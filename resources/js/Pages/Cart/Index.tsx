import { useState } from "react";
import BookingWidget from "@/Pages/Booking/BookingWidget";
import CartItem from "@/Components/App/CartItem";
import ShippingAddressSelector from "@/Components/App/ShippingAddressSelector";
import PrimaryButton from "@/Components/Core/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import { Inertia, Method } from "@inertiajs/inertia";
import { Head, Link } from "@inertiajs/react";

function Index({
  csrf_token,
  cartItems,
  totalQuantity,
  totalPrice,
  shippingAddresses,
  bookings,
  showBookingWidget,
  showShippingForm,
  vendorId,
}: any) {
  const [selectedAddressId, setSelectedAddressId] = useState(
    shippingAddresses.find((a: any) => a.is_default)?.id ?? null
  );
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean | null>(
    null
  );
  const [bookingDate, setBookingDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 1. Check if any cart group has vendor_type "appointment"
  const hasAppointmentItems = Object.values(cartItems).some(
    (group: any) => group.user.vendor_type === "appointment"
  );

  // 2. Calculate total booking fee ONLY if user said "Yes"
  const totalBookingFee =
    bookingConfirmed === true
      ? Object.values(cartItems)
          .filter((group: any) => group.user.vendor_type === "appointment")
          .reduce((sum: number, group: any) => {
            const fee = parseFloat(group.user.booking_fee || "0");
            return sum + (isNaN(fee) ? 0 : fee);
          }, 0)
      : 0;

  // 3. Subtotal with booking fee added
  const subtotalWithBooking = totalPrice + totalBookingFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
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
        method: "POST" as Method,
        data: {
          booking_date: bookingDate,
          hasBooking: bookingConfirmed ? "1" : "0",
          hasShipping: showShippingForm ? "1" : "0",
          time_slot: timeSlot,
          vendor_user_id: vendorId,
        },
        preserveState: true,
        preserveScroll: true,
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
      addressInput.value = selectedAddressId!;
      form.appendChild(addressInput);

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      setLoading(false);
      alert("Failed to submit booking. Please try again.");
    }
  };

  return (
  <AuthenticatedLayout>
    <Head title="Your Cart" />

    <div className="container mx-auto p-8 flex flex-col lg:flex-row gap-4">
      {/* CART ITEMS */}
      <div className="card flex-1 bg-white dark:bg-gray-800 order-1 lg:order-2">
        <div className="card-body">
          <h2 className="text-lg font-bold">Shopping Cart</h2>

          {Object.keys(cartItems).length === 0 && (
            <p className="py-6 text-center text-gray-500">
              You don't have any items in your cart.
            </p>
          )}

          {Object.values(cartItems).map((group: any) => (
            <section key={group.user.id} className="mb-6">
              <div className="flex items-center justify-between pb-2 border-b">
                <Link href="/" className="underline">
                  {group.user.name}
                </Link>
              </div>
              {group.items.map((item: any) => (
                <CartItem key={item.id} item={item} />
              ))}
            </section>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="card flex-1 bg-white dark:bg-gray-800 lg:min-w-[260px] order-2 lg:order-2">
        <div className="card-body space-y-6">
          {/* Show installer question ONLY if appointment items AND user hasn't answered */}
          {hasAppointmentItems && bookingConfirmed === null && (
            <div className="mb-4 border p-4 rounded bg-yellow-50">
              <p className="font-semibold mb-2 text-gray-800">
                Your cart contains items that require a professional installer:
              </p>

              {Object.values(cartItems)
                .filter((group: any) => group.user.vendor_type === "appointment")
                .map((group: any) => (
                  <div
                    key={group.user.id}
                    className="mb-4 border border-yellow-300 bg-yellow-50 p-4 rounded"
                  >
                    <p className="mb-2 font-semibold text-gray-800">
                      Would you like to book an appointment to hire a professional installer for items from{" "}
                      <span className="underline">{group.user.name}</span>?
                    </p>

                    <p className="text-sm text-gray-700 mb-2">
                      Note: A booking fee of <strong>${parseFloat(group.user.booking_fee).toFixed(2)}</strong> will be added to your subtotal.
                    </p>

                    <ul className="list-disc list-inside text-gray-700 mb-3">
                      {group.items.map((item: any) => (
                        <li key={item.id}>
                          {item.title} — Qty: {item.quantity}
                        </li>
                      ))}
                    </ul>

                    <div>
                      <button
                        onClick={() => setBookingConfirmed(true)}
                        className="mr-2 px-3 py-1.5 bg-green-600 text-white rounded"
                      >
                        Yes, book installer
                      </button>
                      <button
                        onClick={() => setBookingConfirmed(false)}
                        className="px-3 py-1.5 bg-gray-300 rounded"
                      >
                        No, skip
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Booking widget */}
          {bookingConfirmed && showBookingWidget && (
            <div className="space-y-4 border p-4 rounded">
              <h3 className="font-bold text-lg">Book Appointment</h3>
              <button
                className="inline-block mb-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={() => setDialogOpen(true)}
              >
                Book Appointment
              </button>
              <BookingWidget
                bookingDate={bookingDate}
                setBookingDate={setBookingDate}
                timeSlot={timeSlot}
                setTimeSlot={setTimeSlot}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                vendorId={vendorId.length > 0 ? vendorId[0] : null}
                onSubmit={(date, slot) => {
                  setBookingDate(date);
                  setTimeSlot(slot);
                }}
              />
              {bookingDate && timeSlot && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Selected Date:</strong> {bookingDate}
                  </p>
                  <p>
                    <strong>Selected Time:</strong> {timeSlot}
                  </p>
                </div>
              )}
              <p className="text-green-700 mt-2">
                Booking fee added: ${totalBookingFee.toFixed(2)}
              </p>
            </div>
          )}

          {/* Subtotal */}
          <p className="mt-4 font-semibold">
            Subtotal:{" "}
            <CurrencyFormatter
              amount={bookingConfirmed ? subtotalWithBooking : totalPrice}
              currency="AUD"
            />
            {bookingConfirmed && totalBookingFee > 0 && (
              <span className="ml-2 text-sm text-green-600">
                (Includes ${totalBookingFee.toFixed(2)} booking fee)
              </span>
            )}
          </p>

          {/* Shipping form + checkout */}
          <form onSubmit={handleCheckout} className="space-y-4">
            <input type="hidden" name="_token" value={csrf_token} />
            {showShippingForm && (
              <ShippingAddressSelector
                shippingAddresses={shippingAddresses}
                selectedAddressId={selectedAddressId}
                setSelectedAddressId={setSelectedAddressId}
              />
            )}
            <PrimaryButton
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-full"
            >
              <CreditCardIcon className="size-5" />
              {loading ? "Processing..." : "Proceed to checkout"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
);

}

export default Index;
