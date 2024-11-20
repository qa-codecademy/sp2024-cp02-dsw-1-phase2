import { ReactNode, createContext, useEffect, useState } from "react";
import { User } from "../common/interfaces/user.interface";
import axiosInstance from "../common/utils/axios-instance.util";

type AuthContextProviderType = {
  children: ReactNode | ReactNode[];
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const defaultValues: AuthContextType = {
  user: null,
  setUser: () => {},
  isLoading: false,
  setIsLoading: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultValues);

export default function AuthContextProvider({
  children,
}: AuthContextProviderType) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    axiosInstance
      .post("/auth/refresh-tokens")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const requestInterceptorId = axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/auth/refresh-tokens"
        ) {
          originalRequest._retry = true;

          try {
            const receivedUser = await axiosInstance.post(
              "/auth/refresh-tokens"
            );
            setUser(receivedUser.data);

            return axiosInstance(originalRequest);
          } catch (refreshError: any) {
            setUser(null);

            if (refreshError.response && refreshError.response.data) {
              return Promise.reject(refreshError.response.data);
            }
            return Promise.reject(refreshError);
          }
        }

        if (error.response && error.response.status === 403) {
          return Promise.reject(error.response.data);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptorId);
      axiosInstance.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
