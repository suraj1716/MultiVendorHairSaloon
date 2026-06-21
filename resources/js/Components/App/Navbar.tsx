"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, usePage, router } from "@inertiajs/react";
import { Search, User } from "lucide-react";
import MiniCartDropdown from "./MiniCartDropdown";
import LoginModal from "@/Pages/Auth/Login";
import { PageProps } from "@/types";
import { Bars3Icon } from "@heroicons/react/24/outline";
import RegisterModal from "@/Pages/Auth/Register";
import { useAuthModal } from "@/Contexts/AuthModalContext";

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

function LogoOrnament() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, margin: "3px 0" }}
    >
      <div
        style={{ width: 28, height: 1, background: "var(--color-accent)" }}
      />
      <div
        style={{
          width: 4,
          height: 4,
          background: "var(--color-accent)",
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{ width: 28, height: 1, background: "var(--color-accent)" }}
      />
    </div>
  );
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
  const [query, setQuery] = useState(""); // ← controlled input

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery(""); // ← clear on open
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
          padding: "48px 40px 36px",
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
            {/* Search icon — clicking it triggers search */}
            <button
              onClick={() => handleSearch(query)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
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
                border: "none",
                outline: "none",
                fontFamily: "var(--font-display)",
                fontSize: 24,
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
              }}
            >
              Close
            </button>
          </div>

          {/* Suggestion pills */}
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}
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
  const page = usePage();
  const { auth, keyword, categoryGroups, productGroups } = usePage<
    PageProps<{
      keyword: string;
      departments: Department[];
      categoryGroups: CategoryGroup[];
      productGroups: ProductGroup[];
      auth?: { user: any };
    }>
  >().props;
  const user = auth?.user ?? null;
  const groups = (categoryGroups as CategoryGroup[]) ?? [];
  const pGroups = (productGroups as ProductGroup[]) ?? [];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { openLogin, openRegister } = useAuthModal();

  const collectionsRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(e.target as Node)
      )
        setCollectionsOpen(false);
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
  }, []);

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
  };

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

        .subnav-link {
          font-family: var(--font-body); font-size: 10px; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--color-text-muted); text-decoration: none;
          padding: 0 20px; height: 100%; display: flex; align-items: center;
          border-right: 1px solid var(--color-border);
          transition: color var(--transition-fast), background var(--transition-fast);
        }
        .subnav-link:first-child { border-left: 1px solid var(--color-border); }
        .subnav-link:hover { color: var(--color-primary); background: rgba(201,169,110,0.08); }
        .subnav-link.featured { color: var(--color-accent-dark); font-weight: 500; }

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

        /* ── Full-screen mobile menu ── */
        .fs-panel {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-primary-dark);
}

        /* Left dark half */
        .fs-left {
          background: var(--color-primary-dark);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2rem 1.5rem;
        }
        .fs-left::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 280px; height: 280px;
          border-radius: 50%;
          border: 50px solid rgba(201,169,110,0.08);
          pointer-events: none;
        }
        .fs-left::after {
          content: '';
          position: absolute;
          bottom: 30%; right: -60px;
          width: 180px; height: 180px;
          border-radius: 50%;
          border: 30px solid rgba(74,124,47,0.15);
          pointer-events: none;
        }
        .fs-left-accent-line {
          width: 40px; height: 1px;
          background: var(--color-accent);
          opacity: 0.5;
          margin-bottom: 1.25rem;
          position: relative; z-index: 1;
        }
        .fs-left-brand {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 300;
          font-style: italic;
          color: var(--color-text-inverse);
          line-height: 1.1;
          position: relative; z-index: 1;
          margin: 0;
        }
        .fs-left-brand span { display: block; color: var(--color-accent); }
        .fs-left-tagline {
          font-family: var(--font-body);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(253,250,246,0.4);
          margin-top: 0.75rem;
          position: relative; z-index: 1;
        }

        /* Right light half */
        .fs-right {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: transparent;
}
        .fs-close {
  position: absolute;
  top: 1.25rem; right: 1.25rem;
  width: 2.25rem; height: 2.25rem;
  border-radius: 50%;
  border: 1px solid rgba(201,169,110,0.25);
  background: rgba(201,169,110,0.08);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--color-accent-light);
  z-index: 10;
  transition: background var(--transition-fast);
}
.fs-close:hover { background: rgba(201,169,110,0.18); }

