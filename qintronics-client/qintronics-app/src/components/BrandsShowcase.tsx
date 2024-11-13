// BrandsShowcase.tsx
import { motion } from "framer-motion";

// Define an array with brand names and their corresponding image URLs
const brands = [
  {
    name: "Apple",
    imageUrl: "../../public/images/apple-png.png", // Replace with the actual image URL
  },
  {
    name: "Samsung",
    imageUrl: "../../public/images/samsung-png.png",
  },
  {
    name: "Sony",
    imageUrl: "../../public/images/sony-png.png",
  },
  {
    name: "Microsoft",
    imageUrl: "../../public/images/microsoft-png.png",
  },
  {
    name: "Google",
    imageUrl: "../../public/images/google-png.png",
  },
  {
    name: "LG",
    imageUrl: "../../public/images/LG-png.png",
  },
  {
    name: "Dell",
    imageUrl: "../../public/images/dell-png.png",
  },
  {
    name: "Asus",
    imageUrl: "../../public/images/asus-png.png",
  },
];

const BrandsShowcase = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="w-24 h-24 object-contain mb-4"
              />
              <span className="text-xl font-semibold text-gray-800">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsShowcase;
