import { motion } from "framer-motion";

const blogPosts = [
  {
    title: "5G Technology: The Future of Mobile Connectivity",
    excerpt:
      "Explore how 5G is revolutionizing mobile networks and its potential impact on various industries.",
    image: "../../public/images/blog-posts-images/5g-blog.png",
  },
  {
    title: "The Rise of AI in Consumer Electronics",
    excerpt:
      "Discover how artificial intelligence is transforming everyday gadgets and improving user experiences.",
    image: "../../public/images/blog-posts-images/ai-blog.png",
  },
  {
    title: "Sustainable Tech: Eco-Friendly Gadgets for a Greener Future",
    excerpt:
      "Learn about the latest innovations in sustainable technology and how they're helping to reduce environmental impact.",
    image: "../../public/images/blog-posts-images/eco-blog.png",
  },
];

const LatestBlogPosts = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-2xl"
            whileHover={{ y: -10 }}
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              <motion.button
                className="bg-[#1A3F6B] text-white py-2 px-6 rounded-full font-medium hover:bg-[#173755] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read More
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlogPosts;
