import { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";
import { useProducts } from "../hooks/useProducts";
import { Product } from "./../common/types/Product.interface";
import Pagination from "./Pagination";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import ProductSearch from "./ProductSearch";
import { PlusCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string | null;
    isOpen: boolean;
  }>({ id: null, isOpen: false });

  const { deleteProduct } = useProducts();

  // Fetch products with error handling
  const fetchProducts = async (currentPage: number, search?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/products", {
        page: currentPage,
        pageSize,
        ...(search && { name: search }),
      });

      setProducts(response.data.products);
      setTotal(response.data.total);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initial load and page changes
  useEffect(() => {
    fetchProducts(page);
  }, [page, pageSize]);

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!searchTerm) {
        fetchProducts(1);
        return;
      }
      fetchProducts(1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Create product handler
  const handleCreateProduct = async (formData: FormData) => {
    setError(null);
    try {
      const response = await axiosInstance.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setIsFormOpen(false);
        fetchProducts(page);
      }
      setSuccess("Product created successfully");
    } catch (err: any) {
      console.error("Error creating product:", err);
      if (err.response?.data?.message) {
        setError(`Failed to create product: ${err.response.data.message}`);
      } else {
        setError("Failed to create product. Please try again.");
      }
    }
  };

  // Update product handler
  const handleUpdateProduct = async (id: string, formData: FormData) => {
    setError(null);
    try {
      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setSelectedProduct(null);
        setIsFormOpen(false);
        fetchProducts(page);
      }
      setSuccess("Product updated successfully");
    } catch (err: any) {
      console.error("Error updating product:", err);
      if (err.response?.data?.message) {
        setError(`Failed to update product: ${err.response.data.message}`);
      } else {
        setError("Failed to update product. Please try again.");
      }
    }
  };

  // Delete product handler
  const handleDeleteProduct = async () => {
    if (!deleteConfirmation.id) return;

    setError(null);
    try {
      await deleteProduct(deleteConfirmation.id);
      // Recalculate page if necessary
      const newTotal = total - 1;
      const maxPage = Math.ceil(newTotal / pageSize);
      if (page > maxPage && maxPage > 0) {
        setPage(maxPage);
      } else {
        fetchProducts(page);
      }
      setDeleteConfirmation({ id: null, isOpen: false });
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
      setDeleteConfirmation({ id: null, isOpen: false });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
          {success}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-15 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center mb-4">
              <Trash2 className="text-red-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">
                Delete Product
              </h2>
            </div>
            <p className="mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setDeleteConfirmation({ id: null, isOpen: false })
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {/* Search and Add New Product */}
      <div className="flex items-center justify-center gap-4">
        <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {!isFormOpen && (
          <motion.button
            onClick={() => {
              setSelectedProduct(null);
              setIsFormOpen(true);
            }}
            className=" px-4 py-2 bg-[#1A3F6B] text-white rounded-md flex items-center transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={16} className="mr-2" /> Add New Product
          </motion.button>
        )}
      </div>

      {/* Create Product Form */}
      {isFormOpen && !selectedProduct && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {/* Update Product Form */}
      {selectedProduct && (
        <ProductForm
          initialData={selectedProduct}
          onSubmit={(formData) =>
            handleUpdateProduct(selectedProduct.id, formData)
          }
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      {/* Product Grid */}
      <ProductGrid
        products={products}
        onUpdateProduct={(id) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            setSelectedProduct(product);
            setIsFormOpen(false);
          }
        }}
        onRemoveProduct={(id) => setDeleteConfirmation({ id, isOpen: true })}
      />

      {/* Pagination and Page Size Controls */}
      <div className="flex items-center justify-center gap-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={setPage}
        />

        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="rounded h-full border-gray-300 shadow-sm focus:border-[#1A3F6B] focus:ring-[#1A3F6B]"
        >
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </select>
      </div>
    </div>
  );
};

export default ProductManagement;
