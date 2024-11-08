import React, { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductForm from "./ProductForm";
import ProductGrid from "./ProductGrid";
import ProductSearch from "./ProductSearch";
import Pagination from "./Pagination";
import { Product } from "./../common/types/Product.interface";

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const fetchProducts = async () => {
    try {
      const data = await getProducts({
        page,
        pageSize,
        name: searchTerm,
      });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchTerm]);

  const handleCreateProduct = async (
    data: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await createProduct(data);
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    try {
      await updateProduct(id, data);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}

      <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <button
        onClick={() => setIsFormOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Add New Product
      </button>

      {isFormOpen && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {selectedProduct && (
        <ProductForm
          initialData={selectedProduct}
          onSubmit={(data) => handleUpdateProduct(selectedProduct.id, data)}
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      <ProductGrid
        products={products}
        onCreateProduct={() => setIsFormOpen(true)}
        onUpdateProduct={(id) => {
          const product = products.find((p) => p.id === id);
          if (product) setSelectedProduct(product);
        }}
        onRemoveProduct={handleDeleteProduct}
      />

      <Pagination
        currentPage={page}
        totalPages={Math.ceil(total / pageSize)}
        onPageChange={setPage}
      />

      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="mt-2 block rounded-md border-gray-300 shadow-sm"
      >
        <option value={10}>10 per page</option>
        <option value={20}>20 per page</option>
        <option value={50}>50 per page</option>
      </select>
    </div>
  );
};

export default ProductManagement;
