import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../common/utils/axios-instance.util";

interface Category {
  id: string;
  name: string;
  products?: string[];
  createdAt: string;
  updatedAt: string;
  iconURL: string;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/categories");
      if (response.data) {
        setCategories(response.data);
      } else {
        throw new Error("No data received");
      }
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev + 7;
      return next >= categories.length ? 0 : next;
    });
  }, [categories.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => {
      const next = prev - 7;
      return next < 0 ? Math.max(categories.length - 7, 0) : next;
    });
  }, [categories.length]);

  const LoadingState = () => (
    <div className="w-full bg-[#0B1120] min-h-[400px] flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="w-full bg-[#0B1120] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl text-red-400 mb-4">⚠️ {error}</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchCategories()}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </motion.button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!categories.length) {
    return (
      <div className="w-full bg-[#0B1120] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl">No categories available</h2>
        </div>
      </div>
    );
  }

  const visibleCategories = categories.slice(activeIndex, activeIndex + 7);

  return (
    <div className="w-full bg-[#0B1120] text-white py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <motion.h2 className="text-4xl font-bold tracking-tight text-white">
              Explore Categories
            </motion.h2>
            <p className="text-gray-400 mt-2">
              Discover our curated selection of premium tech
            </p>
          </div>

          {categories.length > 7 && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
          initial={false}
        >
          <AnimatePresence mode="wait">
            {visibleCategories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: idx * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                onClick={
                  category.name === "Gift Cards"
                    ? () => navigate("/category/gift-cards")
                    : () => navigate(`/category/${category.name}`)
                }
                onHoverStart={() => setHoveredIndex(idx)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="group cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative h-full bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <motion.div
                      animate={
                        hoveredIndex === idx
                          ? {
                              scale: [1, 1.1, 1],
                              transition: { duration: 0.3 },
                            }
                          : {}
                      }
                      className="mb-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300"
                    >
                      {
                        <img
                          src={category.iconURL}
                          alt={`${category.name} icon`}
                          className={`w-6 h-6 transition-all duration-300 ease-in-out`}
                        />
                      }
                    </motion.div>
                    <h3 className="text-sm font-medium leading-tight group-hover:text-blue-300 transition-colors duration-300">
                      {category.name}
                    </h3>
                    {category.products && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-gray-400 mt-1"
                      >
                        {category.products.length} products
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
