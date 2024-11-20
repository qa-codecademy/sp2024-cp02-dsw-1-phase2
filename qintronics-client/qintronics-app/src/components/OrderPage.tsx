import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import {
  FaCheck,
  FaCity,
  FaCreditCard,
  FaEnvelope,
  FaHome,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPhone,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { FormData } from "../common/interfaces/form.data.interface";
import { FormErrors } from "../common/interfaces/form.error.interface";
import { ProductsAndQuantity } from "../common/interfaces/order.details.interface";
import axiosInstance from "../common/utils/axios-instance.util";
import { orderConfirm, orderFormIncomplete } from "../common/utils/swalUtils";
import { CardPaymentContext } from "../context/card-payment.context";
import { motion } from "framer-motion";

const CheckoutForm: React.FC = () => {
  const cartItems = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryDay: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkoutValid, setCheckoutValid] = useState<boolean>(false);
  const { orderDetails, setOrderDetails } = useContext(CardPaymentContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/users/me")
      .then((res) => {
        const {
          email,
          userInfo: { firstName, lastName, phone, address, city, postalCode },
        } = res.data;

        setFormData({
          firstName,
          lastName: lastName || "",
          email: email,
          phone: phone || "",
          address: address || "",
          city: city || "",
          zipCode: postalCode.toString() || "",
          deliveryDay: "",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // Handle input field changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
    updateProgress();
  };

  // Handle changes to the payment method selection
  const handlePaymentMethodChange = async (method: string) => {
    setPaymentMethod(method);
    setIsSubmitted(false);

    const mappedCartItems: ProductsAndQuantity[] = cartItems().map(
      (item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
      })
    );

    setOrderDetails({
      address: formData.address,
      city: formData.city,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phone,
      email: formData.email,
      zip: Number(formData.zipCode),
      prefDeliveryDate: formData.deliveryDay,
      productsAndQuantity: [...mappedCartItems],
    });

    if (method === "cod") {
      if (validateCheckoutForm()) {
        setCheckoutValid(true);
      } else {
        orderFormIncomplete();
      }
    } else if (method === "card") {
      if (validateCheckoutForm()) {
        navigate("/payment");
      } else {
        orderFormIncomplete();
      }
    }
  };

  // Validate individual fields
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    switch (name) {
      case "firstName":
      case "lastName":
        newErrors[name] = value.trim() ? "" : "This field is required";
        break;
      case "email":
        newErrors.email = /^\S+@\S+\.\S+$/.test(value)
          ? ""
          : "Invalid email address";
        break;
      case "phone":
        newErrors.phone = /^\+?\d{9,15}$/.test(value)
          ? ""
          : "Invalid phone number";
        break;
      case "zipCode":
        newErrors.zipCode = /^\d{3,6}$/.test(value) ? "" : "Invalid ZIP code";
        break;
      case "deliveryDay":
        newErrors.deliveryDay = value
          ? ""
          : "Please select a preferred day of delivery";
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Update progress based on filled fields (counting 8 input fields)
  const updateProgress = () => {
    const fieldsToCheck = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "zipCode",
      "deliveryDay",
    ];

    const totalFields = fieldsToCheck.length; // 8 fields
    const filledFields = fieldsToCheck.filter(
      (field) => formData[field as keyof FormData].trim() !== ""
    ).length;

    const progressPercentage = (filledFields / totalFields) * 100;
    setProgress(Math.round(progressPercentage));
  };

  // Validate the entire checkout form
  const validateCheckoutForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormData];
      if (!value.trim()) {
        newErrors[key as keyof FormErrors] = "This field is required";
      }
    });
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);
    setCheckoutValid(isValid);
    return isValid;
  };

  // Handle confirm button click
  const handleConfirmOrder = () => {
    if (orderDetails) {
      orderConfirm(navigate);
      axiosInstance
        .post("/orders", { ...orderDetails, isPaid: false })
        .then(() => {
          setIsSubmitted(true);
          localStorage.removeItem("cart");
        })
        .catch((err) => console.log(err));
    }
  };

  // Render validation icons
  const renderValidationIcon = (field: keyof FormData) => {
    if (!formData[field].trim()) return null;

    return errors[field] ? (
      <FaTimes className="absolute right-3 text-red-500" />
    ) : (
      <FaCheck className="absolute right-3 text-green-500" />
    );
  };

  return (
    <div className="min-h-screen bg-white py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl"></div>
        <div className="relative px-10 py-10 bg-white shadow-lg sm:rounded-xl sm:p-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-4">
              <h1 className="text-3xl font-semibold text-primary">Checkout</h1>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUser className="text-secondary" />
                    <label className="text-primary font-semibold">
                      First Name
                    </label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your first name"
                    disabled={isSubmitted}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUser className="text-secondary" />
                    <label className="text-primary font-semibold">
                      Last Name
                    </label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your last name"
                    disabled={isSubmitted}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaEnvelope className="text-secondary" />
                    <label className="text-primary font-semibold">Email</label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your email"
                    disabled={isSubmitted}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPhone className="text-secondary" />
                    <label className="text-primary font-semibold">Phone</label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your phone number"
                    disabled={isSubmitted}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaHome className="text-secondary" />
                    <label className="text-primary font-semibold">
                      Address
                    </label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your address"
                    disabled={isSubmitted}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCity className="text-secondary" />
                    <label className="text-primary font-semibold">City</label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your city"
                    disabled={isSubmitted}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* ZIP Code */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="text-secondary" />
                    <label className="text-primary font-semibold">
                      ZIP Code
                    </label>
                  </div>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                    placeholder="Enter your ZIP code"
                    disabled={isSubmitted}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                {/* Delivery Day */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <TbTruckDelivery className="text-secondary" />
                    <label className="text-primary font-semibold">
                      Delivery Day
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      name="deliveryDay"
                      value={formData.deliveryDay}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]} // Set min to today's date
                      className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("deliveryDay")}
                  </div>
                  {errors.deliveryDay && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deliveryDay}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-primary mb-4">
                  Choose Payment Method
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Pay with Cash */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 w-full sm:w-1/2 ${
                      paymentMethod === "cod"
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("cod")}
                  >
                    <FaMoneyBillWave className="text-green-500 text-3xl mb-2" />
                    <span className="font-semibold text-lg">
                      Cash on Delivery
                    </span>
                    <span className="text-gray-500 text-sm">
                      Pay with cash when your order is delivered.
                    </span>
                  </button>

                  {/* Pay with Card */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 w-full sm:w-1/2 ${
                      paymentMethod === "card"
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    <FaCreditCard className="text-blue-500 text-3xl mb-2" />
                    <span className="font-semibold text-lg">Pay with Card</span>
                    <span className="text-gray-500 text-sm">
                      Enter your card details to pay online.
                    </span>
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              {checkoutValid && paymentMethod === "cod" && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="mt-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"
                    onClick={handleConfirmOrder}
                  >
                    <GiConfirmed className="mr-2" size={28} />
                    Confirm Order
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
