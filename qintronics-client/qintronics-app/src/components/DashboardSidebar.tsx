import React from "react";
import { motion } from "framer-motion";
import { Package, List, Folder, ShoppingCart, Users } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Package, label: "Dashboard" },
    { id: "products", icon: List, label: "Products" },
    { id: "categories", icon: Folder, label: "Categories" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
    { id: "users", icon: Users, label: "Users" },
  ];

  return (
    <aside className="bg-gray-100 text-gray-800 w-64 flex-shrink-0 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-light">Admin Dashboard</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`block w-full text-left px-6 py-3 hover:bg-gray-200 transition-colors duration-200 ${
              activeSection === item.id ? "bg-gray-200" : ""
            }`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon className="inline-block mr-3" size={18} />
            {item.label}
          </motion.button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;