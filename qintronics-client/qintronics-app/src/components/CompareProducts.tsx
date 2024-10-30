import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { BaseProduct, Product } from "../common/types/products-interface";
import axiosInstance from "../common/utils/axios-instance.util";

interface Category {
  id: string;
  name: string;
}
const ITEMS_PER_PAGE = 9;

const CompareProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<BaseProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (selectedCategory) {
        queryParams.append("categoryName", selectedCategory);
      }
      if (searchQuery.trim()) {
        queryParams.append("name", searchQuery);
      }

      const response = await axiosInstance.post("/products", {
        pageSize: ITEMS_PER_PAGE,
        page: currentPage,
      });
      const data = response.data;

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleProductSelect = (product: Product) => {
    if (selectedProducts.length < 3 && !selectedProducts.includes(product)) {
      setSelectedProducts([...selectedProducts, product]);
      if (selectedProducts.length === 2) {
        setIsComparing(true);
      }
    }
  };

  const handleProductRemove = (product: Product) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    if (selectedProducts.length <= 2) {
      setIsComparing(false);
    }
  };

  const SearchHeader = () => (
    <div className=" top-0  bg-white shadow-md mb-6">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-lg border focus:outline-none focus:border-blue-400"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="relative">
            <img
              src={product.img || "/api/placeholder/400/300"}
              alt={product.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <button
              onClick={() => handleProductSelect(product)}
              disabled={selectedProducts.includes(product)}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                selectedProducts.includes(product)
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {selectedProducts.includes(product) ? (
                <Check size={20} />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </div>
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">
              ${product.price.toLocaleString()}
            </p>
            {product.discount > 0 && (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const SelectedProductsBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Selected: {selectedProducts.length}/3
            </span>
            <div className="flex gap-2">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-gray-100 rounded-lg p-2"
                >
                  <img
                    src={product.img || "/api/placeholder/60/60"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <button
                    onClick={() => handleProductRemove(product)}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {selectedProducts.length >= 2 && (
            <button
              onClick={() => setIsComparing(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Compare Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const ProductComparison = () => {
    const allSpecs = selectedProducts.reduce((specs, product) => {
      Object.keys(product.specifications).forEach((spec) => {
        if (!specs.includes(spec)) {
          specs.push(spec);
        }
      });
      return specs;
    }, [] as string[]);

    return (
      <div className="flex justify-center inset-0 ">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setIsComparing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </button>
            <h2 className="text-2xl font-semibold">Compare Products</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectedProducts.map((product) => (
              <div key={product.id} className="relative">
                <button
                  onClick={() => handleProductRemove(product)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="p-6 rounded-2xl bg-white shadow-lg">
                  <img
                    src={product.img || "/api/placeholder/400/300"}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">
                    {product.name}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-3xl font-bold">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.discount > 0 && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                    {allSpecs.map((spec) => (
                      <div key={spec} className="py-3 border-b last:border-0">
                        <div className="text-sm text-gray-500 mb-1">
                          {spec.charAt(0).toUpperCase() + spec.slice(1)}
                        </div>
                        <div className="font-medium">
                          {product.specifications[spec] || "—"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {!isComparing ? (
        <div className="max-w-7xl mx-auto">
          <div className="p-6">
            <h1 className="text-4xl font-semibold mb-4">Compare Products</h1>
            <p className="text-gray-500">
              Select up to 3 products to compare their features
            </p>
          </div>

          <SearchHeader />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading products...</div>
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid />
              <Pagination />
            </>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No products found</div>
            </div>
          )}

          {selectedProducts.length > 0 && <SelectedProductsBar />}
        </div>
      ) : (
        <ProductComparison />
      )}
    </div>
  );
};

export default CompareProducts;
