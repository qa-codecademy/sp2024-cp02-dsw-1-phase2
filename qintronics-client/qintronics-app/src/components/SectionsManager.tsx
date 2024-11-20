import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Loader2, PlusCircle, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

// DeleteConfirmationModal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  sectionName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sectionName: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-15 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Delete Section</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{sectionName}</span>? This action
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
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

interface Section {
  id: string;
  name: string;
}

const SectionManager: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    sectionId: string;
    sectionName: string;
  }>({ isOpen: false, sectionId: "", sectionName: "" });

  useEffect(() => {
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

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) {
      setError("Section name is required");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/sections", { name: newSectionName.trim() });
      await fetchSections();
      setNewSectionName("");
      setIsCreating(false);
      setError(null);

      // Set success message
      setSuccessMessage(`Section "${newSectionName}" created successfully!`);
      setTimeout(() => setSuccessMessage(null), 5000); // Auto-hide success message after 5 seconds
    } catch (err) {
      setError("Failed to create section");
      console.error("Error creating section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSection = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      setLoading(true);
      await axiosInstance.put(`/sections/${id}`, { name: editingName.trim() });
      await fetchSections();
      setEditingId(null);
      setEditingName("");
      setError(null);
    } catch (err) {
      setError("Failed to update section");
      console.error("Error updating section:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSection = async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/sections/${id}`);
      await fetchSections();
      setError(null);
    } catch (err) {
      setError("Failed to delete section");
      console.error("Error deleting section:", err);
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
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleCreateSection)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter section name"
            autoFocus
          />

          <motion.button
            onClick={handleCreateSection}
            disabled={loading || !newSectionName.trim()}
            className="p-2 text-green-500 hover:text-green-600 disabled:opacity-50 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check size={20} />
          </motion.button>

          <motion.button
            onClick={() => {
              setIsCreating(false);
              setNewSectionName("");
            }}
            className="p-2 text-red-500 hover:text-red-600 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#1A3F6B] text-white rounded-lg flex items-center gap-2 hover:bg-[#15406D] transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          <PlusCircle size={20} />
          Create Section
        </motion.button>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {loading && sections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-8"
            >
              <Loader2 className="animate-spin text-blue-500" size={24} />
            </motion.div>
          ) : (
            sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                {editingId === section.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, () => handleUpdateSection(section.id))
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <motion.button
                      onClick={() => handleUpdateSection(section.id)}
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
                  <>
                    <span className="text-gray-700">{section.name}</span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => {
                          setEditingId(section.id);
                          setEditingName(section.name);
                        }}
                        className="p-2 text-[#1A3F6B] hover:text-[#1A3F6B] relative group"
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
                            sectionId: section.id,
                            sectionName: section.name,
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
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, sectionId: "", sectionName: "" })
        }
        onConfirm={() => {
          handleRemoveSection(deleteModal.sectionId);
          setDeleteModal({ isOpen: false, sectionId: "", sectionName: "" });
        }}
        sectionName={deleteModal.sectionName}
      />
    </div>
  );
};

export default SectionManager;
