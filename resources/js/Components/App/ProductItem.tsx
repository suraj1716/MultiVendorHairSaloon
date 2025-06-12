import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/core";
import { Product } from "@/types";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import ProductRating from "./ProductRating";

interface Props {
  product: Product;
}

export default function ProductItem({ product }: Props) {
  const form = useForm({
    product_id: product.id,
    quantity: 1,
  });

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.post(route("cart.store", product.id), form.data, {
      preserveScroll: true,
    });
  };

  return (
    <div className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[250px] xl:w-[260px] mx-auto">
      <div className="relative overflow-hidden rounded-xl bg-white shadow hover:shadow-md transition-shadow duration-300">
        <div className="overflow-hidden">
          <Link href={route("product.show", product.slug)}>
            <img
              className="h-[130px] sm:h-[150px] md:h-[160px] lg:h-[180px] w-full object-cover transition duration-300 transform hover:-translate-y-1 hover:scale-105"
              src={product.image}
              alt={product.title}
            />
          </Link>
        </div>

        {product.highlight && (
          <span
            className={`
              absolute top-0 left-0 w-20 -translate-x-5 translate-y-1 -rotate-45
              text-center text-[12px] font-bold text-white
              px-2 py-1
              shadow-lg select-none
              ${
                product.highlight === "sale"
                  ? "bg-red-600 animate-pulse"
                  : product.highlight === "hot"
                  ? "bg-orange-500 animate-pulse"
                  : product.highlight === "trending"
                  ? "bg-green-600 animate-pulse"
                  : "bg-black"
              }
            `}
          >
            {product.highlight.charAt(0).toUpperCase() + product.highlight.slice(1)}
          </span>
        )}

        <div className="mt-3 px-2 pb-3">
          <h5 className="text-sm font-semibold tracking-tight text-slate-900 line-clamp-1">
            <Link href={route("product.show", product.slug)}>{product.title}</Link>
          </h5>

          <p className="text-[10px] text-gray-600 line-clamp-2 mt-1">
            <Link
              href={route("vendor.profile", product.user?.store_name ?? "")}
              className="hover:underline"
            >
              {product.user?.name ?? "Unknown Vendor"}
            </Link>
            &nbsp;in&nbsp;
            <Link
              href={route("product.byDepartment", product.department?.slug ?? "")}
              className="hover:underline"
            >
              {product.department?.name ?? "Unknown Department"}
            </Link>
          </p>

          <div className="mt-2 mb-3 text-[10px] sm:text-xs">
            <ProductRating
              rating={product.average_rating ?? 0}
              reviewsCount={product.reviews_count ?? 0}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col items-start space-y-0.5">
              <span className="text-sm font-bold text-slate-900">
                <CurrencyFormatter amount={product.price ?? product.price} currency="AUD" />
              </span>
              {product.price && (
                <span className="text-[10px] text-slate-400 line-through">
                  <CurrencyFormatter amount={product.price} currency="AUD" />
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={addToCart}
              className="flex items-center rounded bg-slate-900 px-2 py-1 text-[10px] text-white hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
