import { ArrowRightLeft, Heart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import calculateDiscountedPrice from "../common/helpers/calculate-discount-for-product.helper";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
import axiosInstance from "../common/utils/axios-instance.util";
import { CartItem } from "../common/interfaces/cart.item.interface";
import addToCart from "../common/utils/addToCart";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/auth.context";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductAndFavFlag[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = () => {
    setLoading(true);
    axiosInstance
      .get(`/products/user/favorite`)
      .then((res) => {
        setFavoriteProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleToggleFavorite = (productId: string) => {
    if (user) {
      axiosInstance
        .post("/products/favorite", {
          productId,
        })
        .then(() => {
          fetchFavorites();
          console.log("Favorite toggled");
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return; // Could possibly show an info popup or login redirect
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex justify-center items-start p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center w-full max-w-7xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
            Favorite Products
          </h1>
          {loading ? (
            <div>Loading...</div> // You can replace this with a loader component if available
          ) : (
            <>
              {favoriteProducts && favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full justify-center items-center">
                  {favoriteProducts.map((product, index) => {
                    const price = Number(product.price);
                    const discountedPrice =
                      product.discount > 0
                        ? calculateDiscountedPrice(price, product.discount)
                        : price;

                    const validPrice = !isNaN(price)
                      ? price.toFixed(2)
                      : "0.00";
                    const validDiscountedPrice = !isNaN(discountedPrice)
                      ? discountedPrice.toFixed(2)
                      : "0.00";

                    return (
                      <div
                        className={`relative mx-auto w-64 h-96 min-h-[28rem] rounded-lg text-center cursor-pointer transform transition-all ease-in-out duration-300 hover:scale-105 shadow-lg hover:border hover:border-[#1A3F6B] bg-white product-card flex flex-col justify-between group`}
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        {/* Discount badge on the left */}
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-[#1BD8C4] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </div>
                        )}

                        {/* Heart icon and ArrowRightLeft icon - Hidden until hover */}
                        <div className="absolute top-2 right-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Heart
                            size={24}
                            className={`${
                              product.isFavorite
                                ? "fill-[#1A3F6B] stroke-[#1A3F6B] bg-white border-2" // Filled heart with bold border
                                : "fill-none stroke-[#1A3F6B] bg-white border" // Outline heart with normal border
                            } border-[#1A3F6B] rounded-full p-1 cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleToggleFavorite(product.id);
                            }}
                          />
                          <ArrowRightLeft
                            size={24}
                            className="text-[#1A3F6B] border border-[#1A3F6B] rounded-full p-1 bg-white"
                          />
                        </div>

                        {/* Product image centered with lazy loading */}
                        <div className="p-4 sm:p-6 rounded-lg text-[#1A3F6B] h-full flex flex-col justify-between">
                          <div className="w-full h-32 sm:h-40 flex justify-center items-center mb-2 sm:mb-4">
                            <img
                              src={product.img}
                              alt={`Image of ${product.name}`}
                              className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                              aria-label={`Image of ${product.name}`}
                              loading="lazy"
                            />
                          </div>
                          <h4 className="text-lg sm:text-xl font-semibold mt-2 min-h-[3rem] flex items-center justify-center">
                            {product.name}
                          </h4>
                          <p className="text-md mt-1">Brand: {product.brand}</p>

                          {/* Pricing Section */}
                          <div className="flex flex-col items-center">
                            <p
                              className={`text-lg sm:text-xl font-bold mt-1 ${
                                product.discount > 0 ? "text-[#1BD8C4]" : ""
                              }`}
                            >
                              ${validDiscountedPrice}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-sm mt-1 line-through text-gray-500">
                                ${validPrice}
                              </p>
                            )}
                          </div>

                          <p className="text-md mt-1">
                            Availability: {product.availability} units
                          </p>

                          {/* Add to Cart Button */}
                          <button
                            className="mt-4 bg-[#1A3F6B] text-white font-bold py-1 px-3 rounded-lg mx-auto shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center uppercase"
                            aria-label="Add to Cart"
                            onClick={() => {
                              const cartItem: CartItem = {
                                id: product.id,
                                name: product.name,
                                description: product.description,
                                price: product.price,
                                quantity: 1, // Set default quantity to 1
                                image: product.img,
                              };
                              addToCart(cartItem); // Add product to cart
                            }}
                          >
                            <FaShoppingCart className="mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full mt-2 flex justify-center">
                  <p className="text-center text-lg font-semibold text-gray-600 bg-gray-100 py-4 px-6 rounded-lg shadow-md">
                    <span role="img" aria-label="heart-broken" className="mr-2">
                      💔
                    </span>
                    No favorite products available.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
