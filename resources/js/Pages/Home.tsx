"use client";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Category,
  CategoryGroup,
  Department,
  PaginationProps,
  Product,
  ProductGroup,
} from "@/types";
import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, usePage } from "@inertiajs/react";
import ProductCarousel from "@/Components/App/ProductCarousel";
import HeroCarousel from "@/Components/App/Hero_Banner";
import CountUp from "react-countup";
import {
  FireIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  GiftIcon,
  TicketIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
const iconPool = [
  FireIcon,
  ArrowTrendingUpIcon,
  TagIcon,
  SparklesIcon,
  StarIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  GiftIcon,
  TicketIcon,
  ShoppingBagIcon,
];

interface HeroBannerProps {
  id: number;
  title: string;
  subtitle: string;
  image_path: string;
  button_text?: string;
  button_link?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PageProps {
  allproducts: PaginationProps<Product>;
  products: PaginationProps<Product>;
  categoryGroups: CategoryGroup[];
  productGroups: ProductGroup[];
  banners: HeroBannerProps[];
  departments: Department[];
   categories: Category[];
}

const getIconByIndex = (index: number) => {
  const Icon = iconPool[index % iconPool.length];
  return <Icon className="w-5 h-5" style={{ color: "var(--color-accent)" }} />;
};

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const stats = [
  {
    end: 2700,
    suffix: "+",
    label: "Happy Clients",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z",
  },
  {
    end: 1300,
    suffix: "+",
    label: "5-Star Reviews",
    icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    end: 48,
    suffix: "",
    label: "Expert Stylists",
    icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  },
  {
    end: 15,
    suffix: "y",
    label: "Years of Excellence",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
];

const pillars = [
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M6.343 6.343l-.707-.707M6.343 17.657l-.707.707M15.536 15.536l.707.707M12 21v-1",
    title: "Premium Products",
    body: "We use only the finest professional-grade colour, treatment, and care products sourced from world-leading brands.",
  },
  {
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    title: "Master Stylists",
    body: "Every member of our team is trained to international standards and committed to continuous education.",
  },
  {
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Personalised Care",
    body: "Every consultation is tailored to your unique hair type, lifestyle, and aesthetic goals.",
  },
];

const marqueeItems = [
  "Premium Hair Services",
  "Expert Stylists",
  "Sydney CBD",
  "Book Online",
  "Luxury Treatments",
  "Award Winning",
];

const testimonials = [
  {
    quote:
      "Absolutely transformed my hair. The balayage is exactly what I'd been dreaming of for years.",
    name: "Amelia R.",
    service: "Balayage & Toning",
    stars: 5,
  },
  {
    quote:
      "The scalp treatment was incredibly relaxing. My hair feels healthier than it has in a decade.",
    name: "Priya S.",
    service: "Scalp Ritual",
    stars: 5,
  },
  {
    quote:
      "Worth every cent. The team is professional, kind, and genuinely talented. My go-to salon.",
    name: "Charlotte M.",
    service: "Cut & Style",
    stars: 5,
  },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function GoldDivider({ centered = true }: { centered?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: centered ? "center" : "flex-start",
        gap: 10,
        margin: "1.25rem 0 0",
      }}
    >
      <div
        style={{ width: 48, height: 1, background: "var(--color-accent)" }}
      />
      <div
        style={{
          width: 5,
          height: 5,
          background: "var(--color-accent)",
          transform: "rotate(45deg)",
          flexShrink: 0,
        }}
      />
      <div
        style={{ width: 48, height: 1, background: "var(--color-accent)" }}
      />
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.65rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "var(--color-accent)",
        display: "block",
        marginBottom: "0.6rem",
      }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)",
        fontWeight: 300,
        color: "var(--color-text)",
        lineHeight: 1.15,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}

