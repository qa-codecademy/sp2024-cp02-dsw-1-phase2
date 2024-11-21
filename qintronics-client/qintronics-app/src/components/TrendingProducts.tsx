import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Flame, TrendingUp, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { BaseProduct, Product } from "../common/types/products-interface";
import addToCart from "../common/utils/addToCart";
import { fetchProducts } from "../common/utils/fetchProducts";

const getRandomRating = () => {
  const randomRating = 3.5 + Math.random() * 1.5; // Scale random number to 3.5–5
  const filledStars = Math.round(randomRating); // Rounded to nearest whole number
  return { randomRating: randomRating.toFixed(1), filledStars };
};

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 8;

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({
          random: true,
          page: 1,
          pageSize: productsPerPage,
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

  const navigate = useNavigate();

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
      discount: product.discount,
    };
    addToCart(cartItem);
  };

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white">
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
                <Flame size={16} className="text-orange-400" />
                <span>Trending Now</span>
              </motion.div>

              <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
                Most Popular Products
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Discover what everyone's talking about. Our top trending
                products, curated based on popularity and sales.
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={1}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleNavigateClick(product.id)}
                  >
                    {index < 4 && (
                      <div className="absolute top-4 left-4 z-10">
                        <motion.div
                          className="flex items-center gap-1 bg-[#1A3F6B] backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <TrendingUp size={14} className="text-[#1BD8C4]" />
                          <span>Hot Item</span>
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
                            ${product.price}
                          </p>
                          <p className="text-sm text-[#1BD8C4] font-medium">
                            Fast Selling
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrendingProducts;
