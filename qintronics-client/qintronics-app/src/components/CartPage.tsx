import React, { useState } from "react";
import {
  FaBox,
  FaDollarSign,
  FaSortAmountUp,
  FaCalculator,
} from "react-icons/fa";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdShoppingCartCheckout } from "react-icons/md";
import { HiOutlineXMark } from "react-icons/hi2";
import { HiPlus, HiMinus } from "react-icons/hi";
import { BsCartX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Iphone 15 pro",
      sku: "Full-frame mirror less camera with 24.5MP resolution and 4K video recording.",
      price: 399,
      quantity: 1,
      image: "/iphone-pro.jpg",
    },
    {
      id: 2,
      name: "Canon EOS R5",
      sku: "Full-frame mirror less camera with 45MP resolution and 8K video recording.",
      price: 599,
      quantity: 3,
      image: "/canon.jpg",
    },
    {
      id: 3,
      name: "Razer BlackWidow V3",
      sku: "Mechanical keyboard with RGB lighting.",
      price: 799,
      quantity: 5,
      image: "/razor.jpg",
    },
  ]);

  const navigate = useNavigate();

  const handleIncrement = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
            className="bg-blue-600 text-white flex justify-center items-center px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          >
            <MdShoppingCartCheckout className="mr-2" size={18} />
            Continue Shopping
          </button>
        </>
      ) : (
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden p-8 form-bg">
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
                <tr key={item.id} className="border-b transition hover:bg-gray-50">
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
                      <p className="text-gray-500 text-xs">{item.sku}</p>
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
            <button className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out">
              <MdShoppingCartCheckout className="mr-2" size={18} />
              Continue Shopping
            </button>

            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-gray-900 mb-2">
                Total: ${calculateTotal().toFixed(2)}
              </span>
              <button
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
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