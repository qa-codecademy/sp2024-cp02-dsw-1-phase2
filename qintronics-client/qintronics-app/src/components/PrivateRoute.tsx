import { useState } from "react";
import { Outlet } from "react-router-dom";
import LoginPopup from "./LoginPopup";

export default function PrivateRoute() {
  // If there is an access token, a user should be logged in
  const accessToken = localStorage.getItem("accessToken");

  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);

  const toggleLoginPopup = () => setLoginPopupOpen((prev) => !prev);

  if (!accessToken) {
    if (!isLoginPopupOpen) toggleLoginPopup();
    return <LoginPopup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />;
  }
  return <Outlet />;
}
