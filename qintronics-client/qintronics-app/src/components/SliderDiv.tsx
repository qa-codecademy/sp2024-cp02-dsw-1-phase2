import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../common/types/Product-interface";
import fetchProducts from "../common/utils/fetchProducts"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

const SliderDiv = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts({ page: 1, pageSize: 8 }); // Fetch 8 products from page 1
        setProducts(data.products); // Set fetched products
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000); // 3 seconds delay

    return () => clearInterval(interval);
  }, [products.length]); // Ensure interval is cleared and updated on products change

  // Handle dot click to change currentIndex
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const navigate = useNavigate();

  const handleNavigateClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative w-[90vw] max-w-7xl h-[60vh] mx-auto bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden">
      <AnimatePresence>
        {products.length > 0 && (
          <motion.div
            className="absolute w-full h-full flex"
            key={currentIndex}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              key={products[currentIndex].id}
              className="relative w-full flex-shrink-0 h-full bg-white rounded-xl overflow-hidden shadow-xl transition-transform"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onClick={() => handleNavigateClick(products[currentIndex].id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={products[currentIndex].img}
                alt={products[currentIndex].name}
                className="w-full h-full object-contain object-center transition-transform duration-500 hover:scale-90"
              />
              <motion.div
                className="absolute inset-0 flex items-end p-4"
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-lg text-black max-w-xs w-full">
                  <h2 className="text-2xl font-bold mb-2">
                    {products[currentIndex].name}
                  </h2>
                  <p className="text-sm mb-2">
                    {products[currentIndex].description}
                  </p>
                  <p className="text-lg font-semibold">
                    ${products[currentIndex].price}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {products.map((_, index) => (
          <div
            key={index}
            className={`w-5 h-5 rounded-full cursor-pointer transition-transform duration-300 ${
              index === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SliderDiv;
