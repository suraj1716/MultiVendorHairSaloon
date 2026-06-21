import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { useEffect } from "react";
import AOS from "aos";
import { P as ProductCarousel } from "./ProductCarousel-DIhMp4Yv.js";
import { router, usePage, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FireIcon, ArrowTrendingUpIcon, TagIcon, SparklesIcon, StarIcon, ShoppingCartIcon, Squares2X2Icon, GiftIcon, TicketIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
import "swiper/react";
import "swiper/modules";
import "./ProductItem-CcFS9y8F.js";
import "@inertiajs/core";
import "react-icons/fa";
function HeroBanner({
  title,
  subtitle,
  image_path,
  button_text = "Explore",
  button_link = "/shop"
}) {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: "\n    min-h-screen/2 w-full\n    bg-gradient-to-r from-[#521f48] to-[#a70797]\n    text-white font-montserrat\n    flex flex-col md:flex-row items-center justify-between\n    overflow-hidden\n    px-4  md:px-0 md:py-0\n  ",
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "w-full md:w-1/2 z-20 px-6 py-10 md:px-20",
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.8 },
            children: [
              /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6", children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-white/80 text-lg md:text-xl leading-relaxed max-w-xl mb-8", children: subtitle }),
              /* @__PURE__ */ jsx(
                motion.button,
                {
                  onClick: () => router.visit(button_link),
                  className: "bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-slate-200 transition duration-300",
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: 0.4, duration: 0.6 },
                  children: button_text
                }
              )
            ]
          }
        ),
        image_path && /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "w-full md:w-1/2 h-full z-10 flex justify-center md:justify-end",
            initial: { opacity: 0, x: 50 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.8 },
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: image_path,
                alt: title,
                className: "w-full h-full object-cover"
              }
            )
          }
        )
      ]
    }
  );
}
const iconPool = [
  FireIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  GiftIcon,
  TicketIcon,
  ShoppingBagIcon
];
const getIconByIndex = (index) => {
  const Icon = iconPool[index % iconPool.length];
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-orange-500"
  ];
  return /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 align-middle ${colors[index % colors.length]}` });
};
function Home({
  products,
  categoryGroups,
  productGroups,
  allproducts,
  hero
  // <-- Add hero to the props
}) {
  const { props, url } = usePage();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
    setTimeout(() => {
      document.querySelectorAll(".aos-init").forEach((el) => {
        el.classList.remove("opacity-0");
      });
    }, 100);
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scrollToCategoryId = params.get("scrollToCategoryId");
    if (scrollToCategoryId) {
      const el = document.getElementById(
        `category-group-${scrollToCategoryId}`
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [url]);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToProductId = urlParams.get("scrollToProductId");
    if (scrollToProductId) {
      const el = document.getElementById(`product-group-${scrollToProductId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
  console.log("hero", hero);
  return /* @__PURE__ */ jsx("div", { className: "overflow-x-hidden font-montserrat", children: /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx("div", { className: "z-[400]", children: /* @__PURE__ */ jsx(
      HeroBanner,
      {
        title: hero == null ? void 0 : hero.title,
        subtitle: hero == null ? void 0 : hero.subtitle,
        image_path: (hero == null ? void 0 : hero.image_path) ? `/storage/${hero.image_path}` : "/fallback-image.jpg",
        button_text: hero == null ? void 0 : hero.button_text,
        button_link: hero == null ? void 0 : hero.button_link
      }
    ) }),
    /* @__PURE__ */ jsx("section", { className: "w-full", children: productGroups.map((group, index) => {
      var _a, _b;
      const products2 = Array.isArray((_a = group.products) == null ? void 0 : _a.data) ? group.products.data : [];
      const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";
      return /* @__PURE__ */ jsx(
        "div",
        {
          id: `product-group-${group.id}`,
          className: `${bgColor} w-full py-10`,
          children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                getIconByIndex(index),
                " ",
                /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: group.name })
              ] }),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("productGroup.show", {
                    productGroup: group.slug
                  }),
                  className: "text-sm text-blue-600 hover:underline font-medium",
                  children: "Show all products →"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              ProductCarousel,
              {
                title: "",
                products: products2,
                wrapperClassName: "scroll-mt-20",
                sectionClassName: "px-0 py-0"
              }
            ),
            ((_b = group.images) == null ? void 0 : _b[0]) && /* @__PURE__ */ jsx("div", { className: "w-full  mt-10", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: `/storage/${group.images[0]}`,
                alt: group.name,
                className: "w-full rounded-2xl lg:h-[350px] xs:object-cover xs:h-42 object-cover  shadow-sm"
              }
            ) })
          ] })
        },
        group.id
      );
    }) }),
    /* @__PURE__ */ jsx("section", { className: "w-full ", children: categoryGroups.map((group, index) => {
      const bgColor = index % 2 === 0 ? "bg-gray-100" : "bg-white";
      return /* @__PURE__ */ jsx(
        "div",
        {
          id: `category-group-${group.id}`,
          className: `${bgColor} w-full py-12`,
          children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-10 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              getIconByIndex(index + 3),
              " ",
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-gray-800 leading-snug", children: group.name })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 ", children: group.categories.map((category) => /* @__PURE__ */ jsx(
              "a",
              {
                href: route("category.show", category.id),
                className: "block overflow-hidden transition",
                children: /* @__PURE__ */ jsxs("div", { className: "relative aspect-square w-full bg-slate-300 border-2 overflow-hidden", children: [
                  category.image && /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: `/storage/${category.image}`,
                      alt: category.name,
                      className: "w-full h-full object-cover opacity-70"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40" }),
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-semibold text-lg text-center px-2", children: category.name }) })
                ] })
              },
              category.id
            )) })
          ] })
        },
        group.id
      );
    }) }),
    /* @__PURE__ */ jsxs("section", { className: "w-full bg-gray-100 relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "hidden md:flex justify-between items-center  w-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            getIconByIndex(6),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800 leading-snug", children: "Products" })
          ] }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/shop",
              className: "text-sm text-indigo-600 hover:underline font-medium whitespace-nowrap",
              children: "See all products →"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "md:hidden flex justify-between items-center px-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            getIconByIndex(6),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-800  leading-snug", children: "Products" })
          ] }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/shop",
              className: "text-sm text-indigo-600 hover:underline font-medium whitespace-nowrap",
              children: "See all products →"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "relative z-0 w-full overflow-x-hidden px-5",
          style: {
            marginLeft: "calc(-50vw + 50%)",
            marginRight: "calc(-50vw + 50%)"
          },
          children: /* @__PURE__ */ jsx(
            ProductCarousel,
            {
              products: allproducts.data,
              sectionClassName: "bg-gray-100 mb-20"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "w-full bg-gray-50 text-gray-600", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12", children: /* @__PURE__ */ jsx("h2", { className: "text-center text-3xl font-montserrat text-gray-800 mb-8 leading-snug", children: "Blog" }) }) })
  ] }) });
}
export {
  Home as default,
  getIconByIndex
};
