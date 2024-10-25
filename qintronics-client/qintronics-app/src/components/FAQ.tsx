import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importing navigate for button functionality

const faqData = [
  {
    question: "What is Qintronics?",
    answer:
      "Qintronics is a leading retailer of electronics, offering a wide selection of the latest technology from world-class brands.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, we will provide a tracking number via email. You can use this number to track your shipment on our website.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on most products, provided they are returned in their original condition. For detailed information, please visit our return policy page.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, Qintronics ships internationally. Shipping fees and delivery times vary depending on the destination.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach out to our customer support team via our contact page or by emailing support@qintronics.com. We aim to respond within 24 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept a variety of payment methods including credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.",
  },
  {
    question: "Can I modify my order after placing it?",
    answer:
      "Unfortunately, once an order is placed, it cannot be modified. However, you can cancel the order within 24 hours and place a new one.",
  },
  {
    question: "How long does it take to process a return?",
    answer:
      "Once we receive your returned item, we will process it within 5-7 business days. You will be notified via email once the return is complete.",
  },
  {
    question: "Do you offer product warranties?",
    answer:
      "Yes, most of our products come with manufacturer warranties. Please check the product page for detailed warranty information.",
  },
  {
    question: "Can I purchase a gift card from Qintronics?",
    answer:
      "Yes, we offer digital gift cards that you can purchase directly from our website. They are perfect for any occasion!",
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate(); // Initialize the navigate hook for routing

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-5xl font-extrabold text-[#1A3F6B] text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 transition duration-500 ease-in-out hover:shadow-xl"
            >
              <button
                className="w-full flex justify-between items-center text-left text-xl font-semibold text-gray-900"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center">
                  <FaQuestionCircle className="text-[#1A3F6B] mr-3" />
                  <span>{item.question}</span>
                </div>
                <span>
                  {openIndex === index ? (
                    <FaChevronUp className="text-[#1A3F6B] transition duration-300 ease-in-out" />
                  ) : (
                    <FaChevronDown className="text-[#1A3F6B] transition duration-300 ease-in-out" />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
                style={{
                  maxHeight: openIndex === index ? "300px" : "0px",
                }}
              >
                <div className="mt-4 text-gray-700 transition-opacity duration-500 ease-in-out">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
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

export default FAQ;