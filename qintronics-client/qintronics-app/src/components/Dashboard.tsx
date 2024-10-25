// Dashboard.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "../common/types/Product-interface";
import Sidebar from "./DashboardSidebar";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import ProductGrid from "./ProductGrid";
import CategoryManager from "./CategoryManager";
import OrderManager from "./OrderManager";
import RecentActivity from "./RecentActivity";
import InventoryStatus from "./InventoryStatus";
import ProductSearch from "./ProductSearch";
import UserManagement from "./UserManagement";
import Pagination from "./Pagination";
import axiosInstance from "../common/utils/axios-instance.util";

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [sort, setSort] = useState<string>("ASC");
  const [sortBy, setSortBy] = useState<string>("name");
  const [categoryName, setCategoryName] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, sort, sortBy, categoryName, brand, searchTerm]);

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        sort,
        sortBy,
        ...(categoryName && { categoryName }),
        ...(brand && { brand }),
        ...(searchTerm && { name: searchTerm }),
      });

      // Ensure page and pageSize are numbers
      queryParams.set("page", page.toString());
      queryParams.set("pageSize", pageSize.toString());

      const { data } = await axiosInstance.get<ProductsResponse>(
        `/products?${queryParams}`
      );
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCreateProduct = () => {
    console.log("Create product");
  };

  const handleRemoveProduct = (id: string) => {
    axiosInstance
      .delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Error removing product:", error);
      });
  };

  const handleUpdateProduct = (id: string) => {
    console.log("Update product", id);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setPage(1);
  };

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategoryName(newCategory);
    setPage(1);
  };

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    setPage(1);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <StatCard title="Total Sales" value="$12,345" trend={12} />
              <StatCard title="Orders" value="142" trend={-5} />
              <StatCard title="Customers" value="1,234" trend={8} />
              <StatCard title="Avg. Order Value" value="$87" trend={3} />
            </div>
            <SalesChart />
            <InventoryStatus products={products} />
            <RecentActivity />
          </motion.div>
        );
      case "products":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Products</h2>
            <ProductSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
            <div className="mb-4">
              <select
                onChange={(e) => handleSortChange(e.target.value)}
                value={sort}
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
              <select
                onChange={(e) => handleSortByChange(e.target.value)}
                value={sortBy}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Created At</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={categoryName}
                onChange={(e) => handleCategoryChange(e.target.value)}
              />
              <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
              />
            </div>
            <ProductGrid
              products={products}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              onRemoveProduct={handleRemoveProduct}
            />
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalProducts / pageSize)}
              onPageChange={handlePageChange}
            />
            <select
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              value={pageSize}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </motion.div>
        );
      case "categories":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">
              Categories
            </h2>
            <CategoryManager />
          </motion.div>
        );
      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">Orders</h2>
            <OrderManager />
          </motion.div>
        );
      case "users": // NEW SECTION
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-light text-gray-800 mb-8">
              User Management
            </h2>
            <UserManagement />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen flex">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 overflow-hidden">
        <main className="max-w-7xl mx-auto px-8 py-12">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;