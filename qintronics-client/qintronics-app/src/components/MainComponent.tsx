import { useEffect, useRef, useState } from "react";
import CardsDiv from "./CardsDiv";
import Newsletter from "./Newsletter";
import SlideDiv from "./SlideDiv";
import SliderDiv from "./SliderDiv";
// import AdBanner from "./AdBanner";
import { motion } from "framer-motion";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { Product } from "../common/types/Product-interface";
import axiosInstance from "../common/utils/axios-instance.util";
import BrandsShowcase from "./BrandsShowcase";
import FeaturedCategories from "./FeaturedCategories";
import LatestBlogPosts from "./LatestBlogPosts";
import Sidebar from "./Sidebar";
import Testimonials from "./Testimonials";

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

const MainComponent = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [featured, newProducts, discounted] = await Promise.all([
          fetchProducts({
            sortBy: "price",
            sort: "DESC",
            pageSize: 8,
          }),
          fetchProducts({
            sortBy: "name",
            sort: "DESC",
            pageSize: 12,
          }),
          fetchProducts({
            discount: true,
            pageSize: 10,
          }),
        ]);

        setFeaturedProducts(featured.products);
        setNewArrivals(newProducts.products);
        setDiscountedProducts(discounted.products);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex relative">
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
      <div className="flex-1 min-h-screen bg-gradient-to-b from-gray-50 to-white transition-all duration-300">
        {/* Hero Section with Gradient Overlay */}
        <section className="grid md:grid-cols-1 relative h-screen">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-green-200 opacity-90" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-7xl md:text-9xl font-bold text-white leading-tight">
                The future <br /> is here.
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                Discover our latest collection of cutting-edge technology
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg"
              >
                Explore Now
              </motion.button>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={() =>
              exploreRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ChevronDown size={32} className="text-white" />
          </motion.div>
        </section>

        {/* Content Sections */}
        <div ref={exploreRef} className="space-y-16 py-16">
          {/* Featured Products */}
          <section className="px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Featured Products
              </h2>
              <SliderDiv />
            </div>
          </section>

          {/* Latest Releases with Accent Background */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
            <div className="max-w-7xl mx-auto px-8">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Latest Releases
              </h2>
              <CardsDiv products={newArrivals} />
            </div>
          </section>

          {/* Special Offers */}
          <section className="px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Special Offers
              </h2>
              <SlideDiv products={discountedProducts} />
            </div>
          </section>

          {/* Categories with Dynamic Background */}
          <section className="bg-gradient-to-r from-blue-900 to-green-200 text-black py-16">
            <div className="max-w-7xl mx-auto px-8">
              <h2 className="text-4xl font-bold mb-8">Shop by Category</h2>
              <FeaturedCategories />
            </div>
          </section>

          {/* Innovation Showcase */}
          <section className="px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Innovation at its finest
              </h2>
              <BrandsShowcase />
            </div>
          </section>

          {/* Customer Stories */}
          <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16">
            <div className="max-w-7xl mx-auto px-8">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Customer Stories
              </h2>
              <Testimonials />
            </div>
          </section>

          {/* Tech News & Insights */}
          <section className="px-8">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-gray-900">
                Tech News & Insights
              </h2>
              <LatestBlogPosts />
            </div>
          </section>

          {/* Newsletter with Gradient */}
          <section className="bg-gradient-to-r from-gray-900 to-blue-900 py-16">
            <div className="max-w-7xl mx-auto px-8">
              <Newsletter />
            </div>
          </section>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-24 left-4 z-50 bg-white bg-opacity-70 backdrop-blur-lg p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-colors duration-300"
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
