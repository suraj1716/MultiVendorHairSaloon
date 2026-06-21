import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "../AdminLayout";
import {
  AdminPageHeader,
  AdminTable,
  AdminBtn,
  ActionBtn,
  FilterBar,
  Pagination,
  StatusBadge,
  Tr,
  Td,
  FlashMessage,
  ConfirmModal,
  Icons,
} from "../../../Components/Admin/AdminComponents";

interface Order {
  id: number;
  customer: string;
  customer_email: string;
  customer_phone: string;
  vendor: string;
  vendor_type: string;
  total_price: number;
  status: string;
  is_paid: boolean;
  payment_method: string | null;
  payment_intent: string | null;
  refunded_at: string | null;
  refund_amount: number | null;
  has_booking: boolean;
  created_at: string;
}

interface Props {
  orders: { data: Order[]; links: any[] };
  filters: Record<string, string>;
  statuses: string[];
  flash: { success?: string; error?: string };
  errors?: { error?: string };
}

export default function OrdersIndex({
  orders,
  filters,
  statuses,
  flash,
  errors,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const handleStatusChange = (id: number, status: string) => {
    router.patch(
      route("admin.orders.status", id),
      { status },
      { preserveScroll: true },
    );
  };

  const handleRefund = (id: number) => {
    if (!confirm("Process a full Stripe refund for this order?")) return;
    router.post(route("admin.orders.refund", id), {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    router.delete(route("admin.orders.destroy", deleteTarget.id), {
      onFinish: () => setDeleteTarget(null),
    });
  };

  return (
    <>
      <Head title="Orders" />
      <AdminLayout>
        <AdminPageHeader
          eyebrow="Commerce"
          title="Orders"
          meta={`${orders.data.length} records shown`}
          action={
            <div style={{ display: "flex", gap: 8 }}>
              <AdminBtn
                as="a"
                href={route("admin.orders.create")}
                variant="accent"
              >
                <Icons.Plus /> Walk-in Order
              </AdminBtn>
            </div>
          }
        />

        <FlashMessage flash={{ ...flash, error: errors?.error }} />

        <FilterBar
          routeName="admin.orders.index"
          filters={filters}
          fields={[
            {
              key: "search",
              placeholder: "Search ID, name, email, phone…",
              flex: true,
            },
            {
              key: "is_read",
              type: "select",
              placeholder: "Read / Unread",
              options: [
                { value: "1", label: "Read" },
                { value: "0", label: "Unread" },
              ],
            },
            {
              key: "status",
              type: "select",
              placeholder: "All statuses",
              options: statuses.map((s) => ({ value: s, label: s })),
            },
            {
              key: "is_paid",
              type: "select",
              placeholder: "Payment",
              options: [
                { value: "1", label: "Paid" },
                { value: "0", label: "Unpaid" },
              ],
            },
            { key: "date_from", type: "date" },
            { key: "date_to", type: "date" },
          ]}
        />

        <AdminTable
          headers={[
            "#",
            "Customer",
            "Vendor",
            "Total",
            "Method",
            "Booking",
            "Status",
            "Paid",
            "Actions",
          ]}
          empty="✦ No orders found"
        >
          {orders.data.map((o) => (
            <Tr key={o.id}>
              <Td muted>#{o.id}</Td>

              <Td>
                <div style={{ fontWeight: 500 }}>{o.customer}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    marginTop: 1,
                  }}
                >
                  {o.customer_email}
                </div>
                {o.customer_phone && (
                  <div
                    style={{ fontSize: 11, color: "var(--color-text-muted)" }}
                  >
                    {o.customer_phone}
                  </div>
                )}
              </Td>

              <Td muted>{o.vendor}</Td>

              <Td>
                <span
                  style={{ color: "var(--color-primary)", fontWeight: 500 }}
                >
                  A${Number(o.total_price).toFixed(2)}
                </span>
                {o.refunded_at && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--color-error)",
                      marginTop: 2,
                    }}
                  >
                    Refunded A${o.refund_amount}
                  </div>
                )}
              </Td>

              <Td muted>
                {o.payment_method ? (
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: "var(--color-bg-alt)",
                      border: "1px solid var(--color-border)",
                      padding: "2px 7px",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {o.payment_method}
                  </span>
                ) : o.payment_intent ? (
                  <span
                    style={{ fontSize: 10, color: "var(--color-text-muted)" }}
                  >
                    Stripe
                  </span>
                ) : (
                  "—"
                )}
              </Td>

              <Td muted>{o.has_booking ? "✓" : "—"}</Td>

              <Td onClick={(e) => e.stopPropagation()}>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text)",
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Td>

              <Td>
                <StatusBadge
                  status={
                    o.refunded_at ? "refunded" : o.is_paid ? "paid" : "draft"
                  }
                />
              </Td>

              <Td onClick={(e) => e.stopPropagation()}>
                <div style={{ display: "flex", gap: 4 }}>
                  <ActionBtn
                    variant="view"
                    title="View"
                    as="a"
                    href={route("admin.orders.show", o.id)}
                  >
                    <Icons.View />
                  </ActionBtn>
                  <ActionBtn
                    variant="edit"
                    title="Edit"
                    as="a"
                    href={route("admin.orders.edit", o.id)}
                  >
                    <Icons.Edit />
                  </ActionBtn>
                  {!o.refunded_at &&
                    (o.payment_intent ||
                      ["cash", "eftpos"].includes(o.payment_method ?? "")) && (
                      <ActionBtn
                        variant="delete"
                        title="Refund"
                        onClick={() => handleRefund(o.id)}
                      >
                        ↩
                      </ActionBtn>
                    )}
                  <ActionBtn
                    variant="delete"
                    title="Delete"
                    onClick={() => setDeleteTarget(o)}
                  >
                    <Icons.Delete />
                  </ActionBtn>
                </div>
              </Td>
            </Tr>
          ))}
        </AdminTable>

        <Pagination links={orders.links} />

        {deleteTarget && (
          <ConfirmModal
            title={`Delete Order #${deleteTarget.id}?`}
            description={`This will permanently delete the order for ${deleteTarget.customer}. Any linked booking will also be removed. This cannot be undone.`}
            confirmLabel="Delete Order"
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AdminLayout>
    </>
  );
}
