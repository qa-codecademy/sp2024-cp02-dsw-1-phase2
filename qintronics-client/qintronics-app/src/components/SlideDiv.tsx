import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Product } from "../common/types/Product-interface";
import fetchProducts from "../common/utils/fetchProducts";
import addToCart from "../common/utils/addToCart";
import { CartItem } from "../common/interfaces/cart.item.interface";
import "./SlideDiv.css";
import { useNavigate } from "react-router-dom";
import { BaseProduct } from "../common/types/products-interface";

const SlideDiv: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProducts({ discount: true });
        const discountedProducts = response.products
          .filter((product) => product.discount > 0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);
        setProducts(discountedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const calculateDiscountedPrice = (price: number, discount: number) =>
    (price * (1 - discount / 100)).toFixed(2);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No discounted products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="slide-div-container">
      <div className="slide-div-wrapper">
        <div className="featured-products">
          <h2 className="featured-title">Products On Sale</h2>
          <motion.button
            className="view-all-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: "#1A3F6B" }}
            onClick={() => navigate("/sales")} // Navigate to /sales
          >
            View All
          </motion.button>
        </div>

        <div className="products-scroll-container">
          <div className="products-wrapper">
            {products.map((product) => {
              const discountedPrice = calculateDiscountedPrice(
                product.price,
                product.discount
              );

              return (
                <motion.div
                  key={product.id}
                  className="product-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-container">
                    <motion.img
                      src={product.img}
                      alt={product.name}
                      className="product-image"
                      whileHover={{ scale: 1 }}
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
                        onClick={(event) => handleAddToCart(event, product)}
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