/* ─────────────────────────────────────────────
   Main
───────────────────────────────────────────── */
export default function Home({
  allproducts,
  products,
  categoryGroups,
  departments,
  productGroups,
  banners,
  categories,
}: PageProps) {
  const { url } = usePage();
  const [activeDepartment, setActiveDepartment] = useState<Department | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [landscapeImages, setLandscapeImages] = useState<
    Record<number, string>
  >({});
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      const results: Record<number, string> = {};
      for (const group of productGroups) {
        if (!group?.images?.length) continue;
        for (const image of group.images) {
          const img = new Image();
          img.src = `/storage/${image}`;
          await new Promise((resolve) => {
            img.onload = () => {
              if (img.naturalWidth > img.naturalHeight && !results[group.id]) {
                results[group.id] = image;
              }
              resolve(true);
            };
          });
          if (results[group.id]) break;
        }
      }
      setLandscapeImages(results);
    };
    loadImages();
  }, [productGroups]);

  useEffect(() => {
    AOS.init({ duration: 750, once: true, easing: "ease-out" });
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(
      "scrollToCategoryId",
    );
    if (id)
      document
        .getElementById(`category-group-${id}`)
        ?.scrollIntoView({ behavior: "smooth" });
  }, [url]);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get(
      "scrollToProductId",
    );
    if (id)
      document
        .getElementById(`product-group-${id}`)
        ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = document.getElementById("stats-section");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* testimonial auto-rotate */
  useEffect(() => {
    const t = setInterval(
      () => setActiveTestimonial((i) => (i + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  const eyebrow: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: "0.7rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: "var(--color-accent)",
    display: "block",
    marginBottom: "0.5rem",
  };

  return (
    <div
      className=" isolate"
      style={{ fontFamily: "var(--font-body)", background: "var(--color-bg)" }}
    >
      <AuthenticatedLayout>
        {/* ══ HERO ══ */}
        <div className="relative z-0">
          <HeroCarousel
            banners={(banners ?? []).map((b) => ({
              ...b,
              button_text: b.button_text ?? "",
              button_link: b.button_link ?? "",
            }))}
          />
        </div>

        {/* ══ MARQUEE ══ */}
        <div
          style={{
            background: "var(--color-primary)",
            padding: "13px 0",
            overflow: "hidden",
            borderBottom: "1px solid rgba(201,169,110,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {marqueeItems.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--color-accent-light)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span
                  style={{ color: "var(--color-accent)", fontSize: "0.75rem" }}
                >
                  ✦
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ══ SPLIT INTRO ══ */}
        <section
          style={{
            background: "var(--color-bg)",
            padding: "7rem 0",
            overflow: "hidden",
          }}
          data-aos="fade-up"
        >
          <div className="container-site">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "5rem",
                alignItems: "center",
              }}
              className="max-lg:grid-cols-1 max-lg:gap-12"
            >
              {/* left: text */}
              <div>
                <SectionEyebrow>Est. 2009 · Sydney CBD</SectionEyebrow>
                <SectionHeading>
                  The art of hair,{" "}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--color-accent)",
                    }}
                  >
                    elevated
                  </em>
                </SectionHeading>
                <GoldDivider centered={false} />
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    lineHeight: 1.85,
                    fontSize: "0.97rem",
                    marginTop: "1.75rem",
                    maxWidth: 460,
                  }}
                >
                  Dhurva is Sydney's destination for precision haircraft. From
                  transformative colour to restorative treatments, every service
                  is designed around you — your hair, your lifestyle, your
                  vision.
                </p>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    lineHeight: 1.85,
                    fontSize: "0.97rem",
                    marginTop: "1rem",
                    maxWidth: 460,
                  }}
                >
                  Our atelier brings together master colourists, texture
                  specialists, and bridal artists under one roof — each devoted
                  to making excellence feel effortless.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    marginTop: "2.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href={route("shop.search")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "13px 28px",
                      background: "var(--color-accent)",
                      color: "var(--color-bg-dark)",
                      border: "1px solid var(--color-accent)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "background 250ms, border-color 250ms",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--color-accent-dark)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "var(--color-accent)";
                    }}
                  >
                    Explore Services
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ width: 13, height: 13 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                  <a
                    href={route("about")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "13px 28px",
                      background: "transparent",
                      color: "var(--color-text)",
                      border: "1px solid var(--color-border)",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      fontWeight: 400,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      transition: "border-color 250ms",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-border)";
                    }}
                  >
                    Our Story
                  </a>
                </div>
              </div>

              {/* right: stacked image mosaic */}
              <div
                style={{ position: "relative", height: 520 }}
                className="max-lg:hidden"
              >
                {/* large background image */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "78%",
                    height: "78%",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                  }}
                >
                  {categories[2]?.image && (
                    <img
                      src={`/storage/${categories[2].image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(28,26,23,0.18)",
                    }}
                  />
                </div>
                {/* small inset image */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "52%",
                    height: "52%",
                    background: "var(--color-surface-warm)",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
                  }}
                >
                  {categories[4]?.image && (
                    <img
                      src={`/storage/${categories[4].image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                {/* accent card */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "22%",
                    right: "-1.5rem",
                    background: "var(--color-primary)",
                    border: "1px solid rgba(201,169,110,0.3)",
                    padding: "1.25rem 1.5rem",
                    minWidth: 160,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2rem",
                      fontWeight: 300,
                      color: "var(--color-accent-light)",
                      lineHeight: 1,
                    }}
                  >
                    15+
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 4,
                    }}
                  >
                    Years of Excellence
                  </div>
                </div>
                {/* vertical rule decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: "8%",
                    left: "20%",
                    width: 1,
                    height: 60,
                    background: "var(--color-accent)",
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section
          id="stats-section"
          style={{
            background: "var(--color-primary)",
            borderTop: "1px solid rgba(201,169,110,0.15)",
            borderBottom: "1px solid rgba(201,169,110,0.15)",
          }}
        >
          <div className="container-site" style={{ paddingBlock: "4.5rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "2rem",
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{ textAlign: "center", position: "relative" }}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                >
                  {/* divider between items */}
                  {i > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        width: 1,
                        height: "60%",
                        background: "rgba(201,169,110,0.15)",
                      }}
                      className="max-sm:hidden"
                    />
                  )}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{
                      width: 28,
                      height: 28,
                      margin: "0 auto 0.75rem",
                      color: "var(--color-accent)",
                      opacity: 0.8,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={s.icon}
                    />
                  </svg>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 4vw, 2.75rem)",
                      fontWeight: 300,
                      color: "white",
                      lineHeight: 1,
                    }}
                  >
                    {statsVisible ? (
                      <CountUp
                        end={s.end}
                        duration={2.5}
                        separator=","
                        suffix={s.suffix}
                      />
                    ) : (
                      <span>0{s.suffix}</span>
                    )}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.4)",
                      marginTop: "0.5rem",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ SERVICES BENTO ══ */}
        <section id="services"
          style={{ background: "var(--color-bg)", padding: "7rem 0",  scrollMarginTop: "100px", }}
          data-aos="fade-up"
        >
          <div className="container-site">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "3rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <SectionEyebrow>What We Offer</SectionEyebrow>
                <SectionHeading>
                  Our{" "}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--color-accent)",
                    }}
                  >
                    Services
                  </em>
                </SectionHeading>
                <GoldDivider centered={false} />
              </div>
              <a
                href={route("shop.search")}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderBottom: "1px solid var(--color-accent)",
                  paddingBottom: 2,
                }}
              >
                View All Services
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  style={{ width: 12, height: 12 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>

            {/* Desktop bento */}
            <div
              className="lg:grid hidden"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(3, 240px)",
                gap: "10px",
              }}
            >
              {categories.slice(0, 9).map((cat, idx) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    gridColumn:
                      idx === 0 ? "span 2" : idx === 5 ? "span 2" : "span 1",
                  }}
                  className="group"
                  data-aos="fade-up"
                  data-aos-delay={idx * 50}
                >
                  <img
                    src={`/storage/${cat.image}`}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.7s ease",
                    }}
                    className="group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(18,16,13,0.85) 0%, rgba(18,16,13,0.1) 55%, transparent 100%)",
                      transition: "opacity 0.3s",
                    }}
                  />
                  {/* hover tint */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(201,169,110,0.06)",
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                    className="group-hover:opacity-100"
                  />
                  {/* accent line */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: 2,
                      width: "0%",
                      background: "var(--color-accent)",
                      transition: "width 0.4s ease",
                    }}
                    className="group-hover:w-full"
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      padding: "1.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: idx === 0 || idx === 5 ? "1.6rem" : "1.25rem",
                        fontWeight: 300,
                        color: "white",
                        letterSpacing: "0.01em",
                        marginBottom: 4,
                      }}
                    >
                      {cat.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.5)",
                      }}
                    >
                      {cat.products_count} treatments
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                      opacity: 0,
                      transition: "opacity 0.3s 0.05s",
                    }}
                    className="group-hover:opacity-100"
                  >
                    <span
                      style={{
                        border: "1px solid rgba(201,169,110,0.6)",
                        color: "var(--color-accent-light)",
                        padding: "4px 14px",
                        fontSize: "0.62rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Explore
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {categories.slice(0, 6).map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    position: "relative",
                    height: "175px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={`/storage/${cat.image}`}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(18,16,13,0.8), transparent 55%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      padding: "0.875rem 1rem",
                      color: "white",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 300,
                      }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ DEPARTMENT MODAL ══ */}
        {/* ══ CATEGORY MODAL ══ */}
        {activeCategory && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(18,16,13,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setActiveCategory(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(520px, 90vw)",
                background: "var(--color-surface-warm)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  height: 240,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={
                    activeCategory.image
                      ? `/storage/${activeCategory.image}`
                      : "/images/placeholder.png"
                  }
                  alt={activeCategory.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(18,16,13,0.6), transparent 60%)",
                  }}
                />

                <button
                  onClick={() => setActiveCategory(null)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    width: 36,
                    height: 36,
                    background: "rgba(18,16,13,0.65)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div style={{ padding: "2rem 2rem 2.5rem" }}>
                <span style={eyebrow}>Category</span>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 300,
                    color: "var(--color-text)",
                    margin: "0.4rem 0 0.875rem",
                  }}
                >
                  {activeCategory.name}
                </h3>

                <p
                  style={{
                    color: "var(--color-text-muted)",
                    lineHeight: 1.8,
                    marginBottom: "1.75rem",
                    fontSize: "0.93rem",
                  }}
                >
                  Browse our collection of {activeCategory.name.toLowerCase()}{" "}
                  products and services.
                </p>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() =>
                      (window.location.href = route(
                        "shop.search",
                        // "category.show",
                        activeCategory.id,
                      ))
                    }
                    className="btn btn-primary"
                  >
                    View Category
                  </button>

                  <button
                    onClick={() => setActiveCategory(null)}
                    className="btn btn-ghost"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ PILLARS ══ */}
        <section
          style={{
            background: "var(--color-surface)",
            borderTop: "1px solid var(--color-border)",
            borderBottom: "1px solid var(--color-border)",
            padding: "7rem 0",
          }}
          data-aos="fade-up"
        >
          <div className="container-site">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <SectionEyebrow>The Dhurva Difference</SectionEyebrow>
              <SectionHeading>
                Crafted for{" "}
                <em
                  style={{ fontStyle: "italic", color: "var(--color-accent)" }}
                >
                  Excellence
                </em>
              </SectionHeading>
              <GoldDivider />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "1px",
                background: "var(--color-border)",
              }}
            >
              {pillars.map((p, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--color-surface-warm)",
                    padding: "3rem 2.5rem",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 300ms",
                  }}
                  className="group hover:bg-[var(--color-bg)]"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  {/* corner accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 3,
                      height: 0,
                      background: "var(--color-accent)",
                      transition: "height 0.4s ease",
                    }}
                    className="group-hover:h-full"
                  />
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      marginBottom: "1.75rem",
                      border: "1px solid var(--color-accent-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      style={{ width: 22, height: 22 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={p.icon}
                      />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.3rem",
                      fontWeight: 300,
                      color: "var(--color-text)",
                      marginBottom: "0.875rem",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-muted)",
                      lineHeight: 1.8,
                      fontSize: "0.9rem",
                    }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section
          style={{
            background: "var(--color-bg)",
            padding: "7rem 0",
            overflow: "hidden",
          }}
          data-aos="fade-up"
        >
          <div className="container-site">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "5rem",
                alignItems: "start",
              }}
              className="max-lg:grid-cols-1 max-lg:gap-10"
            >
              {/* left: label + nav */}
              <div style={{ paddingTop: "0.5rem" }}>
                <SectionEyebrow>Client Love</SectionEyebrow>
                <SectionHeading>
                  What our guests{" "}
                  <em
                    style={{
                      fontStyle: "italic",
                      color: "var(--color-accent)",
                    }}
                  >
                    say
                  </em>
                </SectionHeading>
                <GoldDivider centered={false} />
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    marginTop: "1.5rem",
                    maxWidth: 280,
                  }}
                >
                  Over 1,300 five-star reviews from guests who trust us with
                  their most important asset.
                </p>
                {/* nav dots */}
                <div style={{ display: "flex", gap: 8, marginTop: "2.5rem" }}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      style={{
                        width: i === activeTestimonial ? 28 : 8,
                        height: 8,
                        background:
                          i === activeTestimonial
                            ? "var(--color-accent)"
                            : "var(--color-border)",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "width 300ms ease, background 300ms ease",
                      }}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* right: cards */}
              <div style={{ position: "relative" }}>
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      position: i === 0 ? "relative" : "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      opacity: i === activeTestimonial ? 1 : 0,
                      transform: `translateY(${i === activeTestimonial ? 0 : 16}px)`,
                      transition: "opacity 500ms ease, transform 500ms ease",
                      pointerEvents: i === activeTestimonial ? "all" : "none",
                      background: "var(--color-surface-warm)",
                      border: "1px solid var(--color-border)",
                      padding: "2.5rem",
                    }}
                  >
                    {/* top accent */}
                    <div
                      style={{
                        display: "flex",
                        gap: 2,
                        marginBottom: "1.5rem",
                      }}
                    >
                      {Array.from({ length: t.stars }).map((_, si) => (
                        <svg
                          key={si}
                          viewBox="0 0 24 24"
                          fill="var(--color-accent)"
                          style={{ width: 13, height: 13 }}
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.35rem",
                        fontWeight: 300,
                        color: "var(--color-text)",
                        lineHeight: 1.65,
                        fontStyle: "italic",
                        marginBottom: "2rem",
                      }}
                    >
                      "{t.quote}"
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: 1,
                          height: 32,
                          background: "var(--color-accent)",
                          opacity: 0.5,
                        }}
                      />
                      <div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            color: "var(--color-text)",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--color-text-muted)",
                            marginTop: 2,
                          }}
                        >
                          {t.service}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA BAND ══ */}
        <section
          style={{
            background: "var(--color-primary)",
            padding: "7rem 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* large decorative letterform */}
          <div
            style={{
              position: "absolute",
              right: "-2rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(18rem, 30vw, 26rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "rgba(201,169,110,0.04)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              letterSpacing: "-0.05em",
            }}
          >
            D
          </div>

          {/* geometric accents */}
          {[380, 250, 160].map((sz, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                right: `${-sz / 2 + i * 24}px`,
                top: `${-sz / 2 + i * 18}px`,
                width: sz,
                height: sz,
                borderRadius: "50%",
                border: `1px solid rgba(201,169,110,${0.12 - i * 0.03})`,
                pointerEvents: "none",
              }}
            />
          ))}
          {[220, 140].map((sz, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${-sz / 2 + i * 16}px`,
                bottom: `${-sz / 2 + i * 14}px`,
                width: sz,
                height: sz,
                borderRadius: "50%",
                border: `1px solid rgba(201,169,110,${0.08 - i * 0.02})`,
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            className="container-site"
            style={{ textAlign: "center", position: "relative", zIndex: 1 }}
            data-aos="fade-up"
          >
            <SectionEyebrow>Our Promise</SectionEyebrow>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
                fontWeight: 300,
                color: "white",
                lineHeight: 1.15,
                maxWidth: 680,
                margin: "0 auto 1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Where every visit is a{" "}
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-accent-light)",
                }}
              >
                luxury experience
              </em>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "1rem",
                lineHeight: 1.8,
                maxWidth: 460,
                margin: "0 auto 3rem",
              }}
            >
              From the moment you walk in to the moment you leave, our team is
              dedicated to making you feel seen, heard, and beautiful.
            </p>

            {/* inline trust strip */}
            <div
              style={{
                display: "flex",
                gap: "2.5rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: "3rem",
              }}
            >
              {["5-Star Rated", "Est. 2009", "Sydney CBD", "Award Winning"].map(
                (badge) => (
                  <div
                    key={badge}
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        background: "var(--color-accent)",
                        transform: "rotate(45deg)",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.62rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href={route("shop.search")} className="btn btn-accent btn-lg">
                Book a Service
              </a>
              <a href={route("about")} className="btn btn-outline-light btn-lg">
                Meet Our Team
              </a>
            </div>
          </div>
        </section>

        {/* Product group , currently commented out for this project */}
        {false && (
          <>
            {productGroups?.map((group, index) => {
              const groupProducts = Array.isArray(group.products?.data)
                ? group.products.data
                : [];
              const image = landscapeImages[group.id];
              const isEven = index % 2 === 0;
              return (
                <section
                  key={group.id}
                  id={`product-group-${group.id}`}
                  style={{
                    background: isEven
                      ? "var(--color-bg)"
                      : "var(--color-bg-alt)",
                    paddingTop: "4rem",
                  }}
                >
                  <div className="container-site">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "2rem",
                      }}
                      data-aos="fade-up"
                    >
                      <div>
                        <span style={eyebrow}>Featured</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          {getIconByIndex(index)}
                          <h2
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "clamp(1.5rem, 3vw, 2rem)",
                              fontWeight: 400,
                              color: "var(--color-text)",
                            }}
                          >
                            {group.name}
                          </h2>
                        </div>
                      </div>
                      <Link
                        href={route("productGroup.show", {
                          productGroup: group.slug,
                        })}
                      >
                        View All →
                      </Link>
                    </div>
                    <ProductCarousel
                      title=""
                      products={groupProducts}
                      wrapperClassName="scroll-mt-20"
                      sectionClassName="px-0"
                    />
                  </div>
                  {image && (
                    <img
                      src={`/storage/${image}`}
                      alt={group.name}
                      style={{
                        width: "100%",
                        marginTop: "3rem",
                        objectFit: "cover",
                        height: 320,
                        display: "block",
                      }}
                    />
                  )}
                </section>
              );
            })}
          </>
        )}

        {/* Category group , currently commented out for this project */}
        {false && (
          <>
            {categoryGroups.map((group, index) => (
              <section
                key={group.id}
                id={`category-group-${group.id}`}
                style={{
                  background:
                    index % 2 === 0 ? "var(--color-bg-alt)" : "var(--color-bg)",
                  paddingBlock: "4rem",
                }}
              >
                <div className="container-site">
                  <div style={{ marginBottom: "2rem" }} data-aos="fade-up">
                    <span style={eyebrow}>Browse</span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {getIconByIndex(index + 3)}
                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(1.5rem, 3vw, 2rem)",
                          fontWeight: 400,
                          color: "var(--color-text)",
                        }}
                      >
                        {group.name}
                      </h2>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {group.categories.map((category, ci) => (
                      <Link
                        key={category.id}
                        href={route("category.show", category.id)}
                        style={{
                          position: "relative",
                          display: "block",
                          height: 240,
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          textDecoration: "none",
                        }}
                        className="group"
                        data-aos="fade-up"
                        data-aos-delay={ci * 60}
                      >
                        {category.image && (
                          <img
                            src={`/storage/${category.image}`}
                            alt={category.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                            className="group-hover:scale-105"
                          />
                        )}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(28,26,23,0.65) 0%, transparent 60%)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: 2,
                            width: "0%",
                            background: "var(--color-accent)",
                            transition: "width 0.35s ease",
                          }}
                          className="group-hover:w-full"
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            padding: "1rem 1.25rem",
                            color: "white",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "1.1rem",
                              fontWeight: 400,
                              letterSpacing: "0.02em",
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </>
        )}
      </AuthenticatedLayout>
    </div>
  );
}
