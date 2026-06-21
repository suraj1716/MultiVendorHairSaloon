import { jsx, jsxs } from "react/jsx-runtime";
import { usePage, Link } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
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
function OrdersHistory() {
  var _a;
  const { orders } = usePage().props;
  return /* @__PURE__ */ jsx(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Order History" }),
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto p-4", children: ((_a = orders == null ? void 0 : orders.data) == null ? void 0 : _a.length) === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "You have no orders yet." }) : orders.data.map(
        (order) => order.vendor.vendor_type === "ecommerce" && /* @__PURE__ */ jsxs("div", { className: "bg-white shadow rounded-md mb-6 p-4 overflow-x-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 border-b border-gray-200 pb-1 text-sm text-gray-700", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Order #" }),
              order.id,
              " | ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Status:" }),
              " ",
              /* @__PURE__ */ jsx("span", { className: "capitalize", children: order.status }),
              " |",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Date:" }),
              " ",
              new Date(order.created_at).toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "font-semibold text-gray-900", children: [
              "$",
              Number(order.total_price).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3 text-sm text-gray-600", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Vendor:" }),
              " ",
              order.vendor.store_name
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Store:" }),
              " ",
              order.vendor.store_name
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Address:" }),
              " ",
              order.vendor.store_address
            ] })
          ] }),
          /* @__PURE__ */ jsxs("table", { className: "w-full text-sm border-collapse table-auto", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100", children: [
              /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Product" }),
              /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Product Variation" }),
              /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Attach" }),
              /* @__PURE__ */ jsx("th", { className: "border p-2 text-left w-12", children: "Qty" }),
              /* @__PURE__ */ jsx("th", { className: "border p-2 text-left w-24", children: "Price" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: order.orderItems.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
              /* @__PURE__ */ jsxs("td", { className: "border p-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.product.image || "/images/placeholder.png",
                    alt: item.product.title,
                    className: "w-10 h-10 object-cover rounded"
                  }
                ),
                /* @__PURE__ */ jsx(
                  Link,
                  {
                    href: `/product/${item.product.id}`,
                    className: "text-gray-800 hover:underline truncate max-w-xs",
                    children: item.product.title
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("td", { className: "border p-2", children: item.variation_summary && item.variation_summary.length > 0 ? item.variation_summary.map((v, i) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                  v.type,
                  ":"
                ] }),
                " ",
                v.option
              ] }, i)) : "—" }),
              /* @__PURE__ */ jsx("td", { className: "border p-2", children: item.attachment_path ? /\.(jpe?g|png|gif|bmp|webp)(\?.*)?$/i.test(item.attachment_path) ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: `/storage/${item.attachment_path}`,
                  alt: item.attachment_name || "Attachment preview",
                  className: "w-16 h-16 object-cover rounded border",
                  onError: (e) => {
                    e.currentTarget.style.display = "none";
                  }
                }
              ) : /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/storage/${item.attachment_path}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-blue-600 hover:underline",
                  children: item.attachment_name || "Download Attachment"
                }
              ) : /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "—" }) }),
              /* @__PURE__ */ jsx("td", { className: "border p-2", children: item.quantity }),
              /* @__PURE__ */ jsxs("td", { className: "border p-2", children: [
                "$",
                Number(item.price).toFixed(2)
              ] })
            ] }, item.id)) })
          ] })
        ] }, order.id)
      ) })
    }
  );
}
export {
  OrdersHistory as default
};
