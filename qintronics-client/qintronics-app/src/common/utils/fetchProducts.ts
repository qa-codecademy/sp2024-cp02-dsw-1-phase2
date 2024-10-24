import { Product } from "../types/products-interface";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:3000/api/products");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.products; // Assuming 'products' key exists
};
