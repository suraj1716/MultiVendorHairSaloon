import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
import { MinusCircle, PlusCircle } from "lucide-react";
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
  vendor,
  products,
  departments,
  filters
}) {
  const [expandedDepartments, setExpandedDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [maxPrice, setMaxPrice] = useState(
    filters.max_price ? parseInt(filters.max_price) : 3e3
  );
  const [sortBy, setSortBy] = useState(filters.sort_by || "default");
  const onDepartmentClick = (id) => {
    setSelectedDepartment(id);
    setSelectedCategory("");
    setExpandedDepartments([id]);
  };
  const toggleDepartment = (id) => {
    setExpandedDepartments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((deptId) => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const handleFilterChange = () => {
    router.get(
      route("vendor.profile", { vendor: vendor.data.store_name }),
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
    setSelectedCategory("");
    setExpandedDepartments([]);
    setMaxPrice(3e3);
    setSortBy("default");
    router.get(
      route("vendor.profile", { vendor: vendor.data.store_name }),
      {
        department_id: null,
        category_id: null,
        max_price: "3",
        sort_by: "default"
      },
      {
        preserveState: true,
        preserveScroll: true
      }
    );
  };
  const DEFAULT_MAX_PRICE = 5e3;
  const ShowAllProducts = () => {
    setSelectedDepartment(null);
    setSelectedCategory("");
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
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `${vendor.data.store_name} Profile Page` }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-200 py-10 text-center", children: /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-semibold text-gray-800", children: [
      "Products By Vendor: ",
      vendor.data.store_name
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-6 p-6", children: [
      /* @__PURE__ */ jsxs("aside", { className: "hidden lg:block lg:w-1/4 bg-white shadow rounded p-4 h-auto sticky top-4 self-start", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Filters" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition",
              onClick: ShowAllProducts,
              children: "All Products"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Departments & Categories" }),
          /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: departments.map((department) => {
            const isExpanded = expandedDepartments.includes(
              department.id.toString()
            );
            return /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      toggleDepartment(department.id.toString());
                      setSelectedDepartment(department.id.toString());
                      setSelectedCategory("");
                    },
                    className: "font-semibold text-left w-full",
                    children: department.name
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "ml-2",
                    onClick: () => toggleDepartment(department.id.toString()),
                    "aria-label": isExpanded ? "Collapse department" : "Expand department",
                    children: isExpanded ? /* @__PURE__ */ jsx(MinusCircle, { size: 20, className: "text-gray-600" }) : /* @__PURE__ */ jsx(PlusCircle, { size: 20, className: "text-gray-600" })
                  }
                )
              ] }),
              isExpanded && /* @__PURE__ */ jsx("ul", { className: "ml-4 mt-1 space-y-1", children: department.categories.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
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
            ] }, department.id);
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
              onClick: handleFilterChange,
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
      /* @__PURE__ */ jsx("div", { className: "lg:hidden p-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-blue-600 text-white px-4 py-2 rounded w-full",
          onClick: () => setShowFilterModal(true),
          children: "Open Filters"
        }
      ) }),
      showFilterModal && /* @__PURE__ */ jsx(
        "div",
        {
          className: "px-5  z-[9999] fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center",
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
                    /* @__PURE__ */ jsx("h3", { className: "text-bold font-medium mb-5", children: "Departments & Categories" }),
                    /* @__PURE__ */ jsx("ul", { className: "text-sm space-y-1", children: departments.map((department) => {
                      const idStr = department.id.toString();
                      const isExpanded = expandedDepartments.includes(idStr);
                      return /* @__PURE__ */ jsxs("li", { children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            className: "font-semibold w-full text-left",
                            onClick: () => onDepartmentClick(idStr),
                            children: department.name
                          }
                        ),
                        isExpanded && /* @__PURE__ */ jsx("ul", { className: "ml-4 mt-1", children: department.categories.map((category) => {
                          const catIdStr = category.id.toString();
                          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center space-x-2 cursor-pointer", children: [
                            /* @__PURE__ */ jsx(
                              "input",
                              {
                                type: "radio",
                                name: "category",
                                value: catIdStr,
                                checked: selectedCategory === catIdStr,
                                onChange: () => setSelectedCategory(catIdStr),
                                className: "form-radio text-blue-600 "
                              },
                              catIdStr + selectedCategory
                            ),
                            /* @__PURE__ */ jsx("span", { children: category.name })
                          ] }) }, catIdStr);
                        }) })
                      ] }, idStr);
                    }) })
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
                          handleFilterChange();
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
        products.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: " grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 ", children: products.data.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center space-x-2", children: products.meta.links.map(
          (link, index) => link.url ? /* @__PURE__ */ jsx(
            Link,
            {
              href: link.url,
              className: `px-3 py-1 border rounded ${link.active ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`,
              children: link.label.replace("&laquo;", "«").replace("&raquo;", "»")
            },
            index
          ) : /* @__PURE__ */ jsx(
            "span",
            {
              className: "px-3 py-1 border rounded text-gray-400 cursor-not-allowed",
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
  ListProducts as default
};
