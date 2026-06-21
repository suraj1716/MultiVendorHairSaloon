import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import BookingWidget from "./BookingWidget-DQ8kKQ_u.js";
import { useForm, Link, Head } from "@inertiajs/react";
import { C as CurrencyFormatter, A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { Inertia } from "@inertiajs/inertia";
import "axios";
import "@radix-ui/react-dialog";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "react-day-picker";
import "dayjs";
import "./AvailableSlots-BiD8K0YY.js";
import "dayjs/plugin/isSameOrAfter.js";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "@heroicons/react/20/solid";
const productRoute = (item) => {
  const params = new URLSearchParams();
  Object.entries(item.option_ids).forEach(([typeId, optionId]) => {
    params.append(`options[${typeId}]`, optionId + "");
  });
  return route("product.show", { slug: item.slug }) + "?" + params.toString();
};
function CartItem({ item }) {
  const deleteForm = useForm({
    option_ids: item.option_ids
  });
  const [error2, setError] = useState("");
  const onDeleteClick = () => {
    deleteForm.delete(route("cart.destroy", item.product_id), {
      preserveScroll: true
    });
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col md:flex-row gap-4 p-3 border-b border-gray-200 dark:border-gray-700",
      children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: productRoute(item),
            className: "w-full md:w-32 flex justify-start",
            children: /* @__PURE__ */ jsx(
              "img",
              {
                src: item.image_url,
                alt: item.title,
                className: "max-w-full max-h-32 object-contain rounded"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col justify-between text-left", children: [
          " ",
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 text-sm font-semibold text-gray-900 dark:text-white", children: /* @__PURE__ */ jsx(Link, { href: productRoute(item), children: item.title }) }),
            /* @__PURE__ */ jsxs("h3", { className: "mb-3 text-sm font-extrabold text-gray-900 dark:text-white", children: [
              "Total Price:",
              " ",
              /* @__PURE__ */ jsx(
                CurrencyFormatter,
                {
                  amount: item.price * item.quantity,
                  currency: "AUD"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400 space-y-1", children: item.options.map((option) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("strong", { className: "font-semibold", children: [
                option.type.name,
                ":"
              ] }),
              " ",
              option.name
            ] }, option.id)) }),
            item.attachment_name && /* @__PURE__ */ jsxs("div", { className: "mt-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300", children: [
              "Attachment: ",
              item.attachment_name
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-4 justify-start", children: [
            /* @__PURE__ */ jsx("button", { onClick: onDeleteClick, className: "btn btn-sm btn-ghost", children: "Delete" }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-sm btn-ghost", children: "Save for later" })
          ] })
        ] })
      ]
    },
    item.id
  ) });
}
function ShippingAddressSelector({
  shippingAddresses,
  selectedAddressId,
  setSelectedAddressId
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: "Choose a shipping address" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          href: route("profile.edit"),
          className: "w-full sm:w-auto inline-block px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 text-center",
          children: "+ Add New Address"
        }
      )
    ] }),
    shippingAddresses.map((address) => /* @__PURE__ */ jsxs(
      "label",
      {
        className: "border rounded-md p-4 mb-3 flex cursor-pointer hover:border-blue-500",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "shipping_address_id",
              value: address.id,
              checked: selectedAddressId === address.id,
              onChange: () => setSelectedAddressId(address.id),
              className: "mt-1",
              required: true
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "ml-4", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-semibold", children: [
              address.full_name,
              address.is_default && /* @__PURE__ */ jsx("span", { className: "text-green-600 text-sm ml-1", children: "(Default)" })
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              address.address_line1,
              address.address_line2 && `, ${address.address_line2}`,
              ",",
              " ",
              address.city,
              ", ",
              address.state,
              " ",
              address.postal_code
            ] }),
            /* @__PURE__ */ jsx("p", { children: address.country }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
              "Phone: ",
              address.phone
            ] })
          ] })
        ]
      },
      address.id
    ))
  ] });
}
function Index({
  csrf_token,
  cartItems,
  totalQuantity,
  totalPrice,
  shippingAddresses,
  bookings,
  showBookingWidget,
  showShippingForm,
  vendorId
}) {
  var _a;
  const [selectedAddressId, setSelectedAddressId] = useState(
    ((_a = shippingAddresses.find((a) => a.is_default)) == null ? void 0 : _a.id) ?? null
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(
    null
  );
  const stepRefs = useRef([]);
  const [step, setStep] = useState(1);
  useEffect(() => {
    const currentRef = stepRefs.current[step - 1];
    if (currentRef) {
      currentRef.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }, [step]);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hasAppointmentItems = Object.values(cartItems).some(
    (group) => group.user.vendor_type === "appointment"
  );
  const totalBookingFee = bookingConfirmed === true ? Object.values(cartItems).filter((group) => group.user.vendor_type === "appointment").reduce((sum, group) => {
    const fee = parseFloat(group.user.booking_fee || "0");
    return sum + (isNaN(fee) ? 0 : fee);
  }, 0) : 0;
  const subtotalWithBooking = totalPrice + totalBookingFee;
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedAddressId && showShippingForm) {
      alert("Please select a shipping address.");
      return;
    }
    if (bookingConfirmed && (!bookingDate || !timeSlot)) {
      alert("Please select booking date and time.");
      return;
    }
    setLoading(true);
    try {
      await Inertia.visit(route("bookings.store"), {
        method: "POST",
        data: {
          booking_date: bookingDate,
          hasBooking: bookingConfirmed ? "1" : "0",
          hasShipping: showShippingForm ? "1" : "0",
          time_slot: timeSlot,
          vendor_user_id: vendorId
        },
        preserveState: true,
        preserveScroll: true
      });
      const form = document.createElement("form");
      form.method = "POST";
      form.action = route("cart.checkout");
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "_token";
      tokenInput.value = csrf_token;
      form.appendChild(tokenInput);
      const addressInput = document.createElement("input");
      addressInput.type = "hidden";
      addressInput.name = "shipping_address_id";
      addressInput.value = selectedAddressId;
      form.appendChild(addressInput);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setLoading(false);
      alert("Failed to submit booking. Please try again.");
    }
  };
  console.log(showShippingForm);
  return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Your Cart" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 overflow-x-auto scrollbar-hide", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-start sm:justify-center gap-6 px-4 min-w-max", children: ["Cart", "Shipping/Booking", "Review"].map((label, index) => {
        const stepIndex = index + 1;
        const isCompleted = step > stepIndex;
        const isActive = step === stepIndex;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            ref: (el) => stepRefs.current[index] = el,
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setStep(stepIndex),
                  className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors duration-200
                ${isActive ? "bg-blue-600 text-white border-blue-600" : isCompleted ? "bg-green-500 text-white border-green-500" : "bg-gray-200 text-gray-700 border-gray-300"}
              `,
                  children: stepIndex
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `text-xs sm:text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-600"}`,
                  children: label
                }
              ),
              index < 2 && /* @__PURE__ */ jsx("div", { className: "w-6 h-px bg-gray-300 sm:w-10" })
            ]
          },
          label
        );
      }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        step === 1 && /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-4", children: "Step 1: Shopping Cart" }),
          /* @__PURE__ */ jsx("div", { className: "card flex-1 bg-white dark:bg-gray-800 order-1 lg:order-2", children: /* @__PURE__ */ jsxs("div", { className: "card-body", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Shopping Cart" }),
            Object.keys(cartItems).length === 0 && /* @__PURE__ */ jsx("p", { className: "py-6 text-center text-gray-500", children: "You don't have any items in your cart." }),
            Object.values(cartItems).map((group) => /* @__PURE__ */ jsxs("section", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between pb-2 border-b", children: /* @__PURE__ */ jsx(Link, { href: "/", className: "underline", children: group.user.name }) }),
              group.items.map((item) => /* @__PURE__ */ jsx(CartItem, { item }, item.id))
            ] }, group.user.id))
          ] }) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setStep(2),
              className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded",
              children: "Next: Shipping / Booking"
            }
          )
        ] }),
        step === 2 && /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-4", children: "Step 2: Shipping or Booking" }),
          /* @__PURE__ */ jsx("div", { className: "card flex-1 bg-white dark:bg-gray-800 lg:min-w-[260px] order-2 lg:order-2", children: /* @__PURE__ */ jsxs("div", { className: "card-body space-y-6", children: [
            hasAppointmentItems && bookingConfirmed === null && /* @__PURE__ */ jsxs("div", { className: "mb-4 border p-4 rounded bg-yellow-50", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold mb-2 text-gray-800", children: "Your cart contains items that require a professional installer:" }),
              Object.values(cartItems).filter((group) => group.user.vendor_type === "appointment").map((group) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "mb-4 border border-yellow-300 bg-yellow-50 p-4 rounded",
                  children: [
                    /* @__PURE__ */ jsxs("p", { className: "mb-2 font-semibold text-gray-800", children: [
                      "Would you like to book an appointment to hire a professional installer for items from",
                      " ",
                      /* @__PURE__ */ jsx("span", { className: "underline", children: group.user.name }),
                      "?"
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700 mb-2", children: [
                      "Note: A booking fee of ",
                      /* @__PURE__ */ jsxs("strong", { children: [
                        "$",
                        parseFloat(group.user.booking_fee).toFixed(2)
                      ] }),
                      " will be added to your subtotal."
                    ] }),
                    /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside text-gray-700 mb-3", children: group.items.map((item) => /* @__PURE__ */ jsxs("li", { children: [
                      item.title,
                      " — Qty: ",
                      item.quantity
                    ] }, item.id)) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setBookingConfirmed(true),
                          className: "mr-2 px-3 py-1.5 bg-green-600 text-white rounded",
                          children: "Yes, book installer"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setBookingConfirmed(false),
                          className: "px-3 py-1.5 bg-gray-300 rounded",
                          children: "No, skip"
                        }
                      )
                    ] })
                  ]
                },
                group.user.id
              ))
            ] }),
            bookingConfirmed && showBookingWidget && /* @__PURE__ */ jsxs("div", { className: "space-y-4 border p-4 rounded", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg", children: "Book Appointment" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "inline-block mb-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700",
                  onClick: () => setDialogOpen(true),
                  children: "Book Appointment"
                }
              ),
              /* @__PURE__ */ jsx(
                BookingWidget,
                {
                  bookingDate,
                  setBookingDate,
                  timeSlot,
                  setTimeSlot,
                  open: dialogOpen,
                  onOpenChange: setDialogOpen,
                  vendorId: vendorId.length > 0 ? vendorId[0] : null,
                  onSubmit: (date, slot) => {
                    setBookingDate(date);
                    setTimeSlot(slot);
                  }
                }
              ),
              bookingDate && timeSlot && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 dark:text-gray-300", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Selected Date:" }),
                  " ",
                  bookingDate
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Selected Time:" }),
                  " ",
                  timeSlot
                ] })
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-green-700 mt-2", children: [
                "Booking fee added: $",
                totalBookingFee.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-4 font-semibold", children: [
              "Subtotal:",
              " ",
              /* @__PURE__ */ jsx(
                CurrencyFormatter,
                {
                  amount: bookingConfirmed ? subtotalWithBooking : totalPrice,
                  currency: "AUD"
                }
              ),
              bookingConfirmed && totalBookingFee > 0 && /* @__PURE__ */ jsxs("span", { className: "ml-2 text-sm text-green-600", children: [
                "(Includes $",
                totalBookingFee.toFixed(2),
                " booking fee)"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleCheckout, className: "space-y-4", children: [
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "_token", value: csrf_token }),
              showShippingForm && /* @__PURE__ */ jsx(
                ShippingAddressSelector,
                {
                  shippingAddresses,
                  selectedAddressId,
                  setSelectedAddressId
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-x-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setStep(1),
                className: "w-1/2 px-4 py-2 bg-gray-300 text-center rounded",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setStep(3),
                className: "w-1/2 px-4 py-2 bg-blue-600 text-white text-center rounded",
                children: "Next: Review"
              }
            )
          ] })
        ] }),
        step === 3 && /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded shadow space-y-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold mb-4", children: "Step 3: Review Order" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Shopping Cart" }),
            Object.keys(cartItems).length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Your cart is empty." }) : Object.values(cartItems).map((group) => /* @__PURE__ */ jsxs(
              "section",
              {
                className: "mb-4 border border-gray-200 rounded p-3",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-2", children: [
                    /* @__PURE__ */ jsx(Link, { href: "/", className: "underline font-semibold", children: group.user.name }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: () => setStep(1),
                        className: "text-sm text-blue-600 hover:underline",
                        children: "Edit"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: group.items.map((item) => /* @__PURE__ */ jsxs(
                    "li",
                    {
                      className: "flex justify-between text-gray-700",
                      children: [
                        /* @__PURE__ */ jsxs("span", { children: [
                          item.title,
                          " x ",
                          item.quantity
                        ] }),
                        /* @__PURE__ */ jsxs("span", { children: [
                          "$",
                          (item.price * item.quantity).toFixed(2)
                        ] })
                      ]
                    },
                    item.id
                  )) })
                ]
              },
              group.user.id
            ))
          ] }),
          hasAppointmentItems && /* @__PURE__ */ jsxs("div", { className: "border border-yellow-300 bg-yellow-50 rounded p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Installer Booking" }),
            /* @__PURE__ */ jsxs("p", { className: "mb-2", children: [
              "Booking confirmed: ",
              /* @__PURE__ */ jsx("strong", { children: bookingConfirmed ? "Yes" : "No" })
            ] }),
            bookingConfirmed && bookingDate && timeSlot && /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Date:" }),
                " ",
                bookingDate
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Time:" }),
                " ",
                timeSlot
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-green-700", children: [
                "Booking fee added: $",
                totalBookingFee.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setStep(2),
                className: "mt-2 text-sm text-blue-600 hover:underline",
                children: "Edit Booking"
              }
            )
          ] }),
          selectedAddressId && /* @__PURE__ */ jsxs("div", { className: "border border-gray-300 rounded p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold mb-2", children: "Shipping Address" }),
            (() => {
              const address = shippingAddresses.find(
                (addr) => addr.id === selectedAddressId
              );
              if (!address) return /* @__PURE__ */ jsx("p", { children: "No shipping address selected." });
              return /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
                /* @__PURE__ */ jsx("p", { children: address.full_name }),
                /* @__PURE__ */ jsx("p", { children: address.address_line1 }),
                address.address_line2 && /* @__PURE__ */ jsx("p", { children: address.address_line2 }),
                /* @__PURE__ */ jsxs("p", { children: [
                  address.city,
                  ", ",
                  address.state,
                  " ",
                  address.postcode
                ] }),
                /* @__PURE__ */ jsx("p", { children: address.country }),
                /* @__PURE__ */ jsx("p", { children: address.phone })
              ] });
            })(),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setStep(2),
                className: "mt-2 text-sm text-blue-600 hover:underline",
                children: "Edit Shipping"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "font-semibold text-left text-lg", children: [
            "Subtotal:",
            " ",
            /* @__PURE__ */ jsx(
              CurrencyFormatter,
              {
                amount: bookingConfirmed ? subtotalWithBooking : totalPrice,
                currency: "AUD"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setStep(2),
                className: "w-[40%] px-4 py-2 bg-gray-300 text-gray-800 rounded text-center",
                children: "Back"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleCheckout,
                className: "w-[60%] px-4 py-2 bg-blue-600 text-white rounded text-center",
                children: "Proceed to Checkout"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Index as default
};
