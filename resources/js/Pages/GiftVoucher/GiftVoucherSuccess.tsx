import { Link } from "@inertiajs/react";

interface Voucher {
  code: string;
  amount: number;
  remaining_amount: number;
  active: boolean;
  expires_at: string;
}

interface Props {
  voucher: Voucher;
}

export default function GiftVoucherSuccess({ voucher }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-xl)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>

        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            border: "1px solid var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-xl)",
            color: "var(--color-accent)",
            fontSize: "1.75rem",
          }}
        >
          ✦
        </div>

        {/* Heading */}
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
          Purchase Confirmed
        </span>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 300,
            color: "var(--color-text)",
            lineHeight: 1.1,
            marginBottom: "var(--space-lg)",
          }}
        >
          Your voucher is ready
        </h1>
        <div
          style={{
            width: "48px",
            height: "1px",
            background: "var(--color-accent)",
            margin: "0 auto var(--space-2xl)",
          }}
        />

        {/* Voucher Card */}
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            padding: "var(--space-2xl)",
            marginBottom: "var(--space-2xl)",
            textAlign: "left",
          }}
        >
          {/* Code */}
          <div style={{ marginBottom: "var(--space-lg)", textAlign: "center" }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-light)",
                marginBottom: "var(--space-sm)",
              }}
            >
              Voucher Code
            </span>
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
                padding: "var(--space-sm) var(--space-xl)",
              }}
            >
              {voucher?.code}
            </span>
          </div>

          <div
            style={{
              height: "1px",
              background: "var(--color-border)",
              margin: "var(--space-lg) 0",
            }}
          />

          {/* Details rows */}
          {[
            { label: "Total Value", value: `A$${voucher.amount.toFixed(2)}` },
            { label: "Remaining Balance", value: `A$${voucher.remaining_amount.toFixed(2)}` },
            {
              label: "Expires On",
              value: new Date(voucher.expires_at).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "var(--space-sm) 0",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-light)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 400,
                  color: "var(--color-text)",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={route("gift-voucher.shop")}
          style={{
            display: "inline-block",
            background: "transparent",
            color: "var(--color-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.875rem 2.5rem",
            border: "1px solid var(--color-primary)",
            textDecoration: "none",
            transition: "all var(--transition-base)",
          }}
          onMouseEnter={(e) => {
            const a = e.currentTarget as HTMLAnchorElement;
            a.style.background = "var(--color-primary)";
            a.style.color = "var(--color-text-inverse)";
          }}
          onMouseLeave={(e) => {
            const a = e.currentTarget as HTMLAnchorElement;
            a.style.background = "transparent";
            a.style.color = "var(--color-primary)";
          }}
        >
          Buy Another Voucher
        </Link>
      </div>
    </div>
  );
}
