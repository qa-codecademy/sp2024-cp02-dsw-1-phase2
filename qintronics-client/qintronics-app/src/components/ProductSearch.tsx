import React from "react";

interface ProductSearchProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
    </div>
  );
};

export default ProductSearch;
