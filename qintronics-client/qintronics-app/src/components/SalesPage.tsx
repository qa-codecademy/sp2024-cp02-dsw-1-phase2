import { useEffect, useState } from "react";
import { ProductAndFavFlag } from "../common/types/product-and-favorites-interface";
import axiosInstance from "../common/utils/axios-instance.util";
import Loader from "./Loader";
import ProductList from "./ProductList";

const SalesPage = () => {
  const [saleProducts, setSaleProducts] = useState<ProductAndFavFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(8); // Number of products per page
  const [hasNext, setHasNext] = useState(false); // Track if next page exists
  const [hasPrev, setHasPrev] = useState(false); // Track if previous page exists

  const fetchSaleProducts = (page: number, size: number) => {
    setLoading(true);
    axiosInstance
      .post("/products", {
        page,
        pageSize: size,
        discount: true,
      })
      .then((res) => {
        setSaleProducts(res.data.products);
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

  // Fetch sale products when the page or page size changes
  useEffect(() => {
    fetchSaleProducts(currentPage, pageSize);
  }, [currentPage, pageSize]);

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
    setCurrentPage(1); // Reset to the first page when page size changes
  };

  return (
    <div className="sales-page">
      {loading ? (
        <Loader /> // Show loader while loading
      ) : (
        <ProductList
          categoryName=""
          productList={saleProducts}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageSizeChange={handlePageSizeChange} // Pass page size change handler
          title="Products on Sale"
        />
      )}
    </div>
  );
};

export default SalesPage;
