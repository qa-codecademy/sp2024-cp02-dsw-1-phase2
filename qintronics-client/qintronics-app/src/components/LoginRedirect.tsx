// import { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/auth.context";
// import Loader from "./Loader";
// import LoginPopup from "./LoginPopup";

// export default function LoginRedirect() {
//   const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);
//   const { user, isLoading } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       // Redirect user to login page when they are not authenticated
//       navigate("/login");
//     }
//   }, [user, navigate]);

//   if (isLoading) return <Loader />;

//   const toggleLoginPopup = () => setLoginPopupOpen((prev) => !prev);

//   if (!user) {
//     if (!isLoginPopupOpen) toggleLoginPopup();
//     return <LoginPopup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />;
//   }

//   return null; // If the user is authenticated, there's nothing to display
// }
