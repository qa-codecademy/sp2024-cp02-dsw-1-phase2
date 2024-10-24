import {
  FaStar,
  FaHeadset,
  FaTruck,
  FaLightbulb,
  FaShieldAlt,
  FaUserCheck,
  FaBatteryFull,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Introduction Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-[#1A3F6B] mb-6">
            About Us
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to Qintronics, where innovation meets reliability. Learn
            about our mission, values, and dedication to delivering the latest
            technological advancements to our customers worldwide.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8 text-gray-800">
            <h3 className="text-4xl font-bold">Our Story</h3>
            <p className="text-lg leading-relaxed">
              Founded on the principle of bringing the latest technological
              innovations to consumers, Qintronics has grown into a leading tech
              retailer. Our journey began with a small team of passionate
              technology enthusiasts, and today, we are a global organization
              committed to delivering high-quality products and services.
            </p>
            <p className="text-lg leading-relaxed">
              We collaborate with world-class brands to provide a wide selection
              of products, ensuring our customers always have access to the most
              advanced technologies. Our mission is to make cutting-edge
              technology accessible to everyone, no matter where they are.
            </p>
            <p className="text-lg leading-relaxed">
              At Qintronics, we believe in a future where technology is not just
              a luxury but a necessity for all. By blending innovation with
              customer-centric service, we strive to create an exceptional
              shopping experience that empowers individuals and transforms the
              way they interact with the digital world.
            </p>
          </div>
          <div className="relative">
            <img
              src="../../public/images/qintronics-office.webp"
              alt="Our Story"
              className="w-full h-auto rounded-lg shadow-xl transition-transform transform hover:scale-105 duration-300"
            />
          </div>
        </div>

        {/* Our Mission and Values Section */}
        <div className="mb-16">
          <h3 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Our Mission and Values
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="w-full h-full">
              <img
                src="../../public/images/qintronics-shop.webp"
                alt="Mission and Values"
                className="w-full h-auto rounded-lg shadow-xl transition-transform transform hover:scale-105 duration-300"
              />
            </div>

            {/* Mission and Values Text Section */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-[#1BD8C4] to-[#1A3F6B] text-white rounded-full">
                  <FaLightbulb className="text-4xl" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    Innovation
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We continuously seek out the latest technological
                    advancements to bring innovative solutions to our customers.
                    Our commitment to innovation drives everything we do.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-[#FFA500] to-[#FFD700] text-white rounded-full">
                  <FaShieldAlt className="text-4xl" />
                </div>

                <div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    Integrity
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We believe in honest, transparent business practices. Our
                    customers trust us to deliver products and services that
                    meet their expectations, with no compromises on quality or
                    ethics.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-[#8e44ad] to-[#3498db] text-white rounded-full">
                  <FaUserCheck className="text-4xl" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    Customer Focus
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We put our customers at the center of everything we do,
                    providing personalized experiences, dedicated support, and a
                    carefully curated selection of the best products on the
                    market.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-[#2ecc71] to-[#16a085] text-white rounded-full">
                  <FaBatteryFull className="text-4xl" />
                </div>
                <div>
                  <h4 className="text-2xl font-semibold text-gray-900 mb-2">
                    Sustainability
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    We are committed to sustainable practices, working with
                    partners who share our vision of responsible sourcing and
                    environmental stewardship to minimize our impact on the
                    planet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-16">
          <h3 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose Qintronics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative p-8 bg-gradient-to-br from-[#1BD8C4] to-[#1A3F6B] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
              <div className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white text-[#1A3F6B] p-4 rounded-full">
                <FaStar className="text-4xl" />
              </div>
              <h4 className="text-xl font-semibold text-center mt-10 mb-4">
                Premium Products
              </h4>
              <p className="text-sm leading-relaxed text-center">
                We partner with renowned brands to offer products that meet the
                highest standards of quality and innovation. Each product
                undergoes rigorous testing to ensure reliability and
                performance.
              </p>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-[#8e44ad] to-[#3498db] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
              <div className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white text-[#8e44ad] p-4 rounded-full">
                <FaHeadset className="text-4xl" />
              </div>
              <h4 className="text-xl font-semibold text-center mt-10 mb-4">
                Outstanding Customer Support
              </h4>
              <p className="text-sm leading-relaxed text-center">
                Our dedicated customer service team is here to help with any
                questions or issues, ensuring a smooth and pleasant shopping
                experience from start to finish.
              </p>
            </div>

            <div className="relative p-8 bg-gradient-to-br from-[#2ecc71] to-[#16a085] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
              <div className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white text-[#2ecc71] p-4 rounded-full">
                <FaTruck className="text-4xl" />
              </div>
              <h4 className="text-xl font-semibold text-center mt-10 mb-4">
                Fast and Secure Delivery
              </h4>
              <p className="text-sm leading-relaxed text-center">
                We prioritize secure and timely delivery, ensuring that your
                purchases arrive at your doorstep without delay, no matter where
                you are.
              </p>
            </div>
          </div>
        </div>

        {/* Add Return Home Button */}
        <div className="flex justify-center">
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

export default AboutUs;
