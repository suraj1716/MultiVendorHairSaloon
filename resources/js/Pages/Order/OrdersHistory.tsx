import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, PaginationProps, Order } from "@/types";

export default function OrdersHistory() {
  const { orders } =
    usePage<PageProps<{ orders: PaginationProps<Order> }>>().props;

  return (
    <AuthenticatedLayout
      header={
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
          }}
        >
          Order History
        </h2>
      }
    >
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 py-10">
          {orders?.data?.length === 0 ? (
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              You have no orders yet.
            </p>
          ) : (
            orders.data.map((order) => (
              <div
                key={order.id}
                className="mb-6 p-6 overflow-x-auto"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Order header */}
                <div
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 pb-3"
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <div style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                    <span style={{ color: "var(--color-text)", fontWeight: 600 }}>
                      Order #{order.id}
                    </span>
                    {" · "}
                    <span className="capitalize">{order.status}</span>
                    {" · "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-accent-dark)",
                      fontSize: "var(--text-lg)",
                      fontWeight: 600,
                    }}
                  >
                    ${Number(order.total_price).toFixed(2)}
                  </div>
                </div>

                {/* Vendor / Salon Info */}
                <div
                  className="mb-4"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                      Salon:
                    </span>{" "}
                    {order.vendor.store_name}
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                      Address:
                    </span>{" "}
                    {order.vendor.store_address}
                  </div>
                  {order.payment_method && (
                    <div>
                      <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                        Payment:
                      </span>{" "}
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                  )}
                </div>

                {/* Booking info, shown for appointment-type vendors */}
                {order.vendor.vendor_type === "appointment" && order.booking_date && (
                  <div
                    className="mb-4 p-3"
                    style={{
                      backgroundColor: "var(--color-bg-alt)",
                      borderRadius: "var(--radius-md)",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--color-text)",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Appointment:</span>{" "}
                    {new Date(order.booking_date).toLocaleDateString()} · {order.time_slot}
                  </div>
                )}

                {/* Items Table */}
                <table
                  className="w-full table-auto border-collapse"
                  style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)" }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-bg-alt)" }}>
                      <th
                        className="text-left p-2"
                        style={{ color: "var(--color-text-muted)", fontWeight: 500 }}
                      >
                        Product
                      </th>
                      <th
                        className="text-left p-2"
                        style={{ color: "var(--color-text-muted)", fontWeight: 500 }}
                      >
                        Variation
                      </th>
                      <th
                        className="text-left p-2"
                        style={{ color: "var(--color-text-muted)", fontWeight: 500 }}
                      >
                        Attachment
                      </th>
                      <th
                        className="text-left p-2 w-12"
                        style={{ color: "var(--color-text-muted)", fontWeight: 500 }}
                      >
                        Qty
                      </th>
                      <th
                        className="text-left p-2 w-24"
                        style={{ color: "var(--color-text-muted)", fontWeight: 500 }}
                      >
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: "1px solid var(--color-border)" }}
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-10 h-10 object-cover"
                                style={{ borderRadius: "var(--radius-sm)" }}
                              />
                            )}
                            {item.product ? (
                              <Link
                                href={`/product/${item.product.id}`}
                                className="hover:underline truncate max-w-xs"
                                style={{ color: "var(--color-text)" }}
                              >
                                {item.product.title}
                              </Link>
                            ) : (
                              <span style={{ color: "var(--color-text)" }}>
                                Booking Fee
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-2" style={{ color: "var(--color-text-muted)" }}>
                          {item.variation_summary && item.variation_summary.length > 0
                            ? item.variation_summary.map((v, i) => (
                                <div key={i}>
                                  <span style={{ color: "var(--color-text)", fontWeight: 500 }}>
                                    {v.type}:
                                  </span>{" "}
                                  {v.option}
                                </div>
                              ))
                            : "—"}
                        </td>

                        <td className="p-2">
                          {item.attachment_path ? (
                            /\.(jpe?g|png|gif|bmp|webp)(\?.*)?$/i.test(item.attachment_path) ? (
                              <img
                                src={`/storage/${item.attachment_path}`}
                                alt={item.attachment_name || "Attachment preview"}
                                className="w-16 h-16 object-cover"
                                style={{
                                  borderRadius: "var(--radius-sm)",
                                  border: "1px solid var(--color-border)",
                                }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (

                              <a  href={`/storage/${item.attachment_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "var(--color-info)" }}
                                className="hover:underline"
                              >
                                {item.attachment_name || "Download Attachment"}
                              </a>
                            )
                          ) : (
                            <span style={{ color: "var(--color-text-light)" }}>—</span>
                          )}
                        </td>

                        <td className="p-2" style={{ color: "var(--color-text)" }}>
                          {item.quantity}
                        </td>
                        <td className="p-2" style={{ color: "var(--color-text)" }}>
                          ${Number(item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}

          {/* Pagination links */}
          {orders?.links && orders.links.length > 3 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap">
              {orders.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url || "#"}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="px-3 py-1.5 text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: link.active
                      ? "var(--color-primary)"
                      : "var(--color-surface)",
                    color: link.active
                      ? "var(--color-text-inverse)"
                      : "var(--color-text-muted)",
                    border: "1px solid var(--color-border)",
                    pointerEvents: link.url ? "auto" : "none",
                    opacity: link.url ? 1 : 0.5,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
