import React, { useState } from "react";
import { router } from "@inertiajs/react";

/* ─────────────────────────────────────────────
   Shared style constants
───────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  padding: "8px 12px",
  fontFamily: "var(--font-body)",
  fontSize: "13px",
  color: "var(--color-text)",
  background: "var(--color-bg-alt)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  outline: "none",
  minWidth: "160px",
  transition: "border-color 150ms ease",
};

/* ─────────────────────────────────────────────
   StatusBadge
───────────────────────────────────────────── */
const COLORS: Record<string, string> = {
  draft:       "var(--color-text-light)",
  paid:        "var(--color-primary)",
  shipped:     "var(--color-info)",
  delivered:   "var(--color-success)",
  cancelled:   "var(--color-error)",
  active:      "var(--color-info)",
  approved:    "var(--color-success)",
  rejected:    "var(--color-error)",
  ecommerce:   "var(--color-primary)",
  appointment: "var(--color-accent-dark)",
  gift:        "var(--color-accent-dark)",
  promo:       "var(--color-primary)",
  published:   "var(--color-success)",
  pending:     "var(--color-warning)",
  refunded:    "var(--color-error)",
};

export function StatusBadge({ status }: { status: string }) {
  const color = COLORS[status?.toLowerCase()] ?? "var(--color-text-muted)";
  return (
    <span style={{
      fontFamily: "var(--font-body)",
      fontSize: "0.6rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color,
      background: `${color}18`,
      padding: "3px 8px",
      borderRadius: "var(--radius-full)",
      border: `1px solid ${color}40`,
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: color, display: "inline-block", flexShrink: 0,
      }} />
      {status}
    </span>
  );
}

/* ─────────────────────────────────────────────
   FilterBar
───────────────────────────────────────────── */
type FilterField = {
  key: string;
  placeholder?: string;
  type?: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  flex?: boolean;
};

