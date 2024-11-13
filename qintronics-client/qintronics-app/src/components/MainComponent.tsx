import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Star, ArrowUp } from "lucide-react";
import CardsDiv from "./CardsDiv";
import Newsletter from "./Newsletter";
import SlideDiv from "./SlideDiv";
import BrandsShowcase from "./BrandsShowcase";
import FeaturedCategories from "./FeaturedCategories";
import LatestBlogPosts from "./LatestBlogPosts";
import Sidebar from "./Sidebar";
import Testimonials from "./Testimonials";
import { Product } from "../common/types/Product-interface";
import axiosInstance from "../common/utils/axios-instance.util";
import HeroSection from "./HeroSection";
import TrendingProducts from "./TrendingProducts";

// Fetch products helper function
const fetchProducts = async (
  params: Partial<{
    discount?: boolean;
    name?: string;
    brand?: string;
    categoryName?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sort?: string;
    userId?: string;
  }> = {}
) => {
  try {
    const response = await axiosInstance.post("/products", {
      page: 1,
      pageSize: 12,
      ...params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Animated Section Component
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};


const MainComponent = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const mainRef = useRef(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [featured, newProducts, discounted, trending, flashSale] =
          await Promise.all([
            fetchProducts({ sortBy: "price", sort: "DESC", pageSize: 8 }),
            fetchProducts({ sortBy: "name", sort: "DESC", pageSize: 12 }),
            fetchProducts({ discount: true, pageSize: 10 }),
            fetchProducts({ sortBy: "popularity", pageSize: 10 }),
            fetchProducts({ discount: true, sortBy: "time", pageSize: 5 }),
          ]);

        setFeaturedProducts(featured.products);
        setNewArrivals(newProducts.products);
        setDiscountedProducts(discounted.products);
        setTrendingProducts(trending.products);
        setFlashSaleProducts(flashSale.products);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex relative" ref={mainRef}>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-10 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-32 left-0 bg-white transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 h-[calc(100vh-20rem)]`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen w-full bg-white mx-auto">
        {/* Hero Section with Parallax */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <HeroSection />
        </motion.div>

        {/* Categories */}
        <AnimatedSection className="bg-white py-16 border-b border-gray-200">
          <div className="max-w-[80vw] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Shop by Category
            </h2>
            <FeaturedCategories />
          </div>
        </AnimatedSection>

        {/* Trending Products */}
        <AnimatedSection className="py-16">
          <div className="max-w-[80vw] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Trending Products
            </h2>
            <TrendingProducts products={trendingProducts} />
          </div>
        </AnimatedSection>

        {/* Latest Releases */}
        <AnimatedSection className="bg-white py-16 border-b border-gray-200">
          <div className="max-w-[80vw] mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Latest Releases
            </h2>
            <CardsDiv products={newArrivals} />
          </div>
        </AnimatedSection>

        {/* Special Offers */}
        <AnimatedSection className="py-16 bg-gray-50">
          <div className="max-w-[80vw] mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Special Offers
            </h2>
            <SlideDiv products={discountedProducts} />
          </div>
        </AnimatedSection>

        {/* Featured Brands */}
        <AnimatedSection className="py-16">
          <div className="max-w-[80vw] mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Featured Brands
            </h2>
            <BrandsShowcase />
          </div>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection className="bg-white py-16 border-b border-gray-200">
          <div className="max-w-[80vw] mx-auto px-8">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Customer Stories
            </h2>
            <Testimonials />
          </div>
        </AnimatedSection>

        {/* Blog Posts */}
        <AnimatedSection className="py-16 bg-gray-50">
          <div className="max-w-[80vw] mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-gray-900">
              Tech News & Insights
            </h2>
            <LatestBlogPosts />
          </div>
        </AnimatedSection>

        {/* Newsletter */}
        <AnimatedSection className="bg-white py-16">
          <div className="max-w-[80vw] mx-auto px-8">
            <Newsletter />
          </div>
        </AnimatedSection>

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: showScrollTop ? 1 : 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        >
          <ArrowUp size={24} />
        </motion.button>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-24 left-4 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <motion.div
          animate={{ rotate: isSidebarOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={24} />
        </motion.div>
      </button>
    </div>
  );
};

export default MainComponent;
