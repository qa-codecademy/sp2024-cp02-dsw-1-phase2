import React from "react";
import {
  FaTruck,
  FaGlobe,
  FaClock,
  FaDollarSign,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Shipping: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-5xl font-extrabold text-[#1A3F6B] text-center mb-12 tracking-wide">
          Shipping Information
        </h2>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          At Qintronics, we ensure timely and affordable shipping to your
          doorstep, whether you are shopping locally or internationally. Explore
          our delivery options below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Fast Delivery Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#1BD8C4] to-[#1A3F6B] p-4 rounded-full">
                <FaTruck className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/fast-delivery.webp"
              alt="Fast Delivery"
              className="w-full h-60 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Fast Delivery
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We ensure fast and secure delivery to your doorstep. Partnering
              with leading shipping services guarantees reliable delivery
              options.
            </p>
          </div>

          {/* Global Shipping Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#3498db] to-[#2980b9] p-4 rounded-full">
                <FaGlobe className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/global-shipping.jpg"
              alt="Global Shipping"
              className="w-full h-460 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Global Shipping
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We proudly ship internationally, bringing the latest technology to
              customers worldwide.
            </p>
          </div>

          {/* Estimated Delivery Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#FFA500] to-[#FFD700] p-4 rounded-full">
                <FaClock className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/estimated-delivery.webp"
              alt="Estimated Delivery"
              className="w-full h-60 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Estimated Delivery Times
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Domestic deliveries arrive within 3-5 business days. International
              orders take 7-14 business days, depending on customs.
            </p>
          </div>

          {/* Shipping Costs Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#2ecc71] to-[#16a085] p-4 rounded-full">
                <FaDollarSign className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/shipping-rates.jpeg"
              alt="Shipping Costs"
              className="w-full h-60 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Affordable Shipping Rates
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We offer competitive rates for all orders. Shipping costs are
              shown at checkout, so there are no surprises.
            </p>
          </div>

          {/* Shipping Insurance Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#A3D8F4] to-[#73BFE6] p-4 rounded-full">
                <FaShieldAlt className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/shipping-insurance.png"
              alt="Shipping Insurance"
              className="w-full h-60 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Shipping Insurance
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Protect your order with our shipping insurance. For a small
              additional fee, your package will be covered against damage or
              loss during transit.
            </p>
          </div>

          {/* Shipping Transparency Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-[#9b59b6] to-[#8e44ad] p-4 rounded-full">
                <FaInfoCircle className="text-4xl text-white" />
              </div>
            </div>
            <img
              src="../../public/images/shipping/track-order.png"
              alt="Shipping Transparency"
              className="w-full h-60 object-cover rounded-t-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-center mb-4">
              Shipping Transparency
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Stay informed every step of the way. We provide clear
              communication about your shipping process, including estimated
              delivery times and tracking details.
            </p>
          </div>
        </div>

        {/* Add Return Home Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/")}
            className="bg-[#1A3F6B] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-[#1A3F6B] hover:shadow-xl border border-transparent hover:border-[#1A3F6B] transition-all duration-300 transform hover:scale-105 mb-6"
          >
            Return Home
          </button>
        </div>
      </div>
    </section>
  );
};

export default Shipping;