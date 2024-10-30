// ResetPassword.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axiosInstance from "../common/utils/axios-instance.util";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });
      setSuccessMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
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
        Reset Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Reset Password
        </motion.button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {successMessage && (
        <p className="mt-4 text-green-500">{successMessage}</p>
      )}
    </motion.div>
  );
};

export default ResetPassword;
