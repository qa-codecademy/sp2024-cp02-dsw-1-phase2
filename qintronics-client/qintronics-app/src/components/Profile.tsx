// Profile.tsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

interface UserInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  ccFullName: string;
  ccNum: string;
  expDate: string;
  cvv: string;
}

const Profile = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/users/me`); // Updated endpoint to fetch user info
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [setIsLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userInfo) {
      setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo) {
      try {
        const response = await axios.patch(`/api/user-info/update`, userInfo); // Updated endpoint for user info update
        setUser(response.data); // Update the user context with the new data
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (userInfo) {
      try {
        await axios.patch(`/api/user-info/delete`, { id: user?.userId }); // Updated endpoint for user info deletion
        setUser(null); // Clear user context
        setUserInfo(null); // Clear user info
      } catch (error) {
        console.error("Error deleting user info:", error);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!userInfo) return <div>No user information available.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              value={userInfo.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={userInfo.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Phone"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Address"
              name="address"
              value={userInfo.address}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="City"
              name="city"
              value={userInfo.city}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Postal Code"
              name="postalCode"
              value={userInfo.postalCode}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Country"
              name="country"
              value={userInfo.country}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Cardholder Name"
              name="ccFullName"
              value={userInfo.ccFullName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Card Number"
              name="ccNum"
              value={userInfo.ccNum}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="Expiration Date"
              name="expDate"
              type="date"
              value={userInfo.expDate}
              onChange={handleChange}
              readOnly={!isEditing}
            />
            <InputField
              label="CVV"
              name="cvv"
              type="password"
              value={userInfo.cvv}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
        {isEditing && (
          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded"
          >
            Save Changes
          </button>
        )}
        {user && (
          <button
            type="button"
            onClick={handleDelete}
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded"
          >
            Delete Account
          </button>
        )}
      </form>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  type?: string;
}> = ({ label, name, value, onChange, readOnly, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`p-2 border rounded ${
        readOnly ? "bg-gray-100" : "bg-white"
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    />
  </div>
);

export default Profile;
