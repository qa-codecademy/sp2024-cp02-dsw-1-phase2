import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { RiMailSendLine } from "react-icons/ri";
import "sweetalert2/dist/sweetalert2.min.css";
import axiosInstance from "../common/utils/axios-instance.util";
import { contactPageSuccess } from "../common/utils/swalUtils";
import { useNavigate } from "react-router-dom";

const ContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, phone, message } = formData;

    // Validation checks
    if (!name) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your name!",
      });
      return;
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your email!",
      });
      return;
    }

    if (!phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a phone number!",
      });
      return;
    }

    if (!message) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a message!",
      });
      return;
    }

    // Clear the form fields
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });

    // Show the success Swal message immediately
    contactPageSuccess(navigate);

    // Proceed with the API call
    axiosInstance
      .post("/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      })
      .catch((err) => console.log(err)); // Catch errors if needed
  };

  return (
    <div className="bg-lightGray py-16 relative">
      <div className="big-circle"></div>
      <img src="/shape.png" className="square" alt="Background Shape" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="bg-white shadow-custom rounded-lg p-8"
        >
          <h2 className="text-3xl text-center font-bold text-primary mb-6">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-8">
            Have any questions? Feel free to reach out, and we’ll get back to
            you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaUser className="text-secondary" />
                <label className="text-primary font-semibold">Name</label>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope className="text-secondary" />
                <label className="text-primary font-semibold">Email</label>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Field */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaPhone className="text-secondary" />
                <label className="text-primary font-semibold">Phone</label>
              </div>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Message Field */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope className="text-secondary" />
                <label className="text-primary font-semibold">Message</label>
              </div>
              <motion.textarea
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="border border-darkGray pl-4 py-6 h-40 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
                placeholder="Write your message"
                rows={6}
              ></motion.textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="mt-4 bg-[#1A3F6B] text-white font-bold py-3 px-6 rounded-lg w-full max-w-xs shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center justify-center uppercase"

              >
                <RiMailSendLine className="mr-2" size={18} />
                Send Message
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="space-y-8"
        >
          <div className="bg-white shadow-custom rounded-lg p-8 space-y-4">
            <h3 className="text-2xl font-semibold text-primary">Get in Touch</h3>
            <p className="text-gray-600">
              Looking to boost your dropshipping success? Connect with us and
              transform your business! Whether you're an experienced entrepreneur
              or just getting started, we're here to offer expert advice, premium
              products, and exceptional support every step of the way. Reach out
              today, and let's make your dropshipping venture a triumph!
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPinIcon className="h-6 w-6 text-secondary mr-3" />
                <p className="text-primary">
                  Qintronics 11th October St. 33A, Skopje 1000
                </p>
              </div>
              <div className="flex items-center">
                <EnvelopeIcon className="h-6 w-6 text-secondary mr-3" />
                <a
                  href="mailto:qintronics@project.com"
                  className="text-primary hover:underline"
                >
                  qintronics@project.com
                </a>
              </div>

              <div className="flex items-center">
                <PhoneIcon className="h-6 w-6 text-secondary mr-3" />
                <a
                  href="tel:+1235235598"
                  className="text-primary hover:underline"
                >
                  +1235 2355 98
                </a>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-semibold text-primary flex justify-center items-center">
                  Connect with us:
                </p>
                <div className="flex space-x-4 mt-2 justify-center items-center">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary text-center hover:text-primary transition"
                  >
                    <FaFacebook className="h-6 w-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition"
                  >
                    <FaTwitter className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition"
                  >
                    <FaInstagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-primary transition"
                  >
                    <FaLinkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="overflow-hidden rounded-lg shadow-lg"
            style={{ height: "500px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2965.6240183274977!2d21.437439711854108!3d41.986881558475986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135415c6204d8197%3A0xb73c65132f7d38d2!2sQinshift!5e0!3m2!1sen!2smk!4v1717094928821!5m2!1sen!2smk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            ></iframe>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactForm;