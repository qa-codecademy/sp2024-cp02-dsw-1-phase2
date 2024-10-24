import { Product } from "./../types/Product-interface";

// fetchProducts.ts
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/products.json");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
