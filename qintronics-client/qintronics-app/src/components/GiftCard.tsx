import React, { useEffect, useState } from "react";
import {
  FaCamera,
  FaGamepad,
  FaGift,
  FaKeyboard,
  FaMicrophone,
  FaMobileAlt,
  FaMouse,
  FaShoppingCart,
  FaTv,
  FaVideo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { BaseProduct } from "../common/types/products-interface";
import addToCart from "../common/utils/addToCart";
import axiosInstance from "../common/utils/axios-instance.util";
import { giftCardComplete } from "../common/utils/swalUtils";
import Loader from "./Loader";
import barcodeImage from "/images/barcode.png"; // Static barcode image
import giftImage from "/images/gift-bow-removebg-preview.png";

const colorOptions = [
  {
    id: 1,
    gradient: "linear-gradient(135deg, #1a3f6b, #1bd8c4)",
    borderColor: "#1a3f6b",
    backColor: "#1bd8c4",
    backColorName: "cyan",
  },
  {
    id: 2,
    gradient: "linear-gradient(135deg, #ff0080, #ff8c00)",
    borderColor: "#ff0080",
    backColor: "#ff8c00",
    backColorName: "orange",
  },
  {
    id: 3,
    gradient: "linear-gradient(135deg, #8e44ad, #3498db)",
    borderColor: "#8e44ad",
    backColor: "#3498db",
    backColorName: "purple",
  },
  {
    id: 4,
    gradient: "linear-gradient(135deg, #2ecc71, #16a085)",
    borderColor: "#2ecc71",
    backColor: "#16a085",
    backColorName: "green",
  },
];

const GiftCard = () => {
  const [toName, setToName] = useState("");
  const [toNameError, setToNameError] = useState<string>("");

  const [selectedAmount, setSelectedAmount] = useState<number>(10);

  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].gradient);
  const [borderColor, setBorderColor] = useState(colorOptions[0].borderColor);
  const [backColor, setBackColor] = useState(colorOptions[0].backColor);
  const [backColorName, setBackColorName] = useState(
    colorOptions[0].backColorName
  );

  const expirationDate = "01/25/2025";

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleToNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToName(value);

    if (value.length < 3) {
      setToNameError("Recipient's name must be at least 3 characters long.");
    } else if (value.length > 40) {
      setToNameError("Recipient's name cannot be longer than 40 characters.");
    } else {
      setToNameError(""); // Clear error
    }

    if (isFlipped) setIsFlipped(false); // Flip to front
  };

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    if (isFlipped) setIsFlipped(false); // Flip to front
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      // Limit to 200 characters
      setMessage(value);
      setCharCount(value.length);
      if (!isFlipped) setIsFlipped(true); // Flip to back
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped); // Toggle the flip state
  };

  const handleColorChange = (
    gradient: string,
    borderColor: string,
    backColor: string,
    backColorName: string
  ) => {
    setSelectedColor(gradient);
    setBorderColor(borderColor);
    setBackColor(backColor);
    setBackColorName(backColorName);
  };

  const navigate = useNavigate();

  const findAppropriateGiftCard = (color: string, amount: string) => {
    axiosInstance
      .post("/products", {
        name: `${amount} Gift Card - ${color}`,
        categoryName: "Gift Cards",
        page: 1,
        pageSize: 1,
        includeGiftCards: true,
      })
      .then((res) => {
        console.log(res.data.products[0].id);
        handleAddToCart(res.data.products[0]);
      });
  };

  const handleAddToCart = (product: BaseProduct) => {
    if (toNameError || !toName) {
      setToNameError("Recipient's name is required.");
      return;
    }

    if (!selectedAmount) {
      return;
    }
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: 1,
      image: product.img,
      discount: 0,
    };
    addToCart(cartItem);

    giftCardComplete(navigate);
  };

  return (
    <div className="flex">
      <div className="flex justify-center items-start pt-2 min-h-screen flex-1 bg-gray-50">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full max-w-xs sm:max-w-lg p-4 sm:p-6 bg-white shadow-lg rounded-lg">
            <div className="text-center mb-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold flex justify-center items-center mb-4">
                <FaGift className="mr-2 text-[#1A3F6B]" /> Design Your Gift Card
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4">
                Customize your gift card by picking a design, selecting the
                amount, and writing a message.
              </p>
            </div>

            {/* Gift Card Display */}
            <div className="gift-card-container w-full h-48 sm:h-60 mx-auto relative mt-4">
              <div
                className={`gift-card transition-transform transform-gpu ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={handleCardClick}
                style={{
                  background: selectedColor,
                  border: `2px solid ${borderColor}`,
                }}
              >
                {/* Front Side */}
                <div className="absolute w-full h-full rounded-lg p-2 sm:p-4 flex flex-col justify-center items-center front-card">
                  <img
                    src={giftImage}
                    alt="Gift Icon"
                    className="gift-icon w-10 h-10 sm:w-12 sm:h-12"
                  />

                  {/* Conditional designs for different colors */}
                  {borderColor === "#1a3f6b" && (
                    <>
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <FaMouse className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                        <FaKeyboard className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                    </>
                  )}

                  {borderColor === "#ff0080" && (
                    <>
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <FaVideo className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                        <FaCamera className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                    </>
                  )}

                  {borderColor === "#8e44ad" && (
                    <>
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <FaTv className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                        <FaMobileAlt className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                    </>
                  )}

                  {borderColor === "#2ecc71" && (
                    <>
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                        <FaMicrophone className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                        <FaGamepad className="text-white text-4xl sm:text-5xl opacity-20 rotate-45" />
                      </div>
                    </>
                  )}

                  <h1 className="text-md sm:text-lg md:text-xl font-bold mb-2 flex items-center justify-center whitespace-nowrap">
                    <FaGift className="mr-1 text-lg sm:text-xl md:text-2xl" />{" "}
                    Qintronics Gift Card
                  </h1>

                  {/* Expiration Date in Bottom Left */}
                  <p className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 text-xs sm:text-sm text-white-500">
                    Expires on: {expirationDate}
                  </p>

                  {/* Recipient's Name */}
                  <h3 className="text-sm sm:text-md font-semibold text-center truncate max-w-full px-2">
                    {toName || "To: Recipient's Name"}
                  </h3>
                  <p className="mt-2 text-lg sm:text-2xl font-bold truncate">
                    ${selectedAmount || "Amount"}
                  </p>
                </div>

                {/* Back Side */}
                <div
                  className="gift-card-back absolute w-full h-full text-center p-2 sm:p-4"
                  style={{
                    backgroundColor: backColor,
                    border: `2px solid ${borderColor}`,
                  }}
                >
                  <p className="mt-2 sm:mt-4 break-words text-sm sm:text-md">
                    {message || "Write a message..."}
                  </p>

                  {/* Barcode Image */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
                    <img
                      src={barcodeImage}
                      alt="Gift Card Barcode"
                      className="w-10 h-10 sm:w-12 sm:h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-6">
              <h2 className="font-semibold mb-4 text-center text-sm sm:text-base">
                Select Gift Card Color:
              </h2>
              <div className="flex justify-center space-x-2 sm:space-x-4 mb-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    className="p-3 sm:p-4 border-2 rounded-full w-8 sm:w-10 h-8 sm:h-10 transition-all duration-300 hover:ring-4 hover:ring-blue-300"
                    style={{ background: color.gradient }}
                    onClick={() =>
                      handleColorChange(
                        color.gradient,
                        color.borderColor,
                        color.backColor,
                        color.backColorName
                      )
                    }
                  >
                    {selectedColor === color.gradient && (
                      <span className="text-white text-lg">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 mb-4">
              <label className="block text-sm font-semibold mb-2">To:</label>
              <input
                type="text"
                className={`w-full border p-2 rounded-lg ${
                  toNameError ? "border-red-500" : ""
                }`}
                value={toName}
                onChange={handleToNameChange}
                placeholder="Enter recipient's name"
                maxLength={40} // Limit to 40 characters
              />
              {toNameError && (
                <p className="text-red-500 text-xs mt-1">{toNameError}</p>
              )}
            </div>

            {/* Amount Selection */}
            <h2 className="font-semibold mb-4 text-center text-sm sm:text-base">
              Select Gift Card Amount:
            </h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[10, 20, 30, 40, 50, 100, 200, 500].map((amount) => (
                <label
                  key={amount}
                  className={`cursor-pointer flex justify-center items-center h-20 w-full sm:h-24 sm:w-24 border-2 rounded-lg transition-all duration-300 ${
                    selectedAmount === amount
                      ? "border-[#1A3F6B] bg-[#1A3F6B]/30 shadow-lg"
                      : "border-gray-300 bg-gray-100"
                  } hover:bg-[#1A3F6B]/30 hover:shadow-md hover:border-[#1A3F6B]/30`}
                >
                  <input
                    type="radio"
                    name="amount"
                    value={amount}
                    checked={selectedAmount === amount}
                    onChange={() => handleAmountChange(amount)}
                    className="hidden"
                  />
                  <span className="text-sm sm:text-md font-semibold text-center">
                    ${amount}
                  </span>
                  {selectedAmount === amount && (
                    <span className="absolute top-2 right-2 text-blue-500">
                      ✓
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Message Field */}
            <div className="mt-4 sm:mt-6">
              <label className="block font-semibold mb-1 text-xs sm:text-sm">
                Message:
              </label>
              <textarea
                className="w-full border p-1 sm:p-2 rounded-lg mb-2 resize-none"
                style={{
                  maxHeight: "80px",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
                rows={3}
                maxLength={200}
                value={message}
                onChange={handleMessageChange}
                placeholder="Write a message..."
              ></textarea>
              <div className="text-right text-xs sm:text-sm text-gray-500 mb-2">
                {charCount}/200 characters
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <button
                onClick={() =>
                  findAppropriateGiftCard(
                    backColorName,
                    selectedAmount?.toString()
                  )
                }
                className="w-full sm:w-auto mt-4 bg-[#1A3F6B] text-white font-bold py-1 sm:py-2 px-3 sm:px-4 rounded-lg shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex justify-center items-center"
              >
                <FaShoppingCart className="mr-1 sm:mr-2" />
                ADD TO CART
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard;
