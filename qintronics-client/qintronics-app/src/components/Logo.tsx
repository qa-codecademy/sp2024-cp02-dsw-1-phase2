import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <Link
      to="/"
      className="relative flex flex-col items-center space-y-2 overflow-hidden"
    >
      {/* Line Animation Above the Logo (Left to Right) */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-green-200"
      />

      {/* Logo Text with Hover Effect */}
      <motion.h1
        // whileHover={{ scale: 1.1, color: "#1f2937" }}
        transition={{ type: "spring", stiffness: 300 }}
        className="text-3xl font-bold text-gray-800 relative z-10"
      >
        Qintronics
      </motion.h1>

      {/* Line Animation Below the Logo (Right to Left) */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-200 to-blue-400"
      />
    </Link>
  );
};

export default Logo;
