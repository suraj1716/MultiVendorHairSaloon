import { jsxs, jsx } from "react/jsx-runtime";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
import { B as Breadcrumbs } from "./Breadcrumbs-CH7E_0xj.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { Head } from "@inertiajs/react";
import "@inertiajs/core";
import "react-icons/fa";
import "react";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
function ProductGroupShow({
  productGroup,
  products
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: productGroup.name, current: true }
  ];
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: `Products - ${productGroup.name}` }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-100 py-6 px-4 lg:px-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbItems }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl font-bold text-gray-800 text-center", children: [
        productGroup.name,
        " Products"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "block lg:hidden w-full", children: Array.isArray(productGroup == null ? void 0 : productGroup.images) && productGroup.images.length > 2 && /* @__PURE__ */ jsx(
      "img",
      {
        src: `/storage/${productGroup.images[2]}`,
        alt: productGroup.name,
        className: "w-full h-auto object-cover"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:flex sticky top-5 w-full lg:w-1/4 bg-white  items-center justify-center", children: Array.isArray(productGroup == null ? void 0 : productGroup.images) && productGroup.images.length > 2 && /* @__PURE__ */ jsx(
        "img",
        {
          src: `/storage/${productGroup.images[1]}`,
          alt: productGroup.name,
          className: "h-full w-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsx("main", { className: "w-full lg:w-3/4", children: products.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10", children: products.data.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) }) })
    ] })
  ] });
}
export {
  ProductGroupShow as default
};