.fs-auth {
  padding: 4rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.fs-auth-guest-label {
  font-family: var(--font-body);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(253,250,246,0.35);
  margin-bottom: 0.75rem;
}
.fs-btn-signin {
  display: block; width: 100%; padding: 0.7rem 0;
  background: var(--color-accent);
  color: var(--color-primary-dark);
  border: none;
  font-family: var(--font-body); font-size: 0.6rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  cursor: pointer; margin-bottom: 0.5rem; font-weight: 600;
  transition: background var(--transition-fast);
}
.fs-btn-signin:hover { background: var(--color-accent-light); }
.fs-btn-register {
  display: block; width: 100%; padding: 0.7rem 0;
  background: transparent;
  color: rgba(253,250,246,0.55);
  border: 1px solid rgba(255,255,255,0.15);
  font-family: var(--font-body); font-size: 0.6rem;
  letter-spacing: 0.18em; text-transform: uppercase;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: border-color var(--transition-fast), color var(--transition-fast);
}
.fs-btn-register:hover { border-color: var(--color-accent); color: var(--color-accent-light); }

.fs-user-name { font-family: var(--font-body); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-text-inverse); margin: 0; }
.fs-user-sub { font-family: var(--font-body); font-size: 0.6rem; color: rgba(253,250,246,0.4); letter-spacing: 0.1em; margin: 0; }
.fs-chip {
  padding: 0.25rem 0.65rem;
  border: 1px solid rgba(201,169,110,0.25);
  font-family: var(--font-body); font-size: 0.55rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--color-accent-light); text-decoration: none;
  background: rgba(201,169,110,0.07); cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.fs-chip:hover { background: var(--color-accent); color: var(--color-primary-dark); border-color: var(--color-accent); }
