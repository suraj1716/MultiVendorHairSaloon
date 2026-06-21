import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { a as ProductRating } from "./ProductItem-CcFS9y8F.js";
import { useForm, usePage, router, Head, Link } from "@inertiajs/react";
import { P as ProductCarousel } from "./ProductCarousel-DIhMp4Yv.js";
import { useState, useMemo, useEffect } from "react";
import { B as Breadcrumbs } from "./Breadcrumbs-CH7E_0xj.js";
import { A as AuthenticatedLayout, C as CurrencyFormatter } from "./AuthenticatedLayout-BxONmVZd.js";
import parse from "html-react-parser";
import "@inertiajs/core";
import "swiper/react";
import "swiper/modules";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
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
const AdvanceProductRating = ({
  rating,
  reviewsCount = 0,
  size = "md",
  onRate,
  ratingBreakdown,
  productId,
  reviews = []
}) => {
  var _a;
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  const spacing = size === "sm" ? "space-x-1" : "space-x-2";
  const { data, setData, post, processing, errors, reset } = useForm({
    rating: 0,
    comment: "",
    comment_title: ""
    // ← added
  });
  const maxCount = Math.max(...Object.values(ratingBreakdown || {}), 1);
  const { auth } = usePage().props;
  const authUserId = ((_a = auth == null ? void 0 : auth.user) == null ? void 0 : _a.id) ?? null;
  const alreadyReviewed = authUserId !== null && reviews.some((review) => review.userId === authUserId);
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("reviews.store", productId), {
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-w-md", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center ${spacing} mb-2`, children: [
      renderStars(rating, iconSize, onRate),
      /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-gray-500 dark:text-gray-400", children: [
        rating.toFixed(2),
        " out of 5"
      ] })
    ] }),
    reviewsCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400 mb-4", children: [
      reviewsCount.toLocaleString(),
      " global ratings"
    ] }),
    ratingBreakdown && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [5, 4, 3, 2, 1].map((star) => {
      const starKey = star;
      const count = ratingBreakdown[starKey];
      const widthPercent = count / maxCount * 100;
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            className: "text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline w-12 text-left",
            onClick: () => onRate && onRate(star),
            "aria-label": `Rate ${star} star${star > 1 ? "s" : ""}`,
            children: [
              star,
              " star"
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "w-2/4 h-5 mx-4 bg-gray-200 rounded-sm dark:bg-gray-700", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-5 bg-yellow-300 rounded-sm",
            style: { width: `${widthPercent}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: count })
      ] }, star);
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: alreadyReviewed ? /* @__PURE__ */ jsx("p", { className: "text-green-700 font-medium", children: "You have already submitted a review for this product." }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Your Rating" }),
        /* @__PURE__ */ jsx(
          ProductRating,
          {
            rating: data.rating,
            size: "md",
            onRate: (rating2) => setData("rating", rating2)
          }
        ),
        errors.rating && /* @__PURE__ */ jsx("div", { className: "text-red-600 text-sm mt-1", children: errors.rating })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: data.comment_title || "",
            onChange: (e) => setData("comment_title", e.target.value),
            className: "border px-2 py-1 rounded w-full",
            placeholder: "Short title for your review"
          }
        ),
        errors.comment_title && /* @__PURE__ */ jsx("div", { className: "text-red-600 text-sm", children: errors.comment_title })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium mb-1", children: "Comment" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: data.comment,
            onChange: (e) => setData("comment", e.target.value),
            className: "border px-2 py-1 rounded w-full",
            rows: 4,
            placeholder: "Write your review..."
          }
        ),
        errors.comment && /* @__PURE__ */ jsx("div", { className: "text-red-600 text-sm", children: errors.comment })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: processing || data.rating === 0,
          className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50",
          children: "Write a Review"
        }
      )
    ] }) })
  ] });
};
const ProductReview = ({
  productId,
  reviews = []
}) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    rating: 0,
    comment: "",
    comment_title: ""
    // ← added
  });
  const [expandedReviews, setExpandedReviews] = useState({});
  const toggleExpand = (id) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const isLongComment = (comment) => {
    if (!comment) return false;
    return comment.split("\n").length > 4 || comment.length > 300;
  };
  return /* @__PURE__ */ jsx("div", { className: "w-full max-w-2xl space-y-8", children: /* @__PURE__ */ jsxs("div", { children: [
    (!reviews || reviews.length === 0) && /* @__PURE__ */ jsx("p", { children: "No reviews yet." }),
    reviews.map((review) => {
      const isExpanded = expandedReviews[review.id] ?? false;
      const comment = review.comment ?? "";
      return /* @__PURE__ */ jsx("div", { className: "w-full py-1", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col mb-1", children: /* @__PURE__ */ jsxs("article", { className: "p-6 bg-white dark:bg-gray-800 rounded-lg  w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "w-10 h-10 me-4 rounded-full",
              src: "/docs/images/people/profile-picture-5.jpg",
              alt: ""
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "font-medium dark:text-white", children: /* @__PURE__ */ jsxs("p", { children: [
            review.userName,
            " ",
            /* @__PURE__ */ jsxs(
              "time",
              {
                dateTime: review.userCreatedAt,
                className: "block text-sm text-gray-500 dark:text-gray-400",
                children: [
                  "Joined on",
                  " ",
                  new Date(
                    review.userCreatedAt
                  ).toLocaleDateString()
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-1 space-x-1 rtl:space-x-reverse", children: [
          /* @__PURE__ */ jsx(ProductRating, { rating: review.rating, size: "sm" }),
          /* @__PURE__ */ jsx("h3", { className: "ms-2 text-l font-semibold text-gray-900 dark:text-white", children: review.comment_title })
        ] }),
        /* @__PURE__ */ jsx("footer", { className: "mb-5 text-sm text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxs("p", { children: [
          "Reviewed at",
          " ",
          /* @__PURE__ */ jsx("time", { dateTime: review.createdAt, children: new Date(review.createdAt).toLocaleDateString() })
        ] }) }),
        review.comment && /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: `text-gray-700 dark:text-gray-300 break-words whitespace-pre-line ${!isExpanded ? "line-clamp-4" : ""}`,
              children: comment
            }
          ),
          isLongComment(comment) && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => toggleExpand(review.id),
              className: "text-blue-600 hover:underline text-sm mt-1",
              children: isExpanded ? "Show less" : "Read more"
            }
          )
        ] })
      ] }) }) }, review.id);
    })
  ] }) });
};
function Carousel({ images, index, onIndexChange }) {
  var _a;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:items-start gap-6", children: [
    /* @__PURE__ */ jsx("div", { className: "mt-2 w-full lg:order-1 lg:w-24 lg:flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "flex flex-row items-center justify-start gap-3 lg:flex-col lg:items-stretch", children: images.map((image, i) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => onIndexChange(i),
        className: `
                aspect-square h-20 rounded-lg border-2 transition-all

                ${index === i ? "border-indigo-600" : "border-transparent"}
                focus:outline-none
              `,
        "aria-label": `Select image ${i + 1}`,
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: image.thumb,
            alt: `Thumbnail ${i + 1}`,
            className: "h-full w-full object-cover rounded-md"
          }
        )
      },
      image.id
    )) }) }),
    /* @__PURE__ */ jsxs("div", { className: "lg:order-2 lg:ml-6 relative w-full max-w-xl rounded-xl overflow-hidden cursor-zoom-in aspect-[5/4] bg-gray-50 group", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: (_a = images[index]) == null ? void 0 : _a.large,
          alt: `Selected product image ${index + 1}`,
          className: "h-full w-full object-contain transition-transform duration-500 ease-in-out group-hover:scale-110",
          loading: "lazy",
          draggable: false
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex justify-center items-center pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none", children: "Hover to zoom" }) })
    ] })
  ] });
}
function arraysAreEqual(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}
function Show({
  product,
  relatedProducts,
  ratingBreakdown,
  variationOptions
}) {
  var _a, _b, _c, _d, _e;
  const form = useForm({
    option_ids: {},
    quantity: 1,
    price: 0,
    designer: false,
    attachment: null
  });
  const reviews = product.reviews;
  const designCharge = 20;
  const [designer, setdesigner] = useState(false);
  const { url } = usePage();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(
    "description"
  );
  const { auth } = usePage().props;
  const images = useMemo(() => {
    const imageSet = /* @__PURE__ */ new Map();
    for (let option of Object.values(selectedOptions)) {
      if (Array.isArray(option.images)) {
        option.images.forEach((image) => {
          const id = image.id || 0;
          if (!imageSet.has(id)) {
            imageSet.set(id, {
              id,
              thumb: image.thumb || "/placeholder.jpg",
              small: image.small || image.thumb || "/placeholder.jpg",
              large: image.large || image.thumb || "/placeholder.jpg"
            });
          }
        });
      }
    }
    if (imageSet.size === 0 && Array.isArray(product.images)) {
      product.images.forEach((image) => {
        const id = image.id || 0;
        if (!imageSet.has(id)) {
          imageSet.set(id, {
            id,
            thumb: image.thumb || "/placeholder.jpg",
            small: image.small || image.thumb || "/placeholder.jpg",
            large: image.large || image.thumb || "/placeholder.jpg"
          });
        }
      });
    }
    if (imageSet.size === 0) {
      imageSet.set(0, {
        id: 0,
        thumb: "/placeholder.jpg",
        small: "/placeholder.jpg",
        large: "/placeholder.jpg"
      });
    }
    return Array.from(imageSet.values());
  }, [product, selectedOptions]);
  const computedProduct = useMemo(() => {
    const selectedOptionIds = Object.values(selectedOptions).map((op) => op.id).sort();
    if (Array.isArray(product.variations)) {
      for (let variation of product.variations) {
        let optionIds = variation.variation_type_option_ids.slice().sort();
        if (arraysAreEqual(selectedOptionIds, optionIds)) {
          return {
            ...product,
            price: variation.price,
            quantity: variation.quantity === null ? Number.MAX_VALUE : variation.quantity
          };
        }
      }
    }
    return {
      price: product.price,
      quantity: product.quantity
    };
  }, [product, selectedOptions]);
  useEffect(() => {
    for (let type of product.variationTypes) {
      const selectedOptionId = variationOptions[type.id];
      chooseOption(
        type.id,
        type.options.find((option) => option.id === selectedOptionId) || type.options[0],
        false
      );
    }
  }, []);
  const getOptionIdsMap = (newOptions) => {
    return Object.fromEntries(
      Object.entries(newOptions).map(([a, b]) => {
        return [a, b.id];
      })
    );
  };
  const chooseOption = (typeId, option, updateRouter = true) => {
    setSelectedOptions((prevSelectedOptions) => {
      var _a2, _b2;
      const newOptions = {
        ...prevSelectedOptions,
        [typeId]: option
      };
      if (((_a2 = option.images) == null ? void 0 : _a2.length) > 0) {
        const imageId = (_b2 = option.images[0]) == null ? void 0 : _b2.id;
        const index = images.findIndex((img) => img.id === imageId);
        if (index !== -1) setCarouselIndex(index);
      }
      if (updateRouter) {
        router.get(
          url,
          {
            options: getOptionIdsMap(newOptions)
          },
          {
            preserveScroll: true,
            preserveState: true
          }
        );
      }
      return newOptions;
    });
  };
  const finalPrice = useMemo(() => {
    const basePrice = Number(computedProduct.price);
    return form.data.designer ? basePrice + designCharge : basePrice;
  }, [computedProduct.price, form.data.designer]);
  useEffect(() => {
    form.setData("price", finalPrice);
  }, [finalPrice]);
  const addToCart = () => {
    const requiredVariationTypeIds = product.variationTypes.map((vt) => vt.id);
    const selectedOptionTypeIds = Object.keys(selectedOptions).map(Number);
    const allOptionsSelected = requiredVariationTypeIds.every(
      (id) => selectedOptionTypeIds.includes(id)
    );
    if (!allOptionsSelected) {
      alert("Please select all product options before adding to cart.");
      return;
    }
    const formData = new FormData();
    formData.append("price", String(finalPrice));
    form.data.quantity;
    formData.append("quantity", form.data.quantity.toString());
    Object.entries(selectedOptions).forEach(([typeId, option]) => {
      formData.append(`option_ids[${typeId}]`, String(option.id));
    });
    formData.append("designer", form.data.designer ? "1" : "0");
    if (form.data.attachment) {
      formData.append("attachment", form.data.attachment);
    }
    router.post(route("cart.store", product.id), formData, {
      preserveScroll: true,
      preserveState: true,
      forceFormData: true,
      onError: (errors) => {
        console.error("Error adding to cart:", errors);
      },
      onSuccess: () => {
        console.log("Product successfully added to cart.");
      }
    });
  };
  const getValidOptionsForType = (typeId) => {
    const variationTypes = product.variationTypes;
    const currentType = variationTypes.find((t) => t.id === typeId);
    if (!currentType) return /* @__PURE__ */ new Set();
    const selectedOptionIdsExceptCurrent = Object.entries(selectedOptions).filter(([selectedTypeIdStr, opt]) => {
      const selectedTypeId = Number(selectedTypeIdStr);
      return selectedTypeId !== typeId && opt !== void 0;
    }).map(([_, opt]) => opt.id);
    const matchingVariations = product.variations.filter(
      (variation) => selectedOptionIdsExceptCurrent.every(
        (selectedId) => variation.variation_type_option_ids.includes(selectedId)
      )
    );
    const validOptionIds = /* @__PURE__ */ new Set();
    currentType.options.forEach((option) => {
      const optionId = option.id;
      const exists = matchingVariations.some(
        (variation) => variation.variation_type_option_ids.includes(optionId)
      );
      if (exists) {
        validOptionIds.add(optionId);
      }
    });
    return validOptionIds;
  };
  const renderProductVariationTypes = () => {
    const variationTypes = product.variationTypes;
    variationTypes[0];
    return /* @__PURE__ */ jsx(Fragment, { children: variationTypes.map((type) => {
      var _a2;
      const validOptionIds = getValidOptionsForType(type.id);
      return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("b", { className: "block mb-3 text-lg font-semibold text-gray-800", children: type.name }),
        type.type === "Image" && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3", children: type.options.filter(
          (option) => {
            var _a3;
            return validOptionIds.has(option.id) || ((_a3 = selectedOptions[type.id]) == null ? void 0 : _a3.id) === option.id;
          }
        ).map((option) => {
          var _a3, _b2, _c2, _d2;
          return /* @__PURE__ */ jsx(
            "label",
            {
              className: `cursor-pointer rounded-lg border  duration-150
                        ${((_a3 = selectedOptions[type.id]) == null ? void 0 : _a3.id) === option.id ? "ring-2 ring-indigo-600 shadow-md" : "ring-1 ring-gray-300 hover:ring-indigo-400"}`,
              onClick: () => chooseOption(type.id, option),
              tabIndex: 0,
              role: "button",
              "aria-pressed": ((_b2 = selectedOptions[type.id]) == null ? void 0 : _b2.id) === option.id ? "true" : "false",
              children: ((_d2 = (_c2 = option.images) == null ? void 0 : _c2[0]) == null ? void 0 : _d2.thumb) && /* @__PURE__ */ jsx(
                "img",
                {
                  src: option.images[0].thumb,
                  alt: option.name || "",
                  className: "w-20 h-20 object-cover rounded-lg"
                }
              )
            },
            option.id
          );
        }) }),
        type.type === "Radio" && /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap items-center gap-3 select-none", children: type.options.filter(
          (option) => {
            var _a3;
            return validOptionIds.has(option.id) || ((_a3 = selectedOptions[type.id]) == null ? void 0 : _a3.id) === option.id;
          }
        ).map((option) => {
          var _a3, _b2;
          return /* @__PURE__ */ jsxs(
            "label",
            {
              className: "cursor-pointer",
              "aria-pressed": ((_a3 = selectedOptions[type.id]) == null ? void 0 : _a3.id) === option.id ? "true" : "false",
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: `variation_type_${type.id}`,
                    value: option.id,
                    className: "peer sr-only",
                    onChange: () => chooseOption(type.id, option),
                    checked: ((_b2 = selectedOptions[type.id]) == null ? void 0 : _b2.id) === option.id
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "peer-checked:bg-indigo-600 peer-checked:text-white rounded-lg border border-indigo-600 px-6 py-2 font-semibold transition-colors", children: option.name })
              ]
            },
            option.id
          );
        }) }),
        type.type === "Select" && /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxs(
          "select",
          {
            className: "w-full rounded-lg border border-gray-400 px-4 py-2 font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500",
            value: ((_a2 = selectedOptions[type.id]) == null ? void 0 : _a2.id) ?? "",
            onChange: (e) => {
              const selectedId = Number(e.target.value);
              const selected = type.options.find(
                (opt) => opt.id === selectedId
              );
              if (selected) chooseOption(type.id, selected);
            },
            children: [
              /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: "Select an option" }),
              type.options.filter(
                (option) => {
                  var _a3;
                  return validOptionIds.has(option.id) || ((_a3 = selectedOptions[type.id]) == null ? void 0 : _a3.id) === option.id;
                }
              ).map((option) => /* @__PURE__ */ jsx("option", { value: option.id, children: option.name }, option.id))
            ]
          }
        ) })
      ] }, type.id);
    }) });
  };
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: product.title }),
    /* @__PURE__ */ jsx("section", { className: "py-12 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 max-w-7xl", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: "Home", href: "/" },
            {
              label: product.user.store_name || "Vendor",
              href: route("vendor.profile", {
                vendor: product.user.store_name
              })
            },
            {
              label: ((_a = product.department) == null ? void 0 : _a.name) || "Department",
              href: route("product.byDepartment", product.department.slug)
            },
            {
              label: ((_b = product.category) == null ? void 0 : _b.name) || "Category",
              href: route("product.byDepartment", product.department.slug)
            },
            { label: product.title, current: true }
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-20", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsx(
          Carousel,
          {
            images: images.map((img) => ({
              ...img,
              alt: product.title
            })),
            index: carouselIndex,
            onIndexChange: setCarouselIndex
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 flex flex-col", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold text-gray-900 leading-tight sm:text-4xl", children: product.title }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 text-sm font-semibold text-indigo-600 tracking-wide mb-6", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("vendor.profile", product.user.store_name),
                className: "hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded",
                children: product.user.name
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "mx-1 text-gray-500", children: "in" }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: route("product.byDepartment", product.department.slug),
                className: "hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded",
                children: product.department.name
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            ProductRating,
            {
              size: "md",
              rating: product.average_rating ?? 0,
              reviewsCount: product.reviews_count ?? 0
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: renderProductVariationTypes() }),
          /* @__PURE__ */ jsxs("label", { className: "mt-6 inline-flex items-center cursor-pointer select-none", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: form.data.designer,
                onChange: (e) => form.setData("designer", e.target.checked),
                className: "form-checkbox text-indigo-600 h-5 w-5",
                "aria-checked": form.data.designer
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "ml-3 text-gray-900 font-medium", children: [
              "Need designer? (adds $",
              designCharge,
              " to price)"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                className: "mt-5 relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50\n               dark:border-gray-600 dark:bg-gray-800 p-6 text-center hover:border-indigo-500 focus-within:border-indigo-500",
                onClick: () => {
                  var _a2;
                  return (_a2 = document.getElementById("attachment")) == null ? void 0 : _a2.click();
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      id: "attachment",
                      type: "file",
                      accept: "image/*,application/pdf",
                      onChange: (e) => {
                        var _a2;
                        return form.setData("attachment", ((_a2 = e.target.files) == null ? void 0 : _a2[0]) || null);
                      },
                      className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-600 dark:text-gray-400 font-medium", children: "Got a file? Drag it here or click to upload your attachment!" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-1", children: "(Images or PDFs welcome 📎)" })
                ]
              }
            ),
            form.errors.attachment && /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-red-600", children: form.errors.attachment })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-10 flex flex-col space-y-5 border-t border-b border-gray-200 py-6 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: "text-4xl font-extrabold text-gray-900", children: /* @__PURE__ */ jsx(CurrencyFormatter, { amount: finalPrice, currency: "AUD" }) }) }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: addToCart,
                type: "button",
                className: "inline-flex items-center justify-center rounded-md bg-gray-900 px-10 py-3 text-lg font-bold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2",
                "aria-label": "Add product to cart",
                children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      className: "mr-3 h-6 w-6 shrink-0",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: 2,
                      "aria-hidden": "true",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        }
                      )
                    }
                  ),
                  "Add to cart"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: "mt-10 space-y-4 text-sm font-medium text-gray-600", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "mr-3 h-6 w-6 text-gray-500 flex-shrink-0",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    }
                  )
                }
              ),
              "Free shipping worldwide"
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "mr-3 h-6 w-6 text-gray-500 flex-shrink-0",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor",
                  "aria-hidden": "true",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    }
                  )
                }
              ),
              "Cancel Anytime"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "bg-slate-50 mt-12 relative left-1/2 right-1/2 w-screen -translate-x-1/2", children: [
        /* @__PURE__ */ jsx("h2", { className: "ml-14 py-6 text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:ml-0", children: "Related Products" }),
        ((_c = relatedProducts == null ? void 0 : relatedProducts.data) == null ? void 0 : _c.length) > 0 && /* @__PURE__ */ jsx(
          ProductCarousel,
          {
            products: relatedProducts.data,
            title: "",
            sectionClassName: "py-5 bg-gray-50",
            wrapperClassName: "w-full px-2 sm:px-4"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-16", children: /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 lg:px-10 mt-10 lg:mt-0", children: [
        /* @__PURE__ */ jsx("div", { className: "border-b border-gray-300", children: /* @__PURE__ */ jsxs("nav", { className: "flex gap-8 overflow-x-auto no-scrollbar", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                setActiveTab("description");
              },
              className: `border-b-2 py-4 text-sm font-semibold whitespace-nowrap hover:border-gray-400 hover:text-gray-800 ${activeTab === "description" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-600"}`,
              children: "Description"
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                setActiveTab("reviews");
              },
              className: `inline-flex items-center border-b-2 py-4 text-sm font-semibold whitespace-nowrap hover:border-gray-400 hover:text-gray-800 ${activeTab === "reviews" ? "border-gray-900 text-gray-900" : "border-transparent text-gray-600"}`,
              children: [
                "Reviews",
                /* @__PURE__ */ jsx("span", { className: "ml-2 rounded-full bg-gray-500 px-2 py-px text-xs font-bold text-gray-100", children: product.reviews_count || 0 })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 flow-root sm:mt-12", children: [
          activeTab === "description" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: "prose max-w-none text-gray-900 dark:text-gray-100", children: parse(product.description) }) }),
          activeTab === "reviews" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Reviews" }),
            /* @__PURE__ */ jsx(
              AdvanceProductRating,
              {
                rating: product.average_rating ?? 0,
                reviewsCount: product.reviews_count ?? 0,
                ratingBreakdown,
                productId: product.id,
                reviews,
                authUserId: ((_d = auth == null ? void 0 : auth.user) == null ? void 0 : _d.id) ?? null
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "mt-10 bg-background-gray rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold mb-4", children: "Customers Words" }),
              /* @__PURE__ */ jsx(
                ProductReview,
                {
                  productId: product.id,
                  reviews: product.reviews,
                  authUserId: ((_e = auth == null ? void 0 : auth.user) == null ? void 0 : _e.id) ?? null
                }
              )
            ] })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  Show as default
};
