import React, { useState } from "react";
import { motion } from "framer-motion";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <section className="shadow-lg bg-[#CBEDEE] rounded-md py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#06255B] mb-8">
          Stay Informed with Our Newsletter
        </h2>
        <p className="text-center text-lg text-[#06255B] mb-6">
          Get the latest updates, news, and special offers straight to your
          inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex rounded-full overflow-hidden shadow-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-6 py-3 text-gray-700 rounded-l-full focus:outline-none focus:ring-4 focus:ring-[#23B3B6] placeholder-gray-500"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-[#23B3B6] text-white px-8 py-3 font-semibold rounded-r-full hover:bg-[#06255B] transition-colors duration-300"
            >
              Subscribe
            </motion.button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          We respect your privacy. You can unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
