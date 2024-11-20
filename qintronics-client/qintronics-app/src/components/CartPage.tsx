import React, { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
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
  FaPlus,
  FaMinus,
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
    return cartItems.reduce((total, item) => {
      const discountedPrice =
        item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
      return total + discountedPrice * item.quantity;
    }, 0);
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
                    {item.discount > 0
                      ? (item.price * (1 - item.discount / 100)).toFixed(2)
                      : item.price.toFixed(2)}
                  </td>
                  <td className="py-4 text-center px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        className="px-3 py-2 bg-white border border-[#1A3F6B] text-[#1A3F6B] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#1A3F6B] hover:text-white"
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => handleDecrement(item.id)}
                      >
                        <FaMinus />
                      </button>

                      <input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="text-center w-16 border border-[#1A3F6B] rounded-lg text-xl font-semibold"
                        style={{
                          height: "40px",
                          width: "40px",
                          padding: "0",
                          lineHeight: "40px",
                        }}
                      />

                      <style>{`
                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    input[type="number"] {
                      -moz-appearance: textfield;
                    }
                  `}</style>

                      <button
                        className="px-3 py-2 bg-white border border-[#1A3F6B] text-[#1A3F6B] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#1A3F6B] hover:text-white"
                        style={{ width: "40px", height: "40px" }}
                        onClick={() => handleIncrement(item.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-center font-semibold text-gray-900 px-4">
                    $
                    {item.discount > 0
                      ? (
                          item.price *
                          (1 - item.discount / 100) *
                          item.quantity
                        ).toFixed(2)
                      : (item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-between items-center">
            <button
              className="mt-16 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase "
              onClick={() => navigate("/")}
            >
              <MdShoppingCartCheckout className="mr-2" size={28} />
              Continue Shopping
            </button>

            <div className="flex flex-col" style={{ marginLeft: "-50px" }}>
              <span className="text-lg font-bold text-gray-900 mb-2">
                Total: ${calculateTotal().toFixed(2)}
              </span>
              <button
                className="mt-6 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase "
                onClick={handleCheckout}
              >
                <IoBagCheckOutline className="mr-2" size={28} />
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
