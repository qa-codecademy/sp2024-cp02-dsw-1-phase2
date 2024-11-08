// ForgotPassword.tsx
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
      className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto mt-16"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Send Reset Link
        </motion.button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {successMessage && (
        <p className="mt-4 text-green-500">{successMessage}</p>
      )}
      <Link to="/login">
        <button className="mt-4 text-blue-500 hover:underline text-sm">
          Back to Login
        </button>
      </Link>
    </motion.div>
  );
};
export default ForgotPassword;
