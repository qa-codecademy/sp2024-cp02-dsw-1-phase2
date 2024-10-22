import axios from "axios";

// declare module "axios" {
//   export interface AxiosRequestConfig {
//     authorization: boolean;
//   }
// }

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
<<<<<<< HEAD
  // authorization: false, // Default is false; for routes that require auth, authorization should be set to true when making the API call
});

axiosInstance.interceptors.request.use(
  (config) => {
    // if (config.authorization) {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const response = await axiosInstance.post("/auth/refresh-tokens", {
              refreshToken,
            });

            localStorage.setItem("accessToken", response.data.newAccessToken);
            localStorage.setItem("refreshToken", response.data.newRefreshToken);

            return axiosInstance(originalRequest);
          } catch (error: any) {
            // If refresh token is expired, remove the tokens, i.e. the user is logged out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            // Redirect to login?

            if (error.response && error.response.data) {
              return Promise.reject(error.response.data);
            }

            return Promise.reject(error);
          }
        }
      }
      if (error.response.status === 403 && error.response.data) {
        return Promise.reject(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

=======
  withCredentials: true,
});

>>>>>>> a07782bf4e3a1faa0e28d99561d2a8d31eae0cdd
export default axiosInstance;
