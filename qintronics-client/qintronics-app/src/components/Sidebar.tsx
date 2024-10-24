import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import axiosInstance from "../common/utils/axios-instance.util";

interface Category {
  name: string;
  route: string;
  icon: JSX.Element;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error(error);
        setError("Failed to load categories");
        console.error(err);
      });
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (categoryName === "Gift Cards") {
      navigate("category/gift-cards");
      setIsOpen(false); // Close the menu when a product is selected
      return;
    }
    setSelectedCategory(categoryName);
    navigate(`/category/${categoryName}`);
    setIsOpen(false); // Close the menu when a product is selected
  };

  return (
    <>
      {/* Mobile and tablet menu button */}
      <button
        className="md:hidden fixed top-5 left-5 z-50 bg-[#1BD8C4] text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <FaBars className="text-xl" />
        )}
      </button>

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
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.name}>
                  <ul className="pl-4 space-y-3">
                    <li
                      key={category.name}
                      className={`cursor-pointer transition-all duration-300 py-2 px-4 rounded-lg relative overflow-hidden group flex items-center
                      ${
                        selectedCategory === category.name
                          ? "bg-white text-[#1BD8C4]"
                          : "text-white hover:bg-white hover:text-[#1BD8C4]"
                      }`}
                      onClick={() => handleCategoryClick(category.name)}
                      aria-label={category.name}
                    >
                      <span className="mr-3 text-lg">{category.icon}</span>
                      <span
                        className={`relative z-10 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B] transition-colors duration-300 ${
                          selectedCategory === category.name
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#1BD8C4] to-[#1A3F6B]"
                            : "text-white"
                        }`}
                      >
                        {category.name}
                      </span>
                    </li>
                  </ul>
                </div>
              ))
            ) : (
              <div>No categories available</div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          role="button"
          aria-label="Close overlay"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
