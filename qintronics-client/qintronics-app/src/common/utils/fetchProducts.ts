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
  const queryParams = new URLSearchParams();

  // Add parameters to query string if they exist
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.categoryName)
    queryParams.append("categoryName", params.categoryName);
  if (params.brand) queryParams.append("brand", params.brand);
  if (params.name) queryParams.append("name", params.name);
  if (params.discount !== undefined)
    queryParams.append("discount", params.discount.toString());

  const url = `/products?${queryParams.toString()}`;
  const response = await axiosInstance.get(url);

  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.data;
};

export default fetchProducts;
