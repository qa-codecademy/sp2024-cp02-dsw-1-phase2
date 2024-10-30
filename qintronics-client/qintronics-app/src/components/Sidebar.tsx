// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaBars, FaTimes } from "react-icons/fa";
// import axiosInstance from "../common/utils/axios-instance.util";

// interface Category {
//   name: string;
//   route: string;
//   icon: JSX.Element;
// }

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     axiosInstance
//       .get("/categories")
//       .then((res) => {
//         setCategories(res.data);
//       })
//       .catch((err) => {
//         console.error(error);
//         setError("Failed to load categories");
//         console.error(err);
//       });
//   }, []);

//   const handleCategoryClick = (categoryName: string) => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     if (categoryName === "Gift Cards") {
//       navigate("category/gift-cards");
//       setIsOpen(false); // Close the menu when a product is selected
//       return;
//     }
//     setSelectedCategory(categoryName);
//     navigate(`/category/${categoryName}`);
//     setIsOpen(false); // Close the menu when a product is selected
//   };

//   return (
//     <>
//       {/* Mobile and tablet menu button */}
//       <button
//         className="md:hidden fixed top-5 left-5 z-50 bg-[#1BD8C4] text-white p-3 rounded-full shadow-lg"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle menu"
//       >
//         {isOpen ? (
//           <FaTimes className="text-xl" />
//         ) : (
//           <FaBars className="text-xl" />
//         )}
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`fixed top-0 left-0 w-64 h-full bg-gray-100 transition-transform transform z-50 md:z-40 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0 md:w-64 md:relative flex flex-col`}
//         role="navigation"
//       >
//         <div className="p-6 bg-gradient-to-b from-[#1BD8C4] to-[#1A3F6B] shadow-2xl flex flex-col overflow-y-auto h-full">
//           <h2 className="text-3xl font-extrabold text-white mb-8 tracking-wider">
//             Categories
//           </h2>
//           <div className="space-y-6 flex-1 overflow-y-auto">
//             {categories.length > 0 ? (
//               categories.map((category) => (
//                 <div key={category.name}>
//                   <ul className="pl-4 space-y-3">
//                     <li
//                       key={category.name}
//                       className={`cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg relative overflow-hidden group flex items-center
//                       ${
//                         selectedCategory === category.name
//                           ? "bg-white text-[#1BD8C4]"
//                           : "text-white hover:bg-white hover:text-[#1BD8C4]"
//                       }`}
//                       onClick={() => handleCategoryClick(category.name)}
//                       aria-label={category.name}
//                     >
//                       <span className="mr-3 text-lg">{category.icon}</span>
//                       <span
//                         className={`relative z-10 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B] transition-colors duration-300 ${
//                           selectedCategory === category.name
//                             ? "text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B]"
//                             : "text-white"
//                         }`}
//                       >
//                         {category.name}
//                       </span>
//                     </li>
//                   </ul>
//                 </div>
//               ))
//             ) : (
//               <div>No categories available</div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Overlay for mobile menu */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//           onClick={() => setIsOpen(false)}
//           role="button"
//           aria-label="Close overlay"
//         ></div>
//       )}
//     </>
//   );
// };

// export default Sidebar;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../common/utils/axios-instance.util"; // Adjust the import path as needed
import { Home, List, MoreHorizontal } from "lucide-react"; // Import Lucide icons

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState("Home");
  const [categories, setCategories] = useState([]); // State to hold categories
  const [showMore, setShowMore] = useState(false); // State to control "More" category visibility

  const navigate = useNavigate();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data); // Assuming the API returns an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    navigate(`/category/${categoryName}`);
  };

  // Split categories into main and other categories
  const mainCategories = categories.slice(0, 6); // Display first 5-6 categories
  const otherCategories = categories.slice(6); // Rest of the categories for "More"

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

          {/* "More" Category to show other categories */}
          {otherCategories.length > 0 && (
            <>
              <motion.button
                onClick={() => setShowMore(!showMore)} // Toggle visibility of other categories
                className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 text-gray-500 bg-white/20 hover:text-white hover:bg-white/30`}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
              >
                <MoreHorizontal className="h-5 w-5 mr-2" />
                {showMore ? "Show Less" : "More"}
              </motion.button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {otherCategories.map(({ id, name }) => (
                      <motion.button
                        key={id}
                        onClick={() => handleCategoryClick(name)}
                        className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-300 ${
                          activeCategory === name
                            ? "text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md"
                            : "text-gray-500 bg-white/20 hover:text-white hover:bg-white/30"
                        }`}
                        whileHover={{ x: 8 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <List className="h-5 w-5 mr-2" /> {name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
