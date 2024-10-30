import { useNavigate } from "react-router-dom";
import {
  FaHeadset,
  FaTruck,
  FaShieldAlt,
  FaTools,
  FaSyncAlt,
  FaCogs,
  FaGift,
  FaClock,
  FaShoppingCart,
} from "react-icons/fa";

const OurServices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-5xl font-extrabold text-[#1A3F6B] text-center mb-12 drop-shadow-md">
          Our Services
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
          At Qintronics, we offer a wide range of services to make your
          experience with us exceptional. Whether it’s fast shipping, customer
          support, or warranty services, we’ve got you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaTruck className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Fast Shipping
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Enjoy fast and reliable delivery services with real-time tracking
              available for all your orders.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaHeadset className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Customer Support
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Our 24/7 customer support team is here to help with any inquiries
              or issues you might face.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaShieldAlt className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Warranty Services
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We offer extensive warranty services on all products to ensure
              your peace of mind.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaTools className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Repair Services
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Our certified technicians are ready to repair your devices with
              high-quality workmanship.
            </p>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaSyncAlt className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Easy Returns
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We offer a hassle-free 30-day return policy, ensuring a smooth
              experience for our customers.
            </p>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaCogs className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Custom Solutions
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              We provide custom solutions tailored to your specific business
              needs.
            </p>
          </div>

          {/* Service 7 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaGift className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Gift Cards</h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Give the gift of choice with our digital gift cards, perfect for
              any occasion.
            </p>
          </div>

          {/* Service 8 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaClock className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              24-Hour Processing
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Orders are processed within 24 hours to ensure fast and efficient
              delivery.
            </p>
          </div>

          {/* Service 9 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 group">
            <div className="flex justify-center mb-6">
              <FaShoppingCart className="text-5xl text-[#1A3F6B] group-hover:text-[#1BD8C4] transition-colors duration-300" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">
              Online Shopping Assistance
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              Need help placing an order? Our support team is here to assist you
              with any issues.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/")}
            className="bg-[#1A3F6B] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white hover:text-[#1A3F6B] hover:shadow-xl border border-transparent hover:border-[#1A3F6B] transition-all duration-300 transform hover:scale-105"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OurServices;
