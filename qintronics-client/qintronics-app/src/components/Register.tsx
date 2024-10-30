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
      const response = await axiosInstance.post("/auth/register", formData);
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
      className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-auto mt-16"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
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
          Sign Up
        </motion.button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {successMessage && (
        <p className="mt-4 text-green-500">{successMessage}</p>
      )}
      <div>
        <Link to={"/login"}>
          <button className="mt-4 text-blue-500 hover:underline text-sm">
            {" "}
            Already have an account? Sign In
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Register;
