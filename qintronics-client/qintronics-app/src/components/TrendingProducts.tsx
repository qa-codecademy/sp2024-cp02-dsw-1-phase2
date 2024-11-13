import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { BaseProduct, Product } from "../common/types/products-interface"; // Ensure the path is correct
import addToCart from "../common/utils/addToCart";
import { fetchProducts } from "../common/utils/fetchProducts"; // Adjust the path based on your project structure

const TrendingProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page size to 20 products
  const productsPerPage = 8;

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({
          random: true,
          page: 1,
          pageSize: productsPerPage,
        });
        setProducts(response.products); // Update with fetched data
        console.log(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -5,
      transition: { duration: 0.1 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const navigate = useNavigate();

  const handleNavigateClick = (id: string) => {
    navigate(`/products/${id}`);
  };

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
    };
    addToCart(cartItem);
    console.log(`Added product ${product.id} to cart`);
  };

  return (
    <div className="max-w-[80vw] mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="relative">
          <motion.div
            className="relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={1}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => handleNavigateClick(product.id)}
                  >
                    <div className="relative w-full h-72 overflow-hidden">
                      <motion.img
                        src={product.img}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-900">
                          ${product.price}
                        </p>
                        <motion.button
                          className="px-3 py-1.5 bg-white text-black rounded-full flex items-center space-x-1 border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors duration-300"
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonVariants}
                          onClick={(event) => handleAddToCart(event, product)}
                        >
                          <ShoppingCart size={16} />
                          <span className="text-sm">Add</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TrendingProducts;
