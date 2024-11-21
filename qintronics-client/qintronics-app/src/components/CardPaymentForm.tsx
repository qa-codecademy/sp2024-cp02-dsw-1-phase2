import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import {
  FaCalendarAlt,
  FaCreditCard,
  FaExclamationCircle,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { GrCheckboxSelected } from "react-icons/gr";
import { TbCreditCardPay } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { SavedCard } from "../common/interfaces/saved.card.interface";
import axiosInstance from "../common/utils/axios-instance.util";
import {
  invalidCardNumber,
  invalidExpiryDate,
  invalidExpiryMonth,
  invalidExpiryYear,
  paymentSuccessful,
  selectedCart,
} from "../common/utils/swalUtils";
import { CardPaymentContext } from "../context/card-payment.context";
import "../styles/card.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const CardPaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showPayWithSavedCardButton, setShowPayWithSavedCardButton] =
    useState(false);
  const [cardType, setCardType] = useState<string>("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardData, setCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const { orderDetails } = useContext(CardPaymentContext);

  const loadSavedCard = async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      if (res.data.userInfo.ccNum) {
        setSavedCard(res.data.userInfo);
        setSelectedCardId(null);
      } else {
        setSavedCard(null);
      }
    } catch (err) {
      console.error("Error loading saved card:", err);
    }
  };

  useEffect(() => {
    loadSavedCard();
  }, []);

  const detectCardType = (cardNumber: string) => {
    const firstDigit = cardNumber[0];
    const firstTwoDigits = cardNumber.slice(0, 2);
    if (firstDigit === "4") return "Visa";
    if (firstTwoDigits >= "51" && firstTwoDigits <= "55") return "MasterCard";
    if (firstTwoDigits === "34" || firstTwoDigits === "37")
      return "AmericanExpress";
    return "";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "");
      const formattedValue = cleaned.replace(/(.{4})/g, "$1 ").trim();
      setCardData((prevData) => ({
        ...prevData,
        cardNumber: formattedValue,
      }));
      const detectedType = detectCardType(cleaned);
      setCardType(detectedType);
    } else if (name === "expiryMonth" || name === "expiryYear") {
      const cleaned = value.replace(/\D/g, "").slice(0, 2);
      setCardData((prevData) => ({
        ...prevData,
        [name]: cleaned,
      }));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 4);
      setCardData((prevData) => ({
        ...prevData,
        cvv: cleaned,
      }));
    } else {
      setCardData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
  };

  const handleSaveCardRequest = async (cardDataPayload: any) => {
    try {
      await axiosInstance.patch("/user-info/update", cardDataPayload);
      return true;
    } catch (error) {
      Swal.fire(
        "Error Saving Card",
        "An error occurred while saving the card. Please try again.",
        "error"
      );
      return false;
    }
  };

  const prepareCardDataPayload = () => {
    const cardNumberWithoutSpaces = cardData.cardNumber.replace(/\s+/g, "");
    const expiryDate = new Date(
      `20${cardData.expiryYear}-${cardData.expiryMonth}-01`
    ).toISOString();
    return {
      ccFullName: cardData.cardHolderName,
      ccNum: cardNumberWithoutSpaces,
      expDate: expiryDate,
      cvv: parseInt(cardData.cvv, 10),
    };
  };

  const validateInputs = () => {
    const cardNumberWithoutSpaces = cardData.cardNumber.replace(/\s+/g, "");
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (
      cardNumberWithoutSpaces.length !== 16 ||
      isNaN(Number(cardNumberWithoutSpaces))
    ) {
      invalidCardNumber();
      return false;
    }
    if (
      parseInt(cardData.expiryMonth) < 1 ||
      parseInt(cardData.expiryMonth) > 12 ||
      cardData.expiryMonth.length !== 2
    ) {
      invalidExpiryMonth();
      return false;
    }
    if (
      parseInt(cardData.expiryYear) < currentYear ||
      (parseInt(cardData.expiryYear) === currentYear &&
        parseInt(cardData.expiryMonth) < currentMonth)
    ) {
      invalidExpiryDate();
      return false;
    }
    if (cardData.expiryYear.length !== 2) {
      invalidExpiryYear();
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate inputs before proceeding
    if (!validateInputs()) return;

    try {
      // Step 1: Ask if the user wants to save the card
      const saveCardResponse = await Swal.fire({
        title: "Save Card?",
        text: "Would you like to save this card for future use?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, save it",
        cancelButtonText: "No, just pay",
      });

      // Step 2: Save the card if the user confirms
      if (saveCardResponse.isConfirmed) {
        const cardDataPayload = prepareCardDataPayload();
        const saveSuccess = await handleSaveCardRequest(cardDataPayload);
        if (!saveSuccess) return; // Stop if saving the card fails
      }

      // Step 3: Show a loading indicator while processing the payment
      Swal.fire({
        title: "Processing Payment",
        text: "Please wait...",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
        timer: 1500,
      });

      // Step 4: Save the order and show success message
      await handleSaveOrder();

      // Step 5: Show a success message, then redirect after the timer ends
      await Swal.fire({
        icon: "success",
        title: "Payment Successful!",
        text: "Your payment has been processed successfully!",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          clearCart();
          navigate("/");
        },
      });
    } catch (paymentError) {
      Swal.fire(
        "Payment Error",
        "An error occurred while processing the payment. Please try again.",
        "error"
      );
    }
  };

  const handleSaveOrder = async () => {
    if (orderDetails) {
      axiosInstance
        .post("/orders", { ...orderDetails, isPaid: true })
        .then(() => {
          clearCart();
          setTimeout(() => {
            paymentSuccessful(navigate);
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUseSelectedCard = () => {
    clearCart();
    selectedCart(navigate);
    if (orderDetails) {
      axiosInstance
        .post("/orders", { ...orderDetails, isPaid: true })
        .then(() => {
          clearCart();
          setTimeout(() => {
            paymentSuccessful(navigate);
          }, 1000);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto mt-16 mb-16">
      <h2 className="text-3xl font-semibold text-primary text-center mb-12 flex justify-center items-center">
        Card Payment
        <BsCreditCard2FrontFill className="ml-2 text-blue-500" />
      </h2>
      {savedCard && (
        <>
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <GrCheckboxSelected className="mr-2 text-secondary text-lg" />
            Select your saved card, or pay with another.
          </h3>
          <ul className="space-y-6">
            <li>
              <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                <FaCreditCard className="mr-4 text-indigo-600 text-3xl" />
                <input
                  type="radio"
                  name="savedCard"
                  id={`card-${savedCard.id}`}
                  className="mr-4 cursor-pointer accent-indigo-600"
                  onChange={() => {
                    setSelectedCardId(savedCard.id ?? null);
                    setShowPayWithSavedCardButton(true);
                  }}
                  checked={selectedCardId === savedCard.id}
                />
                <label
                  htmlFor={`card-${savedCard.id}`}
                  className="flex flex-col space-y-1 text-gray-800"
                >
                  <span className="font-semibold text-lg tracking-wide">
                    {savedCard?.ccNum
                      ? `************${savedCard.ccNum.slice(-4)}`
                      : "xxxx xxxx xxxx xxxx"}{" "}
                    — {savedCard?.ccFullName || "Customer"}
                  </span>
                  {savedCard.expDate ? (
                    !isNaN(Date.parse(savedCard.expDate)) ? (
                      new Date(savedCard.expDate) > new Date() ? (
                        <span className="text-sm text-gray-500 font-medium">
                          Valid until{" "}
                          {new Date(savedCard.expDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </span>
                      ) : (
                        <span className="text-sm text-red-500 flex items-center font-medium">
                          <FaExclamationCircle className="mr-2 text-lg" />
                          Expired
                        </span>
                      )
                    ) : (
                      <span className="text-sm text-gray-500 font-medium">
                        Invalid expiry date
                      </span>
                    )
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">
                      N/A
                    </span>
                  )}
                </label>
              </div>
            </li>
          </ul>
          {showPayWithSavedCardButton && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUseSelectedCard}
                className="mt-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"
              >
                <TbCreditCardPay className="mr-2" size={28} />{" "}
                {/* Increased size here */}
                Use Selected Card to Pay
              </button>
            </div>
          )}
        </>
      )}
      {/* Form to add a new card, visible even if there's a saved card */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <AiOutlinePlus className="mr-2 text-secondary text-lg" />
          Add a New Card
        </h3>
        <div className="card-container">
          <div
            className="card"
            onClick={() => setIsCardFlipped(!isCardFlipped)}
          >
            <div className={`card-inner ${isCardFlipped ? "flipped" : ""}`}>
              <div className="front">
                <img
                  src="https://i.ibb.co/PYss3yv/map.png"
                  className="map-img"
                  alt="map"
                />
                <div className="row">
                  <img
                    src="https://i.ibb.co/G9pDnYJ/chip.png"
                    width="60px"
                    alt="chip"
                  />
                  {cardType === "Visa" && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                      width="60px"
                      alt="Visa"
                    />
                  )}
                  {cardType === "MasterCard" && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg"
                      width="60px"
                      alt="MasterCard"
                    />
                  )}
                  {cardType === "AmericanExpress" && (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/2052px-American_Express_logo_%282018%29.svg.png"
                      width="60px"
                      alt="American Express"
                    />
                  )}
                </div>
                <div className="row card-no">
                  <p>{cardData.cardNumber || "xxxx xxxx xxxx xxxx"}</p>
                </div>
                <div className="row card-holder">
                  <p>CARD HOLDER</p>
                  <p>VALID TILL</p>
                </div>
                <div className="row name">
                  <p>{cardData.cardHolderName || "Cardholder Name"}</p>
                  <p>
                    {cardData.expiryMonth && cardData.expiryYear
                      ? `${cardData.expiryMonth} / ${cardData.expiryYear}`
                      : "MM/YY"}
                  </p>
                </div>
              </div>
              <div className="back">
                <img
                  src="https://i.ibb.co/PYss3yv/map.png"
                  className="map-img"
                  alt="map"
                />
                <div className="bar"></div>
                <div className="row card-cvv">
                  <div>
                    <img
                      src="https://i.ibb.co/S6JG8px/pattern.png"
                      alt="pattern"
                    />
                  </div>
                  <p>{cardData.cvv || "****"}</p>
                </div>
                <div className="row card-text"></div>
                <div className="row signature">
                  <p>CUSTOMER SIGNATURE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handlePaymentSubmit} className="space-y-6 mt-8">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
              <FaUser className="text-secondary" />
              <label className="text-primary font-semibold">
                Card Holder Name
              </label>
            </div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="cardHolderName"
              value={cardData.cardHolderName}
              onChange={handleInputChange}
              className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Enter your name"
              maxLength={30}
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-2">
              <FaCreditCard className="text-secondary" />
              <label className="text-primary font-semibold">Card Number</label>
            </div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="tel"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleInputChange}
              className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
              required
              placeholder="xxxx xxxx xxxx xxxx"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaCalendarAlt className="text-secondary" />
                <label className="text-primary font-semibold">
                  Expiry Month
                </label>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="expiryMonth"
                value={cardData.expiryMonth}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                placeholder="MM"
                maxLength={2}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaCalendarAlt className="text-secondary" />
                <label className="text-primary font-semibold">
                  Expiry Year
                </label>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="expiryYear"
                value={cardData.expiryYear}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                required
                placeholder="YY"
                maxLength={2}
              />
            </div>
          </div>
          <div className="flex flex-col mt-6">
            <div className="flex items-center space-x-2 mb-2">
              <FaLock className="text-secondary text-lg" />
              <label className="text-primary font-semibold">CVV / CVC</label>
            </div>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="cvv"
              value={cardData.cvv}
              onChange={(e) => {
                handleInputChange(e);
                setIsCardFlipped(true);
              }}
              onFocus={() => setIsCardFlipped(true)}
              onBlur={() => setIsCardFlipped(false)}
              className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
              required
              placeholder="* * * *"
              maxLength={4}
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="mt-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"
            >
              <TbCreditCardPay className="mr-2" size={28} />{" "}
              {/* Increased size here */}
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardPaymentForm;
