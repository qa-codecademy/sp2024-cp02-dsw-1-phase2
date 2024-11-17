import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Save, X, ShieldCheck, CreditCard, User } from "lucide-react";
import axiosInstance from "./../common/utils/axios-instance.util"; // Adjust the import path as needed

interface UserInfo {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: number | string;
  country: string;
  ccFullName?: string;
  ccNum?: string;
  expDate?: string;
  cvv?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  userInfo: UserInfo;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      setUser(response.data);
    } catch (error) {
      showToast("Failed to fetch user information", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.userInfo) return;

    const { name, value } = e.target;

    setUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        userInfo: {
          ...prev.userInfo,
          [name]: value,
          postalCode: parseInt(value),
        },
      };
    });

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (user?.userInfo) {
      if (!user.userInfo.firstName) errors.firstName = "First name is required";
      if (!user.userInfo.lastName) errors.lastName = "Last name is required";
      if (
        user.userInfo.phone &&
        !/^\+?[\d\s-]{10,}$/.test(user.userInfo.phone)
      ) {
        errors.phone = "Invalid phone number";
      }
      if (user.userInfo.ccNum && !/^\d{16}$/.test(user.userInfo.ccNum)) {
        errors.ccNum = "Card number must be 16 digits";
      }
      if (user.userInfo.cvv && !/^\d{3,4}$/.test(user.userInfo.cvv)) {
        errors.cvv = "CVV must be 3 or 4 digits";
      }
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please check the form for errors", "error");
      return;
    }

    try {
      const response = await axiosInstance.patch(
        "/user-info/update",
        user?.userInfo
      );
      setUser((prev) => (prev ? { ...prev, userInfo: response.data } : null));
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    }
  };

  const FormField = ({
    label,
    name,
    type = "text",
    value = "",
    error,
    disabled = false,
  }: {
    label: string;
    name: string;
    type?: string;
    value?: string | number;
    error?: string;
    disabled?: boolean;
  }) => (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={handleChange}
        disabled={disabled || !isEditing}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A3F6B] focus:border-[#1A3F6B] disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="relative flex items-center justify-center w-10 h-10 bg-[#1A3F6B] text-white rounded-full hover:bg-[#15406D] transition-transform transform hover:scale-105 group"
                  >
                    <Save className="h-5 w-5" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Save
                    </span>
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="relative flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 group"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Cancel
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[#1A3F6B] text-white rounded-lg hover:bg-[#15406D] transition-transform transform hover:scale-105 flex items-center space-x-2"
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveSection("personal")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "personal"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <User className="h-5 w-5 inline-block mr-2" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveSection("payment")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "payment"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <CreditCard className="h-5 w-5 inline-block mr-2" />
                Payment Methods
              </button>
              <button
                onClick={() => setActiveSection("security")}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "security"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <ShieldCheck className="h-5 w-5 inline-block mr-2" />
                Security
              </button>
            </nav>
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === "personal" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white shadow-lg rounded-xl p-8 space-y-8"
              >
                <h3 className="text-lg font-medium">Personal Information</h3>
                <p className="text-gray-600">
                  Update your personal details and ensure they are accurate.
                </p>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Name Fields */}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormField
                      label="First Name"
                      name="firstName"
                      value={user?.userInfo.firstName}
                      error={formErrors.firstName}
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      value={user?.userInfo.lastName}
                      error={formErrors.lastName}
                    />
                  </div>

                  {/* Contact Fields */}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormField
                      label="Phone"
                      name="phone"
                      value={user?.userInfo.phone}
                      error={formErrors.phone}
                    />
                    <FormField
                      label="Email"
                      name="email"
                      value={user?.email}
                      disabled={true}
                    />
                  </div>

                  {/* Address Information Section */}
                  <FormField
                    label="Address"
                    name="address"
                    value={user?.userInfo.address}
                  />
                  <FormField
                    label="City"
                    name="city"
                    value={user?.userInfo.city}
                  />
                  <FormField
                    label="Postal Code"
                    name="postalCode"
                    value={user?.userInfo.postalCode}
                  />
                  <FormField
                    label="Country"
                    name="country"
                    value={user?.userInfo.country}
                  />
                </form>
              </motion.div>
            )}

            {activeSection === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white shadow-lg rounded-xl p-8 space-y-6"
              >
                <h3 className="text-lg font-medium">Payment Details</h3>
                <p className="text-gray-600">
                  Please provide your payment details below. Your information is
                  secure.
                </p>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left column */}
                  <div className="space-y-6">
                    <FormField
                      label="Cardholder Name"
                      name="ccFullName"
                      value={user?.userInfo.ccFullName}
                    />
                    <FormField
                      label="Expiration Date"
                      name="expDate"
                      type="date"
                      value={user?.userInfo.expDate?.split(" ")[0]}
                    />
                  </div>

                  {/* Right column */}
                  <div className="space-y-6">
                    <FormField
                      label="Card Number"
                      name="ccNum"
                      value={user?.userInfo.ccNum}
                      error={formErrors.ccNum}
                    />
                    <FormField
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={user?.userInfo.cvv}
                      error={formErrors.cvv}
                    />
                  </div>
                </form>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white shadow-sm rounded-xl p-8"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  <p className="text-gray-600">
                    Your account is protected with password authentication.
                  </p>
                  <button
                    className="px-4 py-2 bg-[#1A3F6B] text-white font-medium rounded-lg hover:bg-[#15406D] shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
                    onClick={() => {
                      /* Add password change logic */
                    }}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    <span>Change Password</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed inset-x-0 mx-auto bottom-4 px-6 py-3 rounded-lg shadow-lg text-center ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white w-fit`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
