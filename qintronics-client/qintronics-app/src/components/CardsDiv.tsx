import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../common/types/products-interface"; // Make sure the path is correct
import { fetchProducts } from "../common/utils/fetchProducts"; // Adjust the path based on your project structure
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

const CardsDiv = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 4;

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({
          page: 1, // Change page number as needed
          pageSize: 12, // Adjust the number of products you want to fetch
        });
        setProducts(response.products); // Update the products with fetched data
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const pageCount = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

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
      transition: { duration: 0.1 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-[90vw] max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="relative">
          <motion.div
            className="relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 transition-all duration-300"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <motion.img
                        src={product.img}
                        alt={product.name}
                        className="w-[90%] h-[90%] m-auto object-contain"
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-1 text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </p>
                        <motion.button
                          className="px-3 py-1.5 bg-white text-black rounded-full flex items-center space-x-1 border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-300"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                        >
                          <ShoppingCart size={14} />
                          <span className="text-sm">Add</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`absolute left-[-20px] top-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md transition-opacity duration-300 ${
              currentPage === 0 ? "opacity-0" : "opacity-100"
            }`}
            whileHover={currentPage !== 0 ? "hover" : undefined}
            whileTap={currentPage !== 0 ? "tap" : undefined}
            variants={buttonVariants}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </motion.button>

          <motion.button
            onClick={handleNextPage}
            disabled={currentPage === pageCount - 1}
            className={`absolute right-[-20px] top-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md transition-opacity duration-300 ${
              currentPage === pageCount - 1 ? "opacity-0" : "opacity-100"
            }`}
            whileHover={currentPage !== pageCount - 1 ? "hover" : undefined}
            whileTap={currentPage !== pageCount - 1 ? "tap" : undefined}
            variants={buttonVariants}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CardsDiv;
