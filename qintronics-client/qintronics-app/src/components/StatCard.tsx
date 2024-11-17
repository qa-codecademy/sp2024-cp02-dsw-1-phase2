import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-sm"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
    <div className="text-3xl font-light">{value}</div>
    <div
      className={`flex items-center mt-2 ${
        trend > 0 ? "text-[#1BD8C4]" : "text-red-500"
      }`}
    >
      {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
      <span className="ml-1 text-sm">{Math.abs(trend)}%</span>
    </div>
  </motion.div>
);
