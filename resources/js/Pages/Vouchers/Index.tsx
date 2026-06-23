import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

type Voucher = {
  id?: number;
  code: string;
  type: string;
  amount: number;
  remaining_amount?: number;
  expires_at: string;
  used_count: number;
  max_uses: number;
};

type GiftVoucherCard = {
  id: number;
  code: string;
  amount: number;
  remaining_amount: number;
  active: boolean;
  expires_at: string | null;
  gifted_to_email: string | null;
  created_at: string;
};

interface VouchersProps {
  voucher?: Voucher;
  error?: string;
  referral_code?: string;
  purchased?: GiftVoucherCard[];
  received?: GiftVoucherCard[];
}

// ── Gift card visual ─────────────────────────────────────────────
function GiftCardTile({
  card,
  variant = "purchased",
}: {
  card: GiftVoucherCard;
  variant?: "purchased" | "received";
}) {
  const [copied, setCopied] = useState(false);

  const isExpired = card.expires_at ? new Date(card.expires_at) < new Date() : false;
  const isDepleted = (card.remaining_amount ?? 0) <= 0;
  const isUsable = card.active && !isExpired && !isDepleted;

  const usagePct =
    card.amount > 0 ? 100 - (card.remaining_amount / card.amount) * 100 : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(card.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  let statusLabel = "Active";
  let statusColor = "var(--color-success)";
  if (isDepleted) {
    statusLabel = "Used Up";
    statusColor = "var(--color-text-light)";
  } else if (isExpired) {
    statusLabel = "Expired";
    statusColor = "var(--color-error)";
  } else if (!card.active) {
    statusLabel = "Pending";
    statusColor = "var(--color-warning)";
  }

  return (
    <div
      style={{
        position: "relative",
        background: isUsable
          ? "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)"
          : "var(--color-surface-warm)",
        border: `1px solid ${isUsable ? "var(--color-primary)" : "var(--color-border)"}`,
        padding: "var(--space-xl)",
        overflow: "hidden",
        opacity: isUsable ? 1 : 0.75,
      }}
    >
      {/* decorative corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "90px",
          height: "90px",
          background: isUsable
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.02)",
          borderRadius: "50%",
          transform: "translate(30%, -30%)",
        }}
      />

      {/* status pill */}
      <div
        style={{
          position: "absolute",
          top: "var(--space-md)",
          right: "var(--space-md)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: isUsable ? "#fff" : statusColor,
          background: isUsable ? "rgba(255,255,255,0.15)" : "transparent",
          border: isUsable ? "none" : `1px solid ${statusColor}`,
          padding: "3px 10px",
          borderRadius: "var(--radius-full)",
        }}
      >
        {statusLabel}
      </div>

      {/* gifted-to badge */}
      {variant === "purchased" && card.gifted_to_email && (
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isUsable ? "rgba(255,255,255,0.8)" : "var(--color-accent)",
            marginBottom: "var(--space-sm)",
          }}
        >
          Sent to {card.gifted_to_email}
        </span>
      )}
      {variant === "received" && (
        <span
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isUsable ? "rgba(255,255,255,0.8)" : "var(--color-accent)",
            marginBottom: "var(--space-sm)",
          }}
        >
          Gift Received
        </span>
      )}

      {/* balance */}
      <div style={{ marginBottom: "var(--space-md)" }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: isUsable ? "rgba(255,255,255,0.7)" : "var(--color-text-light)",
            marginBottom: "4px",
          }}
        >
          Remaining Balance
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 300,
            color: isUsable ? "#fff" : "var(--color-text)",
          }}
        >
          A${Number(card.remaining_amount ?? 0).toFixed(2)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            color: isUsable ? "rgba(255,255,255,0.6)" : "var(--color-text-light)",
            marginLeft: "var(--space-sm)",
          }}
        >
          of A${Number(card.amount).toFixed(2)}
        </span>
      </div>

      {/* usage bar */}
      <div
        style={{
          height: "3px",
          background: isUsable ? "rgba(255,255,255,0.2)" : "var(--color-border)",
          width: "100%",
          marginBottom: "var(--space-lg)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(Math.max(usagePct, 0), 100)}%`,
            background: isUsable ? "var(--color-accent-light)" : "var(--color-text-light)",
            transition: "width var(--transition-slow)",
          }}
        />
      </div>

      {/* code row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-sm)",
          background: isUsable ? "rgba(255,255,255,0.1)" : "var(--color-surface)",
          border: `1px dashed ${isUsable ? "rgba(255,255,255,0.35)" : "var(--color-border-dark)"}`,
          padding: "var(--space-sm) var(--space-md)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: isUsable ? "#fff" : "var(--color-primary)",
          }}
        >
          {card.code}
        </span>
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: isUsable ? "#fff" : "var(--color-primary)",
            opacity: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* expiry */}
      {card.expires_at && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            color: isUsable ? "rgba(255,255,255,0.6)" : "var(--color-text-light)",
            marginTop: "var(--space-sm)",
            marginBottom: 0,
          }}
        >
          {isExpired ? "Expired" : "Expires"}{" "}
          {new Date(card.expires_at).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────
function VoucherSection({
  title,
  subtitle,
  cards,
  variant,
}: {
  title: string;
  subtitle: string;
  cards: GiftVoucherCard[];
  variant: "purchased" | "received";
}) {
  if (!cards || cards.length === 0) return null;

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 400,
          color: "var(--color-text)",
          marginBottom: "4px",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-muted)",
          margin: "0 0 var(--space-lg)",
        }}
      >
        {subtitle}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--space-lg)",
        }}
      >
        {cards.map((card) => (
          <GiftCardTile key={card.id} card={card} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export default function Vouchers({
  voucher,
  error,
  referral_code,
  purchased = [],
  received = [],
}: VouchersProps) {
  const { data, setData, post, processing } = useForm({ code: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("vouchers.check"));
  };

  const usagePct = voucher ? (voucher.used_count / voucher.max_uses) * 100 : 0;

  return (
    <AuthenticatedLayout>
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "var(--space-4xl) var(--space-lg)",
          fontFamily: "var(--font-body)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2xl)",
        }}
      >
        {/* ── Page heading ── */}
        <div>
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Promotions & Rewards
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 300,
              color: "var(--color-text)",
              lineHeight: 1.1,
              marginBottom: "var(--space-sm)",
            }}
          >
            Your Vouchers
          </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", margin: 0 }}>
            Your gift card balances, plus a quick way to check any promo or gift code.
          </p>
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "var(--color-accent)",
              marginTop: "var(--space-lg)",
            }}
          />
        </div>

        {/* ── Purchased gift cards ── */}
        <VoucherSection
          title="Your Gift Cards"
          subtitle="Gift cards you've purchased, for yourself or to send to someone else."
          cards={purchased}
          variant="purchased"
        />

        {/* ── Received gift cards ── */}
        <VoucherSection
          title="Gifted to You"
          subtitle="Gift cards someone sent you — ready to use on your next order."
          cards={received}
          variant="received"
        />

        {/* ── Empty state if no gift cards at all ── */}
        {purchased.length === 0 && received.length === 0 && (
          <div
            style={{
              background: "var(--color-surface-warm)",
              border: "1px dashed var(--color-border)",
              padding: "var(--space-2xl)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                margin: "0 0 var(--space-md)",
              }}
            >
              You don't have any gift cards yet.
            </p>
            <a
              href="/gift-vouchers/shop"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-primary)",
                paddingBottom: "1px",
              }}
            >
              Buy a Gift Card →
            </a>
          </div>
        )}

        {/* ── Referral Code ── */}
        {referral_code && (
          <div
            style={{
              background: "var(--color-surface-warm)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-primary)",
              padding: "var(--space-xl)",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Your Referral Code
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 400,
                color: "var(--color-text)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Share &amp; Earn
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--space-lg)",
              }}
            >
              Give your friends a $30 voucher — and you'll earn one too after they spend $100.
            </p>

            {/* Code pill */}
            <div
              style={{
                display: "inline-block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "var(--color-primary)",
                background: "var(--color-surface)",
                border: "1px dashed var(--color-border-dark)",
                padding: "var(--space-sm) var(--space-xl)",
                marginBottom: "var(--space-md)",
              }}
            >
              {referral_code}
            </div>

            {/* Copy link row */}
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
              <input
                type="text"
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${referral_code}`}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "0.65rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  outline: "none",
                }}
              />
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/login?ref=${referral_code}`
                  )
                }
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.65rem 1.5rem",
                  border: "1px solid var(--color-primary)",
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-primary-light)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-primary)")
                }
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {/* ── Code check form ── */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "var(--space-xl)",
          }}
        >
          <label
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-md)",
            }}
          >
            Check a Code
          </label>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}
          >
            <input
              type="text"
              name="code"
              placeholder="Enter voucher or gift code"
              value={data.code}
              onChange={(e) => setData("code", e.target.value)}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "0.75rem 1rem",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text)",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                outline: "none",
                transition: "border-color var(--transition-fast)",
              }}
              onFocus={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "var(--color-primary)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLInputElement).style.borderColor =
                  "var(--color-border)")
              }
            />
            <button
              type="submit"
              disabled={processing}
              style={{
                background: processing ? "var(--color-border)" : "var(--color-accent)",
                color: processing ? "var(--color-text-light)" : "var(--color-bg-dark)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.75rem 2rem",
                border: "none",
                cursor: processing ? "not-allowed" : "pointer",
                transition: "background var(--transition-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!processing)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-accent-dark)";
              }}
              onMouseLeave={(e) => {
                if (!processing)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "var(--color-accent)";
              }}
            >
              {processing ? "Checking…" : "Check Code"}
            </button>
          </form>

          {error && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-error)",
                marginTop: "var(--space-md)",
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* ── Voucher result (from code-check form) ── */}
        {voucher && (
          <div
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
            }}
          >
            {/* Result header */}
            <div
              style={{
                background: "var(--color-primary)",
                padding: "var(--space-lg) var(--space-xl)",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-xl)",
                  fontWeight: 400,
                  color: "#fff",
                }}
              >
                Voucher Details
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-accent-light)",
                }}
              >
                {voucher.type === "gift" ? "Gift Card" : "Promo Code"}
              </span>
            </div>

            <div style={{ padding: "var(--space-xl)" }}>
              {/* Code display */}
              <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: "var(--color-primary)",
                    background: "var(--color-surface-warm)",
                    border: "1px dashed var(--color-border-dark)",
                    padding: "var(--space-sm) var(--space-2xl)",
                  }}
                >
                  {voucher.code}
                </span>
              </div>

              {/* Detail rows */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0",
                  border: "1px solid var(--color-border)",
                }}
              >
                {[
                  { label: "Type", value: voucher.type.charAt(0).toUpperCase() + voucher.type.slice(1) },
                  { label: "Value", value: `A$${Number(voucher.amount).toFixed(2)}` },
                  ...(voucher.type === "gift"
                    ? [{ label: "Remaining", value: `A$${Number(voucher.remaining_amount ?? 0).toFixed(2)}` }]
                    : []),
                  { label: "Expires", value: new Date(voucher.expires_at).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) },
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    style={{
                      padding: "var(--space-lg)",
                      borderRight: i % 2 === 0 ? "1px solid var(--color-border)" : "none",
                      borderBottom: "1px solid var(--color-border)",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--text-xs)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-text-light)",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--text-xl)",
                        fontWeight: 400,
                        color: "var(--color-text)",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Usage bar */}
              <div style={{ marginTop: "var(--space-xl)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Usage
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {voucher.used_count} / {voucher.max_uses}
                  </span>
                </div>
                <div
                  style={{
                    height: "3px",
                    background: "var(--color-border)",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(usagePct, 100)}%`,
                      background:
                        usagePct >= 100
                          ? "var(--color-error)"
                          : usagePct > 60
                          ? "var(--color-warning)"
                          : "var(--color-primary)",
                      transition: "width var(--transition-slow)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Info panels ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
          <div
            style={{
              background: "var(--color-surface-warm)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-accent)",
              padding: "var(--space-xl)",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-accent-dark)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Tip
            </span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "0 0 var(--space-sm)" }}>
              Looking for more discounts? Check our latest seasonal promotions.
            </p>
            <a
              href="/offers"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-primary)",
                paddingBottom: "1px",
                transition: "color var(--transition-fast)",
              }}
            >
              View Offers →
            </a>
          </div>

          <div
            style={{
              background: "var(--color-surface-warm)",
              border: "1px solid var(--color-border)",
              borderLeft: "3px solid var(--color-primary)",
              padding: "var(--space-xl)",
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Referral Program
            </span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: "0 0 var(--space-sm)" }}>
              Invite friends and earn bonus gift vouchers for every referral.
            </p>
            <a
              href="/referral"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-primary)",
                textDecoration: "none",
                borderBottom: "1px solid var(--color-primary)",
                paddingBottom: "1px",
                transition: "color var(--transition-fast)",
              }}
            >
              Learn More →
            </a>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
