import axios from "axios";
import React, { useState } from "react";
import axiosInstance from "./../common/utils/axios-instance.util";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: number | "";
  country: string;
  ccFullName: string;
  ccNum: string;
  expDate: string;
  cvv: string;
}

const Profile = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    ccFullName: "",
    ccNum: "",
    expDate: "",
    cvv: "",
  });

  const validateCreditCard = (number: string) => {
    // Remove spaces and non-digits
    const cleanNumber = number.replace(/\D/g, "");
    // Check if the card number starts with valid prefixes
    const validPrefixes = ["34", "37", "4", "5", "6"];
    return validPrefixes.some((prefix) => cleanNumber.startsWith(prefix));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generate month options (01-12)
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) =>
    (currentYear + i).toString().slice(-2)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;
    let isValid = true;

    switch (name) {
      case "ccNum": {
        formattedValue = value.replace(/\D/g, "").slice(0, 16);
        if (formattedValue.length > 0) {
          isValid = validateCreditCard(formattedValue);
          if (!isValid) {
            setError("Credit card number must start with 34, 37, 4, 5 or 6");
          }
        }
        break;
      }
      case "cvv": {
        formattedValue = value.replace(/\D/g, "").slice(0, 4);
        const cvvNum = parseInt(formattedValue, 10); // Include radix for clarity
        if (formattedValue.length > 0) {
          if (cvvNum < 100 || cvvNum > 9999) {
            setError("CVV must be between 100 and 9999");
            isValid = false;
          }
        }
        break;
      }
      case "phone": {
        formattedValue = value.replace(/[^\d+]/g, "");
        break;
      }
      case "postalCode": {
        formattedValue = value.replace(/\D/g, "");
        break;
      }
    }

    if (isValid) {
      setError(null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submission
    if (!validateCreditCard(formData.ccNum)) {
      setError("Invalid credit card number");
      return;
    }

    const cvvNum = parseInt(formData.cvv);
    if (cvvNum < 100 || cvvNum > 9999) {
      setError("CVV must be between 100 and 9999");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...formData,
        postalCode: formData.postalCode
          ? parseInt(formData.postalCode.toString())
          : "",
        ccNum: formData.ccNum.replace(/\s+/g, ""),
        expDate: `${formData.expDate}-01 00:00:00`,
        cvv: parseInt(formData.cvv), // Ensure CVV is sent as integer
      };

      const response = await axiosInstance.patch("/user-info/update", payload);

      if (response.data) {
        console.log("Update successful:", response.data);
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message?.[0] ||
            err.response?.data?.message ||
            "An error occurred while updating the profile. Please check your connection and try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Update failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm space-y-6 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h2>
          </div>

          {error && (
            <div className="mx-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mx-6 bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl text-sm">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
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
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-medium text-gray-900">Address</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-medium text-gray-900">
                Payment Details
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="ccFullName"
                  value={formData.ccFullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
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
                      onChange={(e) => {
                        const year =
                          formData.expDate.split("-")[0] ||
                          new Date().getFullYear();
                        setFormData((prev) => ({
                          ...prev,
                          expDate: `${year}-${e.target.value}`,
                        }));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
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
                      onChange={(e) => {
                        const month = formData.expDate.split("-")[1] || "01";
                        const fullYear = "20" + e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          expDate: `${fullYear}-${month}`,
                        }));
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
                    >
                      <option value="">YY</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
              } text-white font-medium shadow-sm`}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
