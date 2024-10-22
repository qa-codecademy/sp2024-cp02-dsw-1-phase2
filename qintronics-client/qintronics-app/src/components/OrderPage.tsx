import React, { ChangeEvent, useEffect, useState } from "react";
import {
  FaCcAmazonPay,
  FaCheck,
  FaCheckCircle,
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
import Swal from "sweetalert2";
import { FormData } from "../common/interfaces/form.data.interface";
import { FormErrors } from "../common/interfaces/form.error.interface";
import axiosInstance from "../common/utils/axios-instance.util";

const CheckoutForm: React.FC = () => {
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
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for the min attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
          zipCode: postalCode || "",
          deliveryDay: "",
        });
      })
<<<<<<< HEAD
      .catch((err) => {
        console.error(err);
      });
  }, []);

=======
      .catch(() => {
        // do something if you get error
      });
  }, []);

  // Handle input field changes
>>>>>>> a07782bf4e3a1faa0e28d99561d2a8d31eae0cdd
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

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setIsSubmitted(false);

    if (method === "cod") {
      if (validateCheckoutForm()) {
        setCheckoutValid(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Incomplete Form",
          text: "Please complete the checkout form before confirming the order.",
        });
      }
    } else if (method === "card") {
      if (validateCheckoutForm()) {
        navigate("/payment");
      } else {
        Swal.fire({
          icon: "error",
          title: "Incomplete Form",
          text: "Please complete the checkout form before proceeding to payment.",
        });
      }
    }
  };

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
        newErrors.zipCode = /^\d{5}$/.test(value) ? "" : "Invalid ZIP code";
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

    const totalFields = fieldsToCheck.length;
    const filledFields = fieldsToCheck.filter(
      (field) => formData[field as keyof FormData].trim() !== ""
    ).length;

    const progressPercentage = (filledFields / totalFields) * 100;
    setProgress(Math.round(progressPercentage));
  };

  const validateCheckoutForm = () => {
    const newErrors: FormErrors = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormData];
      if (typeof value === "string" && !value.trim()) {
        newErrors[key as keyof FormErrors] = "This field is required";
      }
    });
    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => !error);
    setCheckoutValid(isValid);
    return isValid;
  };

  const handleConfirmOrder = () => {
    Swal.fire({
      icon: "success",
      title: "Order Confirmed!",
      text: "Your order has been successfully placed. Thank you!",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    }).then(() => {
      setIsSubmitted(true);
      navigate("/");
    });
  };

  const renderValidationIcon = (field: keyof FormData) => {
    const fieldValue = formData[field];

    if (typeof fieldValue === "string" && fieldValue.trim() === "") return null;

    return errors[field] ? (
      <FaTimes className="absolute right-3 text-red-500" />
    ) : (
      <FaCheck className="absolute right-3 text-green-500" />
    );
  };

  return (
    <div className="min-h-screen bg-white py-12 flex flex-col justify-center sm:py-20">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl"></div>
        <div className="relative px-10 py-12 bg-white shadow-lg sm:rounded-xl sm:p-20">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-primary text-center mb-12 flex justify-center items-center">
                Checkout Details
                <FaCheckCircle className="ml-2 text-blue-500" />
              </h1>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-secondary" />
                    <label className="leading-loose text-primary">
                      First Name
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your first name"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("firstName")}
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-secondary" />
                    <label className="leading-loose text-primary">
                      Last Name
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your last name"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("lastName")}
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-secondary" />
                    <label className="leading-loose text-primary">Email</label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your email"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("email")}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaPhone className="text-secondary" />
                    <label className="leading-loose text-primary">Phone</label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your phone number"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("phone")}
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaHome className="text-secondary" />
                    <label className="leading-loose text-primary">
                      Address
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your address"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("address")}
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaCity className="text-secondary" />
                    <label className="leading-loose text-primary">City</label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your city"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("city")}
                  </div>
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {/* ZIP Code */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-secondary" />
                    <label className="leading-loose text-primary">
                      ZIP Code
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
                      placeholder="Enter your ZIP code"
                      disabled={isSubmitted}
                    />
                    {renderValidationIcon("zipCode")}
                  </div>
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                {/* Delivery Day */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <TbTruckDelivery className="text-secondary" />
                    <label className="leading-loose text-primary">
                      Delivery Day
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="date"
                      name="deliveryDay"
                      value={formData.deliveryDay}
                      onChange={handleChange}
                      min={getTodayDate()} // Disable dates before today
                      className="px-4 py-3 border border-darkGray focus:ring-secondary focus:border-secondary w-full sm:text-sm rounded-xl focus:outline-none text-gray-600"
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
              <div className="mt-12">
                <h2 className="text-3xl font-semibold text-primary text-center flex justify-center items-center mb-12">
                  Choose Payment Method
                  <FaCcAmazonPay className="ml-2 text-blue-500" />
                </h2>

                <div className="flex flex-row justify-between space-x-20">
                  {/* Pay with Cash */}
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 w-64 ${
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
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl shadow-lg transition-transform duration-300 transform hover:scale-105 w-64 ${
                      paymentMethod === "card"
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => handlePaymentMethodChange("card")}
                  >
                    <FaCreditCard className="text-blue-500 text-3xl mb-2" />
                    <span className="font-semibold text-lg">Pay with Card</span>
                    <span className="text-gray-500 text-sm">
                    Enter your card details to pay online or choose your card.
                    </span>
                  </button>
                </div>

                {/* Confirm Button */}
                {checkoutValid && paymentMethod === "cod" && (
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold px-8 py-4 text-lg rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
                      onClick={handleConfirmOrder}
                    >
                      <GiConfirmed className="mr-2" size={18} />
                      Confirm Order
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
