// save as resources/js/Pages/Admin/Payouts/Invoice.tsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminLayout from "../AdminLayout";
import { AdminBtn, Icons } from "../../../Components/Admin/AdminComponents";
import { formatDate } from "@/utils/dateFormat";

interface OrderRow {
  id: number;
  created_at: string;
  total_price: number;
  voucher_discount: number | null;
  online_payment_comission: number | null; // Stripe's cut
  website_payment_comission: number | null; // platform's cut
  vendor_subtotal: number | null;
  refunded_at: string | null;
  refund_amount: number | null;
  payment_method: string | null;
  user: { id: number; name: string; email: string } | null;
}

interface Vendor {
  user_id: number;
  store_name: string;
  store_address?: string;
  user?: { name: string; email: string };
}

interface Payout {
  id: number;
  vendor: Vendor | null;
  amount: number;
  starting_from: string;
  until: string;
  created_at: string;
  orders: OrderRow[];
}

interface Props {
  payout: Payout;
}

const money = (n: number | null | undefined) => `A$${Number(n ?? 0).toFixed(2)}`;

export default function PayoutInvoice({ payout }: Props) {
  const orders = payout.orders ?? [];

  const totals = orders.reduce(
    (acc, o) => {
      acc.gross += Number(o.total_price ?? 0);
      acc.voucher += Number(o.voucher_discount ?? 0);
      acc.stripeFee += Number(o.online_payment_comission ?? 0);
      acc.platformFee += Number(o.website_payment_comission ?? 0);
      acc.netToVendor += Number(o.vendor_subtotal ?? 0);
      return acc;
    },
    { gross: 0, voucher: 0, stripeFee: 0, platformFee: 0, netToVendor: 0 },
  );

  const reconciled = Math.abs(totals.netToVendor - Number(payout.amount)) < 0.01;

  return (
    <>
      <Head title={`Payout Invoice #${payout.id}`} />
      <AdminLayout>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .invoice-sheet { box-shadow: none !important; border: none !important; }
          }
        `}</style>

        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Link
            href={route("admin.payouts.index")}
            style={{ fontSize: 12, color: "var(--color-text-muted)" }}
          >
            ← Back to Payouts
          </Link>
          <AdminBtn onClick={() => window.print()}>
            <Icons.Plus /> Print / Save as PDF
          </AdminBtn>
        </div>

        <div
          className="invoice-sheet"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            padding: 32,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "2px solid var(--color-border)",
              paddingBottom: 20,
              marginBottom: 24,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 22 }}>Payout Invoice</h1>
              <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                Reference #{payout.id} · Recorded {formatDate(payout.created_at)}
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div style={{ fontWeight: 600 }}>{payout.vendor?.store_name ?? "—"}</div>
              {payout.vendor?.store_address && <div>{payout.vendor.store_address}</div>}
              {payout.vendor?.user?.email && <div>{payout.vendor.user.email}</div>}
            </div>
          </div>

          {/* Period + reconciliation flag */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ fontSize: 13 }}>
              <strong>Period:</strong> {formatDate(payout.starting_from)} → {formatDate(payout.until)}
              <span style={{ marginLeft: 16, color: "var(--color-text-muted)" }}>
                {orders.length} order{orders.length === 1 ? "" : "s"} included
              </span>
            </div>
            {!reconciled && (
              <div style={{ fontSize: 12, color: "var(--color-error)" }}>
                ⚠ Recorded amount ({money(payout.amount)}) differs from the sum of
                vendor_subtotal below ({money(totals.netToVendor)}) — this payout's amount
                was edited manually.
              </div>
            )}
          </div>

          {/* Order breakdown table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                <th style={{ padding: "6px 4px" }}>Order</th>
                <th style={{ padding: "6px 4px" }}>Date</th>
                <th style={{ padding: "6px 4px" }}>Customer</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Gross Total</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Gift Card</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Stripe Fee</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Platform Fee</th>
                <th style={{ padding: "6px 4px", textAlign: "right" }}>Net to Vendor</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "6px 4px" }}>#{o.id}</td>
                  <td style={{ padding: "6px 4px", color: "var(--color-text-muted)" }}>
                    {o.created_at}
                  </td>
                  <td style={{ padding: "6px 4px" }}>{o.user?.name ?? "—"}</td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    {money(o.total_price)}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    {Number(o.voucher_discount) > 0 ? `−${money(o.voucher_discount)}` : "—"}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    −{money(o.online_payment_comission)}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right" }}>
                    −{money(o.website_payment_comission)}
                  </td>
                  <td style={{ padding: "6px 4px", textAlign: "right", fontWeight: 600 }}>
                    {money(o.vendor_subtotal)}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: 16, textAlign: "center", color: "var(--color-text-muted)" }}>
                    No orders are attached to this payout.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid var(--color-border)", fontWeight: 600 }}>
                <td colSpan={3} style={{ padding: "8px 4px" }}>
                  Totals
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right" }}>{money(totals.gross)}</td>
                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                  {totals.voucher > 0 ? `−${money(totals.voucher)}` : "—"}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                  −{money(totals.stripeFee)}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right" }}>
                  −{money(totals.platformFee)}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right", color: "var(--color-primary)" }}>
                  {money(totals.netToVendor)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginTop: 28,
            }}
          >
            {[
              ["Gross Revenue", money(totals.gross)],
              ["Stripe Fees", `−${money(totals.stripeFee)}`],
              ["Platform Fees", `−${money(totals.platformFee)}`],
              ["Recorded Payout", money(payout.amount)],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: 12,
                }}
              >
                <div style={{ fontSize: 10, color: "var(--color-text-muted)", textTransform: "uppercase" }}>
                  {label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value}</div>
              </div>
            ))}
          </div>

          {orders.some((o) => o.refunded_at) && (
            <div style={{ marginTop: 20, fontSize: 11, color: "var(--color-text-muted)" }}>
              Note: some orders in this period were later refunded. Refunded orders are
              excluded from future payout calculations automatically, but if a refund
              happened *after* this payout was recorded, reconcile manually.
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
