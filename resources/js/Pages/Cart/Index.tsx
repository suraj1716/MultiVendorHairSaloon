import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import BookingWidget from "@/Pages/Booking/BookingWidget";
import CartItem from "@/Components/App/CartItem";
import ShippingAddressSelector from "@/Components/App/ShippingAddressSelector";
import PrimaryButton from "@/Components/Core/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { Inertia, Method } from "@inertiajs/inertia";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { time } from "console";
import { Button } from "@/Components/ui/button"; // shadcn button
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { ShoppingCartIcon } from "@heroicons/react/20/solid";

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
  const [bookingDate, setBookingDate] = useState(
    () => localStorage.getItem("bookingDate") || ""
  );
  const [timeSlot, setTimeSlot] = useState(
    () => localStorage.getItem("timeSlot") || ""
  );
  const [bookingConfirmed, setBookingConfirmed] = useState(() => {
    const storedDate = localStorage.getItem("bookingDate");
    const storedSlot = localStorage.getItem("timeSlot");
    return !!(storedDate && storedSlot);
  });

  const { props } = usePage();
  type FlashProps = {
    success?: string;
    error?: string;
  };

  const flash: FlashProps = props.flash || {};
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success); // ← using react-toastify
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  useEffect(() => {
    localStorage.setItem("checkoutStep", step.toString());
  }, [step]);

  useEffect(() => {
    const currentRef = stepRefs.current[step - 1];
    if (currentRef) {
      currentRef.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      const storedDate = localStorage.getItem("bookingDate") || "";
      const storedSlot = localStorage.getItem("timeSlot") || "";

      setBookingDate(storedDate);
      setTimeSlot(storedSlot);

      setBookingConfirmed(!!(storedDate && storedSlot));
    }
  }, [step]);

  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedDate = localStorage.getItem("bookingDate") || "";
    const storedSlot = localStorage.getItem("timeSlot") || "";

    setBookingDate(storedDate);
    setTimeSlot(storedSlot);

    if (storedDate && storedSlot) {
      setBookingConfirmed(true);
    }
  }, []);

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

  useEffect(() => {
    if (bookingDate) {
      localStorage.setItem("bookingDate", bookingDate);
    }
  }, [bookingDate]);

  useEffect(() => {
    if (timeSlot) {
      localStorage.setItem("timeSlot", timeSlot);
    }
  }, [timeSlot]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Validation
    if (showShippingForm && !selectedAddressId) {
      return alert("Please select a shipping address.");
    }
    if (bookingConfirmed && (!bookingDate || !timeSlot)) {
      return alert("Please select booking date and time.");
    }

    setLoading(true);

    // pick out a single vendor ID (or leave null for “all vendors”)
    const primitiveVendorId = Array.isArray(vendorId) ? vendorId[0] : vendorId;

    // 2) Prepare and log the booking payload
    const bookingPayload = {
      booking_date: bookingDate,
      hasBooking: bookingConfirmed ? "1" : "0",
      hasShipping: showShippingForm ? "1" : "0",
      time_slot: timeSlot,
      vendor_user_id: primitiveVendorId,
    };
    console.log("📦 Booking POST payload:", bookingPayload);

    try {
      // 3) Save the booking
    await router.post(route("bookings.store"), bookingPayload, {
  preserveState: true,
  preserveScroll: true,
});

      // 4) Prepare and log the checkout payload
      const checkoutPayload = {
        shipping_address_id: selectedAddressId,
        vendor_id: null, // <-- null means “checkout all grouped vendors”
      };
      console.log("🧾 Checkout POST payload:", checkoutPayload);

      // 5) Trigger Stripe checkout
   router.visit(route("cart.checkout"), {
  method: "post",
  data: checkoutPayload,
  onError: (errors) => {
    console.error("Validation errors:", errors);
    // Show errors in UI as needed
  },
});


      // 6) Clean up localStorage & reset UI
      ["bookingDate", "timeSlot", "checkoutStep"].forEach((k) =>
        localStorage.removeItem(k)
      );
      setBookingDate("");
      setTimeSlot("");
      setBookingConfirmed(false);
      setStep(1);
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };


function EmptyCartMessage() {
return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[60vh] px-6 md:px-20 bg-gray-50 rounded-lg ">

      {/* Left side - icon */}
      <div className="flex items-center justify-center w-full md:w-1/2 mb-8 md:mb-0">
        <ShoppingCartIcon className="w-40 h-40 text-purple-600 opacity-70" />
      </div>

      {/* Right side - text + button */}
      <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Your Cart is Empty
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0">
          Looks like you haven’t added anything to your cart yet. Start shopping now and find something you love!
        </p>
        <Link
           href="/shop"
          className="inline-block bg-purple-600 text-white text-lg font-semibold rounded-md px-10 py-4 hover:bg-purple-700 transition"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}

  return (
    <AuthenticatedLayout>
      <Head title="Your Cart" />
{Object.keys(cartItems).length > 0 ? (
      <div className="max-w-7xl mx-auto px-8 py-10 bg-gray-50 min-h-screen">
        {/* Step Navigation */}
        <ScrollArea className="mb-8">
          <div className="flex items-center justify-center gap-10 px-4 min-w-max select-none">
            {["Cart", "Shipping/Booking", "Review"].map((label, index) => {
              const stepIndex = index + 1;
              const isCompleted = step > stepIndex;
              const isActive = step === stepIndex;

              return (
                <div
                  key={label}
                  ref={(el) => (stepRefs.current[index] = el)}
                  className="flex items-center gap-3"
                >
                  <Button
                    variant={
                      isActive ? "default" : isCompleted ? "outline" : "ghost"
                    }
                    size="sm"
                    className={`
                    w-12 h-12 rounded-full p-0 text-xl font-semibold transition-all duration-300
                    ${
                      isActive
                        ? "bg-purple-700 text-white"
                        : isCompleted
                        ? "border-purple-500 text-purple-600 hover:bg-purple-100"
                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                    }
                  `}
                    onClick={() => setStep(stepIndex)}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {stepIndex}
                  </Button>

                  <span
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-purple-700"
                        : isCompleted
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>

                  {index < 2 && (
                    <div className="w-14 h-[3px] rounded bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Step Content Wrapper */}
        <div className="mt-8">
          {/* Step 1: Shopping Cart */}
          {step === 1 && (
            <Card className=" rounded-lg border border-gray-200">
              <CardHeader className="border-b border-gray-300">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Step 1: Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.keys(cartItems).length === 0 && (
                  <p className="py-12 text-center text-gray-400 text-xl font-medium">
                    Your cart is empty.
                  </p>
                )}

                {Object.values(cartItems).map((group: any) => (
                  <section key={group.user.id} className="mb-8">
                    <div className="flex p-4 items-center justify-between pb-3 border-b border-gray-300 mb-4">
                      <Link
                        href="/"
                        className="underline text-xl font-semibold text-gray-800 hover:text-purple-600"
                      >
                        {group.user.name}
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((item: any) => (
                        <CartItem key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))}

                <div className="flex justify-end">
                  <Button
                    className="px-10 py-5 text-xl font-semibold rounded-md bg-purple-700 text-white hover:bg-purple-800 transition"
                    onClick={() => setStep(2)}
                  >
                    Next: Shipping / Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Shipping / Booking */}
          {step === 2 && (
            <Card className=" rounded-lg border border-gray-200">
              <CardHeader className="border-b border-gray-300">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Step 2: Shipping or Booking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Booking Section */}
                {hasAppointmentItems && !bookingDate && !timeSlot && (
                  <div className="p-6 mt-10 rounded-lg bg-yellow-50 border border-yellow-300">
                    <p className="text-xl font-semibold mb-3 text-yellow-900">
                      Your cart contains items that require a professional
                      installer:
                    </p>

                    {Object.values(cartItems)
                      .filter(
                        (group: any) => group.user.vendor_type === "appointment"
                      )
                      .map((group: any) => (
                        <div
                          key={group.user.id}
                          className="mb-6 p-5 rounded-lg bg-yellow-100 border border-yellow-400"
                        >
                          <p className="mb-3 font-semibold text-yellow-900 text-lg">
                            Would you like to book an appointment for items from{" "}
                            <span className="underline">{group.user.name}</span>
                            ?
                          </p>

                          <p className="mb-4 text-yellow-800 text-base">
                            Booking fee:{" "}
                            <strong>
                              ${parseFloat(group.user.booking_fee).toFixed(2)}
                            </strong>{" "}
                            added to subtotal.
                          </p>

                          <ul className="list-disc list-inside text-yellow-800 mb-5 text-base">
                            {group.items.map((item: any) => (
                              <li key={item.id}>
                                {item.title} — Qty: {item.quantity}
                              </li>
                            ))}
                          </ul>

                          <div className="flex-row space-y-4">
                            <Button
                              variant="default"
                              onClick={() => {
                                setBookingConfirmed(true);
                                setDialogOpen(true);
                              }}
                              className="px-8 py-3 text-lg font-semibold"
                            >
                              Yes, book installer
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Booking Widget */}
                {showBookingWidget && bookingConfirmed && (
                  <div className="relative w-screen/2 left-1/2 -translate-x-1/2 mt-6 mb-20">
                    <div className="bg-white border border-gray-200 rounded-lg  md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      {/* Left: Selected Date & Time */}
                      <div className="text-gray-800 space-y-2">
                        <p className="text-lg">
                          <strong className="text-lg">Selected Date:</strong>{" "}
                          {bookingDate}
                        </p>
                        <p className="text-lg">
                          <strong>Selected Time:</strong> {timeSlot}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          className="px-5 py-2 text-lg font-semibold rounded-md border-purple-600 text-purple-600 hover:bg-purple-50"
                          onClick={() => setDialogOpen(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="px-5 py-2 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            setBookingConfirmed(false);
                            setBookingDate("");
                            setTimeSlot("");
                            localStorage.removeItem("bookingDate");
                            localStorage.removeItem("timeSlot");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Shipping Address Form */}
                <form onSubmit={handleCheckout} className="space-y-6">
                  <input type="hidden" name="_token" value={csrf_token} />
                  {showShippingForm && (
                    <ShippingAddressSelector
                      shippingAddresses={shippingAddresses}
                      selectedAddressId={selectedAddressId}
                      setSelectedAddressId={setSelectedAddressId}
                    />
                  )}
                </form>
              </CardContent>

              {/* Subtotal */}
              <p className="mt-6 ml-10 font-semibold text-lg text-gray-900">
                Subtotal:{" "}
                <CurrencyFormatter
                  amount={bookingConfirmed ? subtotalWithBooking : totalPrice}
                  currency="AUD"
                />
                {bookingConfirmed && totalBookingFee > 0 && (
                  <span className="ml-2 text-base text-green-600">
                    (Includes ${totalBookingFee.toFixed(2)} booking fee)
                  </span>
                )}
              </p>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  className="flex-1 py-4 text-xl font-semibold rounded-md border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="flex-1 py-4 text-xl font-semibold rounded-md bg-purple-700 text-white  hover:bg-purple-800 transition"
                  onClick={() => {
                    if (showShippingForm && !selectedAddressId) {
                      alert("Please select a shipping address.");
                      return;
                    }
                    if (bookingConfirmed && (!bookingDate || !timeSlot)) {
                      alert("Please select a Booking Date & Time.");
                      return;
                    }
                    setStep(3);
                  }}
                >
                  Next: Review
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <Card className="space-y-8  rounded-lg border border-gray-200">
              <CardHeader className="border-b border-gray-300">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Step 3: Review Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Cart Items Summary */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 text-gray-900">
                    Shopping Cart
                  </h3>
                  {Object.keys(cartItems).length === 0 ? (
                    <p className="text-gray-400 text-center text-xl font-medium">
                      Your cart is empty.
                    </p>
                  ) : (
                    Object.values(cartItems).map((group: any) => (
                      <section
                        key={group.user.id}
                        className="mb-6 border border-gray-300 rounded-lg p-5 bg-white "
                      >
                        <div className="flex justify-between items-center mb-3">
                          <Link
                            href="/"
                            className="underline font-semibold text-gray-900 hover:text-purple-600 text-lg"
                          >
                            {group.user.name}
                          </Link>
                          <Button
                            variant="link"
                            size="lg"
                            className="bg-purple-600 text-white hover:bg-purple-700 text-lg font-semibold rounded-md mt-5 px-5 py-2"
                            onClick={() => setStep(1)}
                          >
                            Edit
                          </Button>
                        </div>
                        <ul className="space-y-2 text-gray-700 text-lg">
                          {group.items.map((item: any) => (
                            <li
                              key={item.id}
                              className="flex justify-between items-center"
                            >
                              <span>
                                {item.title} x {item.quantity}
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))
                  )}
                </div>

                {/* Booking Summary */}
                {hasAppointmentItems && (
          <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-6">
  <h3 className="font-semibold mb-3 text-yellow-900 text-xl">
    Installer Booking
  </h3>
  <p className="mb-3 text-yellow-900 text-lg">
    Booking confirmed: <strong>{bookingConfirmed ? "Yes" : "No"}</strong>
  </p>

  {bookingConfirmed && bookingDate && timeSlot && (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
      {/* Left: Date and Time */}
      <div className="space-y-2 text-gray-800 text-lg">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-purple-600" />
          <span>{bookingDate}</span>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-6 h-6 text-purple-600" />
          <span>{timeSlot}</span>
        </div>
      </div>

      {/* Right: Booking Fee + Edit Button stacked top-right on desktop */}
      <div className="flex flex-col items-start md:items-end space-y-2 mt-4 md:mt-0">
        <p className="font-semibold text-green-700 text-lg">
          Booking fee added: ${totalBookingFee.toFixed(2)}
        </p>
        <Button
          variant="link"
          size="lg"
          className="bg-purple-600 text-white hover:bg-purple-700 text-lg font-semibold rounded-md px-5 py-2"
          onClick={() => setStep(2)}
        >
          Edit Booking
        </Button>
      </div>
    </div>
  )}
</div>


                )}

                {/* Shipping Address Summary */}
              {selectedAddressId && showShippingForm && (
  <div className="border border-gray-300 rounded-lg p-6 bg-white">
    <h3 className="font-regular mb-3 text-gray-900 text-xl">Shipping Address</h3>
    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
      {/* Left: Address details */}
      <div className="text-gray-700 text-lg space-y-1 max-w-md">
        {(() => {
          const address = shippingAddresses.find(
            (addr: any) => addr.id === selectedAddressId
          );
          if (!address) return <p>No shipping address selected.</p>;
          return (
            <>
              <p>{address.full_name}</p>
              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>
                {address.city}, {address.state} {address.postcode}
              </p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </>
          );
        })()}
      </div>

      {/* Right: Edit button */}
      <div className="mt-4 md:mt-0 flex justify-start md:justify-end">
        <Button
          variant="link"
          size="lg"
          className="bg-purple-600 text-white hover:bg-purple-700 text-lg font-semibold rounded-md px-5 py-2"
          onClick={() => setStep(2)}
        >
          Edit Shipping
        </Button>
      </div>
    </div>
  </div>
)}


                {/* Subtotal */}
                <p className="font-semibold text-left text-2xl text-gray-900">
                  Subtotal:{" "}
                  <CurrencyFormatter
                    amount={bookingConfirmed ? subtotalWithBooking : totalPrice}
                    currency="AUD"
                  />
                </p>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-6">
                  <Button
                    variant="outline"
                    className="flex-1 py-4 text-xl lg:w-[50%] font-semibold rounded-md border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                   className="bg-purple-600 p-4 lg:w-[50%] text-white hover:bg-purple-700 text-lg font-semibold rounded-md px-5 py-2"

                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
) : (
  // Show empty cart message instead of navigation and step 1
  <EmptyCartMessage />
)}


    </AuthenticatedLayout>
  );
}

export default Index;
