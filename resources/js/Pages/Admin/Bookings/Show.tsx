import { Head, Link, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "../AdminLayout";
import { StatusBadge } from "../../../Components/Admin/AdminComponents";

type Props = {
  booking: {
    id: number;
    booking_date: string;
    time_slot: string;
    notes: string | null;
    created_at: string;
    customer: { name: string; email: string; phone: string };
    order: {
      id: number;
      status: string;
      is_paid: boolean;
      total_price: number;
      vendor: string;
      items: { id: number; title: string; quantity: number; price: number; subtotal: number }[];
    } | null;
  };
};

export default function BookingShow({ booking }: Props) {
  const handleCancel = () => {
    if (!confirm("Cancel this booking? The linked order will also be cancelled.")) return;
    router.post(route("admin.bookings.cancel", booking.id), {}, {
      onSuccess: () => toast.success("Booking cancelled"),
      onError: () => toast.error("Failed"),
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this booking permanently?")) return;
    router.delete(route("admin.bookings.destroy", booking.id), {
      onSuccess: () => toast.success("Booking deleted"),
      onError: () => toast.error("Failed"),
    });
  };

  const sectionStyle: React.CSSProperties = {
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    marginBottom: "var(--space-lg)",
  };
  const sectionHead: React.CSSProperties = {
    padding: "var(--space-md) var(--space-xl)",
    borderBottom: "1px solid var(--color-border)",
    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
    letterSpacing: "0.15em", textTransform: "uppercase",
    color: "var(--color-text-light)", fontWeight: 500,
  };
  const sectionBody: React.CSSProperties = { padding: "var(--space-xl)" };
  const row: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "140px 1fr",
    gap: "var(--space-sm)", paddingBottom: "var(--space-sm)",
    borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-sm)",
  };
  const label: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
    letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-light)",
  };
  const value: React.CSSProperties = {
    fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)",
  };
  const btnStyle = (color: string): React.CSSProperties => ({
    background: "transparent", border: `1px solid ${color}`, color,
    fontFamily: "var(--font-body)", fontSize: "var(--text-xs)",
    letterSpacing: "0.1em", textTransform: "uppercase",
    padding: "0.6rem 1.25rem", cursor: "pointer", textDecoration: "none",
    display: "inline-block",
  });

  return (
    <AdminLayout>
      <Head title={`Booking #${booking.id}`} />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-2xl)" }}>
        <div>
          <Link href={route("admin.bookings.index")} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-light)", textDecoration: "none", display: "inline-block", marginBottom: "var(--space-sm)" }}>
            ← Bookings
          </Link>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3vw,2.25rem)", fontWeight: 300, color: "var(--color-text)", margin: 0 }}>
            Booking #{booking.id}
          </h1>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", color: "var(--color-text-light)" }}>
            Created {booking.created_at}
          </span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <Link href={route("admin.bookings.edit", booking.id)} style={btnStyle("var(--color-primary)")}>Edit</Link>
          <button onClick={handleCancel} style={btnStyle("var(--color-warning)")}>Cancel Booking</button>
          <button onClick={handleDelete} style={btnStyle("var(--color-error)")}>Delete</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "var(--space-lg)", alignItems: "start" }}>
        <div>
          {/* Booking details */}
          <div style={sectionStyle}>
            <div style={sectionHead}>Booking Details</div>
            <div style={sectionBody}>
              <div style={row}>
                <span style={label}>Date</span>
                <span style={value}>{booking.booking_date}</span>
              </div>
              <div style={row}>
                <span style={label}>Time Slot</span>
                <span style={value}>{booking.time_slot}</span>
              </div>
              <div style={{ ...row, borderBottom: "none", marginBottom: 0 }}>
                <span style={label}>Notes</span>
                <span style={value}>{booking.notes || "—"}</span>
              </div>
            </div>
          </div>

          {/* Order */}
          {booking.order && (
            <div style={sectionStyle}>
              <div style={sectionHead}>Linked Order</div>
              <div style={{ padding: "var(--space-lg) var(--space-xl)", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>#{booking.order.id}</span>
                  <StatusBadge status={booking.order.status} />
                  {booking.order.is_paid && <StatusBadge status="paid" />}
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{booking.order.vendor}</span>
                </div>
                <Link href={route("admin.orders.show", booking.order.id)} style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-primary)", textDecoration: "none" }}>
                  View Order →
                </Link>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Item", "Qty", "Price", "Subtotal"].map(h => (
                      <th key={h} style={{ padding: "var(--space-sm) var(--space-lg)", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-light)", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {booking.order.items.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: i < booking.order!.items.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>{item.title}</td>
                      <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>{item.quantity}</td>
                      <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>A${item.price}</td>
                      <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-primary)", fontWeight: 500 }}>A${item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: "2px solid var(--color-border)" }}>
                    <td colSpan={3} style={{ padding: "var(--space-md) var(--space-lg)", textAlign: "right", fontFamily: "var(--font-body)", fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-text-light)" }}>Total</td>
                    <td style={{ padding: "var(--space-md) var(--space-lg)", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", color: "var(--color-primary)" }}>A${booking.order.total_price}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Customer sidebar */}
        <div style={sectionStyle}>
          <div style={sectionHead}>Customer</div>
          <div style={sectionBody}>
            <div style={row}>
              <span style={label}>Name</span>
              <span style={value}>{booking.customer.name}</span>
            </div>
            <div style={row}>
              <span style={label}>Email</span>
              <span style={value}>{booking.customer.email}</span>
            </div>
            <div style={{ ...row, borderBottom: "none", marginBottom: 0 }}>
              <span style={label}>Phone</span>
              <span style={value}>{booking.customer.phone || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
