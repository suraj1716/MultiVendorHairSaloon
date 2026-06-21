import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";

type Voucher = {
  code: string;
  type: string;
  amount: number;
  remaining_amount?: number;
  expires_at: string;
  used_count: number;
  max_uses: number;
};

interface VouchersProps {
  voucher?: Voucher;
  error?: string;
  referral_code?: string;
}

export default function Vouchers({ voucher, error, referral_code }: VouchersProps) {
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
          maxWidth: "760px",
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
            Enter a promo or gift code to check its value and usage status.
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

        {/* ── Voucher result ── */}
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
