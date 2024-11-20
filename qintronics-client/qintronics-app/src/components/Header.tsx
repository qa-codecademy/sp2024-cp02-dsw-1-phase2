import React, { useContext, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  User,
  ShoppingCart,
  Heart,
  ArrowRightLeft,
  Menu,
  Search,
} from "lucide-react";
import { AuthContext } from "../context/auth.context";
import axiosInstance from "../common/utils/axios-instance.util";
import { Product } from "../common/types/Product-interface";
import fetchProducts from "../common/utils/fetchProducts";
import Logo from "./Logo";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);

  const { user, setUser, isLoading } = useContext(AuthContext);

  // Initialize favorite count from localStorage and listen for updates
  useEffect(() => {
    const storedFavoriteCount = localStorage.getItem("favoriteCount");
    setFavoriteCount(storedFavoriteCount ? JSON.parse(storedFavoriteCount) : 0);

    const handleFavoritesUpdate = () => {
      const updatedFavoriteCount = localStorage.getItem("favoriteCount");
      setFavoriteCount(
        updatedFavoriteCount ? JSON.parse(updatedFavoriteCount) : 0
      );
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  // Cart item count management
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    updateCartItemCount(cartItems);

    const handleCartUpdate = (event: any) => {
      const updatedCartItems = event.detail;
      updateCartItemCount(updatedCartItems);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Product search
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (debouncedQuery) {
        setLoading(true);
        try {
          const { products } = await fetchProducts({ name: debouncedQuery });
          setFilteredProducts(products);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredProducts([]);
      }
    };

    fetchFilteredProducts();
  }, [debouncedQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        userPanelRef.current &&
        !userPanelRef.current.contains(event.target as Node)
      ) {
        setIsUserPanelOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCartItemCount = (cartItems: any[]) => {
    const count = cartItems.reduce(
      (total: number, item: { quantity: number }) => total + item.quantity,
      0
    );
    setCartItemCount(count);
  };

  const handleLogout = () => {
    setUser(null);
    setIsUserPanelOpen(false);
    axiosInstance.post("/auth/logout");
    localStorage.removeItem("cart");
    localStorage.removeItem("favoriteCount");
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: 0 }));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
    navigate("/");
  };

  const handleUserIconClick = () => {
    if (!user) {
      onLoginClick();
    } else {
      setIsUserPanelOpen(!isUserPanelOpen);
    }
  };

  const handleProductClick = (id: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/products/${id}`);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Logo />

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="search"
                placeholder="Search products..."
                className={`w-full bg-gray-100/80 border-none rounded-xl py-2 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-3 text-gray-500 hover:text-gray-700"
              >
                <Search size={18} />
              </button>
              {isSearchOpen && searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredProducts([]);
                  }}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {/* <X size={18} /> */}
                </button>
              )}
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {isSearchOpen && (searchQuery || loading) && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute mt-2 w-full bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {loading && (
                    <div className="p-4 text-gray-600">Loading...</div>
                  )}

                  {!loading && filteredProducts.length === 0 && searchQuery && (
                    <div className="p-4 text-gray-600">
                      No products found for "{searchQuery}".
                    </div>
                  )}

                  {!loading &&
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none"
                      >
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {product.brand}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            $
                            {product.discount > 0
                              ? (
                                  product.price *
                                  (1 - product.discount / 100)
                                ).toFixed(2)
                              : product.price.toFixed(2)}
                          </p>
                        </div>
                        {/* <div className="ml-auto">
                          <p className="text-xs text-gray-500">
                            {product.availability} in stock
                          </p>
                        </div> */}
                      </div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <IconButton
                icon={<ShoppingCart size={20} />}
                count={cartItemCount}
                tooltip="Cart"
              />
            </Link>

            <Link to="/favorites">
              <IconButton
                icon={<Heart size={20} />}
                count={favoriteCount}
                tooltip="Favorites"
              />
            </Link>

            <Link to="/compare" className="relative group">
              <IconButton icon={<ArrowRightLeft size={20} />} />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Compare
              </span>
            </Link>

            {/* User Menu */}
            <div ref={userPanelRef} className="relative">
              <button
                onClick={handleUserIconClick}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <User size={20} />
                {!isLoading && user && (
                  <span className="text-sm font-medium">{user.firstName}</span>
                )}
              </button>

              <AnimatePresence>
                {isUserPanelOpen && user && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-sm">{user.firstName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <nav className="p-1">
                      <MenuLink icon={<User size={16} />} to="/profile">
                        Profile
                      </MenuLink>
                      <MenuLink icon={<ShoppingBag size={16} />} to="/orders">
                        Orders
                      </MenuLink>
                      {user.role === "Admin" && (
                        <MenuLink
                          icon={<LayoutDashboard size={16} />}
                          to="/dashboard"
                        >
                          Dashboard
                        </MenuLink>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Main Menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu size={20} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden"
                  >
                    <nav className="p-1">
                      <MenuLink to="/">Home</MenuLink>
                      {/* <MenuLink to="/sales">Sale</MenuLink> */}
                      <MenuLink to="/about-us">About Us</MenuLink>
                      <MenuLink to="/contact">Contact</MenuLink>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper Components
const IconButton = ({
  icon,
  count,
  tooltip,
}: {
  icon: React.ReactNode;
  count?: number;
  tooltip?: string;
}) => (
  <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
    {icon}
    {count !== undefined && count > 0 && (
      <span
        className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
        style={{ backgroundColor: "#1A3F6B" }}
      >
        {count}
      </span>
    )}
    {tooltip && (
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {tooltip}
      </span>
    )}
  </button>
);

const MenuLink = ({
  children,
  to,
  icon,
}: {
  children: React.ReactNode;
  to: string;
  icon?: React.ReactNode;
}) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
  >
    {icon}
    <span>{children}</span>
  </Link>
);

export default Header;
