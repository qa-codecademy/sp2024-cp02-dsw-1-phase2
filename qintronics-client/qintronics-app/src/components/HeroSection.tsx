import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Box, Star, Clock } from "lucide-react";
import { Product } from "../common/types/products-interface";
import fetchProducts from "../common/utils/fetchProducts";
import SliderDiv from "./SliderDiv";

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({
          sortBy: "price",
          sort: "DESC",
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

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <section className="px-6 py-20 md:py-32 bg-white text-gray-900 max-w-[80vw] mx-auto">
      <div className="grid md:grid-cols-3 gap-12 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full shadow-lg">
            <Sparkles className="w-5 h-5 text-white mr-2" />
            <span className="text-white font-semibold">
              New Collection 2024
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-gray-900">
            Innovation meets <br />
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 text-transparent bg-clip-text">
              Design
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl">
            Experience the perfect blend of cutting-edge technology and elegant
            design. Discover products that transform the way you live and work.
          </p>

          <div className="flex flex-wrap gap-6 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gray-300 text-gray-800 rounded-xl font-semibold hover:border-gray-400 transition-all"
            >
              Learn More
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center items-center gap-2 text-gray-700">
                <Box className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-2xl">50K+</span>
              </div>
              <p className="text-sm text-gray-500">Products</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center items-center gap-2 text-gray-700">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-2xl">4.9</span>
              </div>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-2xl">24/7</span>
              </div>
              <p className="text-sm text-gray-500">Support</p>
            </div>
          </div>
        </motion.div>

        {/* Middle Column - SliderDiv */}
        <div className="flex justify-center items-center col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1 w-full">
          <SliderDiv />
        </div>

        {/* Right Column - Featured Products Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {featuredProducts.slice(0, 4).map((product) => (
            <motion.div
              key={product.id}
              className="aspect-square size-60 bg-gray-50 rounded-3xl shadow-lg overflow-hidden relative transition-transform duration-300 transform hover:scale-105"
            >
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-lg font-medium truncate">
                    {product.name}
                  </h3>
                  <p className="text-white text-sm font-light">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
