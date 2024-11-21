import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Flame,
  Percent,
  Star,
  Clock,
  Box,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Product } from "../common/types/Product-interface";
import fetchProducts from "../common/utils/fetchProducts";
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { useNavigate } from "react-router-dom";
import { BaseProduct } from "../common/types/products-interface";

const getRandomRating = () => {
  const randomRating = 3.5 + Math.random() * 1.5; // Scale random number to 3.5–5
  const filledStars = Math.round(randomRating); // Rounded to nearest whole number
  return { randomRating: randomRating.toFixed(1), filledStars };
};

const SlideDiv = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({ discount: true });
        const discountedProducts = response.products
          .filter((product) => product.discount > 0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);
        setProducts(discountedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
      discount: product.discount,
    };
    addToCart(cartItem);
  };

  const calculateDiscountedPrice = (price: number, discount: number) =>
    (price * (1 - discount / 100)).toFixed(2);

  const calculateSavings = (price: number, discount: number) =>
    (price * (discount / 100)).toFixed(2);

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

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white py-8 rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">
              No discounted products available at the moment.
            </p>
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
                <Flame size={16} className="text-orange-400" />
                <span>Flash Sales</span>
              </motion.div>

              <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
                Limited Time Deals
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Don't miss out on these exclusive discounts. Limited stock
                available.
              </p>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#1A3F6B] text-white hover:bg-white hover:text-[#1A3F6B] hover:shadow-md  rounded-full flex items-center gap-2"
                  onClick={() => navigate("/sales")}
                >
                  View All
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto custom-scrollbar scroll-smooth"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    className="flex gap-8 pb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {products.map((product, index) => {
                      const discountedPrice = calculateDiscountedPrice(
                        product.price,
                        product.discount
                      );
                      const savings = calculateSavings(
                        product.price,
                        product.discount
                      );

                      return (
                        <motion.div
                          key={product.id}
                          className="flex-none w-80 group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                          variants={cardVariants}
                          whileHover="hover"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <div className="relative pt-[100%] bg-white">
                            <motion.img
                              src={product.img}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                            <motion.div
                              className="absolute top-4 left-4 flex flex-col gap-2"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="flex items-center gap-1 bg-[#1A3F6B] backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                                <Percent size={14} className="text-[#1BD8C4]" />
                                <span>{product.discount}% OFF</span>
                              </div>
                              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-full text-sm font-medium">
                                <TrendingUp
                                  size={14}
                                  className="text-green-400"
                                />
                                <span>Save ${savings}</span>
                              </div>
                            </motion.div>
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
                              <div className="space-y-2">
                                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {product.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} />
                              <span>
                                Ends in {Math.floor(Math.random() * 24)}h{" "}
                                {Math.floor(Math.random() * 60)}m
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Box size={16} />
                              <span>
                                {Math.floor(Math.random() * 100)} units left
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-xl font-medium text-gray-900">
                                    ${discountedPrice}
                                  </p>
                                  <p className="text-sm text-gray-400 line-through">
                                    ${product.price.toFixed(2)}
                                  </p>
                                </div>
                                <p className="text-sm text-[#1BD8C4] font-medium">
                                  Fast Selling
                                </p>
                              </div>

                              <motion.button
                                className="rounded-full bg-[#1A3F6B] text-white px-6 py-2 text-sm font-medium flex items-center gap-2 hover:bg-white hover:text-[#1A3F6B] hover:shadow-md transition-colors"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onClick={(event) =>
                                  handleAddToCart(event, product)
                                }
                              >
                                <ShoppingCart size={16} />
                                <span>Add</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SlideDiv;
