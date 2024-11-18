import { motion } from "framer-motion";
import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AboutUs from "./components/AboutUs";
import CardPaymentForm from "./components/CardPaymentForm";
import CartPage from "./components/CartPage";
import CategoryPage from "./components/CategoryPage";
import Chatbot from "./components/Chatbot";
import CompareProducts from "./components/CompareProducts";
import ContactForm from "./components/ContactPage";
import Dashboard from "./components/Dashboard";
import FAQ from "./components/FAQ";
import Favorites from "./components/Favorites";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import GiftCard from "./components/GiftCard";
import Header from "./components/Header";
import Layout from "./components/Layout";
import { Login } from "./components/Login";
import MainComponent from "./components/MainComponent";
import NotFound from "./components/NotFound";
import OrderPage from "./components/OrderPage";
import OurServices from "./components/OurServices";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PrivateRoute from "./components/PrivateRoute";
import ProductDetailsPage from "./components/ProductDetailsPage";
import Profile from "./components/Profile";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import Returns from "./components/Returns";
import SalesPage from "./components/SalesPage";
import Shipping from "./components/Shipping";
import AuthContextProvider from "./context/auth.context";
import CardPaymentProvider from "./context/card-payment.context";
import OrderOverview from "./components/OrderOverview";
import CustomerOrders from "./components/CustomerOrders";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate("/login");
  };
  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <AuthContextProvider>
      <div className="App flex flex-col">
        <Header onLoginClick={handleLoginClick} />{" "}
        <div className="content grow">
          <CardPaymentProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<MainComponent />} />
                <Route path="/cart" element={<CartPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/checkout" element={<OrderPage />} />
                  <Route path="/payment" element={<CardPaymentForm />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/contact" element={<ContactForm />} />
                <Route path="/compare" element={<CompareProducts />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/brand/:brand" element={<CategoryPage />} />
                <Route path="/category/gift-cards" element={<GiftCard />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/our-services" element={<OurServices />} />
                <Route path="/orders" element={<CustomerOrders />} />
                <Route path="/order/:orderId" element={<OrderOverview />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </Layout>
          </CardPaymentProvider>
        </div>
        {/* <Footer /> */} {/* Transferred to Layout.js */}
        <div className="fixed bottom-4 right-4">
          <motion.button
            onClick={toggleChat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-[#1A3F6B] text-white p-4 rounded-full shadow-lg focus:outline-none"
          >
            💬 Chat
          </motion.button>
        </div>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 w-80 h-96 bg-white border border-gray-300 shadow-lg rounded-lg"
          >
            <Chatbot toggleChat={toggleChat} />
          </motion.div>
        )}
      </div>
    </AuthContextProvider>
  );
}

export default App;
