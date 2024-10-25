// src/components/MainComponent.tsx
import SliderDiv from "./SliderDiv";
import CardsDiv from "./CardsDiv";
import SlideDiv from "./SlideDiv";
import Newsletter from "./Newsletter";
import AdBanner from "./AdBanner";
import FeaturedCategories from "./FeaturedCategories";
import Testimonials from "./Testimonials";
import LatestBlogPosts from "./LatestBlogPosts";
import BrandsShowcase from "./BrandsShowcase";
import Sidebar from "./Sidebar";

const MainComponent = () => {
  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow flex flex-col justify-center items-center w-full">
        {/* Hero Section */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Discover the Future of Tech
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Explore our wide range of cutting-edge gadgets and electronics.
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Shop Now
            </button>
          </div>
        </section>

        {/* Featured Products Slider */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Featured Products
            </h2>
            <SliderDiv />
          </div>
        </section>

        {/* Featured Categories */}
        <section className="w-full bg-gray-100 py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Shop by Category
            </h2>
            <FeaturedCategories />
          </div>
        </section>

        {/* Ad Banner */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <AdBanner
              title="Summer Sale: Up to 50% Off!"
              description="Get amazing deals on the latest tech gadgets and accessories."
              imageUrl="/api/placeholder/800/400"
            />
          </div>
        </section>

        {/* Best Sellers */}
        <section className="w-full bg-gray-100 py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Best Sellers
            </h2>
            <SlideDiv />
          </div>
        </section>

        {/* New Arrivals */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              New Arrivals
            </h2>
            <CardsDiv />
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full bg-gray-100 py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What Our Customers Say
            </h2>
            <Testimonials />
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Tech News & Insights
            </h2>
            <LatestBlogPosts />
          </div>
        </section>

        {/* Brands Showcase */}
        <section className="w-full bg-gray-100 py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Featured Brands
            </h2>
            <BrandsShowcase />
          </div>
        </section>

        {/* Newsletter */}
        <section className="w-full bg-white py-12 flex justify-center items-center">
          <div className="container mx-auto px-4 text-center">
            <Newsletter />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainComponent;
