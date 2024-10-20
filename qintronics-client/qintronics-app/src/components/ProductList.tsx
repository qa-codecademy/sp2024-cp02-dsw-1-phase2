import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import calculateDiscountedPrice from "../common/helpers/calculate-discount-for-product.helper";
import { FaShoppingCart } from "react-icons/fa";
import { ArrowRightLeft, Heart } from "lucide-react";
import Sidebar from "./Sidebar";
import axiosInstance from "../common/utils/axios-instance.util";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";

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
  const [products, setProducts] = useState(productList); // Local state for products
  const userId = "d49299cd-6e15-4ba0-a313-ad443c073195"; // Adjust as needed

  useEffect(() => {
    setProducts(productList);
    setIsLoaded(true);
  }, [productList]);

  const handleToggleFavorite = (productId: string) => {
    if (userId) {
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
          console.log("Favorite toggled");
        })
        .catch((err) => console.error(err));
    } else {
      console.log("User not logged in"); // Optional: Show popup or redirect to login
    }
  };

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange(newSize);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex justify-center items-start p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center w-full max-w-7xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-6">
            {title} {category}
          </h1>
          <div className="flex justify-end w-full mb-4">
            <label htmlFor="pageSize" className="mr-2">
              Products per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 w-full justify-center items-center ${
              isLoaded ? "flip-in" : ""
            }`}
          >
            {products.length > 0 ? (
              products.map((product, index) => {
                const price = Number(product.price);
                const discountedPrice =
                  product.discount > 0
                    ? calculateDiscountedPrice(price, product.discount)
                    : price;

                return (
                  <div
                    className={`relative mx-auto w-64 h-96 min-h-[28rem] rounded-lg text-center cursor-pointer transform transition-all ease-in-out duration-300 hover:scale-105 shadow-lg hover:border hover:border-[#1A3F6B] bg-white product-card flex flex-col justify-between group`}
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-[#1BD8C4] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col items-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart
                        size={24}
                        className={`${
                          product.isFavorite
                            ? "text-white bg-[#1A3F6B]"
                            : "text-[#1A3F6B] bg-white"
                        } border border-[#1A3F6B] rounded-full p-1`}
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
                    <div className="p-4 sm:p-6 rounded-lg text-[#1A3F6B] h-full flex flex-col justify-between">
                      <div className="w-full h-32 sm:h-40 flex justify-center items-center mb-2 sm:mb-4">
                        <img
                          src={product.img}
                          alt={`Image of ${product.name}`}
                          className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                          loading="lazy"
                        />
                      </div>
                      <h4 className="text-lg sm:text-xl font-semibold mt-2">
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
                      <button className="mt-4 bg-[#1A3F6B] text-white font-bold py-1 px-3 rounded-lg uppercase">
                        <FaShoppingCart className="mr-2" /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-lg">No products available.</p>
            )}
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={onPrevPage} disabled={!hasPrev}>
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(total / pageSize)}
            </span>
            <button onClick={onNextPage} disabled={!hasNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
