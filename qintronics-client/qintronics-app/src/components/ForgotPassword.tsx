import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../common/utils/axios-instance.util";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setSuccessMessage(
        "Password reset instructions have been sent to your email."
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full mx-auto mt-16"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#1A3F6B]">
        Forgot Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to reset your password
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] placeholder-gray-500"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-[#1A3F6B] text-white py-3 rounded-lg font-medium transition-transform transform hover:scale-105 hover:bg-[#15406D]"
        >
          Send Reset Link
        </motion.button>
      </form>
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}
      {successMessage && (
        <p className="mt-4 text-center text-green-500 font-medium">
          {successMessage}
        </p>
      )}
      <div className="mt-6 text-center">
        <Link to="/login">
          <button className="text-sm text-[#1A3F6B] hover:underline font-medium">
            Back to Login
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
