import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Disclosure } from "@headlessui/react";
import { ShoppingBagIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { usePage, Link, useForm, router } from "@inertiajs/react";
import LoginModal from "./Login-CRSv4mrB.js";
import { Search, UserIcon } from "lucide-react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
function Footer() {
  return /* @__PURE__ */ jsxs("div", { className: "relative mt-16  bg-purple-900", children: [
    /* @__PURE__ */ jsx(
      "svg",
      {
        className: "absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-purple-900",
        preserveAspectRatio: "none",
        viewBox: "0 0 1440 54",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            fill: "currentColor",
            d: "M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-16 row-gap-10 mb-8 lg:grid-cols-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "md:max-w-md lg:col-span-2", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/",
              "aria-label": "Go home",
              title: "Company",
              className: "inline-flex items-center",
              children: [
                /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "w-8 text-violet-300",
                    viewBox: "0 0 24 24",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeMiterlimit: "10",
                    stroke: "currentColor",
                    fill: "none",
                    children: [
                      /* @__PURE__ */ jsx("rect", { x: "3", y: "1", width: "7", height: "12" }),
                      /* @__PURE__ */ jsx("rect", { x: "3", y: "17", width: "7", height: "6" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "1", width: "7", height: "6" }),
                      /* @__PURE__ */ jsx("rect", { x: "14", y: "11", width: "7", height: "12" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "ml-2 text-xl font-bold tracking-wide text-gray-100 uppercase", children: "Company" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-4 lg:max-w-sm text-gray-100 text-sm", children: [
            /* @__PURE__ */ jsx("p", { children: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam." }),
            /* @__PURE__ */ jsx("p", { className: "mt-4", children: "Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-5 row-gap-8 lg:col-span-4 md:grid-cols-4 text-gray-100", children: [
          ["Category", ["News", "World", "Games", "References"]],
          ["Cherry", ["Web", "eCommerce", "Business", "Entertainment", "Portfolio"]],
          ["Apples", ["Media", "Brochure", "Nonprofit", "Educational", "Projects"]],
          ["Business", ["Infopreneur", "Personal", "Wiki", "Forum"]]
        ].map(([title, links], i) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold tracking-wide text-violet-200", children: title }),
          /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-2", children: links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              className: "transition-colors duration-300 hover:text-white",
              children: link
            }
          ) }, link)) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between pt-5 pb-10 border-t border-violet-600 sm:flex-row", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-100", children: "© Copyright 2020 Lorem Inc. All rights reserved." }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center mt-4 space-x-4 sm:mt-0 text-violet-200", children: ["twitter", "instagram", "facebook"].map((icon, i) => /* @__PURE__ */ jsx(
          "a",
          {
            href: "/",
            className: "transition-colors duration-300 hover:text-white",
            children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "h-5 w-5", children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }) })
          },
          i
        )) })
      ] })
    ] })
  ] });
}
const CurrencyFormatter = ({
  amount,
  currency = "USD",
  locale = "en-US"
}) => {
  const formattedAmount = new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount ?? 0);
  return /* @__PURE__ */ jsx("span", { children: formattedAmount });
};
function MiniCartDropdown() {
  const { auth, totalPrice, totalQuantity, miniCartItems } = usePage().props;
  const { user } = auth;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loginOpen, setLoginOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { className: "", children: [
    open && /* @__PURE__ */ jsx("div", { className: "fixed inset-0  bg-black/20 backdrop-blur-sm transition-opacity duration-300" }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative z-50 flex items-center justify-center px-2 sm:px-4",
        ref: dropdownRef,
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setOpen(!open),
              className: "relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition",
              "aria-label": "Open Cart",
              children: [
                /* @__PURE__ */ jsx(ShoppingBagIcon, { className: "h-6 w-6 text-gray-600" }),
                totalQuantity > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full", children: totalQuantity })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute right-0 top-full mt-2 w-[92vw] sm:w-90 md:w-96 bg-white border border-gray-200 rounded-xl shadow-xl transition-all transform origin-top-right duration-200 ${open ? "mt-10 scale-100 opacity-100 visible translate-x-7" : "scale-95 opacity-0 invisible"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "p-4 max-h-[60vh] overflow-y-auto", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold mb-3", children: [
                  totalQuantity,
                  " Item(s)"
                ] }),
                miniCartItems.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-gray-500 text-center py-10", children: "Your cart is empty" }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: miniCartItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("product.show", item.slug),
                      className: "w-16 h-16",
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.image_url,
                          alt: item.title,
                          className: "w-full h-full object-cover rounded"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 text-sm", children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("product.show", item.slug),
                        className: "block font-medium line-clamp-2 hover:underline",
                        children: item.title
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 flex justify-between mt-1", children: /* @__PURE__ */ jsx(
                      CurrencyFormatter,
                      {
                        amount: item.quantity * item.price,
                        currency: "AUD"
                      }
                    ) }),
                    item.options && item.options.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 mt-1", children: item.options.map((opt) => /* @__PURE__ */ jsxs("div", { children: [
                      opt.type.name,
                      ": ",
                      opt.name
                    ] }, opt.id)) })
                  ] })
                ] }, item.id)) }),
                miniCartItems.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("hr", { className: "my-4" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm font-semibold mb-3", children: [
                    /* @__PURE__ */ jsx("span", { children: "Subtotal:" }),
                    /* @__PURE__ */ jsx(CurrencyFormatter, { amount: totalPrice, currency: "AUD" })
                  ] }),
                  user ? /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("cart.index"),
                      className: "w-full block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition",
                      children: "View Cart"
                    }
                  ) : /* @__PURE__ */ jsx(
                    "span",
                    {
                      onClick: () => setLoginOpen(true),
                      className: "w-full block text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition",
                      children: "Login to View Cart"
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            LoginModal,
            {
              isOpen: loginOpen,
              onClose: () => setLoginOpen(false),
              canResetPassword: true
            }
          )
        ]
      }
    )
  ] });
}
function CategoriesDropdown({ departments }) {
  var _a, _b, _c;
  const [expandedDeptId, setExpandedDeptId] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  useEffect(() => {
    if (expandedDeptId !== null) {
      setShowPanel(true);
    } else {
      const timer = setTimeout(() => setShowPanel(false), 300);
      return () => clearTimeout(timer);
    }
  }, [expandedDeptId]);
  if (departments.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "px-4 py-3 text-center text-sm text-gray-500", children: "No departments found." });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex overflow-hidden h-[400px]", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: departments.map((dept) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setExpandedDeptId(dept.id),
        className: "w-full text-left px-4 py-3 text-gray-900  hover:bg-gray-100 flex justify-between items-center border-b border-gray-300",
        "aria-expanded": expandedDeptId === dept.id,
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "text-left w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors",
              children: dept.name
            }
          ),
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `w-5 h-5 transform transition-transform ${expandedDeptId === dept.id ? "rotate-90" : "rotate-0"}`,
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 5l7 7-7 7" })
            }
          )
        ]
      },
      dept.id
    )) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `bg-white shadow-lg overflow-auto transition-all duration-300 ease-in-out ${expandedDeptId !== null ? "max-w-[320px] opacity-100" : "max-w-0 opacity-0"}`,
        style: { width: expandedDeptId !== null ? "320px" : "0px" },
        children: showPanel && /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setExpandedDeptId(null),
              className: "flex items-center text-gray-600 hover:text-gray-900 mb-4",
              "aria-label": "Back to departments",
              children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    className: "w-5 h-5 mr-2",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" })
                  }
                ),
                "Back"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: `/d/${((_a = departments.find((d) => d.id === expandedDeptId)) == null ? void 0 : _a.slug) ?? ""}`,
              className: "block text-gray-700 px-4 py-2 border-b border-gray-300 font-medium",
              onClick: () => setExpandedDeptId(null),
              children: [
                "All ",
                (_b = departments.find((d) => d.id === expandedDeptId)) == null ? void 0 : _b.name,
                " Products"
              ]
            }
          ),
          (((_c = departments.find((d) => d.id === expandedDeptId)) == null ? void 0 : _c.categories) ?? []).map(
            (cat, idx, arr) => {
              var _a2;
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/d/${(_a2 = departments.find((d) => d.id === expandedDeptId)) == null ? void 0 : _a2.slug}?category_id=${cat.id}&department_id=${expandedDeptId}&max_price=4000&sort_by=default`,
                  className: `block text-gray-700 px-4 py-2 ${idx !== arr.length - 1 ? "border-b border-gray-300" : ""}`,
                  onClick: () => setExpandedDeptId(null),
                  children: cat.name
                },
                cat.id
              );
            }
          )
        ] })
      }
    )
  ] });
}
function SearchBar({ keyword = "" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(keyword);
  const [suggestions, setSuggestions] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const containerRef = useRef(null);
  const SearchForm = useForm({
    keyword: "",
    category_id: "",
    max_price: "",
    sort_by: ""
  });
  const fetchSuggestions = (searchTerm) => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }
    fetch(`/search-suggestions?keyword=${encodeURIComponent(searchTerm)}`).then((res) => res.json()).then((res) => {
      setSuggestions(res.data);
    }).catch(() => setSuggestions([]));
  };
  const onInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    SearchForm.setData("keyword", value);
    if (debounceTimeout) clearTimeout(debounceTimeout);
    const timeout = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
    setDebounceTimeout(timeout);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    SearchForm.get("/shop");
  };
  useEffect(() => {
    function onClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);
  return /* @__PURE__ */ jsxs("div", { className: "", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setOpen(true),
        className: "flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-gray-100",
        "aria-label": "Open search",
        children: [
          /* @__PURE__ */ jsx(Search, { size: 18 }),
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Search" })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-[1000] flex justify-center items-start pt-5 px-4", children: /* @__PURE__ */ jsx("div", { ref: containerRef, className: "bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative z-[1001]", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            autoFocus: true,
            type: "search",
            value: query,
            onChange: onInputChange,
            placeholder: "Search products...",
            className: "flex-grow border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600",
            autoComplete: "off"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "p-3 text-purple-600 hover:bg-purple-100 rounded-full",
            "aria-label": "Submit search",
            children: /* @__PURE__ */ jsx(Search, { size: 20 })
          }
        )
      ] }),
      suggestions.length > 0 && /* @__PURE__ */ jsx(
        "ul",
        {
          className: "absolute top-full left-0 right-0 mt-2 max-h-60 overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-300",
          role: "listbox",
          children: suggestions.map((product) => /* @__PURE__ */ jsx(
            "li",
            {
              className: "cursor-pointer px-4 py-2 hover:bg-indigo-100 text-gray-800",
              role: "option",
              tabIndex: -1,
              children: /* @__PURE__ */ jsxs(
                Link,
                {
                  href: `/shop?keyword=${encodeURIComponent(product.title)}`,
                  onClick: () => setSuggestions([]),
                  className: "flex gap-3 items-center",
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: product.image || "/placeholder.jpg",
                        alt: product.title,
                        className: "w-12 h-12 object-cover rounded"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "font-semibold", children: product.title }),
                      /* @__PURE__ */ jsx("div", { dangerouslySetInnerHTML: { __html: product.description }, className: "line-clamp-2" }),
                      /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600", children: /* @__PURE__ */ jsx(CurrencyFormatter, { amount: product.price, currency: "AUD" }) })
                    ] })
                  ]
                }
              )
            },
            product.id
          ))
        }
      )
    ] }) }) })
  ] });
}
function Department() {
  const { dpts, data } = usePage().props;
  const scrollRef = useRef(null);
  const scrollLeft = () => {
    var _a;
    (_a = scrollRef.current) == null ? void 0 : _a.scrollBy({ left: -200, behavior: "smooth" });
  };
  const scrollRight = () => {
    var _a;
    (_a = scrollRef.current) == null ? void 0 : _a.scrollBy({ left: 200, behavior: "smooth" });
  };
  const getUniqueDepartment = (data2, property) => {
    const values = (data2 == null ? void 0 : data2.map((item) => item[property])) ?? [];
    return Array.from(new Set(values));
  };
  getUniqueDepartment(data, "department");
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full space-x-10", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: scrollLeft,
        className: "absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-40 text-white font-bold z-10",
        children: "<"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(
      "ul",
      {
        ref: scrollRef,
        className: "flex overflow-x-auto whitespace-nowrap gap-6 py-4 px-8 items-start scrollbar-hide",
        style: { scrollBehavior: "smooth" },
        children: dpts.map((department) => {
          if (department.productsCount === 0) return null;
          const isActive = route().current("product.byDepartment", department.slug);
          const imageUrl = department.image ? `/storage/${department.image}` : "/images/department-placeholder.png";
          return /* @__PURE__ */ jsxs(
            "li",
            {
              className: "list-none flex flex-col items-center justify-start space-y-1 min-w-[100px]",
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: imageUrl,
                    alt: department.name,
                    className: "w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-lg transition-transform duration-300 hover:scale-105"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: route("product.byDepartment", department.slug),
                    preserveScroll: true,
                    preserveState: true,
                    className: `text-center px-3 py-1 rounded-full text-xs font-medium transition ${isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"}`,
                    children: department.name
                  }
                )
              ]
            },
            department.id
          );
        })
      }
    ) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: scrollRight,
        className: "absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-60 text-white font-bold z-10",
        children: ">"
      }
    )
  ] });
}
function Navbar() {
  const {
    departments,
    auth,
    keyword,
    categoryGroups = [],
    productGroups = []
  } = usePage().props;
  const { user } = auth;
  const [loginOpen, setLoginOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "relative z-[500] top-0  bg-white shadow", children: [
    /* @__PURE__ */ jsxs(
      Dialog,
      {
        open,
        onClose: setOpen,
        className: "relative z-[600] lg:hidden",
        children: [
          /* @__PURE__ */ jsx(
            DialogBackdrop,
            {
              transition: true,
              className: "fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[400] flex", children: /* @__PURE__ */ jsxs(
            DialogPanel,
            {
              transition: true,
              className: "relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full",
              children: [
                /* @__PURE__ */ jsx("div", { className: "flex px-4 pt-5 pb-2", children: /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setOpen(false),
                    className: "relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400",
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "absolute -inset-0.5" }),
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close menu" }),
                      /* @__PURE__ */ jsx(XMarkIcon, { "aria-hidden": "true", className: "size-6" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200 px-6 pb-6 pt-2 text-left space-y-3", children: !user ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setLoginOpen(true),
                      className: "w-full rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                      children: "Sign in"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("register"),
                      className: "block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded",
                      children: "Create account"
                    }
                  )
                ] }) : /* @__PURE__ */ jsx(Disclosure, { children: ({ open: open2 }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs(Disclosure.Button, { className: "w-full text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center", children: [
                    /* @__PURE__ */ jsxs("span", { className: "flex items-center space-x-3 px-2 py-1 rounded  transition-colors duration-200 cursor-pointer", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: user.avatar,
                          alt: "User Avatar",
                          className: "w-8 h-8 rounded-full object-cover"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { className: "text-xl font-medium", children: "Account" })
                    ] }),
                    /* @__PURE__ */ jsx(
                      ChevronDownIcon,
                      {
                        className: `h-5 w-5 transition-transform duration-200 ${open2 ? "rotate-180" : ""}`
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(Disclosure.Panel, { className: " bg-slate-100 px-4 pt-2 pb-4 space-y-2 text-sm text-gray-700", children: [
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("profile.edit"),
                        className: "ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded",
                        children: "Profile"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("bookings.history"),
                        className: "ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded",
                        children: "Bookings"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("orders.history"),
                        className: "ml-2 block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded",
                        children: "Order History"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Link,
                      {
                        href: route("logout"),
                        method: "post",
                        as: "button",
                        className: "ml-2 block text-lg text-gray-700 hover:bg-red-700 hover:text-white transition-colors duration-200 ease-in-out px-2 py-1 rounded",
                        children: "Logout"
                      }
                    )
                  ] })
                ] }) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col divide-y divide-gray-300 px-4 mt-6 mb-6 w-full", children: [
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("shop.search"),
                      className: "block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded",
                      children: "All Products"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Disclosure, { children: ({ open: open2 }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs(Disclosure.Button, { className: "w-full text-left flex justify-between items-center text-lg font-medium text-gray-900 px-4 py-3", children: [
                      /* @__PURE__ */ jsx("span", { children: "All Categories" }),
                      /* @__PURE__ */ jsx(
                        ChevronDownIcon,
                        {
                          className: `h-5 w-5 transition-transform duration-200 ${open2 ? "rotate-180" : ""}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(Disclosure.Panel, { className: "p-0", children: /* @__PURE__ */ jsx(CategoriesDropdown, { departments }) })
                  ] }) }) }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Disclosure, { children: ({ open: open2 }) => /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs(Disclosure.Button, { className: "w-full text-left flex justify-between items-center text-lg font-medium text-gray-900 px-4 py-3", children: [
                      /* @__PURE__ */ jsx("span", { children: "Deals" }),
                      /* @__PURE__ */ jsx(
                        ChevronDownIcon,
                        {
                          className: `h-5 w-5 transition-transform duration-200 ${open2 ? "rotate-180" : ""}`
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(Disclosure.Panel, { className: "pt-1 mb-14", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col divide-y divide-gray-300", children: [
                      categoryGroups.filter((g) => g.active).map((group) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          className: "text-left w-full px-4 py-4 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors",
                          onClick: () => {
                            router.visit(
                              `/?scrollToCategoryId=${group.id}`,
                              {
                                preserveScroll: true,
                                preserveState: true
                              }
                            );
                            setDealsOpen(false);
                            setOpen(false);
                          },
                          children: /* @__PURE__ */ jsx("span", { className: "text-left w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors", children: group.name })
                        },
                        group.id
                      )),
                      productGroups.map((group) => /* @__PURE__ */ jsxs(
                        "button",
                        {
                          className: "text-left w-full px-4 py-4 text-gray-700 hover:bg-purple-700 hover:text-white transition-colors",
                          onClick: () => {
                            router.visit(
                              route("productGroup.show", {
                                productGroup: group.slug
                              }),
                              {
                                preserveScroll: true,
                                preserveState: true
                              }
                            );
                            setDealsOpen(false);
                            setOpen(false);
                          },
                          children: [
                            " ",
                            /* @__PURE__ */ jsx("span", { className: "text-left w-full px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-700 transition-colors", children: group.name })
                          ]
                        },
                        group.id
                      ))
                    ] }) })
                  ] }) }) }),
                  /* @__PURE__ */ jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("contact.index"),
                      className: "block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded",
                      children: "Get Quotes"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("about"),
                      className: "block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded",
                      children: "About"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "pb-4", children: /* @__PURE__ */ jsx(
                    Link,
                    {
                      href: route("contact.index"),
                      className: "block text-lg text-gray-700 hover:bg-purple-700 hover:text-white transition-colors duration-200 ease-in-out px-4 py-1 rounded",
                      children: "Contact Us"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-auto border-t border-gray-200 px-4 py-6", children: /* @__PURE__ */ jsxs("a", { href: "#", className: "-m-2 flex items-center p-2", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      alt: "Flag",
                      src: "https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg",
                      className: "block h-auto w-5 shrink-0"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "ml-3 block text-base font-medium text-gray-900", children: "CAD" }),
                  /* @__PURE__ */ jsx("span", { className: "sr-only", children: ", change currency" })
                ] }) })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("header", { className: "relative bg-white", children: [
      /* @__PURE__ */ jsx("p", { className: "flex h-10 items-center justify-center bg-purple-900 px-4 text-sm font-medium text-white sm:px-6 lg:px-8", children: "Get free delivery on orders over $100" }),
      /* @__PURE__ */ jsxs(
        "nav",
        {
          "aria-label": "Top",
          className: "sticky lg:static mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center", children: [
              /* @__PURE__ */ jsx("div", { className: " flex lg:ml-0 items-center", children: /* @__PURE__ */ jsxs("a", { href: "/", children: [
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Dhurva Logo" }),
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    alt: "Dhurva Logo",
                    src: "/storage/a095427b2bbfa1e4d3596bd7c1adb293/Dhurva%20logo-01.png",
                    className: "h-[100px] xs:p-5  md:h-20 lg:h-24 w-auto object-contain lg:p-4"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex gap-10", children: [
                /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center", children: /* @__PURE__ */ jsx(Link, { href: route("shop.search"), children: "All Products" }) }),
                /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center", children: /* @__PURE__ */ jsx(Link, { href: route("shop.search"), children: "Get Quotes" }) }),
                /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center", children: /* @__PURE__ */ jsx(Link, { href: route("about"), children: "About" }) }),
                /* @__PURE__ */ jsx("div", { className: "ml-auto flex items-center", children: /* @__PURE__ */ jsx(Link, { href: route("contact.index"), children: "Contact Us" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "flex z-[70]   px-4 sm:px-6 lg:px-0 lg:ml-6", children: /* @__PURE__ */ jsx(SearchBar, { keyword }) }),
                /* @__PURE__ */ jsx("div", { className: " ml-2 sm:ml-4 z-[60] flow-root", children: /* @__PURE__ */ jsx(MiniCartDropdown, {}) }),
                user ? /* @__PURE__ */ jsxs("div", { className: "relative dropdown dropdown-end", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      tabIndex: 0,
                      "aria-haspopup": "true",
                      className: "hidden md:inline-flex relative w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400",
                      "aria-label": "User menu",
                      children: /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: user.avatar,
                          alt: user.name || "User",
                          className: "rounded-full w-10 h-10 object-cover"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "ul",
                    {
                      tabIndex: 0,
                      className: "dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-3 w-52 ring-1 ring-black ring-opacity-5 focus:outline-none",
                      "aria-label": "User dropdown menu",
                      children: [
                        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: route("profile.edit"),
                            className: "hover:bg-indigo-50 px-3 py-2 rounded",
                            children: "Profile"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: route("orders.history"),
                            as: "button",
                            className: "hover:bg-indigo-50 px-3 py-2 rounded",
                            children: "Orders"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: route("bookings.history"),
                            as: "button",
                            className: "hover:bg-indigo-50 px-3 py-2 rounded",
                            children: "Bookings"
                          }
                        ) }),
                        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: route("logout"),
                            method: "post",
                            as: "button",
                            className: "hover:bg-indigo-50 px-3 py-2 rounded",
                            children: "Logout"
                          }
                        ) })
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "relative dropdown dropdown-end hidden lg:flex ml-4",
                      ref: dropdownRef,
                      children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => setDropdownOpen((prev) => !prev),
                            className: "flex items-center justify-center w-10 h-10 rounded-full border-2 border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400",
                            "aria-haspopup": "true",
                            "aria-expanded": dropdownOpen,
                            children: /* @__PURE__ */ jsx(UserIcon, { className: "w-6 h-6 text-indigo-500" })
                          }
                        ),
                        dropdownOpen && /* @__PURE__ */ jsxs(
                          "ul",
                          {
                            className: "dropdown-content menu menu-sm bg-white rounded-lg shadow-lg p-2 mt-12 w-52 ring-1 ring-black ring-opacity-5 z-50",
                            "aria-label": "Guest user dropdown",
                            children: [
                              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                                "button",
                                {
                                  onClick: () => {
                                    setDropdownOpen(false);
                                    setLoginOpen(true);
                                  },
                                  className: "w-full text-left hover:bg-indigo-50 px-3 py-2 rounded text-gray-700",
                                  children: "Sign in"
                                }
                              ) }),
                              /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                                Link,
                                {
                                  href: route("register"),
                                  className: "hover:bg-indigo-50 px-3 py-2 rounded text-gray-700",
                                  onClick: () => setDropdownOpen(false),
                                  children: "Create account"
                                }
                              ) })
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    LoginModal,
                    {
                      isOpen: loginOpen,
                      onClose: () => setLoginOpen(false),
                      canResetPassword: true
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setOpen(true),
                  className: "relative rounded-md bg-white p-2 text-gray-400 lg:hidden",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute -inset-0.5" }),
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                    /* @__PURE__ */ jsx(Bars3Icon, { "aria-hidden": "true", className: "size-6" })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "sticky top-4 mt-5 w-full lg:static", children: /* @__PURE__ */ jsx(Department, {}) })
          ]
        }
      )
    ] })
  ] });
}
function AuthenticatedLayout({
  header,
  children
}) {
  const props = usePage().props;
  props.auth.user;
  const [successMessages, setSuccessMessages] = useState([]);
  const timeoutRefs = useRef(
    {}
  );
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  useEffect(() => {
    if (props.success.message) {
      const newMessage = {
        ...props.success,
        id: props.success.time
      };
      setSuccessMessages((prevMessages) => [newMessage, ...prevMessages]);
      const timeoutId = setTimeout(() => {
        setSuccessMessages(
          (prevMessages) => prevMessages.filter((msg) => msg.id != newMessage.id)
        );
        delete timeoutRefs.current[newMessage.id];
      }, 5e3);
      timeoutRefs.current[newMessage.id] = timeoutId;
    }
  }, [props.success]);
  return /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen bg-gray-100 z-[200]", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    props.error && /* @__PURE__ */ jsx("div", { className: "container px-8 mt-8 mx-auto", children: /* @__PURE__ */ jsx("div", { className: "alert alert-error", children: props.error }) }),
    successMessages.length > 0 && /* @__PURE__ */ jsx("div", { className: "toast toast-top toast-end z-[1000] mt-16", children: successMessages.map((msg) => /* @__PURE__ */ jsx("div", { className: "alert laert-success", children: /* @__PURE__ */ jsx("span", { children: msg.message }) }, msg.id)) }),
    /* @__PURE__ */ jsx("main", { children }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  AuthenticatedLayout as A,
  CurrencyFormatter as C
};
