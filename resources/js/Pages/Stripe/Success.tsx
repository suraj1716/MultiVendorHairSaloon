import { Head, Link } from "@inertiajs/react";
import { GiftIcon, CheckIcon } from "@heroicons/react/24/outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Order } from "@/types";

function Success({ orders }: PageProps<{ orders: Order[] }>) {
    return (
        <AuthenticatedLayout>
            <Head title="Payment Completed" />

            <div
                style={{
                    minHeight: "calc(100vh - 80px)",
                    backgroundColor: "var(--color-bg)",
                    padding: "clamp(32px, 6vw, 72px) 16px",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: 760,
                        margin: "0 auto",
                    }}
                >
                    {/* Success Header */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            marginBottom: "clamp(28px, 5vw, 48px)",
                        }}
                    >
                        {/* Animated Tick */}
                        <div
                            style={{
                                position: "relative",
                                width: 104,
                                height: 104,
                                marginBottom: 24,
                            }}
                        >
                            {/* Outer pulse */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "50%",
                                    background:
                                        "var(--color-primary-light)",
                                    animation:
                                        "successPulse 2s ease-out infinite",
                                }}
                            />

                            {/* Middle circle */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 8,
                                    borderRadius: "50%",
                                    background:
                                        "var(--color-primary-light)",
                                    animation:
                                        "successPulse 2s ease-out 0.25s infinite",
                                }}
                            />

                            {/* Main circle */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 16,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%",
                                    background:
                                        "var(--color-primary)",
                                    boxShadow:
                                        "0 10px 30px rgba(0,0,0,0.10)",
                                    animation:
                                        "successScale 0.55s cubic-bezier(.34,1.56,.64,1) both",
                                }}
                            >
                                <CheckIcon
                                    style={{
                                        width: 42,
                                        height: 42,
                                        color: "#fff",
                                        strokeWidth: 2.5,
                                        animation:
                                            "successCheck 0.55s ease-out 0.3s both",
                                    }}
                                />
                            </div>
                        </div>

                        <h1
                            style={{
                                margin: 0,
                                fontFamily: "var(--font-display)",
                                fontSize:
                                    "clamp(2rem, 6vw, var(--text-4xl))",
                                lineHeight: 1.15,
                                fontWeight: 500,
                                color: "var(--color-text)",
                            }}
                        >
                            Payment Completed
                        </h1>

                        <p
                            style={{
                                margin: "12px 0 0",
                                maxWidth: 540,
                                fontFamily: "var(--font-body)",
                                fontSize:
                                    "clamp(0.9rem, 2.5vw, var(--text-base))",
                                lineHeight: 1.6,
                                color: "var(--color-text-muted)",
                            }}
                        >
                            Thank you for your booking. Your payment was
                            successful.
                        </p>
                    </div>

                    {/* Orders */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 20,
                        }}
                    >
                        {orders.map((order) => {
                            const isGiftCardOrder = order.orderItems.some(
                                (item) =>
                                    item.product?.title === "Gift Card" ||
                                    (item.vouchers &&
                                        item.vouchers.length > 0),
                            );

                            return (
                                <div
                                    key={order.id}
                                    style={{
                                        backgroundColor:
                                            "var(--color-surface)",
                                        border:
                                            "1px solid var(--color-border)",
                                        borderRadius:
                                            "var(--radius-lg)",
                                        boxShadow:
                                            "var(--shadow-md)",
                                        overflow: "hidden",
                                    }}
                                >
                                    {/* Order Header */}
                                    <div
                                        style={{
                                            padding:
                                                "clamp(18px, 4vw, 28px)",
                                            borderBottom:
                                                "1px solid var(--color-border)",
                                            background:
                                                "var(--color-bg-alt)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontFamily:
                                                    "var(--font-display)",
                                                fontSize:
                                                    "clamp(1.25rem, 4vw, var(--text-2xl))",
                                                fontWeight: 500,
                                                color: "var(--color-text)",
                                            }}
                                        >
                                            {isGiftCardOrder
                                                ? "Gift Card Purchase"
                                                : "Order Confirmed"}
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 6,
                                                fontFamily:
                                                    "var(--font-body)",
                                                fontSize:
                                                    "var(--text-sm)",
                                                color:
                                                    "var(--color-text-muted)",
                                            }}
                                        >
                                            Order #{order.id}
                                        </div>
                                    </div>

                                    {/* Basic Details */}
                                    <div
                                        style={{
                                            padding:
                                                "clamp(18px, 4vw, 28px)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                                gap: 18,
                                                fontFamily:
                                                    "var(--font-body)",
                                            }}
                                        >
                                            {!isGiftCardOrder && (
                                                <Detail
                                                    label="Salon"
                                                    value={
                                                        order.vendor
                                                            ?.store_name ??
                                                        "—"
                                                    }
                                                />
                                            )}

                                            <Detail
                                                label="Order Number"
                                                value={`#${order.id}`}
                                            />

                                            <Detail
                                                label="Items"
                                                value={String(
                                                    order.orderItems.length,
                                                )}
                                            />

                                            {order.payment_method && (
                                                <Detail
                                                    label="Payment Method"
                                                    value={
                                                        order.payment_method
                                                    }
                                                />
                                            )}
                                        </div>

                                        {/* Gift Cards */}
                                        {order.orderItems.some(
                                            (item) =>
                                                item.vouchers &&
                                                item.vouchers.length > 0,
                                        ) && (
                                            <div
                                                style={{
                                                    marginTop: 28,
                                                    paddingTop: 24,
                                                    borderTop:
                                                        "1px solid var(--color-border)",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 8,
                                                        marginBottom: 14,
                                                    }}
                                                >
                                                    <GiftIcon
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                            color:
                                                                "var(--color-primary)",
                                                        }}
                                                    />

                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontSize:
                                                                "var(--text-sm)",
                                                            fontWeight: 600,
                                                            textTransform:
                                                                "uppercase",
                                                            letterSpacing:
                                                                "0.06em",
                                                            color:
                                                                "var(--color-text-muted)",
                                                        }}
                                                    >
                                                        Your Gift Card
                                                        {order.orderItems.reduce(
                                                            (
                                                                count,
                                                                item,
                                                            ) =>
                                                                count +
                                                                (item.vouchers
                                                                    ?.length ??
                                                                    0),
                                                            0,
                                                        ) > 1
                                                            ? "s"
                                                            : ""}
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection:
                                                            "column",
                                                        gap: 10,
                                                    }}
                                                >
                                                    {order.orderItems.map(
                                                        (item) =>
                                                            item.vouchers?.map(
                                                                (v) => (
                                                                    <div
                                                                        key={
                                                                            v.code
                                                                        }
                                                                        style={{
                                                                            display:
                                                                                "flex",
                                                                            flexDirection:
                                                                                "column",
                                                                            gap: 8,
                                                                            padding:
                                                                                "14px 16px",
                                                                            border:
                                                                                "1px solid var(--color-border)",
                                                                            borderRadius:
                                                                                "var(--radius-md)",
                                                                            background:
                                                                                "var(--color-bg-alt)",
                                                                            overflow:
                                                                                "hidden",
                                                                        }}
                                                                    >
                                                                        <div
                                                                            style={{
                                                                                fontFamily:
                                                                                    "var(--font-mono, monospace)",
                                                                                fontSize:
                                                                                    "clamp(0.95rem, 3vw, var(--text-lg))",
                                                                                fontWeight: 600,
                                                                                letterSpacing:
                                                                                    "0.05em",
                                                                                color:
                                                                                    "var(--color-text)",
                                                                                wordBreak:
                                                                                    "break-all",
                                                                            }}
                                                                        >
                                                                            {
                                                                                v.code
                                                                            }
                                                                        </div>

                                                                        {v.gifted_to_email && (
                                                                            <div
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "var(--font-body)",
                                                                                    fontSize:
                                                                                        "var(--text-xs)",
                                                                                    color:
                                                                                        "var(--color-text-muted)",
                                                                                }}
                                                                            >
                                                                                Sent
                                                                                to{" "}
                                                                                {
                                                                                    v.gifted_to_email
                                                                                }
                                                                            </div>
                                                                        )}

                                                                        {v.expires_at && (
                                                                            <div
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "var(--font-body)",
                                                                                    fontSize:
                                                                                        "var(--text-xs)",
                                                                                    color:
                                                                                        "var(--color-text-muted)",
                                                                                }}
                                                                            >
                                                                                Expires{" "}
                                                                                {new Date(
                                                                                    v.expires_at,
                                                                                ).toLocaleDateString()}
                                                                            </div>
                                                                        )}

                                                                        {!v.active && (
                                                                            <div
                                                                                style={{
                                                                                    fontFamily:
                                                                                        "var(--font-body)",
                                                                                    fontSize:
                                                                                        "var(--text-xs)",
                                                                                    color:
                                                                                        "var(--color-warning, #c9a96e)",
                                                                                }}
                                                                            >
                                                                                Payment
                                                                                received
                                                                                —
                                                                                activating
                                                                                shortly
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(180px, 1fr))",
                                                gap: 10,
                                                marginTop: 28,
                                            }}
                                        >
                                            <Link
                                                href={route(
                                                    "orders.history",
                                                )}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                    minHeight: 46,
                                                    padding: "11px 18px",
                                                    borderRadius:
                                                        "var(--radius-md)",
                                                    background:
                                                        "var(--color-primary)",
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize:
                                                        "var(--text-sm)",
                                                    fontWeight: 600,
                                                    textAlign: "center",
                                                }}
                                            >
                                                View Order Details
                                            </Link>

                                            <Link
                                                href={route("home")}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                    minHeight: 46,
                                                    padding: "11px 18px",
                                                    borderRadius:
                                                        "var(--radius-md)",
                                                    border:
                                                        "1px solid var(--color-border)",
                                                    background:
                                                        "transparent",
                                                    color:
                                                        "var(--color-text)",
                                                    textDecoration: "none",
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize:
                                                        "var(--text-sm)",
                                                    fontWeight: 500,
                                                    textAlign: "center",
                                                }}
                                            >
                                                Back to Home
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes successScale {
                        0% {
                            transform: scale(0);
                            opacity: 0;
                        }
                        70% {
                            transform: scale(1.08);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes successCheck {
                        0% {
                            opacity: 0;
                            transform: scale(0.5) rotate(-15deg);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1) rotate(0);
                        }
                    }

                    @keyframes successPulse {
                        0% {
                            transform: scale(0.85);
                            opacity: 0.7;
                        }
                        70% {
                            transform: scale(1.15);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1.15);
                            opacity: 0;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        *,
                        *::before,
                        *::after {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                        }
                    }
                `}
            </style>
        </AuthenticatedLayout>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div
            style={{
                minWidth: 0,
            }}
        >
            <div
                style={{
                    marginBottom: 5,
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "var(--color-text-muted)",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text)",
                    fontWeight: 500,
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default Success;
