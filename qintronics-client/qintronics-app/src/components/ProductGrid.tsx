import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { Product } from "../common/types/Product-interface";

interface ProductGridProps {
  products: Product[];
  onCreateProduct: () => void;
  onUpdateProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onUpdateProduct,
  onRemoveProduct,
}) => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <motion.div
          key={product.id}
          className="bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-48 object-cover mb-4 rounded"
          />
          <h3 className="text-lg font-medium mb-2">{product.name}</h3>
          <p className="text-gray-600 mb-2">{product.brand}</p>
          <p className="text-[#1A3F6B] font-bold">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2 font-bold">
            Stock: {product.availability}
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <motion.button
              onClick={() => onUpdateProduct(product.id)}
              className="p-2 bg-[#1A3F6B] text-white rounded"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              onClick={() => onRemoveProduct(product.id)}
              className="p-2 bg-red-500 text-white rounded"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ProductGrid;
