import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Update this to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;