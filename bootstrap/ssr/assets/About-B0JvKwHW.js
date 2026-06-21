import { jsx, jsxs } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import "react";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "@inertiajs/react";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
const About = () => {
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-800", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative bg-blue-50 py-20 px-6 md:px-12 text-center overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto relative z-10", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-extrabold text-blue-900 mb-4", children: "About Us" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-600", children: "Empowering ideas through technology, design, and innovation." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 z-0 opacity-20 pointer-events-none", children: /* @__PURE__ */ jsx("svg", { className: "w-full h-full", viewBox: "0 0 800 600", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx("g", { transform: "translate(400 300)", children: /* @__PURE__ */ jsx("path", { d: "M152.2,-178.3C191.3,-139.1,207.3,-69.5,196.2,-10.1C185.2,49.3,147.2,98.7,108.1,146.5C69,194.3,28.8,240.6,-23.3,256.6C-75.3,272.6,-138.3,258.4,-179.8,213.2C-221.2,168,-241.1,91.9,-224.7,27.2C-208.3,-37.5,-155.6,-91.8,-109.6,-136.3C-63.5,-180.9,-31.7,-215.7,24.4,-232.2C80.5,-248.7,161,-246.8,152.2,-178.3Z", fill: "#3b82f6" }) }) }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-16 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-blue-900 mb-4", children: "Our Mission" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-700", children: "Our mission is to deliver innovative and reliable technology solutions that help our clients grow and succeed. We believe in integrity, creativity, and collaboration at every step." })
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://source.unsplash.com/600x400/?technology,mission",
          alt: "Our Mission",
          className: "w-full rounded-lg shadow-md object-cover"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "py-16 px-6 md:px-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "md:order-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-blue-900 mb-4", children: "Our Vision" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-700", children: "We envision a world where technology connects and empowers people to create a better future. Through sustainable solutions, we aim to leave a positive mark on every industry we touch." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "md:order-1", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "https://source.unsplash.com/600x400/?vision,future",
          alt: "Our Vision",
          className: "w-full rounded-lg shadow-md object-cover"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-gray-100 py-16 px-6 md:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-center text-blue-900 mb-12", children: "Meet the Team" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10", children: [
        { name: "Alice Johnson", role: "CEO", img: "https://i.pravatar.cc/150?img=32" },
        { name: "Mark Lee", role: "CTO", img: "https://i.pravatar.cc/150?img=45" },
        { name: "Sarah Kim", role: "Design Lead", img: "https://i.pravatar.cc/150?img=12" }
      ].map((member, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md text-center", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: member.img,
            alt: member.name,
            className: "w-24 h-24 mx-auto rounded-full mb-4 object-cover"
          }
        ),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-800", children: member.name }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: member.role })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-blue-600 text-white py-16 px-6 text-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold mb-4", children: "Want to collaborate?" }),
      /* @__PURE__ */ jsx("p", { className: "mb-6 text-lg", children: "Reach out today and let’s build something extraordinary together." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/contact",
          className: "inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100 transition",
          children: "Contact Us"
        }
      )
    ] }) })
  ] }) });
};
export {
  About as default
};
