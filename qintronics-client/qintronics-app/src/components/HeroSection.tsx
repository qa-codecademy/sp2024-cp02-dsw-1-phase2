import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Clock,
  Eye,
  Heart,
  Package,
  Percent,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { BaseProduct, Product } from "../common/types/products-interface";
import addToCart from "../common/utils/addToCart";
import fetchProducts from "../common/utils/fetchProducts";
import FlashSale from "./FlashSale";

const handleAddToCart = (
  event: React.MouseEvent<HTMLButtonElement>,
  product: BaseProduct
) => {
  event.stopPropagation();
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: 1,
    image: product.img,
    discount: product.discount,
  };
  addToCart(cartItem);
};

const getRandomRating = () => {
  const randomRating = 3.5 + Math.random() * 1.5; // Scale random number to 3.5–5
  const filledStars = Math.round(randomRating); // Rounded to nearest whole number
  return { randomRating: randomRating.toFixed(1), filledStars };
};

const ProductCard = ({
  product,
  onNavigate,
}: {
  product: Product;
  onNavigate: (id: string) => void;
}) => (
  <motion.div
    onClick={() => onNavigate(product.id)}
    className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-100"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
  >
    <div className="relative pt-[100%]">
      <img
        src={product.img}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover p-4 group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 bg-[#1A3F6B] backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium"
        >
          <Star size={12} className="text-yellow-400" />
          <span>Featured</span>
        </motion.div>
        {product.discount && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 bg-[#1BD8C4] backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Percent size={12} />
            <span>Save {product.discount}%</span>
          </motion.div>
        )}
      </div>
      <div className="absolute top-3 right-3 flex flex-col gap-2">
        {/* <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm rounded-full text-gray-700 hover:text-red-500 transition-colors"
        >
          <Heart size={16} />
        </motion.button> */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm rounded-full text-gray-700 hover:text-blue-500 transition-colors"
        >
          <Eye size={16} />
        </motion.button>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {(() => {
              const { randomRating, filledStars } = getRandomRating();

              return (
                <>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < filledStars
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({randomRating})
                  </span>
                </>
              );
            })()}
          </div>
        </div>
        <div className="flex flex-col items-end">
          {product.discount && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900">
            ${(product.price * (1 - product.discount / 100)).toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Package size={14} />
          <span>Free Shipping</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(event) => handleAddToCart(event, product)}
          className="px-4 py-2 bg-[#1A3F6B] text-white rounded-full flex items-center gap-2 hover:bg-white hover:text-[#1A3F6B] hover:shadow-md transition-colors"
        >
          <ShoppingCart size={16} />
          <span>Add</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const SliderDiv = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([] as Product[]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ random: true, pageSize: 5 });
        setProducts(data.products);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0 && !isPaused) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(intervalId);
    }
  }, [loading, products.length, isPaused]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsPaused(true); // Pause auto-sliding when user interacts
    // Resume auto-sliding after 5 seconds of no interaction
    setTimeout(() => setIsPaused(false), 5000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsPaused(true); // Pause auto-sliding when user interacts
    // Resume auto-sliding after 5 seconds of no interaction
    setTimeout(() => setIsPaused(false), 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div
      className="relative h-96 bg-white overflow-hidden shadow-xl group rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative h-full"
            onClick={() => navigate(`/products/${products[currentIndex].id}`)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
            <img
              src={products[currentIndex].img}
              alt={products[currentIndex].name}
              className="w-full h-full object-scale-down"
            />
            <motion.div
              className="absolute inset-0 flex flex-col justify-end p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm text-white border border-white/20 flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#1BD8C4]" />
                  Trending
                </span>
                <span className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm text-white border border-white/20 flex items-center gap-2">
                  <Award size={14} className="text-yellow-400" />
                  Best Seller
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {products[currentIndex].name}
              </h2>
              <p className="text-white/80 mb-4 line-clamp-2">
                {products[currentIndex].description}
              </p>
              <div className="flex items-center gap-4">
                <div className="text-white">
                  <span className="text-sm opacity-80">Starting at</span>
                  <div className="text-2xl font-bold">
                    ${products[currentIndex].price}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-black rounded-full flex items-center gap-2 hover:bg-opacity-90 transition-colors"
                >
                  <ShoppingCart size={18} />
                  Shop Now
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* <motion.button
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="text-white" size={24} />
      </motion.button>

      <motion.button
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="text-white" size={24} />
      </motion.button> */}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetchProducts({
          random: true,
          pageSize: 6,
          discount: true,
        });
        setProducts(response.products);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const features = [
    {
      icon: <Clock className="text-blue-500" />,
      title: "Same Day Delivery",
      description: "Order before 2 PM",
    },
    {
      icon: <Shield className="text-green-500" />,
      title: "Secure Shopping",
      description: "Protected Payments",
    },
    {
      icon: <Package className="text-purple-500" />,
      title: "Free Returns",
      description: "30-Day Guarantee",
    },
  ];

  return (
    <section className="bg-neutral-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full"
            >
              <Sparkles className="text-blue-400" />
              <span>New Collection Available</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Transform Your Space with Style
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of premium products designed to
              elevate your lifestyle.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-gray-50 rounded-lg">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Featured Slider */}
            <div className="col-span-12 lg:col-span-8">
              <SliderDiv />
            </div>

            {/* Top Trending Products */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <FlashSale />
            </div>

            {/* Featured Products Grid */}
            <div className="col-span-12">
              {/* <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2"
                  onClick={() => navigate('/sales')}
                >
                  View All
                  <ArrowRight size={16} />
                </motion.button>
              </div> */}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-xl h-64 w-full mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
                  {products.slice(0, 3).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onNavigate={(id) => navigate(`/products/${id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
