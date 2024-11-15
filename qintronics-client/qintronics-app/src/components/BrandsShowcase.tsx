// BrandsShowcase.tsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Define an array with brand names and their corresponding image URLs
const brands = [
  {
    name: "Apple",
    imageUrl: "../../public/images/apple-png.png",
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
    name: "AMD",
    imageUrl: "../../public/images/amd-png.png",
  },
  {
    name: "Lenovo",
    imageUrl: "../../public/images/lenovo-svg.svg",
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
  const navigate = useNavigate();
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-transform transform hover:scale-105 duration-300 hover:cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/brand/${brand.name}`)}
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
