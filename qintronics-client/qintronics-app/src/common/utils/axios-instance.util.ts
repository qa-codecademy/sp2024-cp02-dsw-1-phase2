import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Update this to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the access token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axiosInstance.post("/auth/refresh-tokens", {
          refreshToken,
        });
        const { newAccessToken, newRefreshToken } = response.data;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out the user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Redirect to login page or update app state
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
