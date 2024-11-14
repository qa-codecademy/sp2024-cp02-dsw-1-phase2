import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
import axiosInstance from "../common/utils/axios-instance.util";
import Loader from "./Loader";
import ProductList from "./ProductList";
import { AuthContext } from "../context/auth.context";

const CategoryPage = () => {
  const { category = "" } = useParams<{ category: string }>();
  const { brand = "" } = useParams<{ brand: string }>();
  const [filteredProducts, setFilteredProducts] = useState<ProductAndFavFlag[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(8); // Number of products per page
  const [hasNext, setHasNext] = useState(false); // Track if next page exists
  const [hasPrev, setHasPrev] = useState(false); // Track if previous page exists
  const { user } = useContext(AuthContext);

  const fetchProducts = (page: number, size: number) => {
    setLoading(true);
    axiosInstance
      .post(`/products`, {
        page,
        pageSize: size,
        brand: brand,
        categoryName: category,
        userId: user?.userId,
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

  // Fetch products when category, page, or page size changes
  useEffect(() => {
    fetchProducts(currentPage, pageSize);
  }, [category, currentPage, pageSize]);

  const handleNextPage = () => {
    if (hasNext) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  return (
    <div className="category-page">
      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <ProductList
          categoryName={category === "" ? brand : category}
          productList={filteredProducts}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageSizeChange={handlePageSizeChange} // Pass page size change handler
        />
      )}
    </div>
  );
};

export default CategoryPage;
