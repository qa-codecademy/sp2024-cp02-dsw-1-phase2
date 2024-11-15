// fetchProducts.ts
import { Product } from "../types/products-interface";
import axiosInstance from "./axios-instance.util";

interface FetchProductsParams {
  page?: number;
  pageSize?: number;
  sort?: "ASC" | "DESC";
  sortBy?: string;
  categoryName?: string;
  brand?: string;
  name?: string;
  discount?: boolean;
  random?: boolean;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  next: boolean;
  prev: boolean;
}

export const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ProductsResponse> => {
  try {
    const response = await axiosInstance.post("/products", {
      page: 1, // Setting the default page to 1
      pageSize: 12, // Setting the default page size to 12
      ...params, // Sending the parameters as the request body
    });

    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Rethrow the error for further handling
  }
};

export default fetchProducts;
