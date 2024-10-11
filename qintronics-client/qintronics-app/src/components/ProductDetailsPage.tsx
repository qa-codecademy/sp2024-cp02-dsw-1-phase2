import { useParams } from "react-router-dom";
import products from "../data/products.json";
import { BaseProduct } from "../common/types/products-interface";
import { useState, useRef, useEffect } from "react";
import { FaMinus, FaPlus, FaShoppingCart, FaSearchPlus } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const formatKey = (key: string) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1));
};

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = (products as BaseProduct[]).find((prod) => prod.id === id);

  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [zoomStyle, setZoomStyle] = useState<{
    transformOrigin: string;
    transform: string;
    transition: string;
  }>({
    transformOrigin: "center",
    transform: "scale(1)",
    transition: "transform 0.5s ease-in-out",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top when the component mounts or when the product ID changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]); // Run whenever the product ID changes

  if (!product) {
    return (
      <div className="text-center text-2xl font-bold mt-10">
        Product not found
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleDetails = () => setIsOpen(!isOpen);

  const handleMouseMove = (e: React.MouseEvent) => {
    const imageElement = imageRef.current;
    if (imageElement) {
      const { left, top, width, height } = imageElement.getBoundingClientRect();
      const x = ((e.pageX - left) / width) * 100;
      const y = ((e.pageY - top) / height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: "scale(2)",
        transition: "transform 0.5s ease-in-out",
      });
    }
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
      transition: "transform 0.5s ease-in-out",
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="bg-white p-6 md:p-10 lg:p-16 rounded-lg shadow-lg max-w-7xl w-full h-auto min-h-[60vh] relative">
        {/* For larger screens, show the discount badge in the top-left corner */}
        {product.discount > 0 && (
          <div className="hidden md:block absolute top-2 left-2 bg-[#1BD8C4] text-white font-bold text-xs px-2 py-1 rounded-full">
            {product.discount}% OFF
          </div>
        )}

        <div className="product-details flex flex-col md:flex-row md:space-x-8 items-start">
          {/* Product Image with Full Magnifier */}
          <div
            className="product-image-magnifier w-full max-w-[90%] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto mb-4 md:mb-0 relative overflow-hidden"
            ref={imageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "zoom-in" }}
          >
            <img
              src={product.img || "/images/default-product.jpg"}
              alt={product.name}
              className="w-full h-auto object-contain transition-transform duration-300"
              style={zoomStyle}
            />

            {/* Zoom-in Icon */}
            <div
              className="absolute bottom-4 right-4 bg-white p-1 sm:p-2 rounded-full shadow-md cursor-pointer"
              onClick={openModal}
              title="Zoom In"
            >
              <FaSearchPlus className="text-xl sm:text-2xl text-[#1A3F6B]" />
            </div>
          </div>

          {/* Modal for Full-Size Image */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
                <button
                  className="absolute top-2 right-2 text-white bg-[#1BD8C4] rounded-full p-2 w-8 h-8 flex justify-center items-center"
                  onClick={closeModal}
                  title="Close"
                >
                  &times;
                </button>

                <img
                  src={product.img || "/images/default-product.jpg"}
                  alt={product.name}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "80vh", maxWidth: "100%" }} // Limit the image size to fit within the screen
                />
              </div>
            </div>
          )}

          {/* Product Info */}
          <div className="product-info flex-1 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                {product.name}
              </h2>
              {/* Heart icon for mobile */}
              <div className="block md:hidden">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-xl sm:text-2xl text-[#1A3F6B] border border-[#1A3F6B] rounded-full p-1 sm:p-2 bg-white shadow-lg cursor-pointer"
                  title="Add to Favorites"
                />
              </div>
              {/* Heart icon for larger screens */}
              <div className="hidden md:block">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-2xl lg:text-3xl text-[#1A3F6B] border border-[#1A3F6B] rounded-full p-2 bg-white shadow-lg cursor-pointer"
                  title="Add to Favorites"
                />
              </div>
            </div>

            {/* Product Price and Discount */}
            <div className="mb-4">
              {product.discount > 0 ? (
                <>
                  {/* Original Price */}
                  <p className="line-through text-sm text-[#1A3F6B]">
                    ${product.price.toFixed(2)}
                  </p>

                  {/* Discounted Price and Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#1BD8C4] text-2xl lg:text-3xl font-bold">
                      $
                      {(
                        product.price -
                        (product.price * product.discount) / 100
                      ).toFixed(2)}
                    </span>
                    {/* Show the discount badge next to the discounted price only on mobile */}
                    <span className="inline-block bg-[#1BD8C4] text-white font-bold text-xs px-2 py-1 rounded-full md:hidden">
                      {product.discount}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#1A3F6B]">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock availability */}
            <p
              className={`text-md mb-2 ${
                product.availability > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.availability > 0
                ? `In stock: ${product.availability}`
                : "Out of stock"}
            </p>

            <p className="text-md mb-4">{product.description}</p>

            <p className="text-md mb-2">
              <span className="font-bold">Warranty:</span> {product.warranty}
            </p>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center group rounded-lg p-1">
                <button
                  className="px-3 py-2 bg-white border border-[#1A3F6B] text-[#1A3F6B] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#1A3F6B] hover:text-white"
                  style={{ width: "40px", height: "40px" }} // Square buttons with shadow
                  onClick={decrementQuantity}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min="1"
                  onChange={handleQuantityChange}
                  className="text-center w-12 sm:w-16 p-2"
                  style={{
                    height: "40px", // Match the height
                    border: "none", // Remove the border
                    outline: "none", // Remove default input outline
                  }}
                />
                <button
                  className="px-3 py-2 bg-white border border-[#1A3F6B] text-[#1A3F6B] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#1A3F6B] hover:text-white"
                  style={{ width: "40px", height: "40px" }} // Square buttons with shadow
                  onClick={incrementQuantity}
                >
                  <FaPlus />
                </button>
              </div>
              <button className="bg-[#1A3F6B] text-white font-bold py-2 px-4 rounded-lg shadow-lg border-2 border-[#1A3F6B] transition-all duration-300 hover:bg-white hover:text-[#1A3F6B] flex items-center">
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Specifications Dropdown */}
            <div className="w-full mt-4">
              <button
                className="font-semibold text-lg text-[#1A3F6B] cursor-pointer w-auto text-left focus:outline-none transition-all duration-300"
                onClick={toggleDetails}
                style={{ display: "block", width: "fit-content" }} // Ensure button starts from left and stays inline
              >
                Specifications
                <span
                  className={`ml-2 inline-block transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▲
                </span>
              </button>
              <div
                ref={detailsRef}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
                style={{
                  maxHeight: isOpen ? detailsRef.current?.scrollHeight : 0,
                }}
              >
                <div className="mt-2 bg-gray-50 p-4 rounded-lg shadow-lg border border-gray-200">
                  {product.specifications ? (
                    <ul className="list-disc list-inside">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <li key={key} className="text-sm py-1">
                            <span className="font-semibold">
                              {formatKey(key)}:
                            </span>{" "}
                            {value as React.ReactNode}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No specifications available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;