.fs-chip.danger { border-color: rgba(192,57,43,0.3); color: #e07070; }
.fs-chip.danger:hover { background: var(--color-error); color: #fff; border-color: var(--color-error); }

.fs-nav { flex: 1; padding: 0.5rem 0; }
.fs-nav-link {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem; font-weight: 300; font-style: italic;
  color: rgba(253,250,246,0.7); text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  transition: color var(--transition-fast), padding-left var(--transition-base);
}
.fs-nav-link:hover { color: var(--color-accent-light); padding-left: 2rem; }
.fs-nav-arrow { color: var(--color-accent); opacity: 0; font-size: 1rem; transition: opacity var(--transition-fast), transform var(--transition-fast); }
.fs-nav-link:hover .fs-nav-arrow { opacity: 1; transform: translateX(4px); }

.fs-disclosure-btn {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 1rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1.5rem; font-weight: 300; font-style: italic;
  color: rgba(253,250,246,0.7);
  background: none; border: none; border-bottom: 1px solid rgba(255,255,255,0.06);
  cursor: pointer; text-align: left;
  transition: color var(--transition-fast), padding-left var(--transition-base);
}
.fs-disclosure-btn:hover { color: var(--color-accent-light); padding-left: 2rem; }

.fs-sub-item {
  display: block; width: 100%; padding: 0.7rem 2.5rem;
  font-family: var(--font-body); font-size: 0.6rem;
  letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(253,250,246,0.4);
  background: rgba(0,0,0,0.15);
  border: none; border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer; text-align: left;
  transition: color var(--transition-fast), background var(--transition-fast);
}
.fs-sub-item:hover { color: var(--color-accent-light); background: rgba(201,169,110,0.08); }

.fs-cta { padding: 1.25rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.08); }
.fs-cta-btn {
  display: block; text-align: center; padding: 0.85rem 0;
  background: var(--color-accent); color: var(--color-primary-dark);
  font-family: var(--font-body); font-size: 0.6rem; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase; text-decoration: none;
  transition: background var(--transition-fast);
}
.fs-cta-btn:hover { background: var(--color-accent-light); }

.fs-currency {
  padding: 0.85rem 1.5rem;
  display: flex; align-items: center; gap: 0.6rem;
  font-family: var(--font-body); font-size: 0.6rem;
  letter-spacing: 0.12em; color: rgba(253,250,246,0.3);
  text-decoration: none; border-top: 1px solid rgba(255,255,255,0.06);
}
      `}</style>

      {/* ══ MOBILE DRAWER ══ */}
      <Dialog
        open={mobileOpen}
        onClose={setMobileOpen}
        className="relative z-[150] lg:hidden"
      >
        {/* Backdrop */}
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

        {/* Panel */}
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
              {/* LEFT: dark decorative */}
              <div className="fs-left">
                <div className="fs-left-accent-line" />
                <p className="fs-left-brand">Dhurva Studio</p>
                <p className="fs-left-tagline">Est. 2020 · Melbourne</p>
              </div>

              {/* RIGHT: nav */}
              <div className="fs-right">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="fs-close"
                  aria-label="Close menu"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                {/* Auth */}
                <div className="fs-auth">
                  {!user ? (
                    <>
                      <p className="fs-auth-guest-label">Your account</p>

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
                    </>
                  ) : (
                    <>
                      <div className="fs-user-row">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="fs-avatar"
                        />

                        <div style={{ textAlign: "left" }}>
                          <p className="fs-user-name">{user.name}</p>
                          <p className="fs-user-sub">My Account</p>
                        </div>

                        <ChevronDownIcon
                          style={{
                            width: "1rem",
                            height: "1rem",
                            marginLeft: "auto",
                            color: "var(--color-text-light)",
                            transform: "rotate(180deg)", // always open
                            flexShrink: 0,
                          }}
                        />
                      </div>

                      {/* Always visible when logged in */}
                      <div className="fs-user-chips">
                        <Link
                          href={route("vouchers.index")}
                          className="fs-chip"
                          onClick={() => setMobileOpen(false)}
                        >
                          Vouchers
                        </Link>

                        <Link
                          href={route("profile.edit")}
                          className="fs-chip"
                          onClick={() => setMobileOpen(false)}
                        >
                          Profile
                        </Link>

                        <Link
                          href={route("bookings.history")}
                          className="fs-chip"
                          onClick={() => setMobileOpen(false)}
                        >
                          Bookings
                        </Link>

                        <Link
                          href={route("orders.history")}
                          className="fs-chip"
                          onClick={() => setMobileOpen(false)}
                        >
                          Orders
                        </Link>

                        <Link
                          href={route("logout")}
                          method="post"
                          as="button"
                          className="fs-chip danger"
                          onClick={() => setMobileOpen(false)}
                        >
                          Logout
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {/* Nav links */}
                <nav className="fs-nav">


                  {[
                     { label: "Book Services", href: route("shop.search") },
                    {
                      label: "Services",
                      href: "/#services",
                      scrollTo: "services",
                    },
                    { label: "About", href: route("about") },
                    { label: "Gallery", href: route("gallery.index") },
                    { label: "Gift Cards", href: route("gift-voucher.shop") },
                    { label: "Contact Us", href: route("contact.index") },
                  ].map((item: any) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="fs-nav-link"
                      onClick={(e) => {
                        if (item.requiresAuth && !user) {
                          e.preventDefault();
                          setMobileOpen(false);
                          openLogin();
                          return;
                        }

                        if (item.scrollTo) {
                          const onHomePage = window.location.pathname === "/";
                          setMobileOpen(false);

                          if (onHomePage) {
                            e.preventDefault();
                            // slight delay lets the mobile drawer close before scrolling
                            setTimeout(() => {
                              const el = document.getElementById(item.scrollTo);
                              el?.scrollIntoView({ behavior: "smooth" });
                            }, 200);
                          }
                          return;
                        }

                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                      <span className="fs-nav-arrow">→</span>
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

                {/* Currency */}
                <a href="#" className="fs-currency">
                  <img
                    src="https://tailwindcss.com/plus-assets/img/flags/flag-australia.svg"
                    alt="AUD"
                    style={{ width: 18, height: "auto" }}
                  />
                  AUD — Australian Dollar
                </a>
              </div>
            </Dialog.Panel>
          </Transition>
        </div>
      </Dialog>

      {/* ══ SEARCH OVERLAY ══ */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ══ PRIMARY NAV WRAPPER (sticky) ══ */}
      <div className="sticky top-0 z-50">
        {/* ══ ANNOUNCEMENT BAR — plain, no sticky ══ */}
        <div
          className="bg-white border-b"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <span style={{ color: "var(--color-accent-light)" }}>✦</span>
          Complimentary consultation with every new client booking &nbsp;—&nbsp;
          <span style={{ color: "var(--color-accent-light)" }}>✦</span>
        </div>

        {/* ══ HEADER — plain, no sticky ══ */}
        <header
          className="bg-white border-b"
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 80,
              gap: 24,
            }}
            className="max-lg:!px-10"
          >
            {/* 1: Logo */}
            <Link
              href={route("home")}
              style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginRight: 64,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  fontWeight: 400,
                  fontStyle: "italic",
                  letterSpacing: "0.1em",
                  color: "var(--color-text)",
                  lineHeight: 1,
                }}
              >
                Dhurva
              </span>
              <LogoOrnament />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 8,
                  fontWeight: 400,
                  letterSpacing: "0.38em",
                  textTransform: "uppercase",
                  color: "var(--color-accent-dark)",
                  lineHeight: 1,
                  marginTop: 2,
                }}
              >
                Luxury Hair Atelier
              </span>
            </Link>

            {/* 2: Nav links */}
            <nav
              className="hidden lg:flex"
              style={{ alignItems: "center", gap: 36, flexShrink: 0 }}
            >
              <NavLink
                href="/#services"
                active
                onClick={(e) => {
                  const onHomePage = window.location.pathname === "/";
                  if (onHomePage) {
                    e.preventDefault();
                    const el = document.getElementById("services");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Services
              </NavLink>
              <NavLink href={route("about")}>About</NavLink>
              <NavLink href={route("gallery.index")}>Gallery</NavLink>
              <NavLink href={route("gift-voucher.shop")}>Gift Vouchers</NavLink>
              <NavLink href={route("contact.index")}>Contact</NavLink>
            </nav>

            {/* 3: Icons (search, cart, account) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
                marginLeft: "auto", // pushes icons + button group to the right
              }}
            >
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                style={iconBtnStyle}
                aria-label="Search"
                className="nav-icon-btn"
              >
                <Search size={18} strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <div style={{ position: "relative" }}>
                <MiniCartDropdown />
              </div>

              {/* User — desktop only */}
              <div
                className="hidden lg:block"
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
                      }}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
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
                          {
                            label: "Your Vouchers",
                            href: route("vouchers.index"),
                          },
                          { label: "Profile", href: route("profile.edit") },
                          {
                            label: "Bookings",
                            href: route("bookings.history"),
                          },
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

              {/* Hamburger — mobile only */}
              <div className="lg:hidden" style={{ marginLeft: 4 }}>
                <button
                  onClick={() => setMobileOpen(true)}
                  style={iconBtnStyle}
                  aria-label="Open menu"
                >
                  <Bars3Icon className="size-5" />
                </button>
              </div>
            </div>

            {/* 4: Book Now — desktop only */}
            <Link
              href={route("shop.search")}
              className="hidden lg:inline-flex"
              style={{
                padding: "9px 22px",
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
          </div>
        </header>
      </div>
    </>
  );
}
