// FeaturedCategories.tsx
import { motion } from "framer-motion";

const categories = [
  { name: "Laptops", icon: "💻" },
  { name: "Smartphones", icon: "📱" },
  { name: "Audio", icon: "🎧" },
  { name: "Gaming", icon: "🎮" },
  { name: "Wearables", icon: "⌚" },
  { name: "Cameras", icon: "📷" },
];

const FeaturedCategories = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-4xl mb-2">{category.icon}</div>
          <h3 className="text-lg font-semibold">{category.name}</h3>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedCategories;
