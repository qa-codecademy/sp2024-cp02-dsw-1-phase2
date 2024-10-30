import { useDashboardStats } from "../hooks/useDashboardStats.hook";
import { StatCard } from "./StatCard";

export const DashboardStats: React.FC = () => {
  const {
    totalSales,
    totalOrders,
    totalCustomers,
    averageOrderValue,
    salesTrend,
    ordersTrend,
    customersTrend,
    averageOrderValueTrend,
  } = useDashboardStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12 gap-6">
      <StatCard
        title="Total Sales"
        value={totalSales ? `$${totalSales.toLocaleString()}` : "$0"}
        trend={salesTrend}
      />
      <StatCard
        title="Orders"
        value={totalOrders.toLocaleString()}
        trend={ordersTrend}
      />
      <StatCard
        title="Customers"
        value={totalCustomers.toLocaleString()}
        trend={customersTrend}
      />
      <StatCard
        title="Average Order Value"
        value={`$${averageOrderValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`}
        trend={averageOrderValueTrend}
      />
    </div>
  );
};
