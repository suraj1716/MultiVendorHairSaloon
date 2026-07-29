import { FormEventHandler, FormEvent, useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import Modal from "@/Components/App/ui/Modal";
import Button from "@/Components/App/ui/Button";
import Badge from "@/Components/App/ui/Badge";
import {
  label,
  input,
  err,
  fieldWrap,
} from "@/Components/App/formStyles";

const indexToWeekday: Record<string, string> = {
  "0": "sunday",
  "1": "monday",
  "2": "tuesday",
  "3": "wednesday",
  "4": "thursday",
  "5": "friday",
  "6": "saturday",
};
const weekdayToIndex: Record<string, string> = Object.fromEntries(
  Object.entries(indexToWeekday).map(([k, v]) => [v, k])
);

type VendorDetailsProps = { className?: string };

export default function VendorDetails({ className }: VendorDetailsProps) {
  const [showBecomeVendorConfirmation, setShowBecomeVendorConfirmation] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const user = usePage().props.auth.user;
  const token = usePage().props.csrf_token;

  const { data, setData, errors, post, processing, recentlySuccessful } =
    useForm({
      store_name: "",
      store_address: "",
      booking_fee: "",
      vendor_type: "",
      start_time: "",
      end_time: "",
      slot_interval: 15,
      recurring_closed_days: [] as string[],
      closed_dates: [] as string[],
    });

  const vendor = user.vendor;

  useEffect(() => {
    if (vendor && vendor.status === "approved") {
      const cleanedRecurringDays = (vendor.recurring_closed_days ?? [])
        .flat()
        .map(String)
        .filter(
          (day, index, self) =>
            ["0", "1", "2", "3", "4", "5", "6"].includes(day) &&
            self.indexOf(day) === index
        )
        .map((dayIndex) => indexToWeekday[dayIndex]);

      setData({
        store_name: vendor.store_name ?? "",
        store_address: vendor.store_address ?? "",
        booking_fee: vendor.booking_fee ?? "",
        vendor_type: vendor.vendor_type ?? "",
        start_time: vendor.business_start_time ?? "",
        end_time: vendor.business_end_time ?? "",
        slot_interval: vendor.slot_interval_minutes ?? 15,
        recurring_closed_days: cleanedRecurringDays,
        closed_dates:
          vendor.closed_dates
            ?.flat()
            .filter((d): d is string => typeof d === "string") ?? [],
      });
    }
  }, [vendor]);

  const onStoreNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setData("store_name", ev.target.value.toLowerCase().replace(/\s+/g, "-"));
  };

  const becomeVendor: FormEventHandler = (ev: FormEvent<Element>) => {
    ev.preventDefault();
    post(route("vendor.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage("you can now create and publish products");
      },
      onError: () => {},
    });
  };

  const updateVendor: FormEventHandler = (ev) => {
    ev.preventDefault();
    const recurringClosedDaysAsIndices = data.recurring_closed_days
      .map((day) => weekdayToIndex[day.toLowerCase()])
      .filter((val): val is string => typeof val === "string");

    setData({
      ...data,
      recurring_closed_days: recurringClosedDaysAsIndices,
    });

    post(route("vendor.store"), {
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setSuccessMessage("your details were updated");
      },
    });
  };

  const closeModal = () => setShowBecomeVendorConfirmation(false);

  const vendorBadgeVariant =
    user?.vendor?.status === "pending"
      ? "warning"
      : user?.vendor?.status === "rejected"
      ? "error"
      : "success";

  return (
    <section className={className}>
      {recentlySuccessful && successMessage && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(58,125,68,0.08)",
            border: "1px solid rgba(58,125,68,0.25)",
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--color-success)",
          }}
        >
          {successMessage}
        </div>
      )}

      {user.vendor?.status && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Badge variant={vendorBadgeVariant}>{user.vendor.status_label}</Badge>
        </div>
      )}

      {!user.vendor && (
        <Button
          variant="primary"
          disabled={processing}
          onClick={() => setShowBecomeVendorConfirmation(true)}
        >
          Become a Vendor
        </Button>
      )}

      {user.vendor &&
        (user.vendor.status === "pending" || user.vendor.status === "rejected") && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)" }}>
            {user.vendor.status === "pending" &&
              "Your vendor request is under review. Please wait for approval."}
            {user.vendor.status === "rejected" &&
              "Your vendor request was rejected. Please contact support."}
          </p>
        )}

      {user.vendor && user.vendor.status === "approved" && (
        <>
          <form onSubmit={updateVendor} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={fieldWrap}>
              <label style={label} htmlFor="store_name">Store Name</label>
              <input
                id="store_name"
                style={input}
                value={data.store_name}
                onChange={onStoreNameChange}
                required
                autoFocus
                autoComplete="store_name"
              />
              {errors.store_name && <p style={err}>{errors.store_name}</p>}
            </div>

            <div style={fieldWrap}>
              <label style={label} htmlFor="booking_fee">Booking Fee (in AUD)</label>
              <input
                id="booking_fee"
                type="number"
                step="0.01"
                style={input}
                value={data.booking_fee}
                onChange={(e) => setData("booking_fee", e.target.value)}
              />
              {errors.booking_fee && <p style={err}>{errors.booking_fee}</p>}
            </div>

            <div style={fieldWrap}>
              <label style={label} htmlFor="vendor_type">Vendor Type</label>
              <select
                id="vendor_type"
                style={input}
                value={data.vendor_type}
                onChange={(e) => setData("vendor_type", e.target.value)}
              >
                <option value="">Select Vendor Type</option>
                <option value="appointment">Appointment</option>
                <option value="ecommerce">E-commerce</option>
              </select>
              {errors.vendor_type && <p style={err}>{errors.vendor_type}</p>}
            </div>

            <div style={fieldWrap}>
              <label style={label} htmlFor="store_address">Store Address</label>
              <textarea
                id="store_address"
                style={{ ...input, minHeight: 80, resize: "vertical" }}
                value={data.store_address}
                onChange={(e) => setData("store_address", e.target.value)}
                placeholder="Enter your Store Address"
              />
              {errors.store_address && <p style={err}>{errors.store_address}</p>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={fieldWrap}>
                <label style={label} htmlFor="start_time">Start Time</label>
                <input
                  id="start_time"
                  type="time"
                  style={input}
                  value={data.start_time}
                  onChange={(e) => setData("start_time", e.target.value)}
                />
                {errors.start_time && <p style={err}>{errors.start_time}</p>}
              </div>

              <div style={fieldWrap}>
                <label style={label} htmlFor="end_time">End Time</label>
                <input
                  id="end_time"
                  type="time"
                  style={input}
                  value={data.end_time}
                  onChange={(e) => setData("end_time", e.target.value)}
                />
                {errors.end_time && <p style={err}>{errors.end_time}</p>}
              </div>
            </div>

            <div style={fieldWrap}>
              <label style={label} htmlFor="slot_interval">Slot Interval (minutes)</label>
              <input
                id="slot_interval"
                type="number"
                min={5}
                style={input}
                value={data.slot_interval}
                onChange={(e) => setData("slot_interval", Number(e.target.value))}
              />
              {errors.slot_interval && <p style={err}>{errors.slot_interval}</p>}
            </div>

            <div style={fieldWrap}>
              <label style={label}>Closed Days</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ].map((day) => (
                  <label
                    key={day}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: "var(--font-body)",
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{ accentColor: "var(--color-accent)", width: 14, height: 14 }}
                      checked={data.recurring_closed_days.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setData("recurring_closed_days", [
                            ...data.recurring_closed_days,
                            day,
                          ]);
                        } else {
                          setData(
                            "recurring_closed_days",
                            data.recurring_closed_days.filter((d) => d !== day)
                          );
                        }
                      }}
                    />
                    <span style={{ textTransform: "capitalize" }}>{day}</span>
                  </label>
                ))}
              </div>
              {errors.recurring_closed_days && <p style={err}>{errors.recurring_closed_days}</p>}
            </div>

            <div style={fieldWrap}>
              <label style={label} htmlFor="closed_dates">Closed Dates (comma separated)</label>
              <input
                id="closed_dates"
                type="text"
                style={input}
                placeholder="YYYY-MM-DD, YYYY-MM-DD"
                value={data.closed_dates.join(", ")}
                onChange={(e) => {
                  const dates = e.target.value
                    .split(",")
                    .map((date) => date.trim())
                    .filter(Boolean);
                  setData("closed_dates", dates);
                }}
              />
              {errors.closed_dates && <p style={err}>{errors.closed_dates}</p>}
            </div>

            <div>
              <Button type="submit" variant="primary" disabled={processing}>
                Update
              </Button>
            </div>
          </form>

          <form
            action={route("stripe.connect")}
            method="post"
            style={{ marginTop: 32 }}
          >
            <input type="hidden" name="_token" value={token} />
            {user.stripe_account_active && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  marginBottom: 12,
                }}
              >
                You are successfully connected to Stripe.
              </p>
            )}
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={user.stripe_account_active}
            >
              Connect to Stripe
            </Button>
          </form>
        </>
      )}

      <Modal show={showBecomeVendorConfirmation} onClose={closeModal}>
        <form onSubmit={becomeVendor} style={{ padding: 32 }}>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
            }}
          >
            Are you sure you want to be a Vendor?
          </h3>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={processing}>
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
