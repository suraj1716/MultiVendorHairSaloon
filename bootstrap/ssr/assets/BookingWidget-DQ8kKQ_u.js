import { jsxs, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogOverlay as DialogOverlay$1, DialogTitle as DialogTitle$1 } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DayPicker } from "react-day-picker";
import dayjs from "dayjs";
import AvailableSlots from "./AvailableSlots-BiD8K0YY.js";
import "dayjs/plugin/isSameOrAfter.js";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function BookingWidget({
  bookingDate,
  setBookingDate,
  timeSlot,
  setTimeSlot,
  open,
  onOpenChange,
  vendorId,
  // add vendorId here
  onSubmit
}) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [closedDates, setClosedDates] = useState([]);
  const [recurringClosedDays, setRecurringClosedDays] = useState([]);
  useEffect(() => {
    if (!bookingDate) {
      setAvailableTimeSlots([]);
      setTimeSlot("");
      return;
    }
    async function fetchTimeSlots() {
      setLoadingSlots(true);
      setError(null);
      setTimeSlot("");
      try {
        const response = await axios.get(`/booking/available-slots`, {
          params: { date: bookingDate, vendorId }
        });
        const { availableSlots, message, closedDates: closedDates2, recurringClosedDays: recurringClosedDays2 } = response.data;
        setAvailableTimeSlots(
          Array.isArray(availableSlots) ? availableSlots : []
        );
        if (closedDates2 && Array.isArray(closedDates2)) {
          setClosedDates(closedDates2);
        }
        if (recurringClosedDays2 && Array.isArray(recurringClosedDays2)) {
          setRecurringClosedDays(recurringClosedDays2.map(Number));
        }
        if (message && message.toLowerCase().includes("error")) {
          setError(message);
        } else {
          setError(null);
        }
      } catch (err) {
        setError("Failed to load time slots.");
        setAvailableTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchTimeSlots();
  }, [bookingDate, vendorId]);
  const closedDatesAsDateObjects = closedDates.map((d) => new Date(d));
  const disabledDays = [
    { before: /* @__PURE__ */ new Date() },
    ...recurringClosedDays.length > 0 ? [{ dayOfWeek: recurringClosedDays }] : [],
    // Correct structure
    ...closedDatesAsDateObjects
  ];
  return /* @__PURE__ */ jsx("div", { className: "space-y-2  ", children: /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsx(DialogOverlay$1, { className: "fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" }),
    /* @__PURE__ */ jsxs(
      DialogContent,
      {
        className: "fixed top-1/2 left-1/2 xs:p-7 -translate-x-1/2 -translate-y-1/2\n               z-[9999] bg-white rounded-lg shadow-lg p-6 max-w-lg max-h-[90vh] overflow-y-auto",
        children: [
          /* @__PURE__ */ jsx(DialogTitle$1, { className: "text-lg font-bold mb-4", children: "Select Booking Details" }),
          /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm sm:max-w-md md:max-w-lg p-6 max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium mb-2", children: "Select Date:" }),
              /* @__PURE__ */ jsx(
                DayPicker,
                {
                  mode: "single",
                  selected: bookingDate ? new Date(bookingDate) : void 0,
                  onSelect: (date) => setBookingDate(date ? dayjs(date).format("YYYY-MM-DD") : ""),
                  disabled: disabledDays
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block font-medium mb-2", children: "Select Time Slot:" }),
              loadingSlots ? /* @__PURE__ */ jsx("p", { children: "Loading available slots..." }) : error ? /* @__PURE__ */ jsx("p", { className: "text-red-600", children: error }) : availableTimeSlots.length > 0 ? /* @__PURE__ */ jsx(
                AvailableSlots,
                {
                  date: bookingDate,
                  availableSlots: availableTimeSlots,
                  selectedSlot: timeSlot,
                  onSelect: (slot) => {
                    setTimeSlot(slot);
                    onOpenChange(false);
                  }
                }
              ) : /* @__PURE__ */ jsx("p", { children: "No available slots." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn-secondary",
                  onClick: () => onOpenChange(false),
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn-primary",
                  onClick: () => {
                    onOpenChange(false);
                  },
                  disabled: !bookingDate || !timeSlot,
                  children: "Confirm Booking"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
export {
  BookingWidget as default
};
