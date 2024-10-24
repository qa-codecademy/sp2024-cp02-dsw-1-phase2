import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import ProductList from "./ProductList";
import { BaseProduct } from "../common/types/products-interface";
import axiosInstance from "../common/utils/axios-instance.util";

const CategoryPage = () => {
  const { category = "" } = useParams<{ category: string }>();
  const [filteredProducts, setFilteredProducts] = useState<BaseProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Fetch products when category, page, or page size changes
  useEffect(() => {
    const fetchProducts = async (page: number, size: number) => {
      try {
        const res = await axiosInstance.get(
          `/products?sort=ASC&sortBy=name&pageSize=${size}&page=${page}&categoryName=${category}`
        );
        setFilteredProducts(res.data.products);
        setTotal(res.data.total);
        setHasNext(res.data.next);
        setHasPrev(res.data.prev);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts(currentPage, pageSize);
  }, [category, currentPage, pageSize]);

  // Memoize page handlers to avoid recreating them on every render
  const handleNextPage = useCallback(() => {
    if (hasNext) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [hasNext]);

  const handlePrevPage = useCallback(() => {
    if (hasPrev) {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  }, [hasPrev]);

  const handlePageSizeChange = useCallback(
    (size: number) => {
      if (pageSize !== size) {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page when page size changes
      }
    },
    [pageSize]
  );

  return (
    <div className="category-page">
      <ProductList
        categoryName={category}
        productList={filteredProducts}
        total={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default CategoryPage;
