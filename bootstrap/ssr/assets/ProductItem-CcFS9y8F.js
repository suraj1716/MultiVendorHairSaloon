import { jsxs, jsx } from "react/jsx-runtime";
import { useForm, Link } from "@inertiajs/react";
import "@inertiajs/core";
import { C as CurrencyFormatter } from "./AuthenticatedLayout-BxONmVZd.js";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
const renderStars = (rating, iconSize, onRate) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let Icon;
    if (rating >= i) {
      Icon = FaStar;
    } else if (rating > i - 1 && rating < i) {
      Icon = FaStarHalfAlt;
    } else {
      Icon = FaRegStar;
    }
    stars.push(
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => onRate && onRate(i),
          className: `focus:outline-none ${onRate ? "cursor-pointer" : "cursor-default"}`,
          "aria-label": `Rate ${i} star${i > 1 ? "s" : ""}`,
          children: /* @__PURE__ */ jsx(Icon, { className: `text-yellow-400 ${iconSize}` })
        },
        i
      )
    );
  }
  return stars;
};
const ProductRating = ({
  rating,
  reviewsCount = 0,
  size = "md",
  onRate
}) => {
  const iconSize = size === "sm" ? "w-4 h-4 sm:w-6 sm:h-6" : "w-6 h-6";
  const spacing = size === "sm" ? "space-x-1" : "space-x-2";
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center ${spacing}`, children: [
    /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: renderStars(rating, iconSize, onRate) }),
    reviewsCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600", children: [
      "(",
      reviewsCount,
      ")"
    ] })
  ] });
};
function ProductItem({ product }) {
  var _a, _b, _c, _d, _e;
  useForm({
    product_id: product.id,
    quantity: 1
  });
  return /* @__PURE__ */ jsx("div", { className: "border-slate-100 border-2  w-[160px] sm:w-[180px] md:w-[200px] lg:w-[250px] xl:w-[230px] gap-5 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden  bg-white shadow hover:shadow-md transition-shadow duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx(Link, { href: route("product.show", product.slug), children: /* @__PURE__ */ jsx(
      "img",
      {
        className: `h-[130px] bg-slate-300 sm:h-[150px] md:h-[160px] lg:h-[180px] w-full  transition duration-300 transform hover:-translate-y-1 hover:scale-105 ${((_a = product.image) == null ? void 0 : _a.toLowerCase().endsWith(".png")) ? "object-contain" : "object-cover"}`,
        src: product.image,
        alt: product.title
      }
    ) }) }),
    product.highlight && /* @__PURE__ */ jsx(
      "span",
      {
        className: `
              absolute top-0 left-0 w-20 -translate-x-5 translate-y-1 -rotate-45
              text-center text-[12px] font-bold text-white
              px-2 py-1
              shadow-lg select-none
              ${product.highlight === "sale" ? "bg-red-600 animate-pulse" : product.highlight === "hot" ? "bg-orange-500 animate-pulse" : product.highlight === "trending" ? "bg-green-600 animate-pulse" : "bg-black"}
            `,
        children: product.highlight.charAt(0).toUpperCase() + product.highlight.slice(1)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 px-3 pb-3", children: [
      /* @__PURE__ */ jsx("h5", { className: "text-sm font-semibold tracking-tight text-slate-900 line-clamp-1", children: /* @__PURE__ */ jsx(Link, { href: route("product.show", product.slug), children: product.title }) }),
      /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-gray-600 line-clamp-2 mt-1", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route("vendor.profile", ((_b = product.user) == null ? void 0 : _b.store_name) ?? ""),
            className: "hover:underline",
            children: ((_c = product.user) == null ? void 0 : _c.name) ?? "Unknown Vendor"
          }
        ),
        " in ",
        /* @__PURE__ */ jsx(
          Link,
          {
            href: route(
              "product.byDepartment",
              ((_d = product.department) == null ? void 0 : _d.slug) ?? ""
            ),
            className: "hover:underline",
            children: ((_e = product.department) == null ? void 0 : _e.name) ?? "Unknown Department"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 mb-3 text-[10px] sm:text-xs", children: /* @__PURE__ */ jsx(
        ProductRating,
        {
          rating: product.average_rating ?? 0,
          reviewsCount: product.reviews_count ?? 0,
          size: "sm"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between gap-2", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row sm:flex-row items-start sm:items-center space-y-0.5 sm:space-y-0", children: [
        /* @__PURE__ */ jsx("span", { className: "xs:text-xs lg:text-sm font-light text-slate-400", children: "Starting at" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm xs:ml-3 font-bold text-slate-900", children: /* @__PURE__ */ jsx(
          CurrencyFormatter,
          {
            amount: product.price ?? product.price,
            currency: "AUD"
          }
        ) })
      ] }) })
    ] })
  ] }) });
}
export {
  ProductItem as P,
  ProductRating as a
};
