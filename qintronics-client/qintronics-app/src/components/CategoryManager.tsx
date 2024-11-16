import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Loader2, PlusCircle, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

interface Category {
  id: string;
  name: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

interface Section {
  id: string;
  name: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/sections");
      setSections(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch sections");
      console.error("Error fetching sections:", err);
    } finally {
      setLoading(false);
    }
  };

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
    if (!newCategoryName.trim() || !selectedSection || !icon) {
      setError("Please provide all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategoryName.trim());
    formData.append("sectionId", selectedSection);
    formData.append("icon", icon);

    try {
      setLoading(true);
      await axiosInstance.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchCategories(); // Refresh categories after creation
      setNewCategoryName("");
      setSelectedSection(null);
      setIcon(null);
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
      await axiosInstance.put(`/categories/${editingId}`, {
        name: editingName.trim(),
        sectionId: editingSection,
      });
      await fetchCategories();
      setEditingId(null);
      setEditingName("");
      setEditingSection(null);
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

          {/* <input
            type="text"
            value={iconPath || ""}
            onChange={(e) => setIconPath(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleCreateCategory)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category icon URL"
          /> */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            className="flex-1 px-4 py-2 border rounded-lg"
          />

          <div className="px-6 py-4 whitespace-nowrap">
            <select
              value={selectedSection || ""}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="border rounded-md px-2 py-1 text-gray-700"
            >
              <option value="" disabled>
                Choose Section
              </option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}{" "}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={handleCreateCategory}
            disabled={loading || !newCategoryName.trim() || !selectedSection}
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
              setSelectedSection(null);
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
                    <select
                      value={editingSection || ""}
                      onChange={(e) => setEditingSection(e.target.value)}
                      className="border rounded-md px-2 py-1"
                    >
                      <option value="" disabled>
                        Select Section
                      </option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>

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
                        setSelectedSection(null);
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
