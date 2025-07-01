import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductItem from "@/Components/App/ProductItem";
import {
  PageProps,
  PaginationProps,
  Product,
  Department,
  CategoryGroup,
  ProductGroup,
} from "@/types";
import { PlusCircle, MinusCircle, SlidersHorizontal } from "lucide-react";

type ProfileProps = PageProps<{
  allProducts: PaginationProps<Product>;
  products: PaginationProps<Product>;
  searchedProducts?: PaginationProps<Product>; // <-- Add thi
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[];
  department: Department;
  departments: Department[];
  filters: {
    department_id: string | null;
    category_id: string | null;
    max_price: string | null;
    sort_by: string | null;
    keyword?: string | null;
  };
}>;

export default function ListProducts({
  products,
  allProducts,
  searchedProducts,
  categoryGroups,
  productGroups,
  departments,
  department,
  filters,
}: ProfileProps) {
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const onDepartmentClick = (id: string) => {
    setSelectedDepartment(id);
    setSelectedCategory("");
    setExpandedDepartments([id]); // only this one expanded
  };

  const toggleDepartment = (id: string) => {
    setExpandedDepartments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((deptId) => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(
    filters.max_price ? parseInt(filters.max_price) : 5000
  );
  const [sortBy, setSortBy] = useState<string>(filters.sort_by || "default");
  const handleApplyFilters = () => {
    const selectedDepartmentSlug = departments.find(
      (d) => d.id.toString() === selectedDepartment?.toString()
    )?.slug;

    if (!selectedDepartmentSlug) {
      console.error("No slug found for selected department");
      return;
    }

    router.get(
      route("product.byDepartment", selectedDepartmentSlug),
      {
        department_id: selectedDepartment,
        category_id: selectedCategory,
        max_price: maxPrice.toString(),
        sort_by: sortBy,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const handleResetFilters = () => {
    setSelectedDepartment(null);
    setExpandedDepartments([]);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("default");

    // Fetch all products with no filters
    router.get(
      route("shop.search"),
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };
  const DEFAULT_MAX_PRICE = 5000;

  const ShowAllProducts = () => {
    setSelectedDepartment(null);
    setSelectedCategory("");
    setExpandedDepartments([]);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("default");

    // Fetch all products with no filters
    router.get(
      route("shop.search"),
      {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const displayedProducts =
    filters.keyword && searchedProducts?.data?.length
      ? searchedProducts
      : products;

  // Ensure uniqueness by ID
  const uniqueProducts = Array.from(
    new Map(allProducts.data.map((p) => [p.id, p])).values()
  );

  //       const uniqueProducts = Array.from(
  //   new Map(displayedProducts.data.map((p) => [p.id, p])).values()
  // );

  console.log("productGroups", productGroups);

  return (
    <AuthenticatedLayout>
      <Head title="Shop" />

      <div className="bg-gray-200 py-10 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">Shop</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Filters */}
        <aside className="hidden lg:block lg:w-1/4 bg-white shadow rounded p-4 h-auto sticky top-4 self-start">
          <h2 className="text-lg font-semibold mb-5">Filters</h2>
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              onClick={handleResetFilters}
            >
              All Products
            </button>
          </div> */}

          {/* Department Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">
              Departments & Categories
            </h3>
            <ul className="text-sm space-y-1">
              {departments.map((department) => {
                const isExpanded = expandedDepartments.includes(
                  department.id.toString()
                );

                return (
                  <li key={department.id}>
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          toggleDepartment(department.id.toString());
                          setSelectedDepartment(department.id.toString());
                          setSelectedCategory(""); // reset category on new department select
                        }}
                        className="font-semibold text-left w-full"
                      >
                        {department.name}
                      </button>
                      <button
                        type="button"
                        className="ml-2"
                        onClick={() =>
                          toggleDepartment(department.id.toString())
                        }
                        aria-label={
                          isExpanded
                            ? "Collapse department"
                            : "Expand department"
                        }
                      >
                        {isExpanded ? (
                          <MinusCircle size={20} className="text-gray-600" />
                        ) : (
                          <PlusCircle size={20} className="text-gray-600" />
                        )}
                      </button>
                    </div>

                    {/* Show categories if expanded */}
                    {isExpanded && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {department.categories.map((category) => (
                          <li key={category.id}>
                            <label className="inline-flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                value={category.id}
                                checked={
                                  selectedCategory === category.id.toString()
                                }
                                onChange={() =>
                                  setSelectedCategory(category.id.toString())
                                }
                              />
                              <span>{category.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Price Range</h3>
            <input
              type="range"
              min={0}
              max={6000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-1">Up to ${maxPrice}</p>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <select
              className="w-full border border-gray-300 rounded p-1 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>

            <button
              className="w-full bg-gray-100 text-gray-700 py-2 rounded border border-gray-300"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Mobile filter toggle button */}
        <div
          className="lg:hidden overflow-x-scroll overflow-y-hidden  pb-20 h-10"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="whitespace-nowrap px-4 py-3">
            <div className="flex space-x-3 items-center min-w-max h-[50px]">
              {/* Filter Button */}
              <button
                className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-md whitespace-nowrap"
                onClick={() => setShowFilterModal(true)}
              >
                <SlidersHorizontal size={18} />
              </button>

              {/* Category Groups */}
              {categoryGroups
                .filter((group) => group.active)
                .map((group) => (
                  <button
                    key={group.id}
                    className="flex-shrink-0 bg-slate-200 hover:bg-indigo-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                    onClick={() => {
                      router.visit(`/?scrollToCategoryId=${group.id}`, {
                        preserveScroll: true,
                        preserveState: true,
                      });
                    }}
                  >
                    {group.name}
                  </button>
                ))}

              {/* Product Groups */}
              {productGroups.map((group) => (
                <button
                  key={group.id}
                  className="flex-shrink-0 bg-slate-200 hover:bg-indigo-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                  onClick={() => {
                    router.visit(`/?scrollToProductId=${group.id}`, {
                      preserveScroll: true,
                      preserveState: true,
                    });
                  }}
                >
                  {group.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showFilterModal && (
          <div
            className="px-10 fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex justify-center items-center"
            onClick={() => setShowFilterModal(false)} // click on backdrop
          >
            {/* Prevent click inside modal from closing */}
            <div
              className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={() => setShowFilterModal(false)}
              >
                &times;
              </button>

              {/* Your Filters Go Here */}
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

              {/* Categories */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Categories</h3>
                  <ul className="text-sm space-y-1">
                    {department?.categories?.map((category) => (
                      <li key={category.id}>
                        <label className="inline-flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category.id.toString()}
                            checked={
                              selectedCategory === category.id.toString()
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              requestAnimationFrame(() => {
                                setSelectedCategory(value);
                              });
                            }}
                          />

                          <span>{category.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <input
                    type="range"
                    min={0}
                    max={6000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Up to ${maxPrice}
                  </p>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Sort By</h3>
                  <select
                    className="w-full border border-gray-300 rounded p-1 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded"
                    onClick={() => {
                      handleApplyFilters();
                      setShowFilterModal(false);
                    }}
                  >
                    Apply
                  </button>
                  <button
                    className="w-full bg-gray-300 text-gray-800 py-2 rounded"
                    onClick={() => {
                      handleResetFilters();
                      setShowFilterModal(false);
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
       <main className="w-full lg:w-full">
  {filters.keyword && searchedProducts?.data?.length ? (
    searchedProducts.data.length === 0 ? (
      <div className="text-center py-20 text-gray-500">
        No products found.
      </div>
    ) : (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-10 gap-y-12 xs:mr-5">
        {searchedProducts.data.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    )
  ) : displayedProducts.data.length === 0 ? (
    <div className="text-center py-20 text-gray-500">
      No products found.
    </div>
  ) : (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-10 gap-y-12 xs:mr-5">
      {uniqueProducts.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )}
</main>

      </div>
    </AuthenticatedLayout>
  );
}
