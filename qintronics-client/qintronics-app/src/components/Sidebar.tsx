import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaLaptop,
  FaTv,
  FaMobileAlt,
  FaTabletAlt,
  FaClock,
  FaMicrochip,
  FaMemory,
  FaCamera,
  FaGamepad,
  FaKeyboard,
  FaMouse,
  FaHeadphones,
  FaMicrophone,
  FaGift,
  FaSquare,
} from "react-icons/fa"; // Import necessary icons
import { GiAirplane } from "react-icons/gi"; // Additional icons for drones
import { BsCameraVideo } from "react-icons/bs"; // For web cameras
import axiosInstance from "../common/utils/axios-instance.util";
import React from "react";

// Define Category interface
interface Category {
  name: string;
  route: string;
  icon: JSX.Element;
}

// Define Sidebar component
const Sidebar = React.memo(() => {
  const navigate = useNavigate();

  // Define icons for each category
  const categoryIcons: { [key: string]: JSX.Element } = {
    Laptops: <FaLaptop />,
    TVs: <FaTv />,
    Phones: <FaMobileAlt />,
    Tablets: <FaTabletAlt />,
    Smartwatches: <FaClock />,
    Processors: <FaMicrochip />,
    "Graphics Cards": <FaMicrochip />,
    RAM: <FaMemory />,
    Cameras: <FaCamera />,
    "Action Cameras": <FaCamera />,
    Drones: <GiAirplane />,
    "Gaming Chairs": <FaGamepad />,
    Games: <FaGamepad />,
    Controllers: <FaGamepad />,
    Keyboards: <FaKeyboard />,
    Mouses: <FaMouse />,
    "Mouse Pads": <FaSquare />,
    Headphones: <FaHeadphones />,
    Microphones: <FaMicrophone />,
    "Web Cameras": <BsCameraVideo />,
    "Gift Cards": <FaGift />,
  };

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => {
        const updatedCategories = res.data.map((category: Category) => ({
          ...category,
          icon: categoryIcons[category.name] || <FaBars />, // Default icon if category doesn't match
        }));
        setCategories(updatedCategories);
      })
      .catch((err) => {
        console.error(error);
        setError("Failed to load categories");
        console.error(err);
      });
  }, [error]);

  const handleCategoryClick = (categoryName: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (categoryName !== selectedCategory) {
      setSelectedCategory(categoryName);
      if (categoryName === "Gift Cards") {
        navigate("/category/gift-cards");
      } else {
        navigate(`/category/${categoryName}`);
      }
    }

    setIsOpen(false); // Close the menu when a category is selected
  };

  // Categorize the items into sections
  const categorizedIcons = {
    ELECTRONICS: ["Laptops", "TVs", "Phones", "Tablets", "Smartwatches"],
    COMPONENTS: ["Processors", "Graphics Cards", "RAM"], // New section for components
    "PHOTOGRAPHY & DRONES": [
      "Cameras",
      "Action Cameras",
      "Drones",
      "Web Cameras",
    ],
    GAMING: ["Gaming Chairs", "Games", "Controllers"],
    ACCESSORIES: [
      "Keyboards",
      "Mouses",
      "Mouse Pads",
      "Headphones",
      "Microphones",
    ],
    GIFT: ["Gift Cards"],
  };

  // Render sections and categories
  const renderedCategories = useMemo(() => {
    return Object.entries(categorizedIcons).map(
      ([sectionName, categoryNames]) => (
        <div key={sectionName} className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {sectionName}
          </h3>{" "}
          {/* Section titles now white */}
          <ul className="space-y-3 pl-4">
            {categoryNames.map((category) => {
              const matchedCategory = categories.find(
                (cat) => cat.name === category
              );
              return matchedCategory ? (
                <li
                  key={matchedCategory.name}
                  className={`cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg relative overflow-hidden group flex items-center
                ${
                  selectedCategory === matchedCategory.name
                    ? "bg-white text-[#1BD8C4]"
                    : "text-white hover:bg-white hover:text-[#1BD8C4]"
                }`}
                  onClick={() => handleCategoryClick(matchedCategory.name)}
                  aria-label={matchedCategory.name}
                >
                  <span className="mr-3 text-lg">{matchedCategory.icon}</span>
                  <span
                    className={`relative z-10 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B] transition-colors duration-300 ${
                      selectedCategory === matchedCategory.name
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B]"
                        : "text-white"
                    }`}
                  >
                    {matchedCategory.name}
                  </span>
                </li>
              ) : null;
            })}
          </ul>
        </div>
      )
    );
  }, [categories, selectedCategory]);

  return (
    <div className="h-full w-64 backdrop-blur-lg bg-[rgba(173,216,230,0.3)] border-r border-white/10 shadow-lg rounded-3xl p-4">
      {/* Categories */}
      <div className="py-6">
        <h2 className="px-6 mb-6 text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Categories
        </h2>
        <nav className="space-y-3">
          {/* Main Categories */}
          {mainCategories.map(({ id, name }) => (
            <motion.button
              key={id}
              onClick={() => handleCategoryClick(name)} // Call the function on click
              className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${
                activeCategory === name
                  ? "text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md"
                  : "text-gray-500 bg-white/20 hover:text-black hover:bg-white/30"
              }`}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Add Lucide icon */}
              <Home className="h-5 w-5 mr-2" />
              {name}
            </motion.button>
          ))}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-100 transition-transform transform z-50 md:z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64 md:relative flex flex-col`}
        role="navigation"
      >
        <div className="p-6 bg-gradient-to-b from-[#1BD8C4] to-[#1A3F6B] shadow-2xl flex flex-col overflow-y-auto h-full">
          <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wider">
            Categories
          </h2>
          <div className="space-y-6 flex-1 overflow-y-auto">
            {renderedCategories}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;