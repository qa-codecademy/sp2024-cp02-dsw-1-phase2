import { useState, useEffect } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

// Define the structure of the response from the API
interface OrderTotal {
  month: string;
  totalSum: number;
  totalOrdersNumber: string; // Stored as a string in the response
}

interface UserTotal {
  month: string;
  newCustomers: string; // Stored as a string in the response
}

interface MonthlyTotalsResponse {
  orderTotals: OrderTotal[];
  userTotals: UserTotal[];
}

export const useDashboardStats = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(0);

  const [salesTrend, setSalesTrend] = useState<number>(0);
  const [ordersTrend, setOrdersTrend] = useState<number>(0);
  const [customersTrend, setCustomersTrend] = useState<number>(0);
  const [averageOrderValueTrend, setAverageOrderValueTrend] =
    useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get<MonthlyTotalsResponse>(
          "/orders/monthly-totals"
        );

        const { orderTotals, userTotals } = data;

        const totalSalesAmount = orderTotals.reduce(
          (sum, month) => sum + month.totalSum,
          0
        );
        setTotalSales(totalSalesAmount);

        const totalOrdersCount = orderTotals.reduce(
          (count, month) => count + Number(month.totalOrdersNumber),
          0
        );
        setTotalOrders(totalOrdersCount);

        const avgOrderValue =
          totalOrdersCount > 0 ? totalSalesAmount / totalOrdersCount : 0;
        setAverageOrderValue(Number(avgOrderValue.toFixed(2)));

        if (orderTotals.length >= 2) {
          const lastMonth = orderTotals[orderTotals.length - 1];
          const previousMonth = orderTotals[orderTotals.length - 2];

          const salesTrendCalc =
            ((lastMonth.totalSum - previousMonth.totalSum) /
              previousMonth.totalSum) *
            100;
          setSalesTrend(Number(salesTrendCalc.toFixed(1)));

          const ordersTrendCalc =
            ((Number(lastMonth.totalOrdersNumber) -
              Number(previousMonth.totalOrdersNumber)) /
              Number(previousMonth.totalOrdersNumber)) *
            100;
          setOrdersTrend(Number(ordersTrendCalc.toFixed(1)));

          const lastMonthAvgOrderValue =
            Number(lastMonth.totalSum) / Number(lastMonth.totalOrdersNumber);
          const prevMonthAvgOrderValue =
            Number(previousMonth.totalSum) /
            Number(previousMonth.totalOrdersNumber);

          const avgOrderValueTrendCalc =
            ((lastMonthAvgOrderValue - prevMonthAvgOrderValue) /
              prevMonthAvgOrderValue) *
            100;
          setAverageOrderValueTrend(Number(avgOrderValueTrendCalc.toFixed(1)));
        }

        const currentMonthCustomers = userTotals.reduce(
          (sum, month) => sum + Number(month.newCustomers),
          0
        );
        setTotalCustomers(currentMonthCustomers);

        const customersTrendCalc = userTotals.length ? 5 : 0;
        setCustomersTrend(customersTrendCalc);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setTotalSales(0);
        setTotalOrders(0);
        setTotalCustomers(0);
        setAverageOrderValue(0);
        setSalesTrend(0);
        setOrdersTrend(0);
        setCustomersTrend(0);
        setAverageOrderValueTrend(0);
      }
    };

    fetchStats();
  }, []);

  return {
    totalSales,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    salesTrend,
    ordersTrend,
    customersTrend,
    averageOrderValueTrend,
  };
};