export function FilterBar({
  fields,
  filters,
  routeName,
}: {
  fields: FilterField[];
  filters: Record<string, string>;
  routeName: string;
}) {
  const [local, setLocal] = useState<Record<string, string>>(filters ?? {});

  const apply = () => {
    const clean: Record<string, string> = {};
    Object.entries(local).forEach(([k, v]) => { if (v) clean[k] = v; });
    router.get(route(routeName), clean, { preserveState: true, replace: true });
  };

  const reset = () => {
    setLocal({});
    router.get(route(routeName), {}, { preserveState: true, replace: true });
  };

  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      padding: "14px 16px",
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
      alignItems: "center",
    }}>
      {fields.map((f) =>
        f.type === "select" ? (
          <select
            key={f.key}
            value={local[f.key] ?? ""}
            onChange={(e) => setLocal({ ...local, [f.key]: e.target.value })}
            style={{ ...inputBase, flex: f.flex ? "1 1 160px" : undefined }}
          >
            <option value="">{f.placeholder ?? "All"}</option>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <div key={f.key} style={{ position: "relative", flex: f.flex ? "1 1 180px" : undefined }}>
            {f.type !== "date" && (
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{
                  width: 13, height: 13,
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  color: "var(--color-text-light)", pointerEvents: "none",
                }}
              >
                <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
            <input
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              value={local[f.key] ?? ""}
              onChange={(e) => setLocal({ ...local, [f.key]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              style={{
                ...inputBase,
                width: "100%",
                paddingLeft: f.type !== "date" ? 30 : 12,
              }}
            />
          </div>
        )
      )}

      <button
        onClick={apply}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 16px",
          background: "var(--color-primary)", color: "white",
          border: "1px solid var(--color-primary)",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)", fontSize: "11px",
          fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: "pointer", transition: "all 150ms ease",
          whiteSpace: "nowrap",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 12, height: 12 }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filter
      </button>

      <button
        onClick={reset}
        style={{
          display: "inline-flex", alignItems: "center",
          padding: "8px 14px",
          background: "transparent", color: "var(--color-text-muted)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-body)", fontSize: "11px",
          fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase",
          cursor: "pointer", transition: "all 150ms ease",
          whiteSpace: "nowrap",
        }}
      >
        Reset
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pagination
───────────────────────────────────────────── */
export function Pagination({ links }: { links: any[] }) {
  return (
    <div style={{
      display: "flex", gap: "4px",
      justifyContent: "center",
      paddingTop: "var(--space-xl)",
      flexWrap: "wrap",
    }}>
      {links.map((l, i) => (
        <button
          key={i}
          disabled={!l.url}
          onClick={() => l.url && router.visit(l.url, { preserveState: true })}
          dangerouslySetInnerHTML={{ __html: l.label }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            minWidth: 32, height: 32, padding: "0 10px",
            fontFamily: "var(--font-body)", fontSize: "12px",
            background: l.active ? "var(--color-primary)" : "var(--color-surface)",
            color: l.active ? "white" : "var(--color-text-muted)",
            border: "1px solid",
            borderColor: l.active ? "var(--color-primary)" : "var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: l.url ? "pointer" : "default",
            opacity: l.url ? 1 : 0.4,
            transition: "all 150ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminTable
───────────────────────────────────────────── */
export function AdminTable({
  headers,
  children,
  empty,
}: {
  headers: string[];
  children: React.ReactNode;
  empty?: string;
}) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-bg-alt)",
            }}>
              {headers.map((h) => (
                <th key={h} style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  fontFamily: "var(--font-body)",
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>

      {/* Empty state rendered outside table to avoid invalid DOM nesting */}
      {!children || (Array.isArray(children) && children.length === 0) ? (
        <div style={{
          padding: "60px 20px",
          textAlign: "center",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 300,
          color: "var(--color-text-muted)",
        }}>
          {empty ?? "✦ No records found"}
        </div>
      ) : null}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tr — table row with hover
───────────────────────────────────────────── */
export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: hovered ? "var(--color-bg-alt)" : "transparent",
        transition: "background 150ms ease",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </tr>
  );
}

/* ─────────────────────────────────────────────
   Td
───────────────────────────────────────────── */
export function Td({
  children,
  muted,
  right,
  nowrap = true,
}: {
  children: React.ReactNode;
  muted?: boolean;
  right?: boolean;
  nowrap?: boolean;
}) {
  return (
    <td style={{
      padding: "12px 16px",
      fontFamily: "var(--font-body)",
      fontSize: "13px",
      color: muted ? "var(--color-text-muted)" : "var(--color-text)",
      textAlign: right ? "right" : "left",
      whiteSpace: nowrap ? "nowrap" : "normal",
      verticalAlign: "middle",
    }}>
      {children}
    </td>
  );
}

/* ─────────────────────────────────────────────
   AdminPageHeader
───────────────────────────────────────────── */
export function AdminPageHeader({
  eyebrow,
  title,
  action,
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  meta?: string;
}) {
  return (
    <div style={{
      background: "var(--color-bg-dark)",
      padding: "32px 28px",
      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
      flexWrap: "wrap", gap: "16px",
      position: "relative", overflow: "hidden",
      margin: "-32px -28px 28px",
    }}>
      {/* subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 120% at 80% 50%, rgba(201,169,110,0.1), transparent)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative" }}>
        <span style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "var(--color-accent)", marginBottom: "6px",
        }}>
          {eyebrow}
        </span>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
          fontWeight: 300, color: "white", lineHeight: 1.1, margin: 0,
        }}>
          {title}
        </h1>
        {meta && (
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "12px",
            color: "rgba(255,255,255,0.4)", marginTop: "6px", letterSpacing: "0.04em",
          }}>
            {meta}
          </p>
        )}
      </div>

      {action && <div style={{ position: "relative" }}>{action}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ActionBtn — edit / delete / view icon buttons
───────────────────────────────────────────── */
export function ActionBtn({
  onClick,
  variant = "default",
  title,
  children,
  as: Tag = "button",
  href,
}: {
  onClick?: () => void;
  variant?: "edit" | "delete" | "view" | "default";
  title?: string;
  children: React.ReactNode;
  as?: any;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);

  const colors = {
    edit:    { border: "var(--color-primary)", color: "var(--color-primary)", bg: "rgba(45,80,22,0.05)" },
    delete:  { border: "var(--color-error)",   color: "var(--color-error)",   bg: "rgba(192,57,43,0.05)" },
    view:    { border: "var(--color-info)",     color: "var(--color-info)",    bg: "rgba(36,113,163,0.05)" },
    default: { border: "var(--color-border)",   color: "var(--color-text-muted)", bg: "var(--color-bg-alt)" },
  };

  const c = colors[variant];

  return (
    <Tag
      href={href}
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${hovered ? c.border : "var(--color-border)"}`,
        background: hovered ? c.bg : "transparent",
        color: hovered ? c.color : "var(--color-text-muted)",
        cursor: "pointer",
        transition: "all 150ms ease",
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      {children}
    </Tag>
  );
}




/* ─────────────────────────────────────────────
   FlashMessage
───────────────────────────────────────────── */
export function FlashMessage({ flash }: { flash: { success?: string; error?: string } }) {
  if (!flash?.success && !flash?.error) return null;
  const isSuccess = !!flash.success;
  return (
    <div style={{
      padding: "10px 16px",
      fontFamily: "var(--font-body)", fontSize: "13px",
      borderRadius: "var(--radius-sm)",
      border: "1px solid",
      marginBottom: "16px",
      background: isSuccess ? "rgba(58,125,68,0.08)" : "rgba(192,57,43,0.08)",
      color: isSuccess ? "var(--color-success)" : "var(--color-error)",
      borderColor: isSuccess ? "rgba(58,125,68,0.2)" : "rgba(192,57,43,0.2)",
    }}>
      {flash.success ?? flash.error}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AdminBtn
───────────────────────────────────────────── */
export function AdminBtn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  type = "button",
  as: Tag = "button",
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md";
  disabled?: boolean;
  type?: "button" | "submit";
  as?: any;
  href?: string;
}) {
  const variants = {
    primary: { bg: "var(--color-primary)", color: "white",                   border: "var(--color-primary)" },
    accent:  { bg: "var(--color-accent)",  color: "var(--color-bg-dark)",    border: "var(--color-accent)" },
    ghost:   { bg: "transparent",          color: "var(--color-text-muted)", border: "var(--color-border)" },
    danger:  { bg: "transparent",          color: "var(--color-error)",      border: "var(--color-error)" },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "10px" },
    md: { padding: "9px 18px", fontSize: "11px" },
  };
  const v = variants[variant];
  const s = sizes[size];

  return (
    <Tag
      href={href}
      type={Tag === "button" ? type : undefined}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: s.padding,
        background: v.bg, color: v.color,
        border: `1px solid ${v.border}`,
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-body)", fontSize: s.fontSize,
        fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 150ms ease",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </Tag>
  );
}



/* ─────────────────────────────────────────────
   Icons — use these everywhere, never inline SVG
───────────────────────────────────────────── */
const iconStyle: React.CSSProperties = { width: 13, height: 13, display: "block" };

export const Icons = {
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Delete: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  View: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={iconStyle}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   ConfirmModal — single delete modal for all pages
───────────────────────────────────────────── */
export function ConfirmModal({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  title: React.ReactNode;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(12,10,8,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "28px 32px",
          maxWidth: 420, width: "90%",
          position: "relative",
        }}
      >
        {/* corner accents */}
        {[
          { top: 0,    left: 0,  borderTop:    "1px solid var(--color-accent)", borderLeft:  "1px solid var(--color-accent)" },
          { top: 0,    right: 0, borderTop:    "1px solid var(--color-accent)", borderRight: "1px solid var(--color-accent)" },
          { bottom: 0, left: 0,  borderBottom: "1px solid var(--color-accent)", borderLeft:  "1px solid var(--color-accent)" },
          { bottom: 0, right: 0, borderBottom: "1px solid var(--color-accent)", borderRight: "1px solid var(--color-accent)" },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: 14, height: 14, opacity: 0.35, ...s }} />
        ))}

        <span style={{
          display: "block",
          fontFamily: "var(--font-body)", fontSize: "10px",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--color-error)", marginBottom: 8,
        }}>
          Confirm
        </span>

        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: "1.2rem",
          fontWeight: 300, color: "var(--color-text)",
          margin: "0 0 12px",
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: "var(--font-body)", fontSize: "13px",
          color: "var(--color-text-muted)", lineHeight: 1.7,
          margin: "0 0 24px",
        }}>
          {description}
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <AdminBtn variant="ghost" onClick={onCancel}>Cancel</AdminBtn>
          <AdminBtn variant="danger" onClick={onConfirm}>
            <Icons.Delete />
            {confirmLabel}
          </AdminBtn>
        </div>
      </div>
    </div>
  );
}
