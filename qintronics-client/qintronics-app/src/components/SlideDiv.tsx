// SlideDiv.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Product } from "../common/types/Product-interface"; // Adjust path as needed
import "./SlideDiv.css"; // Import the separate CSS file


// Promeni na Filip
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";


const SlideDiv: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to shuffle products for randomness
  const shuffleArray = (array: Product[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/products.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();

        // Filter products with a discount and shuffle them
        const discountedProducts = shuffleArray(
          data.filter((product) => product.discount > 0)
        ).slice(0, 10); // Select only 10 products with a discount

        setProducts(discountedProducts);
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="slide-div-container">
      <div className="slide-div-wrapper">
        <div className="featured-products">
          <h2 className="featured-title">Featured Products</h2>
          <motion.button
            className="view-all-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
          </motion.button>
        </div>
        <div className="products-scroll-container">
          <div className="products-wrapper">
            {products.map((product) => {
              const discountedPrice = (
                product.price *
                (1 - product.discount / 100)
              ).toFixed(2);

              return (
                <motion.div
                  key={product.id}
                  className="product-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="product-image-container">
                    <motion.img
                      src={product.img}
                      alt={product.name}
                      className="product-image"
                      whileHover={{ scale: 1 }} // Adjust scale of picture on hover
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price-add">
                      <div className="price-container">
                        <p className="product-price discounted-price">
                          ${discountedPrice}
                        </p>
                        <p className="product-price original-price">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <motion.button
                        className="add-to-cart-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}

                        // Promeni na Filip
                        onClick={() => {
                          const cartItem: CartItem = {
                            id: product.id,
                            name: product.name,
                            description: product.description, // Example SKU
                            price: product.price,
                            quantity: 1, // Set default quantity to 1
                            image: product.img,
                          };
                          addToCart(cartItem); // Add product to cart
                        }}
                      
                      
                      
                      >
                        <ShoppingCart size={14} />
                        <span>Add</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideDiv;
