import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Box, Star, Clock } from "lucide-react";
import { Product } from "../common/types/products-interface";
import fetchProducts from "../common/utils/fetchProducts";
import { useNavigate } from "react-router-dom";

const SliderDiv = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Existing useEffect hooks and handlers remain the same
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts({ random: true, pageSize: 8 });
        setProducts(data.products);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  const handleDotClick = (index: number) => setCurrentIndex(index);
  const navigate = useNavigate();
  const handleNavigateClick = (id: string) => navigate(`/products/${id}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[400px] text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] bg-[#f5f5f7] rounded-2xl overflow-hidden">
      <AnimatePresence initial={false}>
        {products.length > 0 && (
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div
              className="relative w-full h-full cursor-pointer group"
              onClick={() => handleNavigateClick(products[currentIndex].id)}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
              <img
                src={products[currentIndex].img}
                alt={products[currentIndex].name}
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              />
              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-white text-2xl font-semibold mb-2 line-clamp-1">
                  {products[currentIndex].name}
                </h2>
                <p className="text-white/90 text-sm mb-3 line-clamp-2">
                  {products[currentIndex].description}
                </p>
                <div className="flex items-center space-x-4">
                  <span className="text-white text-lg font-medium">
                    ${products[currentIndex].price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-white text-black text-sm rounded-full font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Check Now
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({
          random: true,
          discount: true,
          pageSize: 4,
        });
        setFeaturedProducts(response.products);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  const handleNavigateClick = (id: string) => navigate(`/products/${id}`);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <section className="px-4 py-12 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full">
              <Sparkles className="w-4 h-4 text-white mr-2" />
              <span className="text-sm font-medium">New Collection 2024</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Innovation meets{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text">
                Design
              </span>
            </h1>

            <p className="text-base text-gray-600">
              Experience the perfect blend of cutting-edge technology and elegant
              design. Discover products that transform the way you live and work.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-800 text-sm rounded-xl font-medium hover:border-gray-400 transition-colors"
              >
                Learn More
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="flex justify-center items-center gap-1 text-gray-700">
                  <Box className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xl">50K+</span>
                </div>
                <p className="text-xs text-gray-500">Products</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-1 text-gray-700">
                  <Star className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xl">4.9</span>
                </div>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-1 text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xl">24/7</span>
                </div>
                <p className="text-xs text-gray-500">Support</p>
              </div>
            </div>
          </motion.div>

          {/* Middle Column - SliderDiv */}
          <div className="lg:col-span-4">
            <SliderDiv />
          </div>

          {/* Right Column - Featured Products Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 grid grid-cols-2 gap-4"
          >
            {featuredProducts.slice(0, 4).map((product) => (
              <motion.div
                key={product.id}
                onClick={() => handleNavigateClick(product.id)}
                className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-sm font-medium truncate">
                      {product.name}
                    </h3>
                    <p className="text-white/90 text-xs">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;