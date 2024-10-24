import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
<<<<<<< HEAD
import ProductList from "./ProductList";
import { BaseProduct } from "../common/types/products-interface";
=======
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
>>>>>>> 5900c0cb480f0a48f04467cda0e47a8847f54e68
import axiosInstance from "../common/utils/axios-instance.util";
import Loader from "./Loader";
import ProductList from "./ProductList";

const CategoryPage = () => {
  const { category = "" } = useParams<{ category: string }>();
<<<<<<< HEAD
  const [filteredProducts, setFilteredProducts] = useState<BaseProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
=======
  const [filteredProducts, setFilteredProducts] = useState<ProductAndFavFlag[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(8); // Number of products per page
  const [hasNext, setHasNext] = useState(false); // Track if next page exists
  const [hasPrev, setHasPrev] = useState(false); // Track if previous page exists
  // const userId = "aa711739-3f57-4d82-8c68-0f3696b85ceb"; // DONT FORGET TO UNHARDCOMMENT THIS
  const userId = "d49299cd-6e15-4ba0-a313-ad443c073195"; // DON'T FORGET TO UNHARDCOMMENT THIS

  const fetchProducts = (page: number, size: number) => {
    setLoading(true);
    axiosInstance
      .post(`/products`, {
        page,
        pageSize: size,
        categoryName: category,
        userId,
      })
      .then((res) => {
        setFilteredProducts(res.data.products);
        setTotal(res.data.total);
        setHasNext(res.data.next); // Check if there is a next page
        setHasPrev(res.data.prev); // Check if there is a previous page
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
>>>>>>> 5900c0cb480f0a48f04467cda0e47a8847f54e68

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
