import { Head, Link } from "@inertiajs/react";
import { CurrencyFormatter } from "@/utils/CurrencyFormatter";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
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

        {orders.map((order) => (
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
              Order Summary
            </h3>

            <div
              className="flex flex-col"
              style={{
                fontFamily: "var(--font-body)",
                gap: "var(--space-sm)",
              }}
            >
              <SummaryRow label="Salon">
                <Link
                  href="#"
                  className="hover:underline font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  {order.vendor.store_name}
                </Link>
              </SummaryRow>

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
                  <CurrencyFormatter amount={order.total_price} currency="AUD" />
                </span>
              </SummaryRow>
            </div>

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
        ))}
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
