import { useState, useEffect, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseProduct, Product } from "../common/types/products-interface";
import { fetchProducts } from "../common/utils/fetchProducts";
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Clock, ArrowRight, Box } from "lucide-react";
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { useNavigate } from "react-router-dom";

interface CardsDivProps {
  products: Product[];
}

const CardsDiv: FC<CardsDivProps> = () => {
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

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  <Sparkles size={16} />
                  <span>Just Launched</span>
                </motion.div>
                
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
                  New Arrivals
                </h2>
              </div>

              <motion.button
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => navigate("/new")}
              >
                View All
                <ArrowRight size={16} />
              </motion.button>
            </div>

            <div className="relative group">
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft size={24} />
              </motion.button>

              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextPage}
                disabled={currentPage === pageCount - 1}
              >
                <ChevronRight size={24} />
              </motion.button>

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
                      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -5 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => handleNavigateClick(product.id)}
                    >
                      <div className="relative pt-[100%] bg-gray-50">
                        <motion.img
                          src={product.img}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain p-4"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                        <motion.div 
                          className="absolute top-4 left-4 flex flex-col gap-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                            <Sparkles size={14} />
                            <span>New Launch</span>
                          </div>
                        </motion.div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="min-h-[8rem] flex flex-col justify-between">
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} />
                            <span>Added {Math.floor(Math.random() * 24)}h ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Box size={16} />
                          <span>Only {Math.floor(Math.random() * 50) + 1} in stock</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="space-y-1">
                            <p className="text-xl font-medium text-gray-900">
                              ${product.price.toFixed(2)}
                            </p>
                            <motion.p 
                              className="text-sm text-purple-600 font-medium"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              Launch Price
                            </motion.p>
                          </div>

                          <motion.button
                            className="rounded-full bg-black text-white px-6 py-2 text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsDiv;