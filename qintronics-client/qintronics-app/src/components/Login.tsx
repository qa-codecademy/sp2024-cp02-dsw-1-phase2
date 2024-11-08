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
      <h2 className="text-3xl font-semibold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Sign In
        </motion.button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-4 flex justify-between items-center">
        <Link to="/register">
          <button className="text-blue-500 hover:underline text-sm">
            Need an account? Create one
          </button>
        </Link>
        <Link to="/forgot-password">
          <button className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export { ForgotPassword, ResetPassword, Login };
