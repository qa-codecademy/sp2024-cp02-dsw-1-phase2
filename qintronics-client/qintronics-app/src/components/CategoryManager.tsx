import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Loader2, PlusCircle, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Delete Category</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{categoryName}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface Category {
  id: string;
  name: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
  sectionId: string;
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
  }>({ isOpen: false, categoryId: "", categoryName: "" });

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
      await fetchCategories();

      setNewCategoryName("");
      setSelectedSection(null);
      setIcon(null);
      setIsCreating(false);
      setError(null);

      // Set success message
      setSuccessMessage(`Category "${newCategoryName}" created successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000);
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

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      await fetchCategories();
      setDeleteModal({ isOpen: false, categoryId: "", categoryName: "" });
    } catch (err) {
      setError("Failed to delete category. Please try again later.");
      console.error("Error deleting category:", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-500 p-4 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-4 rounded-lg mb-4"
        >
          {successMessage}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] focus:border-[#1A3F6B] placeholder-gray-400 transition duration-200"
            placeholder="Enter category name"
            autoFocus
          />

          <div className="flex items-center gap-2">
            <label
              htmlFor="icon-upload"
              className="cursor-pointer px-4 py-2 bg-[#1A3F6B] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#15406D] transition duration-200"
            >
              Choose File
            </label>
            <input
              id="icon-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setIcon(e.target.files?.[0] || null)}
              className="hidden"
            />
            {icon && <span className="text-sm text-gray-600">{icon.name}</span>}
          </div>

          <div className="max-w-md w-full mx-auto">
            <select
              value={selectedSection || ""}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] focus:border-[#1A3F6B] transition duration-200"
            >
              <option value="" disabled className="text-gray-400">
                Choose Section
              </option>
              {sections.map((section) => (
                <option
                  key={section.id}
                  value={section.id}
                  className="text-gray-700"
                >
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={handleCreateCategory}
            disabled={loading || !newCategoryName.trim() || !selectedSection}
            className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check size={20} />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Save
            </span>
          </motion.button>

          <motion.button
            onClick={() => {
              setIsCreating(false);
              setNewCategoryName("");
              setSelectedSection(null);
              setIcon(null);
            }}
            className="p-2 text-red-500 hover:text-red-600 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Cancel
            </span>
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
          style={{
            backgroundColor: "#1A3F6B",
          }}
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
            categories.map((category) => {
              const sectionName =
                sections.find((section) => section.id === category.sectionId)
                  ?.name || "Unknown Section";

              return (
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
                        className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50 relative group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Check size={16} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Save
                        </span>
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                          setSelectedSection(null);
                        }}
                        className="p-2 text-red-500 hover:text-red-600 relative group"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={16} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Cancel
                        </span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-1 items-center gap-4">
                      <div className="flex-1">
                        <span className="text-gray-700 text-lg font-medium">
                          {category.name}
                        </span>
                      </div>
                      {sectionName && (
                        <div className="flex-1 text-left pl-12">
                          <span className="text-sm text-gray-500">
                            {sectionName}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => {
                            setEditingId(category.id);
                            setEditingName(category.name);
                          }}
                          className="p-2 text-[#1A3F6B] hover:text-[#15406D] relative group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={loading}
                        >
                          <Edit2 size={16} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Edit
                          </span>
                        </motion.button>

                        <motion.button
                          onClick={() =>
                            setDeleteModal({
                              isOpen: true,
                              categoryId: category.id,
                              categoryName: category.name,
                            })
                          }
                          disabled={loading}
                          className="p-2 text-red-500 hover:text-red-600 disabled:opacity-50 relative group"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Delete
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, categoryId: "", categoryName: "" })
        }
        onConfirm={() => handleDeleteCategory(deleteModal.categoryId)}
        categoryName={deleteModal.categoryName}
      />
    </div>
  );
};

export default CategoryManager;
