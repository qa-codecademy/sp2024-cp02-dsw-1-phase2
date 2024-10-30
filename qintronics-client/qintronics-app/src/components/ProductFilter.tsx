// ProductFilter.tsx
import { useState, useEffect } from "react";

interface ProductFilterProps {
  onFilterChange: (params: {
    categoryName?: string;
    brand?: string;
    name?: string;
    sort?: "ASC" | "DESC";
    sortBy?: string;
  }) => void;
  resetPage: () => void;
  categories: string[];
  brands: string[];
}

const ProductFilter = ({
  onFilterChange,
  resetPage,
  categories,
  brands,
}: ProductFilterProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<"ASC" | "DESC">("ASC");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    // Debounce search input
    const timer = setTimeout(() => {
      const filters: any = {};
      if (category !== "all") filters.categoryName = category;
      if (brand !== "all") filters.brand = brand;
      if (search.trim()) filters.name = search;
      filters.sort = sort;
      filters.sortBy = sortBy;

      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [category, brand, search, sort, sortBy, onFilterChange]);

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setSort("ASC");
    setSortBy("name");
    resetPage();
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-4 bg-gray-100 rounded-lg shadow-md mx-auto max-w-screen-md">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option key="all-categories" value="all">
            All Categories
          </option>
          {categories.map((cat) => (
            <option key={`category-${cat}`} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option key="all-brands" value="all">
            All Brands
          </option>
          {brands.map((b) => (
            <option key={`brand-${b}`} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option key="sort-name" value="name">
            Name
          </option>
          <option key="sort-price" value="price">
            Price
          </option>
          <option key="sort-category" value="category">
            Category
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "ASC" | "DESC")}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option key="sort-asc" value="ASC">
            Ascending
          </option>
          <option key="sort-desc" value="DESC">
            Descending
          </option>
        </select>

        <button
          onClick={handleReset}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
