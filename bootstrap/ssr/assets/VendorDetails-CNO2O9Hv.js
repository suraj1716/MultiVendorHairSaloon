import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { I as InputError } from "./InputError-DiSBWiye.js";
import { I as InputLabel } from "./InputLabel-BRjg4SBP.js";
import { M as Modal } from "./Modal-BeSeEOS3.js";
import { P as PrimaryButton } from "./PrimaryButton-Bj3LWgL6.js";
import { S as SecondaryButton } from "./SecondaryButton-CJNtUGec.js";
import { T as TextInput } from "./TextInput-kwtITkQ9.js";
import { usePage, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import "@headlessui/react";
const weekdayToIndex = {
  monday: "1",
  tuesday: "2",
  wednesday: "3",
  thursday: "4",
  friday: "5",
  saturday: "6",
  sunday: "0"
};
const indexToWeekday = {
  "0": "sunday",
  "1": "monday",
  "2": "tuesday",
  "3": "wednesday",
  "4": "thursday",
  "5": "friday",
  "6": "saturday"
};
function VendorDetails({ className }) {
  var _a;
  const [showBecomeVendorConfirmation, setShowBecomeVendorConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const user = usePage().props.auth.user;
  const token = usePage().props.csrf_token;
  const { data, setData, errors, post, processing, recentlySuccessful } = useForm({
    store_name: "",
    store_address: "",
    booking_fee: "",
    vendor_type: "",
    start_time: "",
    end_time: "",
    slot_interval: 15,
    recurring_closed_days: [],
    closed_dates: []
  });
  const vendor = user.vendor;
  useEffect(() => {
    var _a2;
    if (vendor && vendor.status === "approved") {
      const cleanedRecurringDays = (vendor.recurring_closed_days ?? []).flat().map(String).filter(
        (day, index, self) => ["0", "1", "2", "3", "4", "5", "6"].includes(day) && self.indexOf(day) === index
      ).map((dayIndex) => indexToWeekday[dayIndex]);
      setData({
        store_name: vendor.store_name ?? "",
        store_address: vendor.store_address ?? "",
        booking_fee: vendor.booking_fee ?? "",
        vendor_type: vendor.vendor_type ?? "",
        start_time: vendor.business_start_time ?? "",
        end_time: vendor.business_end_time ?? "",
        slot_interval: vendor.slot_interval_minutes ?? 15,
        recurring_closed_days: cleanedRecurringDays,
        // now day names for UI
        closed_dates: ((_a2 = vendor.closed_dates) == null ? void 0 : _a2.flat().filter((d) => typeof d === "string")) ?? []
      });
    }
  }, [vendor]);
  const onStoreNameChange = (ev) => {
    setData("store_name", ev.target.value.toLowerCase().replace(/\s+/g, "-"));
  };
  const becomeVendor = (ev) => {
    ev.preventDefault();
    post(route("vendor.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage("you can now create and publish products");
      },
      onError: () => {
      }
    });
  };
  const updateVendor = (ev) => {
    ev.preventDefault();
    const recurringClosedDaysAsIndices = data.recurring_closed_days.map((day) => weekdayToIndex[day.toLowerCase()]).filter((val) => typeof val === "string");
    setData({
      ...data,
      recurring_closed_days: recurringClosedDaysAsIndices
    });
    console.log(
      "Final recurring_closed_days sent:",
      recurringClosedDaysAsIndices
    );
    post(route("vendor.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage("your details were updated");
      }
    });
  };
  const closeModal = () => {
    setShowBecomeVendorConfirmation(false);
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    recentlySuccessful && /* @__PURE__ */ jsx("div", { className: "toast toast-top toast-end", children: /* @__PURE__ */ jsx("div", { className: "alert alert-success", children: /* @__PURE__ */ jsx("span", { children: successMessage }) }) }),
    /* @__PURE__ */ jsx("header", { children: /* @__PURE__ */ jsxs("h2", { className: "flex justify-between mb-8 text-lg font-medium text-gray-900 dark:text-gray-100", children: [
      "Vendor Details",
      ((_a = user.vendor) == null ? void 0 : _a.status) && /* @__PURE__ */ jsx(
        "span",
        {
          className: `badge ${user.vendor.status === "pending" ? "badge-warning" : user.vendor.status === "rejected" ? "badge-error" : "badge-success"}`,
          children: user.vendor.status_label
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      !user.vendor && /* @__PURE__ */ jsx(
        PrimaryButton,
        {
          disabled: processing,
          onClick: () => setShowBecomeVendorConfirmation(true),
          children: "Become a Vendor"
        }
      ),
      user.vendor && (user.vendor.status === "pending" || user.vendor.status === "rejected") && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-300", children: [
        user.vendor.status === "pending" && "Your vendor request is under review. Please wait for approval.",
        user.vendor.status === "rejected" && "Your vendor request was rejected. Please contact support."
      ] }),
      user.vendor && user.vendor.status === "approved" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: updateVendor, children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "store_name", value: "Store Name" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "store_name",
                className: "mt-1 block w-full",
                value: data.store_name,
                onChange: onStoreNameChange,
                required: true,
                isFocused: true,
                autoComplete: "store_name"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.store_name })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "booking_fee", value: "Booking Fee (in AUD)" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "booking_fee",
                type: "number",
                step: "0.01",
                className: "mt-1 block w-full",
                value: data.booking_fee,
                onChange: (e) => setData("booking_fee", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.booking_fee })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "vendor_type", value: "Vendor Type" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "vendor_type",
                className: "mt-1 block w-full rounded border-gray-300",
                value: data.vendor_type,
                onChange: (e) => setData("vendor_type", e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select Vendor Type" }),
                  /* @__PURE__ */ jsx("option", { value: "appointment", children: "Appointment" }),
                  /* @__PURE__ */ jsx("option", { value: "ecommerce", children: "E-commerce" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.vendor_type })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "store_address", value: "Store Address" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                className: "textarea textarea-bordered w-full mt-1",
                value: data.store_address,
                onChange: (e) => setData("store_address", e.target.value),
                placeholder: "Enter your Store Address"
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.store_address })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "start_time", value: "Start Time" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "start_time",
                type: "time",
                className: "mt-1 block w-full",
                value: data.start_time,
                onChange: (e) => setData("start_time", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.start_time })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { htmlFor: "end_time", value: "End Time" }),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "end_time",
                type: "time",
                className: "mt-1 block w-full",
                value: data.end_time,
                onChange: (e) => setData("end_time", e.target.value)
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.end_time })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "slot_interval",
                value: "Slot Interval (minutes)"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "slot_interval",
                type: "number",
                min: 5,
                className: "mt-1 block w-full",
                value: data.slot_interval,
                onChange: (e) => setData("slot_interval", Number(e.target.value))
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.slot_interval })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(InputLabel, { value: "Closed Days" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2", children: [
              "sunday",
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday"
            ].map((day) => /* @__PURE__ */ jsxs("label", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: data.recurring_closed_days.includes(day),
                  onChange: (e) => {
                    if (e.target.checked) {
                      setData("recurring_closed_days", [
                        ...data.recurring_closed_days,
                        day
                      ]);
                    } else {
                      setData(
                        "recurring_closed_days",
                        data.recurring_closed_days.filter(
                          (d) => d !== day
                        )
                      );
                    }
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "capitalize", children: day })
            ] }, day)) }),
            /* @__PURE__ */ jsx(
              InputError,
              {
                className: "mt-2",
                message: errors.recurring_closed_days
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx(
              InputLabel,
              {
                htmlFor: "closed_dates",
                value: "Closed Dates (comma separated)"
              }
            ),
            /* @__PURE__ */ jsx(
              TextInput,
              {
                id: "closed_dates",
                type: "text",
                className: "mt-1 block w-full",
                placeholder: "YYYY-MM-DD, YYYY-MM-DD",
                value: data.closed_dates.join(", "),
                onChange: (e) => {
                  const dates = e.target.value.split(",").map((date) => date.trim()).filter(Boolean);
                  setData("closed_dates", dates);
                }
              }
            ),
            /* @__PURE__ */ jsx(InputError, { className: "mt-2", message: errors.closed_dates })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsx(PrimaryButton, { disabled: processing, children: "Update" }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            action: route("stripe.connect"),
            method: "post",
            className: "my-8",
            children: [
              /* @__PURE__ */ jsx("input", { type: "hidden", name: "_token", value: token }),
              user.stripe_account_active && /* @__PURE__ */ jsx("div", { className: "text-center text-gray-600 my-4 text-sm", children: "You are successfully connected to Stripe." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn btn-primary w-full",
                  disabled: user.stripe_account_active,
                  children: "Connect to Stripe"
                }
              )
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { show: showBecomeVendorConfirmation, onClose: closeModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: becomeVendor, className: "p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: "Are you sure you want to be a Vendor?" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { className: "ms-3", disabled: processing, children: "Confirm" })
      ] })
    ] }) })
  ] });
}
export {
  VendorDetails as default
};
