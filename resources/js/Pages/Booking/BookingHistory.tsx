import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginationProps, Order, OrderItem } from "@/types";
import BookingWidget from "./BookingWidget";
import { title } from "process";

function ConfirmationModal({
  open,
  bookingDate,
  timeSlot,
  onSave,
  onCancel,
}: {
  open: boolean;
  bookingDate: string;
  timeSlot: string;
  onSave: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Booking</h3>
        <p className="mb-2">
          <strong>Date:</strong> {bookingDate}
        </p>
        <p className="mb-4">
          <strong>Time:</strong> {timeSlot}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingHistory() {
  const { orders } =
    usePage<PageProps<{ orders: PaginationProps<Order> }>>().props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [errors, setErrors] = useState<{
    booking_date?: string;
    time_slot?: string;
  }>({});
  const today = new Date().toISOString().split("T")[0];

  const handleEditBooking = (item: OrderItem) => {
    if (!item.booking) return;
    setEditingItem(item);
    setBookingDate(item.booking.booking_date);
    setTimeSlot(item.booking.time_slot);
    setErrors({});
    setDialogOpen(true);
  };
  const handleCancelBooking = (
    item: OrderItem,
    orderStatus: string,
    order: Order,
  ) => {
    if (orderStatus !== "draft" && orderStatus !== "paid") {
      console.warn(
        "Booking can only be cancelled when order is draft or paid.",
      );
      return;
    }
    if (!item.booking?.id) {
      console.error("Booking ID is missing.");
      return;
    }

    // Check 24-hour window
    const bookingDate = new Date(item.booking.booking_date);
    const now = new Date();
    const hoursUntilBooking =
      (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      alert(
        "⚠️ Cancellations within 24 hours are not allowed. Please contact support.",
      );
      return;
    }

    const refundAmount = order.total_price - order.booking_fee;

    if (
      confirm(
        `⚠️ Are you sure?\n\n` +
          `Total paid: $${order.total_price.toFixed(2)}\n` +
          `Booking fee (non-refundable): -$${order.booking_fee.toFixed(2)}\n` +
          `You'll receive: $${refundAmount.toFixed(2)}\n\n` +
          `Alternatively, you can edit the booking to change the date/time.`,
      )
    ) {
      router.post(
        route("bookings.cancel", item.booking.id),
        {},
        {
          onSuccess: () => {
            alert("Booking cancelled. Refund will be processed.");
          },
          onError: (errors) => {
            console.error("Failed to cancel booking", errors);
            alert("Cancellation failed. Please try again.");
          },
        },
      );
    }
  };

  const handleConfirmBooking = (date: string, slot: string) => {
    if (!editingItem || !editingItem.booking) {
      console.warn("Missing editingItem or booking");
      return;
    }

    router.put(
      route("bookings.update", editingItem.booking.id),
      { booking_date: date, time_slot: slot },
      {
        onSuccess: () => {
          setEditingItem(null);
          setConfirmModalOpen(false);
          setErrors({});
        },
        onError: (errorBag) => {
          setErrors(errorBag);
          setConfirmModalOpen(false);
          setDialogOpen(true);
        },
      },
    );
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-lg font-semibold text-gray-800">Order History</h2>
      }
    >
      <div className="max-w-4xl mx-auto p-4 overflow-auto">
        {orders?.data?.length === 0 ? (
          <p className="text-gray-600 text-sm">You have no orders yet.</p>
        ) : (
          orders.data.map(
            (order) =>
              order.vendor.vendor_type === "appointment" && (
                <div
                  key={order.id}
                  className="bg-white shadow rounded-md mb-6 p-4 overflow-auto"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 border-b border-gray-200 pb-1 text-sm text-gray-700">
                    <div>
                      <span className="font-semibold">Order #</span>
                      {order.id} |{" "}
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="capitalize">{order.status}</span> |{" "}
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${Number(order.total_price).toFixed(2)}
                    </div>
                  </div>

                  <div className="mb-3 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Vendor:</span>{" "}
                      {order.vendor.store_address}
                    </div>
                    <div>
                      <span className="font-semibold">Store:</span>{" "}
                      {order.vendor.store_name}
                    </div>
                    <div>
                      <span className="font-semibold">Address:</span>{" "}
                      {order.vendor.store_address}
                    </div>

                    {(order.status === "draft" || order.status === "draft") && (
                      <div className="mt-1 p-1 flex gap-2">
                        <button
                          className="inline-block px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                          onClick={() => {
                            const itemToEdit = order.orderItems.find(
                              (item) =>
                                item.booking &&
                                today < item.booking.booking_date,
                            );
                            if (itemToEdit) {
                              handleEditBooking(itemToEdit);
                            } else {
                              alert("No editable booking found in this order.");
                            }
                          }}
                        >
                          Edit Booking
                        </button>
                      </div>
                    )}

                    {order.status === "paid" || order.status === "draft" ? (
                      (() => {
                        const cancellableItem = order.orderItems.find(
                          (item) =>
                            item.booking && today < item.booking.booking_date,
                        );

                        if (cancellableItem) {
                          return (
                            <div className="mt-1 p-1">
                              <button
                                onClick={() =>
                                  handleCancelBooking(
                                    cancellableItem,
                                    order.status,
                                    order, // ← Pass full order object
                                  )
                                }
                                className="text-red-600 hover:underline"
                              >
                                Cancel Booking
                              </button>
                            </div>
                          );
                        }
                        return <span className="text-gray-500">Completed</span>;
                      })()
                    ) : order.status === "cancelled" ? (
                      <button
                        disabled
                        className="text-red-600 cursor-not-allowed"
                      >
                        Cancelled
                      </button>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </div>

                  <table className="w-full text-sm border-collapse table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Product</th>
                        <th className="border p-2 text-left">
                          Product Variation
                        </th>
                        <th className="border p-2 text-left">Booking Date</th>
                        <th className="border p-2 text-left">Booking Time</th>
                        <th className="border p-2 text-left w-12">Qty</th>
                        <th className="border p-2 text-left w-24">Price</th>
                        {/* <th className="border p-2 text-left w-32">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border p-2 flex items-center gap-2">
                            <img
                              src={
                                item.product.image || "/images/placeholder.png"
                              }
                              alt={item.product.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                            <Link
                              href={route("product.show", {
                                slug: item.product.slug,
                              })} // use slug here and plural products
                              className="text-gray-800 hover:underline truncate max-w-xs"
                            >
                              {item.product.title}
                            </Link>
                          </td>
                          <td className="border p-2">
                            {(item.variation_summary ?? []).length > 0
                              ? (item.variation_summary ?? []).map((v, i) => (
                                  <div key={i}>
                                    <span className="font-semibold">
                                      {v.type}:
                                    </span>{" "}
                                    {v.option}
                                  </div>
                                ))
                              : "—"}
                          </td>
                          <td className="border p-2">
                            {item.booking?.booking_date || "—"}
                          </td>
                          <td className="border p-2">
                            {item.booking?.time_slot || "—"}
                          </td>
                          <td className="border p-2">{item.quantity}</td>
                          <td className="border p-2">
                            ${Number(item.price).toFixed(2)}
                          </td>
                          {/* <td className="border p-2">
                            {(order.status === "paid" ||
                              order.status === "draft") &&
                            item.booking &&
                            today < item.booking.booking_date ? (
                              <button
                                onClick={() =>
                                  handleCancelBooking(item, order.status)
                                }
                                className="text-red-600 hover:underline"
                              >
                                Cancel Booking
                              </button>
                            ) : order.status === "cancelled" ? (
                              <button
                                disabled
                                className="text-red-600 cursor-not-allowed"
                              >
                                Cancelled
                              </button>
                            ) : (
                              <span className="text-gray-500">Completed</span>
                            )}
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
          )
        )}

        {/* BookingWidget modal */}
        {editingItem && (
          <BookingWidget
            bookingDate={bookingDate}
            setBookingDate={setBookingDate}
            timeSlot={timeSlot}
            setTimeSlot={(slot) => {
              setTimeSlot(slot);
              if (slot && bookingDate) {
                setDialogOpen(false);
                setConfirmModalOpen(true);
              }
            }}
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
            }}
            vendorId={
              orders?.data.find((order) =>
                order.orderItems.some((item) => item.id === editingItem.id),
              )?.vendor.id ?? null
            }
            onSubmit={() => {}}
          />
        )}

        {/* Confirmation modal */}
        <ConfirmationModal
          open={confirmModalOpen}
          bookingDate={bookingDate}
          timeSlot={timeSlot}
          onCancel={() => {
            setConfirmModalOpen(false);
            setDialogOpen(true);
          }}
          onSave={() => {
            handleConfirmBooking(bookingDate, timeSlot);
            setConfirmModalOpen(false);
          }}
        />
      </div>
    </AuthenticatedLayout>
  );
}
