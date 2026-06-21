import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import BookingWidget from "./BookingWidget-DQ8kKQ_u.js";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
import "axios";
import "@radix-ui/react-dialog";
import "tailwind-merge";
import "react-day-picker";
import "dayjs";
import "./AvailableSlots-BiD8K0YY.js";
import "dayjs/plugin/isSameOrAfter.js";
function BookingHistory() {
  var _a;
  const { orders } = usePage().props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState({});
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const handleEditBooking = (item) => {
    if (!item.booking) return;
    setEditingItem(item);
    setBookingDate(item.booking.booking_date);
    setTimeSlot(item.booking.time_slot);
    setErrors({});
  };
  const handleCancelBooking = (item, orderStatus) => {
    var _a2;
    if (orderStatus !== "draft" && orderStatus !== "paid") {
      console.warn("Booking can only be cancelled when order is draft.");
      return;
    }
    if (orderStatus !== "draft" && orderStatus !== "paid") {
      console.warn(
        "Booking can only be cancelled when order is draft or paid."
      );
      return;
    }
    if (!((_a2 = item.booking) == null ? void 0 : _a2.id)) {
      console.error("Booking ID is missing.");
      return;
    }
    if (orderStatus == "draft" || orderStatus == "paid" && today < item.booking.booking_date) {
      if (confirm("Are you sure you want to cancel this booking?")) {
        router.post(
          route("bookings.cancel", item.booking.id),
          {},
          {
            onSuccess: () => {
              console.log("Booking cancelled");
            },
            onError: (errors2) => {
              console.error("Failed to cancel booking", errors2);
            }
          }
        );
      }
    }
  };
  const handleConfirmBooking = (date, slot) => {
    if (!editingItem || !editingItem.booking) return;
    router.put(
      route("bookings.update", editingItem.booking.id),
      { booking_date: date, time_slot: slot },
      {
        onSuccess: () => {
          setEditingItem(null);
          setDialogOpen(false);
        },
        onError: (errorBag) => {
          setErrors(errorBag);
        }
      }
    );
  };
  const handleSaveBooking = (e) => {
    e.preventDefault();
    if (!editingItem || !editingItem.booking) return;
    router.put(
      route("bookings.update", editingItem.booking.id),
      { booking_date: bookingDate, time_slot: timeSlot },
      {
        onSuccess: () => {
          setEditingItem(null);
        },
        onError: (errorBag) => {
          setErrors(errorBag);
        }
      }
    );
  };
  return /* @__PURE__ */ jsx(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-800", children: "Order History" }),
      children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto p-4 overflow-auto", children: [
        ((_a = orders == null ? void 0 : orders.data) == null ? void 0 : _a.length) === 0 ? /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "You have no orders yet." }) : orders.data.map(
          (order) => order.vendor.vendor_type === "appointment" && /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-white shadow rounded-md mb-6 p-4 overflow-auto",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 border-b border-gray-200 pb-1 text-sm text-gray-700", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Order #" }),
                    order.id,
                    " |",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Status:" }),
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "capitalize", children: order.status }),
                    " |",
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Date:" }),
                    " ",
                    new Date(order.created_at).toLocaleDateString()
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "font-semibold text-gray-900", children: [
                    "$",
                    Number(order.total_price).toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mb-3 text-sm text-gray-600", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Vendor:" }),
                    " ",
                    order.vendor.store_address
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Store:" }),
                    " ",
                    order.vendor.store_name
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Address:" }),
                    " ",
                    order.vendor.store_address
                  ] }),
                  (order.status === "draft" || order.status === "draft") && /* @__PURE__ */ jsx("div", { className: "mt-1 p-1 flex- gap-2", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: " inline-block px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700",
                      onClick: () => {
                        const itemToEdit = order.orderItems.find(
                          (item) => item.booking && today < item.booking.booking_date
                        );
                        if (itemToEdit) {
                          handleEditBooking(itemToEdit);
                          setDialogOpen(true);
                        } else {
                          alert("No editable booking found in this order.");
                        }
                      },
                      children: "Edit Booking"
                    }
                  ) }),
                  order.status === "paid" || order.status === "draft" ? (() => {
                    const cancellableItem = order.orderItems.find(
                      (item) => item.booking && today < item.booking.booking_date
                    );
                    if (cancellableItem) {
                      return /* @__PURE__ */ jsx("div", { className: "mt-1 p-1", children: /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleCancelBooking(
                            cancellableItem,
                            order.status
                          ),
                          className: "text-red-600 hover:underline",
                          children: "Cancel Booking"
                        }
                      ) });
                    } else {
                      return /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Completed" });
                    }
                  })() : order.status === "cancelled" ? /* @__PURE__ */ jsx(
                    "button",
                    {
                      disabled: true,
                      className: "text-red-600 cursor-not-allowed",
                      children: "Cancelled"
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Completed" })
                ] }),
                editingItem && /* @__PURE__ */ jsx(
                  BookingWidget,
                  {
                    bookingDate,
                    setBookingDate,
                    timeSlot,
                    setTimeSlot,
                    open: dialogOpen,
                    onOpenChange: setDialogOpen,
                    vendorId: order.vendor.id,
                    onSubmit: handleConfirmBooking
                  }
                ),
                /* @__PURE__ */ jsxs("table", { className: "w-full text-sm border-collapse table-auto", children: [
                  /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-gray-100", children: [
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Product" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Product Variation" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Booking Date" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left", children: "Booking Time" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left w-12", children: "Qty" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left w-24", children: "Price" }),
                    /* @__PURE__ */ jsx("th", { className: "border p-2 text-left w-32", children: "Actions" })
                  ] }) }),
                  /* @__PURE__ */ jsx("tbody", { children: order.orderItems.map((item) => {
                    var _a2, _b, _c;
                    return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
                      /* @__PURE__ */ jsxs("td", { className: "border p-2 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: item.product.image || "/images/placeholder.png",
                            alt: item.product.title,
                            className: "w-10 h-10 object-cover rounded"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Link,
                          {
                            href: `/product/${item.product.id}`,
                            className: "text-gray-800 hover:underline truncate max-w-xs",
                            children: item.product.title
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("td", { className: "border p-2", children: item.variation_summary && item.variation_summary.length > 0 ? item.variation_summary.map((v, i) => /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
                          v.type,
                          ":"
                        ] }),
                        " ",
                        v.option
                      ] }, i)) : "—" }),
                      /* @__PURE__ */ jsx("td", { className: "border p-2", children: ((_a2 = item.booking) == null ? void 0 : _a2.booking_date) || "—" }),
                      /* @__PURE__ */ jsx("td", { className: "border p-2", children: ((_b = item.booking) == null ? void 0 : _b.time_slot) || "—" }),
                      /* @__PURE__ */ jsx("td", { className: "border p-2", children: item.quantity }),
                      /* @__PURE__ */ jsxs("td", { className: "border p-2", children: [
                        "$",
                        Number(item.price).toFixed(2)
                      ] }),
                      /* @__PURE__ */ jsx("td", { className: "border p-2", children: (order.status === "paid" || order.status === "draft") && item.booking && today < ((_c = item.booking) == null ? void 0 : _c.booking_date) ? /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleCancelBooking(item, order.status),
                          className: "text-red-600 hover:underline",
                          children: "Cancel Booking"
                        }
                      ) : order.status === "cancelled" ? /* @__PURE__ */ jsx(
                        "button",
                        {
                          disabled: true,
                          className: "text-red-600 cursor-not-allowed",
                          children: "Cancelled"
                        }
                      ) : /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Completed" }) })
                    ] }, item.id);
                  }) })
                ] })
              ]
            },
            order.id
          )
        ),
        editingItem && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",
            onClick: () => setEditingItem(null),
            children: /* @__PURE__ */ jsxs(
              "div",
              {
                className: "bg-white rounded p-6 w-96",
                onClick: (e) => e.stopPropagation(),
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-4", children: "Edit Booking" }),
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
                  /* @__PURE__ */ jsxs("form", { onSubmit: handleSaveBooking, children: [
                    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                      errors.booking_date && /* @__PURE__ */ jsx("p", { className: "text-red-600 text-xs mt-1", children: errors.booking_date }),
                      errors.time_slot && /* @__PURE__ */ jsx("p", { className: "text-red-600 text-xs mt-1", children: errors.time_slot })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 mt-4", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "bg-gray-300 rounded px-4 py-2",
                          onClick: () => setEditingItem(null),
                          children: "Cancel"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          className: "bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700",
                          children: "Save"
                        }
                      )
                    ] })
                  ] })
                ]
              }
            )
          }
        )
      ] })
    }
  );
}
export {
  BookingHistory as default
};
