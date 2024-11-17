import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Scale,
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

  // Existing fetch functions and useEffects remain the same
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -5,
      transition: { duration: 0.3 },
    },
  };

  const SearchHeader = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products to compare..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>
      <div className="md:w-72">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow appearance-none"
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
  );

  const ProductGrid = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={cardVariants}
          whileHover="hover"
          className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <div className="relative pt-[100%] bg-white">
            <motion.img
              src={product.img || "/api/placeholder/400/300"}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={() => handleProductSelect(product)}
              disabled={selectedProducts.includes(product)}
              className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                selectedProducts.includes(product)
                  ? "bg-black text-white"
                  : "bg-white/90 backdrop-blur-sm hover:bg-black hover:text-white"
              }`}
            >
              {selectedProducts.includes(product) ? (
                <Check size={20} />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="min-h-[6rem] flex flex-col justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.brand}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-xl font-medium text-gray-900">
                  ${product.price.toLocaleString()}
                </p>
                {product.discount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    {product.discount}% OFF
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-4 mt-12">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="p-3 rounded-full border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-3 rounded-full border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  const SelectedProductsBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-gray-600 font-medium">
              Selected: {selectedProducts.length}/3
            </span>
            <div className="flex gap-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-gray-50 rounded-xl p-3"
                >
                  <img
                    src={product.img || "/api/placeholder/60/60"}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => handleProductRemove(product)}
                    className="absolute -top-2 -right-2 p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {selectedProducts.length >= 2 && (
            <button
              onClick={() => setIsComparing(true)}
              className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Scale size={18} />
              <span>Compare Now</span>
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
      <div className="flex justify-center inset-0 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => setIsComparing(false)}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full text-sm font-medium"
            >
              <Scale size={16} className="text-blue-400" />
              <span>Product Comparison</span>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {selectedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  className="relative bg-white rounded-3xl shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => handleProductRemove(product)}
                    className="absolute top-4 right-4 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                  <div className="p-6">
                    <img
                      src={product.img || "/api/placeholder/400/300"}
                      alt={product.name}
                      className="w-full h-64 object-contain rounded-2xl mb-6"
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
                          <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
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
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white pb-24">
      {!isComparing ? (
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center space-y-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                <Scale size={16} className="text-blue-400" />
                <span>Compare Products</span>
              </motion.div>
              
              <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
                Product Comparison
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Select up to 3 products to compare their features and specifications side by side.
              </p>
            </div>
  
            <SearchHeader />
  
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid />
                <Pagination />
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-64 space-y-4 text-center"
              >
                <Search size={48} className="text-gray-300" />
                <div className="text-gray-500 text-lg">No products found</div>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </motion.div>
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