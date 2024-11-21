import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Award } from "lucide-react";

const brands = [
  {
    name: "Apple",
    imageUrl: "../../public/images/apple-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "Samsung",
    imageUrl: "../../public/images/samsung-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "Sony",
    imageUrl: "../../public/images/sony-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "AMD",
    imageUrl: "../../public/images/amd-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "Lenovo",
    imageUrl: "../../public/images/lenovo-svg.svg",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "LG",
    imageUrl: "../../public/images/LG-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "Dell",
    imageUrl: "../../public/images/dell-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
  {
    name: "Asus",
    imageUrl: "../../public/images/asus-png.png",
    products: Math.floor(Math.random() * 100) + 50,
  },
];

const BrandsShowcase = () => {
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

  const brandVariants = {
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

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
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
              <Award size={16} className="text-purple-400" />
              <span>Featured Brands</span>
            </motion.div>

            <h2 className="text-5xl font-semibold tracking-tight text-gray-900">
              Top Tech Brands
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Explore our curated selection of premium technology brands, each
              known for innovation and quality.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {brands.map((brand) => (
              <motion.div
                key={brand.name}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                variants={brandVariants}
                whileHover="hover"
                onClick={() => navigate(`/brand/${brand.name}`)}
              >
                <div className="relative pt-[100%] bg-white">
                  <motion.img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Sparkles size={16} className="text-purple-400" />
                    <span>{brand.products} Products Available</span>
                  </div>

                  <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                    <motion.button
                      className="rounded-full bg-[#1A3F6B] text-white px-6 py-2 text-sm font-medium flex items-center gap-2 hover:bg-[#15406D] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>View Collection</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandsShowcase;
