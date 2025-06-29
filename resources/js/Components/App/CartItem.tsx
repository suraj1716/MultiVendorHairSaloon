import { productRoute } from "@/helper";
import { CartItem as CartItemType } from "@/types";
import { Link, router, useForm } from "@inertiajs/react";
import { error } from "console";
import TextInput from "../Core/TextInput";
import React, { useState } from "react";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";

type Props = {
  item: CartItemType;
  attachment_path?: string;
};

function CartItem({ item }: { item: CartItemType }) {
  const deleteForm = useForm({
    option_ids: item.option_ids,
  });

  const [error, setError] = useState("");

  const onDeleteClick = () => {
    deleteForm.delete(route("cart.destroy", item.product_id), {
      preserveScroll: true,
    });
  };

  const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    router.put(
      route("cart.update", item.product_id),
      {
        quantity: ev.target.value,
        option_ids: item.option_ids,
      },
      {
        preserveScroll: true,
        onError: (errors) => {
          setError(Object.values(errors)[0]);
        },
      }
    );
  };

  return (
    <>
      <div
        key={item.id}
        className="flex flex-col md:flex-row gap-6 p-4 border-b border-gray-200 dark:border-gray-700"
      >
        {/* Image */}
        <Link
          href={productRoute(item)}
          className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden flex-shrink-0"
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between text-left">
          <div>
            <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              <Link href={productRoute(item)}>{item.title}</Link>
            </h3>

            <p className="mb-2 text-sm font-medium text-purple-800 dark:text-purple-300">
              Total Price:{" "}
              <CurrencyFormatter
                amount={item.price * item.quantity}
                currency="AUD"
              />
            </p>

            <div className="text-sm text-gray-700 dark:text-gray-400 space-y-1">
              {item.options.map((option) => (
                <div key={option.id}>
                  <strong>{option.type.name}:</strong> {option.name}
                </div>
              ))}
            </div>

            {item.attachment_name && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Attachment: {item.attachment_name}
              </div>
            )}
          </div>

          {/* Mobile buttons below content */}
          <div className="flex md:hidden mt-4 space-x-4">
            <button
              onClick={onDeleteClick}
              className="text-sm px-4 py-2 rounded-md border-2 border-purple-600 text-purple-600 bg-white
  hover:bg-red-600 hover:border-red-600 hover:text-white
  transition ease-in-out duration-300
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              Delete
            </button>

            <button className="flex-1 text-sm px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition">
              Save for later
            </button>
          </div>
        </div>

        {/* Desktop buttons on right side, stacked vertically */}
        <div className="hidden md:flex flex-col justify-start space-y-3 flex-shrink-0">
          <button
            onClick={onDeleteClick}
             className="text-sm px-4 py-2 rounded-md border-2 border-purple-600 text-purple-600 bg-white
  hover:bg-red-600 hover:border-red-600 hover:text-white
  transition ease-in-out duration-300
  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            Delete
          </button>
          <button className="text-sm px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition">
            Save for later
          </button>
        </div>
      </div>
    </>
  );
}

export default CartItem;
