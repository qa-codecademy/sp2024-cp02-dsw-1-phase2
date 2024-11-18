import React from "react";
import { motion } from "framer-motion";
import {
  Folder,
  Users,
  Folders,
  LayoutDashboard,
  Package,
  ShoppingBag,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Package, label: "Products" },
    { id: "categories", icon: Folder, label: "Categories" },
    { id: "sections", icon: Folders, label: "Sections" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "users", icon: Users, label: "Users" },
  ];

  return (
    <aside className="bg-gray-100 text-gray-800 w-64 flex-shrink-0 hidden md:block">
      {/* Header Section */}
      <div className="p-6 bg-[#1A3F6B] text-white">
        <h1 className="text-2xl font-light">Admin Dashboard</h1>
      </div>

      {/* Navigation Section */}
      <nav className="mt-8">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`block w-full text-left px-6 py-3 transition-colors duration-200 ${
              activeSection === item.id
                ? "bg-[#1A3F6B] text-white"
                : "hover:bg-gray-200 text-gray-800"
            }`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon
              className={`inline-block mr-3 ${
                activeSection === item.id ? "text-white" : "text-gray-500"
              }`}
              size={18}
            />
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="mt-10 px-6">
        <p className="text-sm text-gray-500">
          Admin Panel Qintronics &copy; {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
