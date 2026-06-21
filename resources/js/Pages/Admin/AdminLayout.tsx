import { useState, useRef, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NAV_GROUPS = [
  {
    group: null,
    items: [
      {
        label: "Dashboard",
        href: "admin.home",
        icon: "⬛",
        countKey: null,
      },
    ],
  },
  {
    group: "Catalogue",
    icon: "📦",
    items: [
      {
        label: "Departments",
        href: "admin.departments.index",
        icon: "🏷️",
        countKey: null,
      },
      {
        label: "Categories",
        href: "admin.categories.index",
        icon: "🗂️",
        countKey: null,
      },
      {
        label: "Products",
        href: "admin.products.index",
        icon: "📦",
        countKey: null,
      },
      {
        label: "Gallery",
        href: "admin.gallery.index",
        icon: "🖼️",
        countKey: null,
      },
      {
        label: "Contacts",
        href: "admin.contacts.index",
        icon: "✉️",
        countKey: "contacts",
      },
    ],
  },
  {
    group: "Commerce",
    icon: "📋",
    items: [
      {
        label: "Orders",
        href: "admin.orders.index",
        icon: "📋",
        countKey: "orders",
      },
      {
        label: "Bookings",
        href: "admin.bookings.index",
        icon: "📅",
        countKey: "bookings",
      },
      {
        label: "Vouchers",
        href: "admin.vouchers.index",
        icon: "🎁",
        countKey: null,
      },
    ],
  },
  {
    group: "People",
    icon: "👤",
    items: [
      { label: "Users", href: "admin.users.index", icon: "👤", countKey: null },
      {
        label: "Vendors",
        href: "admin.vendors.index",
        icon: "🏪",
        countKey: null,
      },
    ],
  },
];

function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span
      style={{
        background: "var(--color-accent)",
        color: "#1a1a1a",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        padding: "1px 5px",
        borderRadius: "10px",
        marginLeft: "auto",
        minWidth: 16,
        textAlign: "center",
        lineHeight: "14px",
        flexShrink: 0,
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const { url, props } = usePage<any>();
const adminCounts = (props.adminCounts ?? {}) as Record<string, number>;



  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([
    "Catalogue",
    "Commerce",
    "People",
  ]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (group: string) =>
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalUnread = Object.values(adminCounts).reduce((a, b) => a + b, 0);

  const notifications = [
    {
      label: "Unread Contacts",
      count: adminCounts.contacts ?? 0,
      href: "admin.contacts.index",
      icon: "✉️",
    },
    { label: "New Users",       count: adminCounts.users     ?? 0, href: "admin.users.index",    icon: "👤" },
    {
      label: "Pending Orders",
      count: adminCounts.orders ?? 0,
      href: "admin.orders.index",
      icon: "📋",
    },
    {
      label: "New Bookings",
      count: adminCounts.bookings ?? 0,
      href: "admin.bookings.index",
      icon: "📅",
    },
  ].filter((n) => n.count > 0);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: collapsed ? "60px" : "220px",
          background: "var(--color-bg-dark)",
          display: "flex",
          flexDirection: "column",
          transition: "width var(--transition-base)",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "var(--space-xl) var(--space-lg)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-sm)",
          }}
        >
          {!collapsed && (
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                color: "#fff",
                fontStyle: "italic",
                whiteSpace: "nowrap",
              }}
            >
              Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: "1.1rem",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {NAV_GROUPS.map((group) => {
            const isOpen = group.group
              ? openGroups.includes(group.group)
              : true;
            const hasActive = group.items.some((item) => {
              const href = route(item.href);
              return url.startsWith(new URL(href).pathname);
            });

            return (
              <div key={group.group ?? "__ungrouped"}>
                {group.group && (
                  <button
                    onClick={() => toggleGroup(group.group!)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "8px var(--space-lg)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: hasActive
                        ? "var(--color-accent-light)"
                        : "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {!collapsed ? (
                      <>
                        <span>{group.group}</span>
                        <span
                          style={{
                            fontSize: "0.55rem",
                            opacity: 0.6,
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          ▾
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.9rem", margin: "0 auto" }}>
                        {group.icon}
                      </span>
                    )}
                  </button>
                )}

                <div
                  style={{
                    maxHeight:
                      isOpen && !collapsed
                        ? "500px"
                        : collapsed
                          ? "auto"
                          : "0px",
                    overflow: "hidden",
                    transition: group.group ? "max-height 0.25s ease" : "none",
                  }}
                >
                  {group.items.map((item) => {
                    const href = route(item.href);
                    const isActive = url.startsWith(new URL(href).pathname);
                    const count = item.countKey
                      ? (adminCounts[item.countKey] ?? 0)
                      : 0;

                    return (
                      <Link
                        key={item.href}
                        href={href}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "var(--space-md)",
                          padding: "9px var(--space-lg)",
                          paddingLeft:
                            collapsed || !group.group
                              ? "var(--space-lg)"
                              : "calc(var(--space-lg) + 10px)",
                          color: isActive
                            ? "var(--color-accent-light)"
                            : "rgba(255,255,255,0.5)",
                          background: isActive
                            ? "rgba(255,255,255,0.06)"
                            : "transparent",
                          borderLeft: isActive
                            ? "2px solid var(--color-accent)"
                            : "2px solid transparent",
                          textDecoration: "none",
                          fontFamily: "var(--font-body)",
                          fontSize: "var(--text-sm)",
                          letterSpacing: "0.04em",
                          transition: "all var(--transition-fast)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ fontSize: "0.95rem", flexShrink: 0 }}>
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            <Badge count={count} />
                          </>
                        )}
                        {collapsed && count > 0 && <Badge count={count} />}
                      </Link>
                    );
                  })}
                </div>

                {group.group && (
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(255,255,255,0.05)",
                      margin: "4px var(--space-lg)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Back to site */}
        <div
          style={{
            padding: "var(--space-lg)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <span>↩</span>
            {!collapsed && "Back to Site"}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Top bar */}
        <header
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            padding: "0 var(--space-xl)",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              color: "var(--color-text)",
              fontWeight: 400,
            }}
          >
            Maison Verd — Admin
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Notification bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-text-muted)",
                  padding: "6px 10px",
                  cursor: "pointer",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-xs)",
                }}
              >
                🔔
                {totalUnread > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      background: "var(--color-error)",
                      color: "#fff",
                      fontSize: "9px",
                      fontWeight: 700,
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 280,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid var(--color-border)",
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <div
                      style={{
                        padding: "20px 16px",
                        textAlign: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      All caught up ✓
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.href}
                        href={route(n.href)}
                        onClick={() => setNotifOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12px 16px",
                          borderBottom: "1px solid var(--color-border)",
                          textDecoration: "none",
                          transition: "background var(--transition-fast)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--color-bg-alt)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <span style={{ fontSize: "1.1rem" }}>{n.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "12px",
                              color: "var(--color-text)",
                              fontWeight: 500,
                            }}
                          >
                            {n.label}
                          </div>
                          <div
                            style={{
                              fontFamily: "var(--font-body)",
                              fontSize: "11px",
                              color: "var(--color-text-muted)",
                              marginTop: 2,
                            }}
                          >
                            {n.count} unread — click to review
                          </div>
                        </div>
                        <span
                          style={{
                            background: "var(--color-accent)",
                            color: "#1a1a1a",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: "10px",
                          }}
                        >
                          {n.count}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => router.post(route("logout"))}
              style={{
                background: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "6px 16px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            padding: "var(--space-2xl) var(--space-xl)",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
