import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animation

const Logo = () => {
  return (
    <Link
      to="/"
      className="relative flex items-center space-x-4 overflow-hidden"
    >
      {/* Spark Animation */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gradient-to-r from-blue-400 to-green-200"
      />

      {/* Logo Text with Hover Effect */}
      <motion.h1
        whileHover={{ scale: 1, color: "#1f2937" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-3xl font-bold text-gray-800 relative z-10"
      >
        Qintronics
      </motion.h1>
    </Link>
  );
};

export default Logo;
