import { jsx, jsxs } from "react/jsx-runtime";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { P as ProductItem } from "./ProductItem-CcFS9y8F.js";
const ProductCarousel = ({
  products,
  title,
  wrapperClassName = "",
  sectionClassName = "bg-white rounded-lg  px-4 py-6 sm:px-6"
}) => {
  return /* @__PURE__ */ jsx("div", { className: `w-full ${wrapperClassName}`, children: /* @__PURE__ */ jsxs("div", { className: sectionClassName, children: [
    title && /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-5 ml-10", children: title }),
    products.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-20 text-gray-500", children: "No products found." }) : /* @__PURE__ */ jsx(
      Swiper,
      {
        modules: [Autoplay, Navigation],
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        navigation: true,
        loop: true,
        breakpoints: {
          320: { slidesPerView: 2, spaceBetween: 10 },
          375: { slidesPerView: 2.2, spaceBetween: 12 },
          480: { slidesPerView: 2.5, spaceBetween: 14 },
          640: { slidesPerView: 3, spaceBetween: 16 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 4.3, spaceBetween: 25 }
        },
        className: "w-full",
        children: products.map((product) => /* @__PURE__ */ jsx(SwiperSlide, { children: /* @__PURE__ */ jsx(ProductItem, { product }) }, product.id))
      }
    )
  ] }) });
};
export {
  ProductCarousel as P
};
