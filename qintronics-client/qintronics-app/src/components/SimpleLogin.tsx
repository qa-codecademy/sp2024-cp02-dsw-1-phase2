import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../common/utils/axios-instance.util";
import { motion } from "framer-motion";
import { AuthContext } from "../context/auth.context";

interface AuthFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

const SimpleLogin: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "Customer",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      let response;
      if (isLogin) {
        response = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Login response:", response.data);
        // Update the AuthContext with user information
        setUser(response.data);
        onClose();
        navigate("/");
      } else {
        response = await axiosInstance.post("/auth/register", formData);
        console.log("Registration response:", response.data);
        setSuccessMessage("Registered successfully! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Error object:", err);
      if (err.response) {
        console.error("Error response:", err.response);
        console.error("Error data:", err.response.data);
      }

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full"
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        {isLogin ? "Sign In" : "Create Account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          {isLogin ? "Sign In" : "Create Account"}
        </motion.button>
      </form>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline text-sm"
      >
        {isLogin
          ? "Need an account? Create one"
          : "Already have an account? Sign In"}
      </button>
      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
      {successMessage && (
        <p className="mt-4 text-green-500 text-sm">{successMessage}</p>
      )}
    </motion.div>
  );
};

export default SimpleLogin;
