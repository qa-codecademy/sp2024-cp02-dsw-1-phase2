import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../common/utils/axios-instance.util";

interface OrderTotal {
  month: string;
  totalSum: number;
  totalOrdersNumber: string;
  averageOrderValue: number;
}

interface MonthlyTotalsResponse {
  orderTotals: OrderTotal[];
}

export const SalesChart: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState<OrderTotal[]>([]);

  useEffect(() => {
    const fetchMonthlyTotals = async () => {
      try {
        const { data } = await axiosInstance.get<MonthlyTotalsResponse>(
          "/orders/monthly-totals"
        );

        const sortedData = data.orderTotals.sort((a, b) =>
          a.month.localeCompare(b.month)
        );

        setMonthlyData(sortedData);
      } catch (error) {
        console.error("Error fetching monthly totals:", error);
      }
    };

    fetchMonthlyTotals();
  }, []);

  const formatMonthLabel = (month: string) => {
    const date = new Date(month + "-01");
    return date.toLocaleString("default", { month: "short", year: "numeric" }); // Include month and year
  };

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-medium text-gray-800 mb-4">Sales Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonthLabel}
            interval={0} // Ensure every month is displayed
            tick={{
              fontSize: 12,
              fill: "#333333",
              fontWeight: "500",
            }} // Adjust font size and color
            angle={-30} // Rotate labels slightly for better spacing
            textAnchor="end" // Align text after rotation
            height={80} // Increase height to fit labels
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              "Sales",
            ]}
            labelFormatter={(month: string) =>
              new Date(month + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })
            }
          />
          <Area
            type="monotone"
            dataKey="totalSum"
            stroke="#1A3F6B"
            fill="rgba(27, 216, 196, 0.5)"
            name="Sales"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
