import { useState } from "react";
import axiosInstance from "./../common/utils/axios-instance.util";
import { Product, ProductsResponse } from "./../common/types/Product.interface";

export const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProducts = async (params: {
    page: number;
    pageSize: number;
    sort?: string;
    sortBy?: string;
    categoryName?: string;
    brand?: string;
    name?: string;
    discount?: boolean;
  }) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get<ProductsResponse>("/products", {
        params,
      });
      return data;
    } catch (err) {
      setError("Failed to fetch products");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post<Product>("/products", product);
      return data;
    } catch (err) {
      setError("Failed to create product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put<Product>(
        `/products/${id}`,
        product
      );
      return data;
    } catch (err) {
      setError("Failed to update product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/products/${id}`);
    } catch (err) {
      setError("Failed to delete product");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
