import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../common/utils/axios-instance.util";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await axiosInstance.post("/auth/register", formData);
      setSuccessMessage("Registered successfully! You can now log in.");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
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
        Create Your Account
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Sign up to start your journey with us
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] placeholder-gray-500"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] placeholder-gray-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] placeholder-gray-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] placeholder-gray-500"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-[#1A3F6B] text-white py-3 rounded-lg font-medium transition-transform transform hover:scale-105 hover:bg-[#15406D]"
        >
          Sign Up
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
            Already have an account? Sign In
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Register;
