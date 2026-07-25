"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, User, X, ChevronRight } from "lucide-react";
import MiniCartDropdown from "./MiniCartDropdown";
import { PageProps, Vendor } from "@/types";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useAuthModal } from "@/Contexts/AuthModalContext";
import axios from "axios";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

interface Category {
  id: string;
  name: string;
  href: string;
}
interface Department {
  id: string;
  name: string;
  categories: Category[];
  image?: string;
}
interface ProductGroup {
  id: number;
  name: string;
  slug: string;
}
interface CategoryGroup {
  id: number;
  name: string;
  active: boolean;
}

function NavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent<Element>) => void;
}) {
  return (
    <Link
      href={href}
      className={`nav-link${active ? " active" : ""}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    router.get(route("shop.search"), { keyword: term.trim() });
    onClose();
  };

  const suggestions = [
    "Balayage",
    "Keratin Ritual",
    "Colour Correction",
    "Bridal",
    "Scalp Treatment",
  ];

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "var(--color-overlay)",
          zIndex: 998,
        }}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "var(--color-surface)",
          zIndex: 999,
          padding: "48px 24px 32px",
          borderBottom: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              display: "block",
              marginBottom: 16,
            }}
          >
            What are you looking for?
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid var(--color-text)",
              paddingBottom: 12,
            }}
          >
            <button
              onClick={() => handleSearch(query)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexShrink: 0,
              }}
              aria-label="Submit search"
            >
              <Search
                size={18}
                color="var(--color-text-light)"
                strokeWidth={1.5}
              />
            </button>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(query);
              }}
              placeholder="Search services, treatments…"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                fontFamily: "var(--font-display)",
                fontSize: 22,
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--color-text)",
                background: "transparent",
                caretColor: "var(--color-accent)",
              }}
            />

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                flexShrink: 0,
              }}
            >
              Close
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 20,
            }}
          >
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                  padding: "5px 14px",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function CollectionsDropdown({
  categoryGroups,
  productGroups,
  onClose,
}: {
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[];
  onClose: () => void;
}) {
  const activeGroups = categoryGroups.filter((g) => g.active);
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 20px)",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        minWidth: 220,
        padding: "8px 0",
        zIndex: 110,
      }}
    >
      {activeGroups.map((g) => (
        <button
          key={g.id}
          onClick={() => {
            router.visit(`/?scrollToCategoryId=${g.id}`, {
              preserveScroll: true,
              preserveState: true,
            });
            onClose();
          }}
          className="nav-dropdown-item"
        >
          {g.name}
        </button>
      ))}
      {activeGroups.length > 0 && productGroups.length > 0 && (
        <div
          style={{
            height: 1,
            background: "var(--color-border)",
            margin: "6px 0",
          }}
        />
      )}
      {productGroups.map((g) => (
        <button
          key={g.id}
          onClick={() => {
            router.visit(route("productGroup.show", { productGroup: g.slug }), {
              preserveScroll: true,
              preserveState: true,
            });
            onClose();
          }}
          className="nav-dropdown-item"
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { auth, categoryGroups, productGroups } = usePage<
    PageProps<{
      keyword: string;
      departments: Department[];
      categoryGroups: CategoryGroup[];
      productGroups: ProductGroup[];
      auth?: { user: any };
    }>
  >().props;
  const user = auth?.user ?? null;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const isAdmin = auth?.user?.roles?.includes("Admin") ?? false;
  const { url } = usePage();
  const onHomePage = url === "/" || url.startsWith("/#");
  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    axios.get("/api/vendor-details").then((res) => setVendor(res.data.data));
  }, []);

  const SOCIALS = [
    {
      label: "Instagram",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="16"
          height="16"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      ),
      url: vendor?.instagram_url,
    },
    {
      label: "Facebook",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      ),
      url: vendor?.facebook_url,
    },
    {
      label: "TikTok",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z" />
        </svg>
      ),
      url: vendor?.tiktok_url,
    },
  ].filter((s) => s.url);

  const { openLogin, openRegister } = useAuthModal();

  const userDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      )
        setUserDropdownOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [url]);

  const iconBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--color-text-muted)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    position: "relative",
    transition: "color var(--transition-fast)",
    padding: 0,
    flexShrink: 0,
  };

  const mobileNavItems: {
    label: string;
    href: string;
    scrollTo?: string;
  }[] = [
    { label: "Book Services", href: route("shop.search") },
    { label: "Services", href: "/#services", scrollTo: "services" },
    { label: "About", href: route("about") },
    { label: "Gallery", href: route("gallery.index") },
    { label: "Gift Cards", href: route("gift-voucher.shop") },
    { label: "Contact Us", href: route("contact.index") },
  ];

  const mobileAccountItems: { label: string; href: string }[] = [
    ...(isAdmin
      ? [{ label: "Admin Dashboard", href: route("admin.dashboard") }]
      : []),
    { label: "Vouchers", href: route("vouchers.index") },
    { label: "Profile", href: route("profile.edit") },
    { label: "Bookings", href: route("bookings.history") },
    { label: "Orders", href: route("orders.history") },
  ];

  return (
    <>
      <style>{`
        /* ── Nav links ── */
        .nav-link {
          font-family: var(--font-body);
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          text-decoration: none;
          position: relative;
          padding-bottom: 3px;
          transition: color var(--transition-fast);
          white-space: nowrap;
        }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: var(--color-accent); transition: width var(--transition-base); }
        .nav-link:hover { color: var(--color-text); }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: var(--color-primary); }
        .nav-link.active::after { width: 100%; }

        .nav-dropdown-item {
          display: block; width: 100%; padding: 10px 24px;
          font-family: var(--font-body); font-size: 11px; font-weight: 400;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-text-muted); text-decoration: none;
          background: none; border: none; text-align: left; cursor: pointer;
          transition: background var(--transition-fast), color var(--transition-fast), padding-left var(--transition-fast);
        }
        .nav-dropdown-item:hover { background: var(--color-bg-alt); color: var(--color-primary); padding-left: 30px; }
        .nav-icon-btn:hover { color: var(--color-primary) !important; }

        .user-menu-item {
          display: block; padding: 9px 16px;
          font-family: var(--font-body); font-size: 11px;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-text-muted); text-decoration: none;
          transition: background var(--transition-fast), color var(--transition-fast);
          white-space: nowrap;
        }
        .user-menu-item:hover { background: var(--color-bg-alt); color: var(--color-primary); }
        .user-menu-item.danger:hover { background: rgba(192,57,43,0.08); color: var(--color-error); }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.5);
          color: var(--color-text-inverse);
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: color var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
          flex-shrink: 0;
        }
        .footer-social-btn:hover {
          color: var(--color-accent-light);
          border-color: var(--color-accent);
          background: rgba(201,169,110,0.1);
        }

        /* ══════════════════════════════════════
           MOBILE DRAWER — full-screen tab layout
           ══════════════════════════════════════ */
        .fs-panel {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100dvh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          background: var(--color-primary-dark);
          display: flex;
          flex-direction: column;
        }

        .fs-header {
          position: sticky;
          top: 0;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: var(--color-primary-dark);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .fs-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fs-header-brand img {
          height: 34px;
          width: auto;
        }
        .fs-close {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.3);
          background: rgba(201,169,110,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-accent-light);
          flex-shrink: 0;
          transition: background var(--transition-fast);
        }
        .fs-close:hover { background: rgba(201,169,110,0.18); }

        /* Auth block */
        .fs-auth {
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .fs-auth-guest-label {
          font-family: var(--font-body);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(253,250,246,0.4);
          margin-bottom: 12px;
        }
        .fs-auth-buttons {
          display: flex;
          gap: 10px;
        }
        .fs-btn-signin {
          flex: 1;
          text-align: center;
          padding: 13px 0;
          background: var(--color-accent);
          color: var(--color-primary-dark);
          border: none;
          border-radius: 2px;
          font-family: var(--font-body); font-size: 0.68rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; font-weight: 600;
          transition: background var(--transition-fast);
        }
        .fs-btn-signin:hover { background: var(--color-accent-light); }
        .fs-btn-register {
          flex: 1;
          text-align: center;
          padding: 13px 0;
          background: transparent;
          color: rgba(253,250,246,0.75);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 2px;
          font-family: var(--font-body); font-size: 0.68rem;
          letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; text-decoration: none;
          transition: border-color var(--transition-fast), color var(--transition-fast);
        }
        .fs-btn-register:hover { border-color: var(--color-accent); color: var(--color-accent-light); }

        .fs-user-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .fs-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1.5px solid var(--color-accent);
        }
        .fs-user-name {
          font-family: var(--font-body); font-size: 0.85rem;
          letter-spacing: 0.05em; text-transform: none;
          color: var(--color-text-inverse); margin: 0; font-weight: 600;
        }
        .fs-user-sub {
          font-family: var(--font-body); font-size: 0.68rem;
          color: rgba(253,250,246,0.45); letter-spacing: 0.08em; margin: 2px 0 0;
        }

        /* Account grid — proper tab-like buttons, not pills */
        .fs-account-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-top: 16px;
        }
        .fs-account-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 8px;
          border: 1px solid rgba(201,169,110,0.25);
          background: rgba(201,169,110,0.06);
          font-family: var(--font-body); font-size: 0.65rem;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-accent-light); text-decoration: none;
          cursor: pointer; border-radius: 2px; text-align: center;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .fs-account-btn:hover { background: rgba(201,169,110,0.16); }
        .fs-account-btn.danger {
          border-color: rgba(192,57,43,0.3); color: #e08080;
          grid-column: span 2;
        }
        .fs-account-btn.danger:hover { background: rgba(192,57,43,0.14); color: #fff; }

        /* Main nav — full-width tab buttons, each covers full row */
        .fs-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 8px 0;
        }
        .fs-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px 20px;
          font-family: var(--font-display);
          font-size: 1.25rem; font-weight: 400;
          color: rgba(253,250,246,0.85); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: transparent;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .fs-nav-link:active,
        .fs-nav-link:hover {
          background: rgba(201,169,110,0.08);
          color: var(--color-accent-light);
        }
        .fs-nav-arrow {
          color: var(--color-accent);
          opacity: 0.6;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .fs-cta {
          padding: 18px 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .fs-cta-btn {
          display: block; text-align: center; padding: 16px 0;
          background: var(--color-accent); color: var(--color-primary-dark);
          font-family: var(--font-body); font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase; text-decoration: none;
          border-radius: 2px;
          transition: background var(--transition-fast);
        }
        .fs-cta-btn:hover { background: var(--color-accent-light); }

        .fs-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px 24px;
          flex-shrink: 0;
        }
        .fs-currency {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-body); font-size: 0.65rem;
          letter-spacing: 0.1em; color: rgba(253,250,246,0.5);
          text-decoration: none;
        }
      `}</style>

      {/* ══ MOBILE DRAWER — full screen, tab-style nav ══ */}
      <Dialog
        open={mobileOpen}
        onClose={setMobileOpen}
        className="relative z-[150] lg:hidden"
      >
        <Transition
          show={mobileOpen}
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0"
            style={{ background: "var(--color-overlay)" }}
          />
        </Transition>

        <div className="fixed inset-0 z-[160]">
          <Transition
            show={mobileOpen}
            as={Fragment}
            enter="transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-250"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fs-panel">
              {/* Header: brand + close */}
              <div className="fs-header">
                <div className="fs-header-brand">
                  <img src="/images/logo.png" alt="RB Hair & Beauty Lounge" />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="fs-close"
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* Auth */}
              <div className="fs-auth">
                {!user ? (
                  <>
                    <p className="fs-auth-guest-label">Your account</p>
                    <div className="fs-auth-buttons">
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          openLogin();
                        }}
                        className="fs-btn-signin"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          openRegister();
                        }}
                        className="fs-btn-register"
                      >
                        Create Account
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="fs-user-row">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="fs-avatar"
                        />
                      ) : (
                        <UserCircleIcon
                          className="fs-avatar"
                          style={{ color: "var(--color-text-light)" }}
                        />
                      )}
                      <div>
                        <p className="fs-user-name">{user.name}</p>
                        <p className="fs-user-sub">My Account</p>
                      </div>
                    </div>

                    <div className="fs-account-grid">
                      {mobileAccountItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="fs-account-btn"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="fs-account-btn danger"
                        onClick={() => setMobileOpen(false)}
                      >
                        Logout
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* Nav links — full-width tabs */}
              <nav className="fs-nav">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="fs-nav-link"
                    onClick={(e) => {
                      if (item.scrollTo) {
                        const isHome = window.location.pathname === "/";
                        setMobileOpen(false);
                        if (isHome) {
                          e.preventDefault();
                          setTimeout(() => {
                            document
                              .getElementById(item.scrollTo!)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }, 200);
                        }
                        return;
                      }
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                    <ChevronRight size={20} className="fs-nav-arrow" />
                  </Link>
                ))}
              </nav>

              {/* CTA */}
              <div className="fs-cta">
                <Link
                  href={route("bookings.store")}
                  className="fs-cta-btn"
                  onClick={() => setMobileOpen(false)}
                >
                  Book a Consultation
                </Link>
              </div>

              {/* Footer: currency + socials */}
              <div className="fs-footer">
                <a href="#" className="fs-currency">
                  <img
                    src="https://tailwindcss.com/plus-assets/img/flags/flag-australia.svg"
                    alt="AUD"
                    style={{ width: 16, height: "auto" }}
                  />
                  AUD
                </a>
                {SOCIALS.length > 0 && (
                  <div className="footer-socials">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="footer-social-btn"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition>
        </div>
      </Dialog>

      {/* ══ SEARCH OVERLAY ══ */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ══ PRIMARY NAV WRAPPER (sticky) ══ */}
      <div className="sticky top-0 z-50">
        {/* ══ ANNOUNCEMENT BAR — desktop ══ */}
        <div
          className="hidden md:flex"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "10px 40px",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                color: "white",
                fontWeight: 600,
                letterSpacing: "0.08em",
                whiteSpace: "nowrap",
                margin: 0,
              }}
            >
              Call: (+61) 414-226-056
            </p>
          </div>

          <div style={{ flex: "0 1 auto", textAlign: "center", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--color-accent-light)" }}>✦</span>{" "}
            Complimentary consultation with every new client booking{" "}
            <span style={{ color: "var(--color-accent-light)" }}>✦</span>
          </div>

          <div
            style={{
              flex: "1 1 0",
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social-btn"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ══ ANNOUNCEMENT BAR — mobile ══ */}
        <div
          className="flex md:hidden"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "10px 16px",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <a
            href="tel:+61414226056"
            style={{
              fontSize: 12,
              color: "white",
              fontWeight: 700,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            Call +61 414 226 056
          </a>

          {SOCIALS.length > 0 && (
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social-btn"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ══ HEADER ══ */}
        <header
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 76,
              gap: 16,
            }}
            className="lg:!px-10"
          >
            {/* Logo */}
            <Link
              href={route("home")}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <img
                src="/images/logo.png"
                alt="RB Hair & Beauty Lounge"
                style={{
                  height: 48,
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Link>

            {/* Nav links — desktop only */}
            <nav
              className="hidden lg:flex"
              style={{
                alignItems: "center",
                gap: 32,
                flexShrink: 0,
                margin: "0 auto",
              }}
            >
              <NavLink
                href="/#services"
                active={onHomePage}
                onClick={(e) => {
                  const onHomePageClick = window.location.pathname === "/";
                  if (onHomePageClick) {
                    e.preventDefault();
                    document
                      .getElementById("services")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Services
              </NavLink>
              <NavLink href={route("about")} active={url.startsWith("/about")}>
                About
              </NavLink>
              <NavLink
                href={route("gallery.index")}
                active={url.startsWith("/gallery")}
              >
                Gallery
              </NavLink>
              <NavLink
                href={route("gift-voucher.shop")}
                active={url.startsWith("/gift-voucher")}
              >
                Gift Vouchers
              </NavLink>
              <NavLink
                href={route("contact.index")}
                active={url.startsWith("/contact")}
              >
                Contact
              </NavLink>
            </nav>

            {/* Icons + Book Now */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setSearchOpen(true)}
                style={iconBtnStyle}
                aria-label="Search"
                className="nav-icon-btn"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              <div style={{ position: "relative", display: "flex" }}>
                <MiniCartDropdown />
              </div>

              {/* User — desktop only */}
              <div
                className="hidden lg:flex"
                style={{ position: "relative" }}
                ref={userDropdownRef}
              >
                {user ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen((p) => !p)}
                      aria-label="User menu"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        border: "1.5px solid var(--color-accent)",
                        overflow: "hidden",
                        cursor: "pointer",
                        padding: 0,
                        background: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <UserCircleIcon
                          style={{
                            width: "100%",
                            height: "100%",
                            color: "var(--color-text-muted)",
                          }}
                        />
                      )}
                    </button>

                    {userDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 12px)",
                          right: 0,
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          minWidth: 180,
                          padding: "6px 0",
                          zIndex: 120,
                        }}
                      >
                        {[
                          ...(isAdmin
                            ? [
                                {
                                  label: "Admin Dashboard",
                                  href: route("admin.dashboard"),
                                },
                              ]
                            : []),
                          { label: "Your Vouchers", href: route("vouchers.index") },
                          { label: "Profile", href: route("profile.edit") },
                          { label: "Bookings", href: route("bookings.history") },
                          { label: "Orders", href: route("orders.history") },
                        ].map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="user-menu-item"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                        <div
                          style={{
                            height: 1,
                            background: "var(--color-border)",
                            margin: "6px 0",
                          }}
                        />
                        <Link
                          href={route("logout")}
                          method="post"
                          as="button"
                          className="user-menu-item danger"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen((p) => !p)}
                      style={iconBtnStyle}
                      aria-label="Account"
                      className="nav-icon-btn"
                    >
                      <User size={18} strokeWidth={1.5} />
                    </button>

                    {userDropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 12px)",
                          right: 0,
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          minWidth: 180,
                          padding: "6px 0",
                          zIndex: 120,
                        }}
                      >
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            openLogin();
                          }}
                          className="nav-dropdown-item"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            openRegister();
                          }}
                          className="nav-dropdown-item"
                        >
                          Create Account
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Book Now — desktop only */}
              <Link
                href={route("shop.search")}
                className="hidden lg:inline-flex"
                style={{
                  marginLeft: 10,
                  padding: "10px 22px",
                  background: "var(--color-primary)",
                  color: "var(--color-text-inverse)",
                  fontFamily: "var(--font-body)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "1px solid var(--color-primary)",
                  transition: "all var(--transition-base)",
                  whiteSpace: "nowrap",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                Book Now
              </Link>

             {/* Hamburger — mobile only */}
<button
  onClick={() => setMobileOpen(true)}
  style={{ ...iconBtnStyle, display: undefined }}
  aria-label="Open menu"
  className="lg:hidden flex items-center justify-center"
>
  <Bars3Icon className="size-5" />
</button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
