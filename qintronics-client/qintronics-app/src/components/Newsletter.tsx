import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Bell, ArrowRight, Send, Check } from "lucide-react";
import axiosInstance from "../common/utils/axios-instance.util";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const itemVariants = {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axiosInstance.post("/contact/newsletter", { email });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden shadow-sm"
        >
          <div className="p-8 md:p-16 space-y-12">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                <Bell size={16} className="text-purple-400" />
                <span>Never Miss Out</span>
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-5xl font-semibold tracking-tight text-gray-900"
              >
                Stay Ahead of Tech
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-xl text-gray-500 max-w-2xl mx-auto"
              >
                Get exclusive deals, latest product updates, and tech insights
                delivered straight to your inbox.
              </motion.p>
            </div>

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto space-y-8"
            >
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col md:flex-row gap-4"
                  >
                    <div className="flex-grow relative">
                      <Mail
                        size={20}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200"
                        required
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="bg-[#1A3F6B] text-white px-8 py-4 rounded-2xl font-medium inline-flex items-center justify-center gap-2 hover:bg-[#15406D] transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Subscribe Now</span>
                      <ArrowRight size={18} />
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-50 text-green-800 rounded-2xl p-4 flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    <span>
                      Thank you for subscribing! Check your inbox soon.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-6 text-center"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Send size={16} className="text-gray-400" />
                    <span>Weekly Updates</span>
                  </div>
                  <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Bell size={16} className="text-gray-400" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  By subscribing, you agree to our Privacy Policy and consent to
                  receive updates from our company.
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Newsletter;
