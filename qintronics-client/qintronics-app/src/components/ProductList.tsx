import { Heart } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import calculateDiscountedPrice from "../common/helpers/calculate-discount-for-product.helper";
import { CartItem } from "../common/interfaces/cart.item.interface";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
import addToCart from "../common/utils/addToCart";
import axiosInstance from "../common/utils/axios-instance.util";
import { notLoggedFavoriteProduct } from "../common/utils/swalUtils";
import { AuthContext } from "../context/auth.context";
import Loader from "./Loader";

interface ProductListProps {
  categoryName: string;
  productList: ProductAndFavFlag[];
  title?: string;
  total: number;
  currentPage: number;
  pageSize: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onPageSizeChange: (size: number) => void;
}

const ProductList = ({
  categoryName: category,
  productList = [],
  title = "Product Catalog",
  total,
  currentPage,
  pageSize,
  onNextPage,
  onPrevPage,
  hasNext,
  hasPrev,
  onPageSizeChange,
}: ProductListProps) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState(productList);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setIsLoaded(false);
    const timeoutId = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [productList]);

  const handleToggleFavorite = (productId: string) => {
    if (user) {
      axiosInstance
        .post("/products/favorite", { productId })
        .then(() => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, isFavorite: !product.isFavorite }
                : product
            )
          );
          let currentFavorites = JSON.parse(
            localStorage.getItem("favoriteCount") || "0"
          );
          currentFavorites += products.find((p) => p.id === productId)
            ?.isFavorite
            ? -1
            : 1;
          localStorage.setItem(
            "favoriteCount",
            JSON.stringify(currentFavorites)
          );
          window.dispatchEvent(new Event("favoritesUpdated"));
        })
        .catch((err) => console.error(err));
    } else {
      notLoggedFavoriteProduct(navigate);
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
    product: ProductAndFavFlag
  ) => {
    event.stopPropagation();
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
    console.log(`Added product ${product.id} to cart`);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-center items-start p-4 sm:p-6 lg:p-8">
        {isLoaded ? (
          <div className="flex flex-col items-center w-full max-w-7xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
              {title} {category}
            </h1>
            <div className="flex flex-col items-center w-full mb-4">
              <div className="flex justify-center items-center mb-4">
                <label htmlFor="pageSize" className="mr-2 text-lg font-medium">
                  Products per page:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="border border-gray-300 text-black rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1BD8C4] focus:border-[#1BD8C4] transition-all duration-300"
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
              </div>
              <div className="flex justify-center items-center mb-6">
                <button
                  onClick={onPrevPage}
                  disabled={!hasPrev}
                  className={`px-4 py-2 rounded-lg text-white font-bold ${
                    hasPrev
                      ? "bg-[#1A3F6B] hover:bg-white hover:text-[#1A3F6B] border border-transparent hover:border-[#1A3F6B]"
                      : "bg-gray-300 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  Previous
                </button>
                <span className="mx-4">
                  Page {currentPage} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={onNextPage}
                  disabled={!hasNext}
                  className={`px-4 py-2 rounded-lg text-white font-bold ${
                    hasNext
                      ? "bg-[#1A3F6B] hover:bg-white hover:text-[#1A3F6B] border border-transparent hover:border-[#1A3F6B]"
                      : "bg-gray-300 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  Next
                </button>
              </div>
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-center items-start`}
              style={{ maxWidth: "90%", columnGap: "1rem" }}
            >
              {products.length > 0 ? (
                products.map((product, index) => {
                  const price = Number(product.price);
                  const discountedPrice =
                    product.discount > 0
                      ? calculateDiscountedPrice(price, product.discount)
                      : price;

                  const validPrice = !isNaN(price) ? price.toFixed(2) : "0.00";
                  const validDiscountedPrice = !isNaN(discountedPrice)
                    ? discountedPrice.toFixed(2)
                    : "0.00";

                  return (
                    <div
                      className={`relative w-full h-auto max-w-[180px] sm:max-w-[220px] lg:max-w-[240px] bg-white rounded-lg text-center cursor-pointer transition-all ease-in-out duration-300 hover:scale-105 shadow-lg hover:border hover:border-[#1A3F6B] flex flex-col group`}
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        height: "430px",
                      }}
                    >
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-[#1BD8C4] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          {product.discount}% OFF
                        </div>
                      )}

                      {/* Icons (Heart and Compare) */}
                      <div className="absolute top-2 right-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart
                          size={24}
                          className={`${
                            product.isFavorite
                              ? "fill-[#1A3F6B] stroke-[#1A3F6B] bg-white border-2"
                              : "fill-none stroke-[#1A3F6B] bg-white border"
                          } border-[#1A3F6B] rounded-full p-1 cursor-pointer shadow-md`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(product.id);
                          }}
                        />
                        {/* <ArrowRightLeft
                          size={24}
                          className="text-[#1A3F6B] border border-[#1A3F6B] rounded-full p-1 bg-white shadow-md"
                        /> */}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div className="w-full h-32 sm:h-40 flex justify-center items-center mb-4">
                          <img
                            src={product.img}
                            alt={`Image of ${product.name}`}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                            loading="lazy"
                          />
                        </div>
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold mt-2 min-h-[2.5rem] flex items-center justify-center">
                          {product.name}
                        </h4>
                        <p className="text-xs sm:text-sm mt-1 text-gray-600">
                          Brand: {product.brand}
                        </p>

                        <div className="flex flex-col items-center mt-2">
                          <div className="flex items-center space-x-2">
                            <p
                              className={`text-sm sm:text-base lg:text-lg font-bold ${
                                product.discount > 0 ? "text-[#1BD8C4]" : ""
                              }`}
                            >
                              ${validDiscountedPrice}
                            </p>
                            {product.discount > 0 && (
                              <p className="text-xs sm:text-sm line-through text-gray-500">
                                ${validPrice}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">
                          Availability: {product.availability} units
                        </p>
                        <button
                          className="mt-4 bg-[#1A3F6B] text-white font-bold py-1 px-2 rounded-lg shadow-md transition-all duration-300 border-2 border-transparent hover:bg-white hover:text-[#1A3F6B] hover:border-[#1A3F6B] flex items-center uppercase text-xs sm:text-sm lg:text-base w-auto"
                          aria-label="Add to Cart"
                          onClick={(event) => handleAddToCart(event, product)}
                        >
                          <FaShoppingCart className="mr-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-lg">No products available.</p>
              )}
            </div>

            <div className="mt-6 text-center text-lg">
              Showing {startItem}-{endItem} of {total} results
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default ProductList;
