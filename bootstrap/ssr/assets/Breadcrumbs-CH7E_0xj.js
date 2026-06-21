import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
const Breadcrumbs = ({ items }) => {
  return /* @__PURE__ */ jsx("nav", { className: "px-4 sm:px-0", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsx(
    "ol",
    {
      role: "list",
      className: "flex flex-wrap items-center gap-x-1 gap-y-1 sm:gap-x-2",
      children: items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center whitespace-nowrap", children: [
        index !== 0 && /* @__PURE__ */ jsx("span", { className: "text-gray-400 mx-2 select-none", children: "/" }),
        item.href && !item.current ? /* @__PURE__ */ jsx(
          Link,
          {
            href: item.href,
            className: "rounded-md px-1 py-1 text-sm font-medium text-purple-600 focus:text-gray-900 focus:shadow hover:text-gray-800",
            children: item.label
          }
        ) : /* @__PURE__ */ jsx(
          "span",
          {
            "aria-current": item.current ? "page" : void 0,
            className: "rounded-md px-1 py-1 text-sm font-bold text-gray-900",
            children: item.label
          }
        )
      ] }, index))
    }
  ) });
};
export {
  Breadcrumbs as B
};
