import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleLogin from "../components/SimpleLogin";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SimpleLogin onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;