import React, { useState, useEffect } from "react";
import { HiOutlineXMark, HiPlus, HiMinus } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { BsCartX } from "react-icons/bs";
import { MdShoppingCartCheckout } from "react-icons/md";
import {
  FaBox,
  FaDollarSign,
  FaSortAmountUp,
  FaCalculator,
  FaShoppingCart,
} from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const navigate = useNavigate();

  // Save cart items to local storage and trigger the cartUpdated event
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartItems }));
  }, [cartItems]);

  // Increment product quantity
  const handleIncrement = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrement product quantity
  const handleDecrement = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove specific product from cart
  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    navigate("/checkout");

    // Clear cart items and update local storage
    setCartItems([]);
    // localStorage.removeItem("cart");
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: [] }));
  };

  return (
    <div className="min-h-screen bg-white-100 py-12 flex flex-col items-center">
      {cartItems.length === 0 ? (
        <>
          <BsCartX className="w-48 h-48 text-gray-300 mb-8" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Looks like your cart is empty!
          </h2>
          <p className="text-lg text-gray-500 mb-8">
            Time to start your shopping
          </p>
          <button
           className="ml-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"
            onClick={() => navigate("/")}
          >
            <MdShoppingCartCheckout className="mr-2" size={18} />
            Continue Shopping
          </button>
        </>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden p-8 form-bg">
          <h2 className="text-3xl font-semibold text-primary text-center mb-8 flex justify-center items-center">
            Shopping Cart
            <FaShoppingCart className="ml-2 text-primary" />
          </h2>
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="py-3"></th>
                <th className="py-3 text-left">
                  <FaBox className="inline mr-2" color="rgb(27 217 197)" />
                  Product
                </th>
                <th className="py-3 text-center">
                  <FaDollarSign
                    className="inline mr-2"
                    color="rgb(27 217 197)"
                  />
                  Price
                </th>
                <th className="py-3 text-center">
                  <FaSortAmountUp
                    className="inline mr-2"
                    color="rgb(27 217 197)"
                  />
                  Quantity
                </th>
                <th className="py-3 text-center">
                  <FaCalculator
                    className="inline mr-2"
                    color="rgb(27 217 197)"
                  />
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition hover:bg-gray-50"
                >
                  <td className="py-4 pr-6">
                    <button
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-transform hover:scale-105 shadow-md"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <HiOutlineXMark size={14} />
                    </button>
                  </td>
                  <td className="py-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-md mr-4 hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 text-center font-semibold text-gray-900 px-4">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-4 text-center px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-all"
                        onClick={() => handleDecrement(item.id)}
                      >
                        <HiMinus size={18} />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border border-gray-300 rounded-md"
                      />
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition-all"
                        onClick={() => handleIncrement(item.id)}
                      >
                        <HiPlus size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-center font-semibold text-gray-900 px-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <button
             className="ml-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"

              onClick={() => navigate("/")}
            >
              <MdShoppingCartCheckout className="mr-2" size={18} />
              Continue Shopping
            </button>

            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-gray-900 mb-2">
                Total: ${calculateTotal().toFixed(2)}
              </span>
              <button
               className="mt-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"

                onClick={handleCheckout}
              >
                <IoBagCheckOutline className="mr-2" size={18} />
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
