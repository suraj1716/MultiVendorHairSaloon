import { jsxs, jsx } from "react/jsx-runtime";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
import { B as Breadcrumbs } from "./Breadcrumbs-CH7E_0xj.js";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { Head } from "@inertiajs/react";
import { useMemo } from "react";
import "@inertiajs/core";
import "react-icons/fa";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
function Show({
  category,
  department,
  products,
  categoryGroups
}) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    {
      label: category.department.name,
      href: route("product.byDepartment", category.department.slug)
    },
    { label: category.name, current: true }
  ];
  const randomActiveGroup = useMemo(() => {
    const activeGroups = categoryGroups.filter((group) => group.active);
    if (activeGroups.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * activeGroups.length);
    return activeGroups[randomIndex];
  }, [categoryGroups]);
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Shop" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-100 py-6 px-4 lg:px-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbItems }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-2xl lg:text-3xl font-bold text-gray-800 text-center", children: [
        "Shop Products ",
        category.name
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "block lg:hidden", children: [
      /* @__PURE__ */ jsx("aside", { className: "w-full lg:w-1/4 bg-white xs:h-auto h-[500px] lg:sticky top-4 self-start", children: randomActiveGroup && /* @__PURE__ */ jsx(
        "img",
        {
          src: `/storage/${randomActiveGroup.image}`,
          alt: randomActiveGroup.name,
          className: "w-full h-full object-cover"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:p-5 xs:mt-5 xs:grid-cols-2 lg:grid-cols-3 xs:gap-y-5 p-10", children: products.data.map((product) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "w-full lg:h-[400px]",
          children: /* @__PURE__ */ jsx(ProductItem, { product })
        },
        product.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: " container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "sticky top-5 w-full lg:w-1/4 bg-white h-[500px] flex items-center justify-center", children: categoryGroups.length > 0 && (() => {
        const randomIndex = Math.floor(
          Math.random() * categoryGroups.length
        );
        const randomGroup = categoryGroups[randomIndex];
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex flex-col items-center",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `/storage/${randomGroup.image}`,
                alt: randomGroup.name,
                className: "h-[450px] w-full object-cover rounded"
              }
            )
          },
          randomGroup.id
        );
      })() }),
      /* @__PURE__ */ jsx("main", { className: "w-full lg:w-3/4", children: products.data.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: products.data.map((product) => /* @__PURE__ */ jsx(ProductItem, { product }, product.id)) }) })
    ] }) })
  ] });
}
export {
  Show as default
};
