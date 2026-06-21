import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
import { MinusCircle, PlusCircle, SlidersHorizontal } from "lucide-react";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "@heroicons/react/20/solid";
import "@inertiajs/core";
import "react-icons/fa";
function ListProducts({
  products,
  allProducts,
  searchedProducts,
  categoryGroups,
  productGroups,
  departments,
  department,
  filters
}) {
  var _a, _b, _c;
  const [expandedDepartments, setExpandedDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const toggleDepartment = (id) => {
    setExpandedDepartments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((deptId) => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState(
    filters.max_price ? parseInt(filters.max_price) : 5e3
  );
  const [sortBy, setSortBy] = useState(filters.sort_by || "default");
  const handleApplyFilters = () => {
    var _a2;
    const selectedDepartmentSlug = (_a2 = departments.find(
      (d) => d.id.toString() === (selectedDepartment == null ? void 0 : selectedDepartment.toString())
    )) == null ? void 0 : _a2.slug;
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
        sort_by: sortBy
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const handleResetFilters = () => {
    setSelectedDepartment(null);
    setExpandedDepartments([]);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("default");
    router.get(
      route("shop.search"),
      {},
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const DEFAULT_MAX_PRICE = 5e3;
  const displayedProducts = filters.keyword && ((_a = searchedProducts == null ? void 0 : searchedProducts.data) == null ? void 0 : _a.length) ? searchedProducts : products;
  const uniqueProducts = Array.from(
    new Map(allProducts.data.map((p) => [p.id, p])).values()
  );
  console.log("products", products);
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Shop" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-200 py-10 text-center", children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-semibold text-gray-800", children: "Shop" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-6 p-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "hidden lg:block lg:w-1/4 bg-white shadow rounded p-4 h-auto sticky top-4 self-start", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-5", children: "Filters" }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Departments & Categories" }),
          /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: departments.map((department2) => {
            const isExpanded = expandedDepartments.includes(
              department2.id.toString()
            );
            return /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      toggleDepartment(department2.id.toString());
                      setSelectedDepartment(department2.id.toString());
                      setSelectedCategory("");
                    },
                    className: "font-semibold text-left w-full",
                    children: department2.name
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "ml-2",
                    onClick: () => toggleDepartment(department2.id.toString()),
                    "aria-label": isExpanded ? "Collapse department" : "Expand department",
                    children: isExpanded ? /* @__PURE__ */ jsx(MinusCircle, { size: 20, className: "text-gray-600" }) : /* @__PURE__ */ jsx(PlusCircle, { size: 20, className: "text-gray-600" })
                  }
                )
              ] }),
              isExpanded && /* @__PURE__ */ jsx("ul", { className: "ml-4 mt-1 space-y-1", children: department2.categories.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: "category",
                    value: category.id,
                    checked: selectedCategory === category.id.toString(),
                    onChange: () => setSelectedCategory(category.id.toString())
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: category.name })
              ] }) }, category.id)) })
            ] }, department2.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Price Range" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: 0,
              max: 6e3,
              value: maxPrice,
              onChange: (e) => setMaxPrice(Number(e.target.value)),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
            "Up to $",
            maxPrice
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Sort By" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "w-full border border-gray-300 rounded p-1 text-sm",
              value: sortBy,
              onChange: (e) => setSortBy(e.target.value),
              children: [
                /* @__PURE__ */ jsx("option", { value: "default", children: "Default" }),
                /* @__PURE__ */ jsx("option", { value: "price_asc", children: "Price: Low to High" }),
                /* @__PURE__ */ jsx("option", { value: "price_desc", children: "Price: High to Low" }),
                /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "w-full bg-blue-600 text-white py-2 rounded",
              onClick: handleApplyFilters,
              children: "Apply Filters"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "w-full bg-gray-100 text-gray-700 py-2 rounded border border-gray-300",
              onClick: handleResetFilters,
              children: "Reset Filters"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "lg:hidden overflow-x-scroll overflow-y-hidden px-4 pb-20 h-10",
          style: { WebkitOverflowScrolling: "touch" },
          children: /* @__PURE__ */ jsx("div", { className: "whitespace-nowrap px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-3 items-center min-w-max h-[50px]", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-md whitespace-nowrap",
                onClick: () => setShowFilterModal(true),
                children: /* @__PURE__ */ jsx(SlidersHorizontal, { size: 18 })
              }
            ),
            categoryGroups.filter((group) => group.active).map((group) => /* @__PURE__ */ jsx(
              "button",
              {
                className: "flex-shrink-0 bg-slate-200 hover:bg-indigo-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap",
                onClick: () => {
                  router.visit(`/?scrollToCategoryId=${group.id}`, {
                    preserveScroll: true,
                    preserveState: true
                  });
                },
                children: group.name
              },
              group.id
            )),
            productGroups.map((group) => /* @__PURE__ */ jsx(
              "button",
              {
                className: "flex-shrink-0 bg-slate-200 hover:bg-indigo-100 text-gray-800 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap",
                onClick: () => {
                  router.visit(`/?scrollToProductId=${group.id}`, {
                    preserveScroll: true,
                    preserveState: true
                  });
                },
                children: group.name
              },
              group.id
            ))
          ] }) })
        }
      ),
      showFilterModal && /* @__PURE__ */ jsx(
        "div",
        {
          className: "px-10 fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999] flex justify-center items-center",
          onClick: () => setShowFilterModal(false),
          children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative",
              onClick: (e) => e.stopPropagation(),
              children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl",
                    onClick: () => setShowFilterModal(false),
                    children: "×"
                  }
                ),
                /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Filters" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Categories" }),
                    /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: (_b = department == null ? void 0 : department.categories) == null ? void 0 : _b.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "radio",
                          name: "category",
                          value: category.id.toString(),
                          checked: selectedCategory === category.id.toString(),
                          onChange: (e) => {
                            const value = e.target.value;
                            requestAnimationFrame(() => {
                              setSelectedCategory(value);
                            });
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: category.name })
                    ] }) }, category.id)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Price Range" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "range",
                        min: 0,
                        max: 6e3,
                        value: maxPrice,
                        onChange: (e) => setMaxPrice(Number(e.target.value)),
                        className: "w-full"
                      }
                    ),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
                      "Up to $",
                      maxPrice
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Sort By" }),
                    /* @__PURE__ */ jsxs(
                      "select",
                      {
                        className: "w-full border border-gray-300 rounded p-1 text-sm",
                        value: sortBy,
                        onChange: (e) => setSortBy(e.target.value),
                        children: [
                          /* @__PURE__ */ jsx("option", { value: "default", children: "Default" }),
                          /* @__PURE__ */ jsx("option", { value: "price_asc", children: "Price: Low to High" }),
                          /* @__PURE__ */ jsx("option", { value: "price_desc", children: "Price: High to Low" }),
                          /* @__PURE__ */ jsx("option", { value: "newest", children: "Newest" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-4", children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "w-full bg-blue-600 text-white py-2 rounded",
                        onClick: () => {
                          handleApplyFilters();
                          setShowFilterModal(false);
                        },
                        children: "Apply"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: "w-full bg-gray-300 text-gray-800 py-2 rounded",
                        onClick: () => {
                          handleResetFilters();
                          setShowFilterModal(false);
                        },
                        children: "Reset"
                      }
                    )
                  ] })
                ] })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsx("main", { className: "w-full lg:w-full", children: filters.keyword && ((_c = searchedProducts == null ? void 0 : searchedProducts.data) == null ? void 0 : _c.length) ? (
        // ✅ If searchedProducts exist
        searchedProducts.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 xs:gap-10 sm:grid-cols-3 lg:grid-cols-4 gap-10 xs:mr-5", children: searchedProducts.data.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) })
      ) : (
        // ✅ Otherwise show default unique products
        displayedProducts.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 xs:gap-10 sm:grid-cols-3 lg:grid-cols-4 gap-10 xs:mr-5", children: uniqueProducts.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) })
      ) })
    ] })
  ] });
}
export {
  ListProducts as default
};
