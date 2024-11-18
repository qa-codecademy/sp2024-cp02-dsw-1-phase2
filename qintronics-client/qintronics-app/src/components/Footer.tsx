import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const location = useLocation();

  // Automatically scroll to the top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer className="bg-gradient-to-b from-[#1BD8C4] to-[#1A3F6B] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* Add your logo here */}
            {/* <img
              src="../../public/images/qintronics-high-resolution-logo-white-transparent-removebg-preview (1).png" // Replace with the path to your logo image
              alt="Company Logo"
              className="h-12 w-auto mb-4" // Adjust the size of your logo
            /> */}
            <h1 className="text-4xl font-bold mb-4">Qintronics</h1>
            <h3 className="text-xl font-bold mb-6">Skopje</h3>
            <p className="text-sm leading-relaxed">
              11th October St. 33A
              <br />
              1000 Skopje, Macedonia
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/our-services"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Our Services
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-[#FFD700] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
            <div className="flex space-x-6">
              <a
                href="#"
                className="hover:text-[#FFD700] transition-transform transform hover:scale-110"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#FFD700] transition-transform transform hover:scale-110"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#FFD700] transition-transform transform hover:scale-110"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="hover:text-[#FFD700] transition-transform transform hover:scale-110"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-400 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Qintronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
