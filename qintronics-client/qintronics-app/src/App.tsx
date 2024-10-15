import { motion } from "framer-motion";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import CardPaymentForm from "./components/CardPaymentForm";
import CartPage from "./components/CartPage";
import CategoryPage from "./components/CategoryPage";
import Chatbot from "./components/Chatbot";
import CompareProducts from "./components/CompareProducts";
import ContactForm from "./components/ContactPage";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import GiftCard from "./components/GiftCard";
import Header from "./components/Header";
import LoginPopup from "./components/LoginPopup";
import MainComponent from "./components/MainComponent";
import OrderPage from "./components/OrderPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
import ProductList from "./components/ProductList";
import SalesPage from "./components/SalesPage";
import { CardPaymentProvider } from "./context/card-payment.context";
import products from "./data/products.json";
import AboutUs from "./components/AboutUs";
import FAQ from "./components/FAQ";
import Shipping from "./components/Shipping";

function App() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Manage chat visibility

  const toggleLoginPopup = () => setIsLoginPopupOpen(!isLoginPopupOpen);
  const toggleChat = () => setIsChatOpen(!isChatOpen); // Toggle chat window

  const convertedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));
  return (
    <div className="App flex flex-col">
      <Header onLoginClick={toggleLoginPopup} />

      <div className="content grow">
        <CardPaymentProvider>
          <Routes>
            <Route path="/" element={<MainComponent />} />
            <Route path="/cart" element={<CartPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<OrderPage />} />
              <Route path="/payment" element={<CardPaymentForm />} />
            </Route>
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/compare" element={<CompareProducts />} />
            <Route path="/dashboard" element={<Dashboard />} />{" "}
            <Route
              path="/products"
              element={<ProductList productList={convertedProducts} />}
            />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/gift-cards" element={<GiftCard />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
          </Routes>
        </CardPaymentProvider>
      </div>

      <LoginPopup isOpen={isLoginPopupOpen} onClose={toggleLoginPopup} />
      <Footer />

      <div className="fixed bottom-4 right-4">
        <motion.button
          onClick={toggleChat} // Opens the chat on button click
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
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
  );
}

export default App;
