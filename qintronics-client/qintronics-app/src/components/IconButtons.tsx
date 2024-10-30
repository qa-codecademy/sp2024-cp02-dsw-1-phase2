import { ShoppingCart, Heart, User, ArrowRightLeft, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface IconButtonsProps {
  onLoginClick: () => void;
  toggleMenu: () => void;
  loggedIn: boolean;
  userName: string | null;
}

const IconButtons = ({
  onLoginClick,
  toggleMenu,
  loggedIn,
  userName,
}: IconButtonsProps) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch the cart items from local storage and update the count
  const updateCartItemCount = (cartItems: any[]) => {
    const count = cartItems.reduce(
      (total: number, item: { quantity: number }) => total + item.quantity,
      0
    );
    setCartItemCount(count);
  };

  useEffect(() => {
    // Initial load: Fetch cart count
    const storedCart = localStorage.getItem("cart");
    const cartItems = storedCart ? JSON.parse(storedCart) : [];
    updateCartItemCount(cartItems);

    // Listen to custom 'cartUpdated' event
    const handleCartUpdate = (event: any) => {
      const updatedCartItems = event.detail;
      updateCartItemCount(updatedCartItems);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return (
    <div className="flex items-center space-x-4 flex-shrink-0 z-20">
      <Link to="/cart" className="relative">
        <button className="p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 text-gray-800">
          <ShoppingCart size={20} />
        </button>
        {/* Badge showing cart item count */}
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            {cartItemCount}
          </span>
        )}
      </Link>

      {/* Other icons */}
      <Link to="/favorites">
        <button className="p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 text-gray-800">
          <Heart size={20} />
        </button>
      </Link>

      <Link to="/compare" className="relative group">
        <button className="p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 text-gray-800">
          <ArrowRightLeft size={20} />
        </button>
        <span className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Compare
        </span>
      </Link>

      <button
        onClick={onLoginClick}
        className="p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 text-gray-800 flex items-center"
      >
        {loggedIn ? (
          <span className="text-sm font-medium">{userName}</span>
        ) : (
          <>
            <User size={20} />
            <span className="ml-2 text-sm">Login</span>
          </>
        )}
      </button>

      <button
        onClick={toggleMenu}
        className="p-2 rounded-full hover:bg-blue-500 transition-colors duration-300 text-gray-800"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};

export default IconButtons;
