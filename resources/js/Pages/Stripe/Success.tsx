import { Head, Link } from "@inertiajs/react";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { CheckCircleIcon, GiftIcon } from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Order } from "@/types";

function Success({ orders }: PageProps<{ orders: Order[] }>) {
  return (
    <AuthenticatedLayout>
      <Head title="Payment was Completed" />
     <div
  className="min-h-screen"
  style={{ backgroundColor: "var(--color-bg)" }}
>
  <div className="max-w-3xl mx-auto flex flex-col justify-center py-16 px-4 min-h-screen">

        <div className="flex flex-col gap-3 items-center mb-10">
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: "88px",
              height: "88px",
              backgroundColor: "var(--color-primary-light)",
              opacity: 0.12,
            }}
          >
            <CheckCircleIcon
              className="size-12"
              style={{ color: "var(--color-primary)" }}
            />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
              fontSize: "var(--text-4xl)",
              fontWeight: 600,
            }}
          >
            Payment Completed
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-base)",
            }}
          >
            Thank you for your booking — your payment was successful.
          </p>
        </div>

        {orders.map((order) => {
          const isGiftCardOrder = order.orderItems.some(
            (item) => item.product?.title === "Gift Card" || (item.vouchers && item.vouchers.length > 0),
          );
          const grossTotal = Number(order.total_price) + Number(order.voucher_discount ?? 0);

          return (
          <div
            key={order.id}
            className="rounded-xl p-8 mb-6"
            style={{
              backgroundColor: "var(--color-surface)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-2xl)",
                color: "var(--color-text)",
                fontWeight: 600,
                marginBottom: "var(--space-lg)",
              }}
            >
              {isGiftCardOrder ? "Gift Card Purchase" : "Order Summary"}
            </h3>

            <div
              className="flex flex-col"
              style={{
                fontFamily: "var(--font-body)",
                gap: "var(--space-sm)",
              }}
            >
              {!isGiftCardOrder && (
                <SummaryRow label="Salon">
                  <Link
                    href="#"
                    className="hover:underline font-medium"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {order.vendor.store_name}
                  </Link>
                </SummaryRow>
              )}

              <SummaryRow label="Order Number">
                <Link
                  href="#"
                  className="hover:underline"
                  style={{ color: "var(--color-text)" }}
                >
                  #{order.id}
                </Link>
              </SummaryRow>

              <SummaryRow label="Items">
                <span style={{ color: "var(--color-text)" }}>
                  {order.orderItems.length}
                </span>
              </SummaryRow>

              {order.payment_method && (
                <SummaryRow label="Payment Method">
                  <span
                    className="capitalize"
                    style={{ color: "var(--color-text)" }}
                  >
                    {order.payment_method}
                  </span>
                </SummaryRow>
              )}

              <div
                style={{
                  borderTop: "1px solid var(--color-border)",
                  margin: "var(--space-sm) 0",
                }}
              />

              <SummaryRow label="Total" emphasized>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-xl)",
                    color: "var(--color-accent-dark)",
                    fontWeight: 600,
                  }}
                >
                  <CurrencyFormatter amount={grossTotal} currency="AUD" />
                </span>
              </SummaryRow>

              {Number(order.voucher_discount) > 0 && (
                <SummaryRow label="Covered by gift card">
                  <span style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                    −<CurrencyFormatter amount={Number(order.voucher_discount)} currency="AUD" />
                  </span>
                </SummaryRow>
              )}
            </div>

            {/* Voucher codes, shown for gift card purchases */}
            {order.orderItems.map((item) =>
              item.vouchers && item.vouchers.length > 0 ? (
                <div key={item.id} style={{ marginTop: "var(--space-lg)" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    <GiftIcon className="size-5" style={{ color: "var(--color-primary)" }} />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-sm)",
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Your gift card{item.vouchers.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {item.vouchers.map((v) => (
                      <div
                        key={v.code}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "14px 18px",
                          backgroundColor: "var(--color-surface-warm, var(--color-bg-alt))",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: "var(--font-mono, monospace)",
                              fontSize: "var(--text-lg)",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              color: "var(--color-text)",
                            }}
                          >
                            {v.code}
                          </div>
                          {v.gifted_to_email && (
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-xs)",
                                color: "var(--color-text-muted)",
                                marginTop: 2,
                              }}
                            >
                              Sent to {v.gifted_to_email}
                            </div>
                          )}
                          {v.expires_at && (
                            <div
                              style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "var(--text-xs)",
                                color: "var(--color-text-muted)",
                                marginTop: 2,
                              }}
                            >
                              Expires {new Date(v.expires_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                       <div style={{ textAlign: "right" }}>
  <span
    style={{
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-lg)",
      fontWeight: 600,
      color: "var(--color-primary)",
    }}
  >
    <CurrencyFormatter amount={Number(v.amount)} currency="AUD" />
  </span>
  {!v.active && (
    <div
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-xs)",
        color: "var(--color-warning, #c9a96e)",
        marginTop: 2,
      }}
    >
      Payment received — activating shortly
    </div>
  )}
</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            )}

            <div
              className="flex justify-between"
              style={{ marginTop: "var(--space-xl)", gap: "var(--space-md)" }}
            >
              <Link
                 href={route("orders.history")}
                className="px-5 py-2.5 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  transition: "var(--transition-base)",
                }}
              >
                View Order Details
              </Link>
              <Link
                href={route("home")}
                className="px-5 py-2.5 rounded-md font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-border-dark)",
                  color: "var(--color-text)",
                  borderRadius: "var(--radius-md)",
                  fontFamily: "var(--font-body)",
                  transition: "var(--transition-base)",
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
          );
        })}
          </div>
      </div>
    </AuthenticatedLayout>
  );
}

function SummaryRow({
  label,
  children,
  emphasized = false,
}: {
  label: string;
  children: React.ReactNode;
  emphasized?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        style={{
          color: "var(--color-text-muted)",
          fontSize: emphasized ? "var(--text-lg)" : "var(--text-sm)",
          fontWeight: emphasized ? 500 : 400,
        }}
      >
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

export default Success;
