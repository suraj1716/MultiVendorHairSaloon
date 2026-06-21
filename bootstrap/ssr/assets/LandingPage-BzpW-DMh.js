import { jsxs, jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
function LandingPage() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 min-h-screen font-sans", children: [
    /* @__PURE__ */ jsx("section", { className: "relative bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.8 },
          className: "flex-1",
          children: [
            /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-6xl font-bold leading-tight mb-4", children: "\\              High-Quality Printing for Every Purpose" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg mb-6 max-w-md", children: "Bring your ideas to life with premium prints, fast turnaround, and unbeatable service." }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: "/shop",
                className: "inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-100 transition",
                children: "Shop Now"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.8 },
          className: "flex-1",
          children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/images/printing-hero.png",
              alt: "Printing press hero",
              className: "rounded-xl shadow-xl w-full"
            }
          )
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-10 text-gray-800", children: "Our Services" }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-10", children: [
        { title: "Business Cards", image: "/images/cards.jpg" },
        { title: "Flyers & Brochures", image: "/images/flyers.jpg" },
        { title: "Posters & Banners", image: "/images/posters.jpg" },
        { title: "Booklets", image: "/images/booklets.jpg" },
        { title: "Custom Apparel", image: "/images/apparel.jpg" },
        { title: "Stickers & Labels", image: "/images/stickers.jpg" }
      ].map((service, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          whileHover: { scale: 1.05 },
          className: "bg-white border rounded-lg shadow-lg overflow-hidden",
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: service.image,
                alt: service.title,
                className: "h-52 w-full object-cover"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800", children: service.title }) })
          ]
        },
        idx
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-r from-yellow-100 to-pink-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-10", children: "What Our Clients Say" }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: [
        { name: "Emily R.", text: "Amazing print quality and service! My flyers turned out perfect." },
        { name: "Jason M.", text: "Fast turnaround and great customer support. Highly recommend!" },
        { name: "Sarah L.", text: "We loved the custom apparel for our team event. Thanks!" }
      ].map((testimonial, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: idx * 0.2 },
          viewport: { once: true },
          className: "bg-white p-6 rounded-xl shadow-md",
          children: [
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700 italic", children: [
              '"',
              testimonial.text,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-4 font-semibold text-indigo-600", children: [
              "— ",
              testimonial.name
            ] })
          ]
        },
        idx
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-indigo-700 text-white text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        className: "max-w-3xl mx-auto px-4",
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-4", children: "Ready to Print Something Great?" }),
          /* @__PURE__ */ jsx("p", { className: "mb-6", children: "Let’s make your next print project your best yet. Start browsing today!" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/shop",
              className: "inline-block bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100",
              children: "Browse Products"
            }
          )
        ]
      }
    ) })
  ] });
}
export {
  LandingPage as default
};
