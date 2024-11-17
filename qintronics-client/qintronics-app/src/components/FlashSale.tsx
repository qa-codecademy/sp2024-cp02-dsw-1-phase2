import  { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, Hourglass, Timer } from 'lucide-react';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Initialize timer
  useEffect(() => {
    const endTime = new Date().getTime() + 3 * 60 * 60 * 1000; 

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const timeLabels = [
    { label: 'Hours', value: timeLeft.hours, icon: <Clock size={16} /> },
    { label: 'Minutes', value: timeLeft.minutes, icon: <Timer size={16} /> },
    { label: 'Seconds', value: timeLeft.seconds, icon: <Hourglass size={16} /> },
  ];

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      {/* Flash Sale Section */}
      <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-2xl text-white">
        <h3 className="text-xl font-bold mb-2">🔥 Flash Sale</h3>
        <p className="text-white/80 mb-4">Up to 50% off on selected items</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {timeLabels.map(({ label, value, icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-sm p-2 rounded-lg transform transition-transform hover:scale-105"
            >
              <div className="text-xl font-bold flex justify-center items-center gap-1">
                {icon}
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="bg-gradient-to-br from-amber-500 to-pink-600 p-6 rounded-2xl text-white">
        <h3 className="text-xl font-bold mb-2">🎁 Special Offers</h3>
        <p className="text-white/80 mb-4">Free shipping on orders over $50</p>
        <Link to="/sales">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-2 bg-white text-black rounded-full flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Shop Deals
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default FlashSale;
