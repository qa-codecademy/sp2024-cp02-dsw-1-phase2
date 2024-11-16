import React, { FC, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Tag, 
  ChevronRight, 
  Percent,
  ChevronLeft,
  ChevronRight as ChevronNextIcon,
  Star,
  Clock,
  Box
} from "lucide-react";
import { Product } from "../common/types/Product-interface";
import fetchProducts from "../common/utils/fetchProducts";
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { useNavigate } from "react-router-dom";
import { BaseProduct } from "../common/types/products-interface";

const SlideDiv: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;
      const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });

      const newIndex = direction === 'left' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(products.length - 1, currentIndex + 1);
      setCurrentIndex(newIndex);
    }
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

  const calculateDiscountedPrice = (price: number, discount: number) =>
    (price * (1 - discount / 100)).toFixed(2);

  const calculateSavings = (price: number, discount: number) =>
    (price * (discount / 100)).toFixed(2);

  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">No discounted products available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  <Tag size={16} />
                  <span>Flash Sales</span>
                </motion.div>
                
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
                  Limited Time Deals
                </h2>
              </div>

              <motion.button
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                whileHover={{ x: 5 }}
                onClick={() => navigate("/sales")}
              >
                View All
                <ChevronRight size={16} />
              </motion.button>
            </div>

            <div className="relative group">
              {/* Slider Controls */}
              <motion.button
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleScroll('left')}
              >
                <ChevronLeft size={24} />
              </motion.button>

              <motion.button
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleScroll('right')}
              >
                <ChevronNextIcon size={24} />
              </motion.button>

              <div 
                ref={scrollContainerRef}
                className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
              >
                <div className="flex gap-6" style={{ paddingBottom: "4px" }}>
                  {products.map((product) => {
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
                        className="flex-none w-80 group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        whileHover={{ y: -5 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <div className="relative pt-[100%] bg-white-50">
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
                            <div className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                              <Percent size={14} />
                              <span>{product.discount}% OFF</span>
                            </div>
                            <div className="bg-black bg-opacity-80 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                              Save ${savings}
                            </div>
                          </motion.div>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="min-h-[8rem] flex flex-col justify-between">
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star size={16} fill="currentColor" />
                                <span className="text-sm text-gray-600">
                                  {(Math.random() * (5 - 4) + 4).toFixed(1)} ({Math.floor(Math.random() * 1000)})
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} />
                              <span>Ends in {Math.floor(Math.random() * 24)}h {Math.floor(Math.random() * 60)}m</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Box size={16} />
                            <span>{Math.floor(Math.random() * 100)} units left</span>
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
                              <motion.p 
                                className="text-sm text-red-600 font-medium"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                Limited Time
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideDiv;