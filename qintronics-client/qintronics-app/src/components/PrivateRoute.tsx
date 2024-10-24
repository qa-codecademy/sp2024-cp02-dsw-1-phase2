import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Loader from "./Loader";
import LoginPopup from "./LoginPopup";

export default function PrivateRoute() {
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loader />;

  const toggleLoginPopup = () => setLoginPopupOpen((prev) => !prev);

  if (!user) {
    if (!isLoginPopupOpen) toggleLoginPopup();
    return <LoginPopup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />;
  }
  return <Outlet />;
}
