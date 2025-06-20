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
        className="flex flex-col md:flex-row gap-4 p-3 border-b border-gray-200 dark:border-gray-700"
      >
        {/* Image */}
        <Link
          href={productRoute(item)}
          className="w-full md:w-32 flex justify-start" // changed from justify-center to justify-start
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="max-w-full max-h-32 object-contain rounded"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between text-left">
          {" "}
          {/* ensure text-left */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              <Link href={productRoute(item)}>{item.title}</Link>
            </h3>

            <h3 className="mb-3 text-sm font-extrabold text-gray-900 dark:text-white">
              Total Price:{" "}
              <CurrencyFormatter
                amount={item.price * item.quantity}
                currency="AUD"
              />
            </h3>

            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {item.options.map((option) => (
                <div key={option.id}>
                  <strong className="font-semibold">{option.type.name}:</strong>{" "}
                  {option.name}
                </div>
              ))}
            </div>

            {item.attachment_name && (
              <div className="mt-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Attachment: {item.attachment_name}
              </div>
            )}
          </div>
          {/* Buttons in a row */}
          <div className="flex gap-4 mt-4 justify-start">
            <button onClick={onDeleteClick} className="btn btn-sm btn-ghost">
              Delete
            </button>
            <button className="btn btn-sm btn-ghost">Save for later</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
