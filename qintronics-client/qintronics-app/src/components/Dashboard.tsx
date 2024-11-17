// Dashboard.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./DashboardSidebar";
import CategoryManager from "./CategoryManager";
import SectionsManager from "./SectionsManager";
import OrderManager from "./OrderManager";
// import InventoryStatus from "./InventoryStatus";
import UserManagement from "./UserManagement";
import { DashboardStats } from "./DashboardStats";
import { SalesChart } from "./SalesChart";
// Import the new ProductManagement component
import ProductManagement from "./ProductManagement";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Overview</h2>
            <DashboardStats />
            <SalesChart />
            {/* <InventoryStatus /> */}
          </motion.div>
        );
      case "products":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Products</h2>
            <ProductManagement />
          </motion.div>
        );
      case "categories":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">
              Categories
            </h2>
            <CategoryManager />
          </motion.div>
        );
      case "sections":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Sections</h2>
            <SectionsManager />
          </motion.div>
        );
      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Orders</h2>
            <OrderManager />
          </motion.div>
        );
      case "users":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">
              User Management
            </h2>
            <UserManagement />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 overflow-hidden">
        <main className="max-w-7xl mx-auto px-8 py-12">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
