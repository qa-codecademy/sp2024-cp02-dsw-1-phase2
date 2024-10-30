import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, ShoppingBag, LogOut } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import IconButtons from "./IconButtons";
import DropdownMenu from "./DropdownMenu";
import { AuthContext } from "../context/auth.context";
import axiosInstance from "../common/utils/axios-instance.util";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setUser, isLoading } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserPanel = () => setIsUserPanelOpen(!isUserPanelOpen);

  const handleLogout = () => {
    setUser(null);
    setIsUserPanelOpen(false);
    axiosInstance.post("/auth/logout");
  };

  const handleUserIconClick = () => {
    if (!user) {
      // Navigate to register or login if not authenticated
      navigate("/login");
    } else {
      toggleUserPanel();
    }
  };

  return (
    <header className="bg-white/60 backdrop-blur-md shadow-md sticky top-0 z-50 py-4 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-6 flex items-center justify-between relative">
        <Logo />
        <SearchBar />
        <div className="flex items-center space-x-6">
          {!isLoading && (
            <IconButtons
              onLoginClick={handleUserIconClick}
              toggleMenu={toggleMenu}
              loggedIn={!!user}
              userName={user?.firstName || null}
            />
          )}
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-all duration-300 ease-in-out"
            >
              <LayoutDashboard className="h-6 w-6" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </Link>
          )}
        </div>
      </div>

      <DropdownMenu isMenuOpen={isMenuOpen} />

      {isUserPanelOpen && user && (
        <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out z-10">
          <div className="px-4 py-2 text-sm text-gray-700">
            <p className="font-bold">{user.firstName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <User className="inline-block w-4 h-4 mr-2" />
            Profile
          </Link>

          <Link
            to="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingBag className="inline-block w-4 h-4 mr-2" />
            My Orders
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <LogOut className="inline-block w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
