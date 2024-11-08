import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Edit2, X, Check, Loader2 } from "lucide-react";
import axiosInstance from "../common/utils/axios-instance.util";

interface Category {
  id: string;
  name: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      const response = await axiosInstance.post("/categories", {
        name: newCategoryName.trim(),
      });
      await fetchCategories(); // Fetch fresh data after creating
      setNewCategoryName("");
      setIsCreating(false);
      setError(null);
    } catch (err) {
      setError("Failed to create category");
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      setLoading(true);
      await axiosInstance.put(`/categories/${id}`, {
        name: editingName.trim(),
      });
      await fetchCategories(); // Fetch fresh data after updating
      setEditingId(null);
      setEditingName("");
      setError(null);
    } catch (err) {
      setError("Failed to update category");
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      setLoading(true);
      await axiosInstance.delete(`/categories/${id}`);
      await fetchCategories(); // Fetch fresh data after deleting
      setError(null);
    } catch (err) {
      setError("Failed to delete category");
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-500 p-4 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      {isCreating ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleCreateCategory)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
            autoFocus
          />
          <motion.button
            onClick={handleCreateCategory}
            disabled={loading || !newCategoryName.trim()}
            className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check size={20} />
          </motion.button>
          <motion.button
            onClick={() => {
              setIsCreating(false);
              setNewCategoryName("");
            }}
            className="p-2 text-red-500 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          <PlusCircle size={20} />
          Create Category
        </motion.button>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {loading && categories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </motion.div>
          ) : (
            categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                {editingId === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, () =>
                          handleUpdateCategory(category.id)
                        )
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <motion.button
                      onClick={() => handleUpdateCategory(category.id)}
                      disabled={loading || !editingName.trim()}
                      className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Check size={16} />
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName("");
                      }}
                      className="p-2 text-red-500 hover:text-red-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-700">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => {
                          setEditingId(category.id);
                          setEditingName(category.name);
                        }}
                        className="p-2 text-blue-500 hover:text-blue-600"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={loading}
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => handleRemoveCategory(category.id)}
                        disabled={loading}
                        className="p-2 text-red-500 hover:text-red-600 disabled:opacity-50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryManager;
