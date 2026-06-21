import { jsxs, jsx } from "react/jsx-runtime";
import { Head, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout, C as CurrencyFormatter } from "./AuthenticatedLayout-BxONmVZd.js";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import "react";
import "@headlessui/react";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
function Success({ orders }) {
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Payment was Completed" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto min-h-screen flex flex-col justify-center py-8 px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 items-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "text-6xl text-emerald-600", children: /* @__PURE__ */ jsx(CheckCircleIcon, { className: "size-24" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-semibold", children: "Payment was Completed" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-6 text-lg text-center", children: "Thanks for your purchase. Your payment was successful." }),
      orders.map((order) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-3xl mb-4 font-bold", children: "Order Summary" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2 font-bold", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: "Seller" }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { href: "#", className: "hover:underline", children: order.vendor.store_name }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: "Order Number" }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(Link, { href: "#", className: "hover:underline", children: [
                "#",
                order.id
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Items" }),
              /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: order.orderItems.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: "Total" }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(CurrencyFormatter, { amount: order.total_price, currency: "AUD" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx(Link, { href: "#", className: "btn btn-primary", children: "View Order Details" }),
              /* @__PURE__ */ jsx(Link, { href: route("dashboard"), className: "btn", children: "Back to home" })
            ] })
          ]
        },
        order.id
      ))
    ] })
  ] });
}
export {
  Success as default
};
