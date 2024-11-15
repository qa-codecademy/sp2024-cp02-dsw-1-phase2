import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Watch } from "lucide-react";
import axiosInstance from "./../common//utils/axios-instance.util"; // Adjust path as needed
import { FaCamera, FaGamepad, FaGift, FaHeadphones, FaImage, FaKeyboard, FaLaptop, FaMemory, FaMicrochip, FaMobileAlt, FaMouse, FaRocket, FaShoppingBag, FaTv } from "react-icons/fa";
import { GiGamepad } from "react-icons/gi";
import { MdTabletMac } from "react-icons/md";

interface Category {
  id: string;
  name: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const categoriesPerPage = 7;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const pageCount = Math.ceil(categories.length / categoriesPerPage);
  const currentCategories = categories.slice(
    currentPage * categoriesPerPage,
    (currentPage + 1) * categoriesPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  // Animation variants - modified for better visibility
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const categoryVariants = {
    hidden: { 
      y: 20, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };


  // Helper function to get emoji based on category name
  const getCategoryIcon = (name: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      "Laptops": <FaLaptop className="text-blue-600 hover:text-blue-800" />,
      "Smartphones": <FaMobileAlt className="text-purple-600 hover:text-purple-800" />,
      "Audio": <FaHeadphones className="text-green-500 hover:text-green-700" />,
      "Gaming": <FaGamepad className="text-red-500 hover:text-red-700" />,
      "Wearables": <Watch className="text-yellow-600 hover:text-yellow-800" />,
      "Cameras": <FaCamera className="text-orange-500 hover:text-orange-700" />,
      "Mouses": <FaMouse className="text-pink-500 hover:text-pink-700" />,
      "Keyboards": <FaKeyboard className="text-indigo-600 hover:text-indigo-800" />,
      "Headphones": <FaHeadphones className="text-green-500 hover:text-green-700" />,
      "TVs": <FaTv className="text-blue-500 hover:text-blue-700" />,
      "Phones": <FaMobileAlt className="text-purple-600 hover:text-purple-800" />,
      "Tablets": <MdTabletMac className="text-blue-400 hover:text-blue-600" />,
      "Smartwatches": <Watch className="text-yellow-600 hover:text-yellow-800" />,
      "Processors": <FaMicrochip className="text-gray-600 hover:text-gray-800" />,
      "Graphics Cards": <FaImage className="text-cyan-500 hover:text-cyan-700" />,
      "RAM": <FaMemory className="text-gray-400 hover:text-gray-600" />,
      "Action Cameras": <FaCamera className="text-orange-500 hover:text-orange-700" />,
      "Drones": <FaRocket className="text-purple-500 hover:text-purple-700" />,
      "Gaming Chairs": <GiGamepad className="text-red-500 hover:text-red-700" />,
      "Games": <FaGamepad className="text-red-500 hover:text-red-700" />,
      "Controllers": <FaGamepad className="text-red-500 hover:text-red-700" />,
      "Mouse Pads": <FaMouse className="text-pink-500 hover:text-pink-700" />,
      "Microphones": <FaHeadphones className="text-green-500 hover:text-green-700" />,
      "Web Cameras": <FaCamera className="text-orange-500 hover:text-orange-700" />,
      "Gift Cards": <FaGift className="text-yellow-500 hover:text-yellow-700" />,
    };
    return iconMap[name] || <FaShoppingBag className="text-gray-500 hover:text-gray-700" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[90vw] mx-auto my-8 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={cardContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
          >
            {currentCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={categoryVariants}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:border-blue-100"
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-3xl mb-2 transform transition-transform duration-300 hover:scale-110">
                    {getCategoryIcon(category.name)}
                  </span>
                  <h3 className="text-sm font-medium text-gray-800">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {pageCount > 1 && (
          <>
            <motion.button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`absolute -left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 transition-all duration-300 ${
                currentPage === 0 
                  ? "opacity-50 cursor-not-allowed" 
                  : "opacity-100 hover:border-blue-200 hover:shadow-lg"
              }`}
              whileHover={currentPage !== 0 ? "hover" : undefined}
              whileTap={currentPage !== 0 ? "tap" : undefined}
              variants={buttonVariants}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            <motion.button
              onClick={handleNextPage}
              disabled={currentPage === pageCount - 1}
              className={`absolute -right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 transition-all duration-300 ${
                currentPage === pageCount - 1 
                  ? "opacity-50 cursor-not-allowed" 
                  : "opacity-100 hover:border-blue-200 hover:shadow-lg"
              }`}
              whileHover={currentPage !== pageCount - 1 ? "hover" : undefined}
              whileTap={currentPage !== pageCount - 1 ? "tap" : undefined}
              variants={buttonVariants}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default FeaturedCategories;