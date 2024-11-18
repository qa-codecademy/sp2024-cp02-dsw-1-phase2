import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseProduct, Product } from "../common/types/products-interface";
import { fetchProducts } from "../common/utils/fetchProducts";
import { ShoppingCart, Sparkles, Clock, Box } from "lucide-react";
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { useNavigate } from "react-router-dom";

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
          random: true,
          page: 1,
          pageSize: 12,
        });
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const pageCount = Math.ceil(products.length / productsPerPage);
  const navigate = useNavigate();

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

  const handleNavigateClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: BaseProduct
  ) => {
    event.stopPropagation();
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1,
      image: product.img,
    };
    addToCart(cartItem);
  };

  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
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
                <Sparkles size={16} className="text-purple-400" />
                <span>Just Launched</span>
              </motion.div>

              <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
                New Arrivals
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Be among the first to explore our latest products. Fresh
                arrivals that set new trends.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleNavigateClick(product.id)}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <motion.div
                        className="flex items-center gap-1 bg-[#1A3F6B] backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Sparkles size={14} className="text-[#1BD8C4]" />
                        <span>New Launch</span>
                      </motion.div>
                    </div>

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
                        <Clock size={14} />
                        <span>{Math.floor(Math.random() * 24)}h ago</span>
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

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Box size={16} />
                        <span>
                          Only {Math.floor(Math.random() * 50) + 1} in stock
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="space-y-1">
                          <p className="text-xl font-medium text-gray-900">
                            ${product.price}
                          </p>
                          <p className="text-sm text-[#1BD8C4] font-medium">
                            Launch Price
                          </p>
                        </div>
                        <motion.button
                          className="rounded-full bg-[#1A3F6B] text-white px-6 py-2 text-sm font-medium flex items-center gap-2 hover:bg-white hover:text-[#1A3F6B] hover:shadow-md transition-colors"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={(event) => handleAddToCart(event, product)}
                        >
                          <ShoppingCart size={16} />
                          <span>Add</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <motion.button
                className="px-6 py-2 rounded-full bg-[#1A3F6B] text-white hover:bg-white hover:text-[#1A3F6B] hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              <motion.button
                className="px-6 py-2 rounded-full bg-[#1A3F6B] text-white hover:bg-white hover:text-[#1A3F6B] hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))
                }
                disabled={currentPage === pageCount - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CardsDiv;
