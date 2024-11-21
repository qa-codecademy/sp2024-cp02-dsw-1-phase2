import { ArrowRightLeft, Heart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import calculateDiscountedPrice from "../common/helpers/calculate-discount-for-product.helper";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
import addToCart from "../common/utils/addToCart";
import axiosInstance from "../common/utils/axios-instance.util";
import { AuthContext } from "../context/auth.context";
import { notLoggedFavoriteProduct } from "../common/utils/swalUtils";
import Loader from "./Loader";

const Favorites = () => {
  const { user } = useContext(AuthContext);
  const [favoriteProducts, setFavoriteProducts] = useState<ProductAndFavFlag[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const updateFavoritesCount = (count: number) => {
    // Store count in localStorage and dispatch custom event
    localStorage.setItem("favoriteCount", JSON.stringify(count));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const fetchFavorites = () => {
    setLoading(true);
    axiosInstance
      .get(`/products/user/favorite`)
      .then((res) => {
        setFavoriteProducts(res.data);
        setLoading(false);
        updateFavoritesCount(res.data.length); // Update count in localStorage
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleToggleFavorite = (productId: string) => {
    if (!user) {
      notLoggedFavoriteProduct(navigate);
      return;
    }

    axiosInstance
      .post("/products/favorite", { productId })
      .then(() => {
        // Remove the product from local favorites list and update count
        const updatedFavorites = favoriteProducts.filter(
          (product) => product.id !== productId
        );
        setFavoriteProducts(updatedFavorites);
        updateFavoritesCount(updatedFavorites.length);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-center items-start p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center w-full max-w-7xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
            Favorite Products
          </h1>
          {loading ? (
            <Loader />
          ) : (
            <>
              {favoriteProducts.length > 0 ? (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 w-full justify-center items-center"
                  style={{ columnGap: "10rem" }}
                >
                  {favoriteProducts.map((product, index) => {
                    const price = Number(product.price);
                    const discountedPrice =
                      product.discount > 0
                        ? calculateDiscountedPrice(price, product.discount)
                        : price;

                    return (
                      <div
                        className="relative mx-auto w-64 h-96 min-h-[28rem] rounded-lg text-center cursor-pointer transform transition-all ease-in-out duration-300 hover:scale-105 shadow-lg hover:border hover:border-[#1A3F6B] bg-white product-card flex flex-col justify-between group"
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Discount Badge */}
                        {product.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-[#1BD8C4] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount}% OFF
                          </div>
                        )}

                        {/* Icons */}
                        <div className="absolute top-2 right-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Heart
                            size={24}
                            className={`${
                              product.isFavorite
                                ? "fill-[#1A3F6B] stroke-[#1A3F6B] bg-white border-2"
                                : "fill-none stroke-[#1A3F6B] bg-white border"
                            } border-[#1A3F6B] rounded-full p-1 cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(product.id);
                            }}
                          />
                          <ArrowRightLeft
                            size={24}
                            className="text-[#1A3F6B] border border-[#1A3F6B] rounded-full p-1 bg-white"
                          />
                        </div>

                        {/* Card Content */}
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

                          <div className="flex flex-col items-center">
                            <p
                              className={`text-lg sm:text-xl font-bold mt-1 ${
                                product.discount > 0 ? "text-[#1BD8C4]" : ""
                              }`}
                            >
                              ${discountedPrice.toFixed(2)}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-sm mt-1 line-through text-gray-500">
                                ${price.toFixed(2)}
                              </p>
                            )}
                          </div>

                          <p className="text-md mt-1">
                            Availability: {product.availability} units
                          </p>

                          <button
                            className="mt-4 bg-[#1A3F6B] text-white font-bold py-1 px-3 rounded-lg mx-auto shadow-lg transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center uppercase"
                            aria-label="Add to Cart"
                            onClick={(e) => {
                              e.stopPropagation();
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
