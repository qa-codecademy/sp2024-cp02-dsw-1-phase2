import { useState, useEffect } from "react";
import { Product } from "../common/types/Product-interface";
import { Search } from "lucide-react";
import fetchProducts from "../common/utils/fetchProducts";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Debouncing the search query to reduce unnecessary API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch products from backend based on debounced query
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (debouncedQuery) {
        setLoading(true);
        try {
          const { products } = await fetchProducts({ name: debouncedQuery });
          setFilteredProducts(products);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredProducts([]);
      }
    };

    fetchFilteredProducts();
  }, [debouncedQuery]);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  // Function to handle product click
  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`); // Navigate to the product page
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={toggleSearch}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-300"
        >
          <Search size={24} />
        </button>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className={`border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
          ${isSearchOpen ? "w-64" : "w-0"}`}
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg p-4">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Displaying search results */}
      {!loading && filteredProducts.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleProductClick(product.id)} // Navigate on click
            >
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.brand}</p>
              <p className="text-sm font-medium">${product.price}</p>
              <p className="text-xs text-gray-500">
                {product.availability} in stock
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No products found */}
      {!loading && filteredProducts.length === 0 && debouncedQuery && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-lg p-4">
          <p className="text-gray-600">
            No products found for "{debouncedQuery}".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
