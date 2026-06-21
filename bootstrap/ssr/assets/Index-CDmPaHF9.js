import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
import { SlidersHorizontal } from "lucide-react";
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
const DEFAULT_MAX_PRICE = 4e3;
function Index({
  department,
  products,
  departments,
  filters,
  categoryGroups,
  productGroups
}) {
  var _a, _b;
  const [selectedDepartment, setSelectedDepartment] = useState(
    filters.department_id
  );
  const [selectedCategory, setSelectedCategory] = useState(
    filters.category_id
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.max_price ? parseInt(filters.max_price) : DEFAULT_MAX_PRICE
  );
  const [sortBy, setSortBy] = useState(filters.sort_by || "default");
  const [showFilterModal, setShowFilterModal] = useState(false);
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
    if (!(department == null ? void 0 : department.slug)) return;
    setSelectedCategory(null);
    setMaxPrice(DEFAULT_MAX_PRICE);
    setSortBy("default");
    router.get(
      route("product.byDepartment", department.slug),
      {},
      // no query params
      {
        preserveScroll: true,
        preserveState: false
        // force state refresh
      }
    );
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Product List" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-200 py-10 text-center ", children: /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-semibold text-gray-800", children: [
      "Products in ",
      department.name
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-6 p-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "hidden lg:block lg:w-1/4 bg-white shadow rounded p-4 h-auto sticky top-4 self-start", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-5", children: "Filters" }),
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: department ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold mb-2", children: department.name }),
          /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: (_a = department == null ? void 0 : department.categories) == null ? void 0 : _a.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
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
        ] }) : /* @__PURE__ */ jsx("p", { children: "Please select a department to see categories." }) }),
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
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
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
              className: "w-full bg-gray-300 text-gray-800 py-2 rounded",
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
                  router.visit(
                    route("productGroup.show", { productGroup: group.slug }),
                    {
                      preserveScroll: true,
                      preserveState: true
                    }
                  );
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
      /* @__PURE__ */ jsxs("main", { className: "w-full lg:w-full ", children: [
        products.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex space-x-3 items-center min-h-[50px] mb-6 ml-10 overflow-x-auto overflow-y-hidden whitespace-nowrap", children: [
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
                  router.visit(
                    route("productGroup.show", { productGroup: group.slug }),
                    {
                      preserveScroll: true,
                      preserveState: true
                    }
                  );
                },
                children: group.name
              },
              group.id
            ))
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10 xs:mr-5", children: products.data.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center space-x-2", children: products.meta.links.map(
          (link, index) => link.url ? /* @__PURE__ */ jsx(
            "a",
            {
              href: link.url,
              className: `px-3 py-1 border rounded ${link.active ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`,
              dangerouslySetInnerHTML: { __html: link.label }
            },
            index
          ) : /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-3 py-1 border rounded text-gray-400",
              dangerouslySetInnerHTML: { __html: link.label }
            },
            index
          )
        ) })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
