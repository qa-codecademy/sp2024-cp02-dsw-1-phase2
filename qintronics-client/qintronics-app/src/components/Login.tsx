import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/auth.context";
import axiosInstance from "../common/utils/axios-instance.util";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", formData);
      setUser(response.data);
      navigate("/");
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
      <h2 className="text-3xl font-semibold mb-6 text-center text-[#1A3F6B]">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Sign in to access your account
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-[#1A3F6B] text-white py-3 rounded-lg font-medium transition-transform transform hover:scale-105 hover:bg-[#15406D]"
        >
          Sign In
        </motion.button>
      </form>
      {error && (
        <p className="mt-4 text-center text-red-500 font-medium">{error}</p>
      )}
      <div className="mt-6 flex justify-between items-center text-gray-600">
        <Link to="/register">
          <button className="text-sm text-[#1A3F6B] hover:underline font-medium">
            Need an account? Create one
          </button>
        </Link>
        <Link to="/forgot-password">
          <button className="text-sm text-[#1A3F6B] hover:underline font-medium">
            Forgot Password?
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export { ForgotPassword, ResetPassword, Login };
