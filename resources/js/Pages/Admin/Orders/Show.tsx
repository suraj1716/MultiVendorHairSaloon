import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../AdminLayout";
import {
  AdminPageHeader, AdminBtn, StatusBadge, FlashMessage,
  ConfirmModal, Icons,
} from "../../../Components/Admin/AdminComponents";

interface OrderItem { id: number; title: string; image: string | null; quantity: number; price: number; subtotal: number; }
interface OrderProps {
  id: number; customer: string; customer_email: string; customer_phone: string;
  vendor: string; vendor_type: string; total_price: number; booking_fee: number;
  status: string; is_paid: boolean; payment_method: string | null; manual_paid_at: string | null;
  payment_intent: string | null; refunded_at: string | null; refund_amount: number | null;
  created_at: string; items: OrderItem[];
  booking: { id: number; booking_date: string; time_slot: string } | null;
}

interface Props {
  order: OrderProps;
  statuses: string[];
  flash: { success?: string; error?: string };
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text)", textAlign: "right" }}>{children}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-alt)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 3, height: 16, background: "var(--color-accent)", borderRadius: 2 }} />
        <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

export default function OrderShow({ order, statuses, flash }: Props) {
  const [showDelete, setShowDelete] = useState(false);
  const [status, setStatus]         = useState(order.status);
  const [saving, setSaving]         = useState(false);

  const handleStatusSave = () => {
    setSaving(true);
    router.patch(route("admin.orders.status", order.id), { status }, {
      preserveScroll: true,
      onFinish: () => setSaving(false),
    });
  };

  const handleRefund = () => {
    if (!confirm("Process a full Stripe refund?")) return;
    router.post(route("admin.orders.refund", order.id), {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    router.delete(route("admin.orders.destroy", order.id));
  };

  const isWalkIn = !!order.payment_method && !order.payment_intent;

  return (
    <>
      <Head title={`Order #${order.id}`} />
      <AdminLayout>
        <AdminPageHeader
          eyebrow="Commerce"
          title={<>Order <em style={{ fontStyle: "italic", color: "var(--color-accent-light)" }}>#{order.id}</em></>}
          meta={`Created ${order.created_at}`}
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <AdminBtn as="a" href={route("admin.orders.edit", order.id)} variant="ghost">
                <Icons.Edit /> Edit
              </AdminBtn>
                 <AdminBtn onClick={() => setShowDelete(true)} variant="danger">
                  <Icons.Delete /> Delete Order
                </AdminBtn>
              <AdminBtn as="a" href={route("admin.orders.index")} variant="ghost">
                <Icons.Back /> Orders
              </AdminBtn>
            </div>
          }
        />

        <FlashMessage flash={flash} />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 20, alignItems: "start" }}>

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Items */}
            <SectionCard title="Order Items">
              <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--color-bg-alt)", borderBottom: "1px solid var(--color-border)" }}>
                      {["", "Product", "Qty", "Unit Price", "Subtotal"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", flexShrink: 0 }}>
                            {item.image
                              ? <img src={`/storage/${item.image}`} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}><Icons.Image /></div>
                            }
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text)" }}>{item.title}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)" }}>×{item.quantity}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)" }}>A${Number(item.price).toFixed(2)}</td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-primary)", fontWeight: 500 }}>A${Number(item.subtotal).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    {order.booking_fee > 0 && (
                      <tr style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-bg-alt)" }}>
                        <td colSpan={4} style={{ padding: "10px 12px", textAlign: "right", fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Booking Fee</td>
                        <td style={{ padding: "10px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text-muted)" }}>A${Number(order.booking_fee).toFixed(2)}</td>
                      </tr>
                    )}
                    <tr style={{ borderTop: "2px solid var(--color-border)", background: "var(--color-bg-alt)" }}>
                      <td colSpan={4} style={{ padding: "12px", textAlign: "right", fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>Order Total</td>
                      <td style={{ padding: "12px", fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--color-primary)" }}>A${Number(order.total_price).toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </SectionCard>

            {/* Booking */}
            {order.booking && (
              <SectionCard title="Booking">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: "14px 16px", background: "var(--color-bg-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 6 }}>Date</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text)", fontWeight: 500 }}>{order.booking.booking_date}</div>
                  </div>
                  <div style={{ padding: "14px 16px", background: "var(--color-bg-alt)", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: 6 }}>Time Slot</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--color-text)", fontWeight: 500 }}>{order.booking.time_slot}</div>
                  </div>
                </div>
              </SectionCard>
            )}

          </div>

          {/* ── RIGHT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Customer */}
            <SectionCard title="Customer">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <InfoRow label="Name">{order.customer}</InfoRow>
                <InfoRow label="Email">{order.customer_email}</InfoRow>
                {order.customer_phone && <InfoRow label="Phone">{order.customer_phone}</InfoRow>}
                <InfoRow label="Vendor">{order.vendor}</InfoRow>
              </div>
            </SectionCard>

            {/* Payment */}
            <SectionCard title="Payment">
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <InfoRow label="Status">
                  <StatusBadge status={order.is_paid ? "paid" : "draft"} />
                </InfoRow>
                {order.payment_method && (
                  <InfoRow label="Method">
                    <span style={{ textTransform: "uppercase", fontSize: 11, letterSpacing: "0.1em" }}>{order.payment_method}</span>
                    {isWalkIn && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--color-accent)", background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.25)", padding: "1px 6px", borderRadius: "var(--radius-full)" }}>Walk-in</span>}
                  </InfoRow>
                )}
                {order.manual_paid_at && <InfoRow label="Paid at">{order.manual_paid_at}</InfoRow>}
                {order.payment_intent && <InfoRow label="Stripe PI"><span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--color-text-muted)" }}>{order.payment_intent.slice(0, 24)}…</span></InfoRow>}
                {order.refunded_at && (
                  <>
                    <InfoRow label="Refunded">A${order.refund_amount}</InfoRow>
                    <InfoRow label="Refund date">{order.refunded_at}</InfoRow>
                  </>
                )}
              </div>
            </SectionCard>

            {/* Status control */}
            <SectionCard title="Order Status">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--color-text)", background: "var(--color-bg-alt)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", outline: "none" }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <AdminBtn onClick={handleStatusSave} disabled={saving || status === order.status} variant="primary">
                  <Icons.Check /> {saving ? "Saving…" : "Update Status"}
                </AdminBtn>
              </div>
            </SectionCard>


          </div>
        </div>

        {showDelete && (
          <ConfirmModal
            title={`Delete Order #${order.id}?`}
            description={`This will permanently delete the order for ${order.customer} including all items and any linked booking.`}
            confirmLabel="Delete Order"
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
          />
        )}
      </AdminLayout>
    </>
  );
}
