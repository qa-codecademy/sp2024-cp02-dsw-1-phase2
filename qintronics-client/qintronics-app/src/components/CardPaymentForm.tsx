import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useContext,
} from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsCalendar2MonthFill, BsCreditCard2FrontFill } from "react-icons/bs";
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
import Swal from "sweetalert2";
import { SavedCard } from "../common/interfaces/saved.card.interface";
import axiosInstance from "../common/utils/axios-instance.util";
import "../styles/card.css";
import { CardPaymentContext } from "../context/card-payment.context";

const CardPaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [cardType, setCardType] = useState<string>("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [cardData, setCardData] = useState({
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [savedCard, setSavedCard] = useState<SavedCard>();
  const { orderDetails } = useContext(CardPaymentContext);

  useEffect(() => {
    axiosInstance
      .get("/users/me")
      .then((res) => {
        res.data.userInfo.ccNum ? setSavedCard(res.data.userInfo) : null;
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Function to detect card type based on card number
  const detectCardType = (cardNumber: string) => {
    const firstDigit = cardNumber[0];
    const firstTwoDigits = cardNumber.slice(0, 2);

    if (firstDigit === "4") return "Visa";
    if (firstTwoDigits >= "51" && firstTwoDigits <= "55") return "MasterCard";
    if (firstTwoDigits === "34" || firstTwoDigits === "37")
      return "AmericanExpress";
    return ""; // Return empty string if no match
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

      // Detect and set card type based on number
      const detectedType = detectCardType(cleaned);
      setCardType(detectedType);
    } else if (name === "expiryMonth" || name === "expiryYear") {
      const cleaned = value.replace(/\D/g, "");
      setCardData((prevData) => ({
        ...prevData,
        [name]: cleaned.slice(0, 2),
      }));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "");
      setCardData((prevData) => ({
        ...prevData,
        cvv: cleaned.slice(0, 4),
      }));
    } else {
      setCardData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cardNumberWithoutSpaces = cardData.cardNumber.replace(/\s+/g, "");

    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the current year
    const currentMonth = new Date().getMonth() + 1; // Get the current month

    // Card number validation
    if (
      cardNumberWithoutSpaces.length !== 16 ||
      isNaN(Number(cardNumberWithoutSpaces))
    ) {
      Swal.fire(
        "Invalid Card Number",
        "Please enter a valid 16-digit card number.",
        "error"
      );
      return;
    }

    // Expiry month validation
    if (
      parseInt(cardData.expiryMonth) < 1 ||
      parseInt(cardData.expiryMonth) > 12 ||
      cardData.expiryMonth.length !== 2
    ) {
      Swal.fire(
        "Invalid Expiry Month",
        "Please enter a valid expiry month (01-12).",
        "error"
      );
      return;
    }

    // Expiry date validation (past dates not allowed)
    if (
      parseInt(cardData.expiryYear) < currentYear ||
      (parseInt(cardData.expiryYear) === currentYear &&
        parseInt(cardData.expiryMonth) < currentMonth)
    ) {
      Swal.fire(
        "Invalid Expiry Date",
        "The expiry date cannot be in the past.",
        "error"
      );
      return;
    }

    if (cardData.expiryYear.length !== 2) {
      Swal.fire(
        "Invalid Expiry Year",
        "Please enter a valid 2-digit expiry year.",
        "error"
      );
      return;
    }

    if (orderDetails) {
      axiosInstance
        .post("/orders", { ...orderDetails, isPaid: true })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your payment has been processed successfully. Thank you!",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          }).then(() => {
            navigate("/");
          });

          localStorage.removeItem("cart");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUseSelectedCard = () => {
    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: "Your payment has been processed successfully. Thank you!",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-semibold text-primary text-center mb-12 flex justify-center items-center">
        Card Payment
        <BsCreditCard2FrontFill className="ml-2 text-blue-500" />
      </h2>

      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <GrCheckboxSelected className="mr-2 text-secondary text-lg" />
        Select your saved card, or pay with another.
      </h3>

      <ul className="space-y-6">
        <li>
          <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300">
            <FaCreditCard className="mr-3 text-indigo-500 text-xl" />
            <input
              type="radio"
              name="savedCard"
              id={`card-${savedCard?.id}`}
              className="mr-4"
              onChange={() => setSelectedCardId(savedCard?.id ?? null)}
            />
            <label
              htmlFor={`card-${savedCard?.id}`}
              className="flex flex-col space-y-1 text-gray-800"
            >
              <span className="font-semibold text-lg">
                {savedCard?.ccNum} — {savedCard?.firstName}
              </span>
              {savedCard && savedCard.expDate ? (
                !isNaN(Date.parse(savedCard.expDate)) ? (
                  new Date(savedCard.expDate) > new Date() ? (
                    <span className="text-sm text-gray-500">
                      Valid until{" "}
                      {new Date(savedCard.expDate as string).toLocaleDateString(
                        "en-US",
                        { month: "2-digit", year: "2-digit" }
                      )}
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 flex items-center">
                      <FaExclamationCircle className="mr-2" />
                      Expired
                    </span>
                  )
                ) : (
                  <span className="text-sm text-gray-500">
                    Invalid expiry date
                  </span>
                )
              ) : (
                <span className="text-sm text-gray-500">N/A</span>
              )}
            </label>
          </div>
        </li>
      </ul>
      {selectedCardId ? (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleUseSelectedCard}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
          >
            <TbCreditCardPay className="mr-2" size={18} />
            Use Selected Card to Pay
          </button>
        </div>
      ) : (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            <AiOutlinePlus className="mr-2 text-secondary text-lg" />
            Add a New Card
          </h3>
          {/* Card Preview */}
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
            <div className="relative">
              <div className="flex items-center">
                <FaUser className="mr-2 text-secondary text-lg" />
                <label className="block text-sm text-primary">
                  Card Holder Name
                </label>
              </div>
              <input
                type="text"
                name="cardHolderName"
                value={cardData.cardHolderName}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full rounded-xl focus:outline-none"
                required
                placeholder="Cardholder Name"
                maxLength={30}
              />
            </div>

            <div className="relative">
              <div className="flex items-center">
                <FaCreditCard className="mr-2 text-secondary text-lg" />
                <label className="block text-sm text-primary">
                  Card Number
                </label>
              </div>
              <input
                type="tel"
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleInputChange}
                className="pl-10 pr-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full rounded-xl focus:outline-none"
                required
                placeholder="xxxx xxxx xxxx xxxx"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <BsCalendar2MonthFill className="mr-2 text-secondary text-lg" />
                <label className="block text-sm text-primary">
                  Expiry Month
                </label>
                <input
                  type="text"
                  name="expiryMonth"
                  value={cardData.expiryMonth}
                  onChange={handleInputChange}
                  className="pl-10 pr-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full rounded-xl focus:outline-none"
                  required
                  placeholder="MM"
                  maxLength={2}
                />
              </div>

              <div className="relative">
                <FaCalendarAlt className="mr-2 text-secondary text-lg" />
                <label className="block text-sm text-primary">
                  Expiry Year
                </label>
                <input
                  type="text"
                  name="expiryYear"
                  value={cardData.expiryYear}
                  onChange={handleInputChange}
                  className="pl-10 pr-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full rounded-xl focus:outline-none"
                  required
                  placeholder="YY"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center">
                <FaLock className="mr-2 text-secondary text-lg" />
                <label className="block text-sm text-primary">CVV / CVC</label>
              </div>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={(e) => {
                  handleInputChange(e);
                  setIsCardFlipped(true); // Flip the card when typing
                }}
                onFocus={() => setIsCardFlipped(true)}
                onBlur={() => setIsCardFlipped(false)}
                className="pl-10 pr-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full rounded-xl focus:outline-none"
                required
                placeholder="* * * *"
                maxLength={4}
              />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
              >
                <TbCreditCardPay className="mr-2" size={18} />
                Pay Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CardPaymentForm;
