import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

interface DropdownMenuProps {
  isMenuOpen: boolean;
}

const DropdownMenu = ({ isMenuOpen }: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute right-0 top-16 bg-white border border-gray-300 shadow-lg rounded-md w-56"
          ref={menuRef}
        >
          <nav className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block py-2 hover:text-blue-500 text-gray-800 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/about-us"
              className="block py-2 hover:text-blue-500 text-gray-800 transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block py-2 hover:text-blue-500 text-gray-800 transition-colors duration-300"
            >
              Contact
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropdownMenu;
