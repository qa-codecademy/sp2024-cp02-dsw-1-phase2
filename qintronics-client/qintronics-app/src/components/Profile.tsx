import React, { useEffect, useState } from "react";
import axiosInstance from "../common/utils/axios-instance.util";

// Interfaces
interface BasicFormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: number | "";
  country: string;
}

interface PaymentFormData {
  ccFullName: string;
  ccNum: string;
  expDate: string;
  cvv: string;
}

// ProfileBasicInfo Component
const ProfileBasicInfo: React.FC<{
  formData: BasicFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ formData, onChange }) => (
  <div className="space-y-6">
    {/* Personal Information Section */}
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-900">
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="+1234567890"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>
    </div>

    {/* Address Section */}
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-900">Address</h3>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Street Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Country
        </label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>
    </div>
  </div>
);

// ProfilePaymentInfo Component
const ProfilePaymentInfo: React.FC<{
  formData: PaymentFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  errors: {
    ccNum?: string;
    cvv?: string;
    expDate?: string;
  };
}> = ({ formData, onChange, errors }) => {
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) =>
    (currentYear + i).toString().slice(-2)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium text-gray-900">Payment Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          name="ccFullName"
          value={formData.ccFullName}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Card Number
        </label>
        <input
          type="text"
          name="ccNum"
          value={formData.ccNum}
          onChange={onChange}
          placeholder="1234 5678 9012 3456"
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.ccNum ? "border-red-500" : "border-gray-200"
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
        />
        {errors.ccNum && (
          <p className="text-red-500 text-xs mt-1">{errors.ccNum}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Expiry Date
          </label>
          <div className="flex gap-2 items-center">
            <select
              name="expMonth"
              value={formData.expDate.split("-")[1] || ""}
              onChange={onChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
            >
              <option value="">MM</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <span className="text-gray-500">/</span>
            <select
              name="expYear"
              value={formData.expDate.split("-")[0]?.slice(-2) || ""}
              onChange={onChange}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
            >
              <option value="">YY</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          {errors.expDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            CVV
          </label>
          <input
            type="password"
            name="cvv"
            value={formData.cvv}
            onChange={onChange}
            maxLength={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.cvv ? "border-red-500" : "border-gray-200"
            } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [basicFormData, setBasicFormData] = useState<BasicFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    ccFullName: "",
    ccNum: "",
    expDate: "",
    cvv: "",
  });

  const [paymentFormErrors, setPaymentFormErrors] = useState<{
    ccNum?: string;
    cvv?: string;
    expDate?: string;
  }>({});

  useEffect(() => {
    axiosInstance
      .get("/users/me")
      .then((res) => {
        const {
          userInfo: {
            firstName,
            lastName,
            phone,
            address,
            city,
            postalCode,
            country,
          },
        } = res.data;

        setBasicFormData({
          firstName: firstName || "",
          lastName: lastName || "",
          phone: phone || "",
          address: address || "",
          city: city || "",
          postalCode: postalCode || "",
          country: country || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for expiry date
    if (name === "expMonth" || name === "expYear") {
      const currentMonth =
        name === "expMonth"
          ? value
          : paymentFormData.expDate.split("-")[1] || "";
      const currentYear =
        name === "expYear"
          ? value
          : paymentFormData.expDate.split("-")[0]?.slice(-2) || "";

      const newExpDate =
        name === "expMonth"
          ? `${currentYear}-${value}`
          : `${value}-${currentMonth}`;

      setPaymentFormData((prev) => ({
        ...prev,
        expDate: newExpDate,
      }));
    } else {
      setPaymentFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear any existing error for this field
    if (["ccNum", "cvv", "expMonth", "expYear"].includes(name)) {
      setPaymentFormErrors((prev) => ({
        ...prev,
        [name === "expMonth" || name === "expYear" ? "expDate" : name]:
          undefined,
      }));
    }
  };

  const validateCreditCard = () => {
    const errors: {
      ccNum?: string;
      cvv?: string;
      expDate?: string;
    } = {};

    // Credit Card Number Validation
    const cleanNumber = paymentFormData.ccNum.replace(/\D/g, "");
    const validPrefixes = ["34", "37", "4", "5", "6"];

    if (!cleanNumber) {
      errors.ccNum = "Card number is required";
    } else if (
      !validPrefixes.some((prefix) => cleanNumber.startsWith(prefix))
    ) {
      errors.ccNum = "Invalid card number prefix";
    } else if (![15, 16].includes(cleanNumber.length)) {
      errors.ccNum = "Card number must be 15 or 16 digits";
    }

    // CVV Validation
    const cleanCVV = paymentFormData.cvv.replace(/\D/g, "");
    if (!cleanCVV) {
      errors.cvv = "CVV is required";
    } else if (parseInt(cleanCVV) < 100 || parseInt(cleanCVV) > 9999) {
      errors.cvv = "CVV must be between 100 and 9999";
    }

    // Expiry Date Validation
    const [year, month] = paymentFormData.expDate.split("-");
    if (!year || !month) {
      errors.expDate = "Expiry date is required";
    } else {
      const currentDate = new Date();
      const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);

      if (expDate < currentDate) {
        errors.expDate = "Card has expired";
      }
    }

    setPaymentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "payment") {
        // Validate payment form before submission
        const isValid = validateCreditCard();
        if (!isValid) {
          setIsLoading(false);
          return;
        }

        // Prepare the payload with expiry date formatted as YYYY-MM
        const formattedPaymentData = {
          ...paymentFormData,
          expDate: `20${paymentFormData.expDate.split("-")[0]}-${
            paymentFormData.expDate.split("-")[1]
          }-01 00:00:00`,
        };
        await axiosInstance.patch("/user-info/update", formattedPaymentData);
      } else {
        // Existing logic for basic info
        const cleanedData = Object.entries(basicFormData).reduce(
          (acc, [key, value]) => {
            if (value !== "") {
              acc[key as keyof FormData] = value;
            }
            return acc;
          },
          {} as any
        );
        if (cleanedData.postalCode) {
          cleanedData.postalCode = parseInt(
            cleanedData.postalCode.toString(),
            10
          );
        }
        await axiosInstance.patch("/user-info/update", cleanedData);
      }

      setSuccessMessage(
        `${
          activeTab === "basic" ? "Basic" : "Payment"
        } information updated successfully!`
      );
    } catch (error) {
      setError("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h2>
          </div>

          {error && (
            <div className="mx-6 mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mx-6 mt-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          <div className="p-6">
            <div className="flex space-x-1 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("basic")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "basic"
                    ? "bg-white text-[#1A3F6B] border-b-2 border-[#1A3F6B]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Basic Information
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === "payment"
                    ? "bg-white text-[#1A3F6B] border-b-2 border-[#1A3F6B]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Payment Details
              </button>
            </div>
            <div className="flex justify-center">
              <form onSubmit={handleSubmit}>
                {activeTab === "basic" ? (
                  <ProfileBasicInfo
                    formData={basicFormData}
                    onChange={handleBasicChange}
                  />
                ) : (
                  <ProfilePaymentInfo
                    formData={paymentFormData}
                    onChange={handlePaymentChange}
                    errors={paymentFormErrors}
                  />
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg transition-colors ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-[#1A3F6B] hover:bg-[#1A3F6B]/95 active:bg-[#1A3F6B]85"
                    } text-white font-medium`}
                  >
                    {isLoading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
