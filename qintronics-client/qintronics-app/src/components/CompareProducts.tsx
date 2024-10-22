import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "./../common/types/Product-interface";
import ProductFilter from "./ProductFilter";
import ProductCard from "./ProductCard";
// import { fetchProducts } from "./../common/utils/fetchProducts";
import { XCircle, CheckCircle, PlusCircle } from "lucide-react";

const CompareProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<2 | 3>(3);

  const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.products; // Assuming 'products' key exists
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    loadProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length < comparisonMode) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const handleFilterChange = (filtered: Product[]) => {
    setFilteredProducts(filtered);
  };

  const resetComparison = () => {
    setSelectedProducts([]);
    setIsComparing(false);
    setComparisonMode(3);
  };

  const startComparison = () => {
    if (selectedProducts.length >= 2) {
      setIsComparing(true);
    }
  };

  const toggleComparisonMode = () => {
    setComparisonMode(comparisonMode === 3 ? 2 : 3);
    if (selectedProducts.length > 2) {
      setSelectedProducts(selectedProducts.slice(0, 2));
    }
  };

  const compareProducts = () => {
    if (selectedProducts.length < 2) return;

    const comparisonResult = selectedProducts.reduce((best, current) => {
      // Define your comparison logic here based on specifications
      // For instance, you could compare a specific property like 'rating' or 'price'
      if (current.specifications > best.specifications) {
        return current;
      }
      return best;
    });

    return comparisonResult;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Product Comparison Tool
        </h1>

        {!isComparing && (
          <ProductFilter
            products={products}
            onFilterChange={handleFilterChange}
            resetPage={resetComparison}
          />
        )}

        <div className="mt-8">
          {isComparing ? (
            <ComparisonView
              products={selectedProducts}
              onReset={resetComparison}
              comparisonResult={compareProducts()}
            />
          ) : (
            <SelectionView
              filteredProducts={filteredProducts}
              selectedProducts={selectedProducts}
              onSelectProduct={handleSelectProduct}
              comparisonMode={comparisonMode}
              onToggleMode={toggleComparisonMode}
              onStartComparison={startComparison}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const SelectionView: React.FC<{
  filteredProducts: Product[];
  selectedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  comparisonMode: 2 | 3;
  onToggleMode: () => void;
  onStartComparison: () => void;
}> = ({
  filteredProducts,
  selectedProducts,
  onSelectProduct,
  comparisonMode,
  onToggleMode,
  onStartComparison,
}) => (
  <div>
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Select Products to Compare</h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleMode}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          Compare {comparisonMode} Products
        </button>
        <button
          onClick={onStartComparison}
          disabled={selectedProducts.length < 2}
          className={`px-4 py-2 rounded-md ${
            selectedProducts.length < 2
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
        >
          Start Comparison
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative ${
            selectedProducts.some((p) => p.id === product.id)
              ? "ring-2 ring-blue-500"
              : ""
          }`}
          onClick={() => onSelectProduct(product)}
        >
          <ProductCard product={product} />
          <div className="absolute top-2 right-2">
            {selectedProducts.some((p) => p.id === product.id) ? (
              <CheckCircle className="text-blue-500 w-6 h-6" />
            ) : selectedProducts.length < comparisonMode ? (
              <PlusCircle className="text-gray-400 w-6 h-6" />
            ) : (
              <XCircle className="text-gray-400 w-6 h-6" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ComparisonView: React.FC<{
  products: Product[];
  onReset: () => void;
  comparisonResult: Product | undefined;
}> = ({ products, onReset, comparisonResult }) => (
  <div>
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Product Comparison</h2>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        Back to Selection
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <ProductCard product={product} />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <ul className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>

    {comparisonResult && (
      <div className="mt-8 p-4 bg-blue-100 border border-blue-400 rounded">
        <h3 className="text-lg font-semibold">Comparison Result</h3>
        <p>
          Based on the selected specifications,{" "}
          <span className="font-bold">{comparisonResult.name}</span> is the
          better product.
        </p>
      </div>
    )}
  </div>
);

export default CompareProducts;