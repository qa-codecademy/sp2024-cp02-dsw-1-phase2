import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import IconButtons from "./IconButtons";
import DropdownMenu from "./DropdownMenu";
import { useUser } from "../context/UserContext";

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("USD");
  const { user, logout } = useUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserPanel = () => setIsUserPanelOpen(!isUserPanelOpen);
  const toggleLanguage = () => setLanguage(language === "EN" ? "MKD" : "EN");
  const toggleCurrency = () => setCurrency(currency === "USD" ? "MKD" : "USD");

  const handleLogout = () => {
    logout();
    setIsUserPanelOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        <Logo />
        <SearchBar />
        <div className="flex items-center space-x-4">
          <IconButtons
            onLoginClick={user ? toggleUserPanel : onLoginClick}
            toggleMenu={toggleMenu}
            loggedIn={!!user}
            userName={user?.name || null}
          />
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-900"
            >
              <LayoutDashboard className="h-6 w-6" />
              <span className="hidden sm:inline-block">Dashboard</span>
            </Link>
          )}
        </div>
      </div>
      <DropdownMenu
        isMenuOpen={isMenuOpen}
        language={language}
        currency={currency}
        toggleLanguage={toggleLanguage}
        toggleCurrency={toggleCurrency}
      />
      {isUserPanelOpen && user && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
          <div className="px-4 py-2 text-sm text-gray-700">
            <p className="font-bold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="inline-block w-4 h-4 mr-2" />
            Profile
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <ShoppingBag className="inline-block w-4 h-4 mr-2" />
            My Orders
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="inline-block w-4 h-4 mr-2" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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