import { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";
import { useProducts } from "../hooks/useProducts";
import { Product } from "./../common/types/Product.interface";
import Pagination from "./Pagination";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import ProductSearch from "./ProductSearch";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(5); // Changed from 5 to 1 as starting page
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        fetchProducts(5);
        return;
      }
      fetchProducts(1, searchTerm);
    }, 500); // Debounce search for better performance

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Create product handler
  const handleCreateProduct = async (formData: FormData) => {
    setError(null);
    try {
      // Log form data for debugging
      for (const pair of formData.entries()) {
        console.log("Form Data:", pair[0], pair[1]);
      }

      const response = await axiosInstance.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        setIsFormOpen(false);
        fetchProducts(page);
      }
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
        fetchProducts(page);
      }
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
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setError(null);
    try {
      await deleteProduct(id);
      // Recalculate page if necessary
      const newTotal = total - 1;
      const maxPage = Math.ceil(newTotal / pageSize);
      if (page > maxPage && maxPage > 0) {
        setPage(maxPage);
      } else {
        fetchProducts(page);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    if (newPageSize === 48) {
      setPage(2);
    } else if (newPageSize === 24) {
      setPage(3);
    } else setPage(5);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {/* Search and Add New Product */}
      <div className="flex justify-between items-center">
        <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <motion.button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 px-4 py-2 bg-[#1A3F6B] text-white rounded-md flex items-center transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusCircle size={16} className="mr-2" /> Add New Product
        </motion.button>
      </div>

      {/* Create Product Form */}
      {isFormOpen && (
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
          if (product) setSelectedProduct(product);
        }}
        onRemoveProduct={handleDeleteProduct}
      />

      {/* Pagination and Page Size Controls */}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(total / pageSize)}
          onPageChange={setPage}
        />

        <select
          value={pageSize}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className="ml-4 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
