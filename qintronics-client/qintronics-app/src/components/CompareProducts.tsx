import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Plus,
  ChevronDown,
  Flame,
  ArrowUpDown,
  Star,
} from "lucide-react";
import axiosInstance from "../common/utils/axios-instance.util";

// Types remain unchanged
interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  img: string;
  specifications: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    display: string;
    camera: string;
    battery: string;
    os: string;
  };
  price: number;
  warranty: string;
  availability: number;
  discount: number;
  categoryId: string;
  isFavorite: boolean;
}

interface Section {
  name: string;
  id: string;
  categories: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  iconURL: string;
}

interface ProductsRequestParams {
  name?: string;
  brand?: string;
  categoryName?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sort: string;
}

const CompareProducts = () => {
  // State declarations remain unchanged
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomRating = () => {
    const randomRating = 3.5 + Math.random() * 1.5; // Scale random number to 3.5–5
    const filledStars = Math.round(randomRating); // Rounded to nearest whole number
    return { randomRating: randomRating.toFixed(1), filledStars };
  };

  // Animation variants
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

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  // Existing useEffect and functions remain unchanged
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sectionsRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/sections"),
          axiosInstance.get("/categories"),
        ]);

        setSections(sectionsRes.data);
        setCategories(categoriesRes.data);

        const productsParams: ProductsRequestParams = {
          page: 1,
          pageSize: 8,
          sortBy: "name",
          sort: "ASC",
          ...(searchTerm && { name: searchTerm }),
          ...(selectedBrand && { brand: selectedBrand }),
          ...(selectedCategory && {
            categoryName: categories.find((c) => c.id === selectedCategory)
              ?.name,
          }),
        };

        const productsRes = await axiosInstance.post(
          "/products",
          productsParams
        );

        if (productsRes.data.products) {
          setProducts(productsRes.data.products);
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedBrand, selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.categoryId === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const addToComparison = (product: Product) => {
    if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#1A3F6B] text-white rounded-xl hover:bg-white hover:text-[#1A3F6B] hover:shadow-md transition-colors"
          >
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-16"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              <ArrowUpDown size={16} className="text-blue-400" />
              <span>Compare Products</span>
            </motion.div>

            <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
              Find Your Perfect Match
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Compare features, specs, and prices to make an informed decision.
            </p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 rounded-3xl shadow-sm"
          >
            <div className="flex gap-4 items-center p-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] transition-all"
                />
              </div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                Filters
                <ChevronDown
                  className={`transform transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4 p-4 mx-4 mb-4 bg-neutral-50 rounded-xl">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="p-3 border-0 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="p-3 border-0 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B]"
                    >
                      <option value="">All Brands</option>
                      {Array.from(new Set(products.map((p) => p.brand))).map(
                        (brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Comparison Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="grid grid-cols-3 gap-8">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative bg-white rounded-3xl shadow-lg overflow-hidden group"
                >
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => removeFromComparison(product.id)}
                    className="absolute top-4 right-4 p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full z-10"
                  >
                    <X size={20} />
                  </motion.button>
                  <div className="p-8">
                    <div className="relative pt-[100%] bg-white">
                      <motion.img
                        src={product.img}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                      <motion.div
                        className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {(() => {
                          const { randomRating } = getRandomRating();

                          return (
                            <>
                              <Star
                                size={14}
                                className="text-yellow-400 fill-yellow-400"
                              />
                              <span>{randomRating}</span>
                            </>
                          );
                        })()}
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">
                      {product.name}
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-500 capitalize">
                              {key}
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      )}
                      <div className="pt-6">
                        <p className="text-3xl font-semibold">
                          $
                          {product.discount
                            ? (
                                product.price *
                                (1 - product.discount / 100)
                              ).toFixed(2)
                            : product.price.toFixed(2)}
                        </p>
                        {product.discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {Array(3 - selectedProducts.length)
                .fill(null)
                .map((_, index) => (
                  <motion.div
                    key={`empty-${index}`}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-2 border-dashed border-neutral-200 rounded-3xl flex items-center justify-center h-[600px] bg-neutral-50"
                  >
                    <div className="text-center text-gray-400">
                      <Plus size={40} className="mx-auto mb-2" />
                      <p>Add product to compare</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Product List */}
          <div className="mb-16">
            <div className="text-center space-y-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                <Flame size={16} className="text-orange-400" />
                <span>Available Products</span>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={1}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {loading
                  ? Array(8)
                      .fill(null)
                      .map((_, index) => (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse"
                        >
                          <div className="p-6">
                            <div className="h-40 bg-neutral-200 rounded-xl mb-4"></div>
                            <div className="h-4 bg-neutral-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded-full w-1/2"></div>
                          </div>
                        </motion.div>
                      ))
                  : filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        variants={cardVariants}
                        whileHover="hover"
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        {index < 4 && (
                          <div className="absolute top-4 left-4 z-10">
                            <motion.div
                              className="flex items-center gap-1 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Flame size={14} className="text-orange-400" />
                              <span>Popular</span>
                            </motion.div>
                          </div>
                        )}

                        <div className="relative pt-[100%] bg-white">
                          <motion.img
                            src={product.img}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          />
                          <motion.div
                            className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {(() => {
                              const { randomRating } = getRandomRating();

                              return (
                                <>
                                  <Star
                                    size={14}
                                    className="text-yellow-400 fill-yellow-400"
                                  />
                                  <span>{randomRating}</span>
                                </>
                              );
                            })()}
                          </motion.div>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="min-h-[6rem] flex flex-col justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="space-y-1">
                              <p className="text-xl font-medium text-gray-900">
                                $
                                {product.discount
                                  ? (
                                      product.price *
                                      (1 - product.discount / 100)
                                    ).toFixed(2)
                                  : product.price.toFixed(2)}
                              </p>
                              {product.discount > 0 && (
                                <p className="text-sm text-gray-500 line-through">
                                  ${product.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                            <motion.button
                              variants={buttonVariants}
                              whileHover="hover"
                              whileTap="tap"
                              onClick={() => addToComparison(product)}
                              disabled={
                                selectedProducts.length >= 3 ||
                                selectedProducts.some(
                                  (p) => p.id === product.id
                                )
                              }
                              className={`rounded-full px-6 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
                                selectedProducts.some(
                                  (p) => p.id === product.id
                                )
                                  ? "bg-neutral-200 text-gray-600"
                                  : "bg-[#1A3F6B] text-white hover:bg-white hover:text-[#1A3F6B] hover:shadow-md"
                              }`}
                            >
                              <Plus size={16} />
                              <span>
                                {selectedProducts.some(
                                  (p) => p.id === product.id
                                )
                                  ? "Added"
                                  : "Compare"}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompareProducts;
