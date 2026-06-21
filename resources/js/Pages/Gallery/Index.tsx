import React, { useEffect, useState } from "react";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PageHero from "@/Components/Page/PageHero";

interface GalleryImage {
  id: number;
  url: string;
}

interface GalleryItem {
  id: number;
  title: string;
  images: GalleryImage[];
}

interface Props extends PageProps {
  galleryItems: GalleryItem[];
}

/* ─────────────────────────────────────────────
   Lightbox
───────────────────────────────────────────── */
function Lightbox({
  image,
  title,
  onClose,
  onPrev,
  onNext,
}: {
  image: GalleryImage;
  title: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(12,10,8,0.94)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* prev */}
        <button onClick={e => { e.stopPropagation(); onPrev(); }} style={{
          position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)",
          width: 48, height: 48, background: "rgba(201,169,110,0.12)",
          border: "1px solid rgba(201,169,110,0.3)", color: "white",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>

        {/* image */}
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          style={{ position: "relative", maxWidth: "min(900px, 88vw)", maxHeight: "80vh" }}
        >
          {/* corner accents */}
          {[
            { top: 0, left: 0, borderTop: "1px solid var(--color-accent)", borderLeft: "1px solid var(--color-accent)" },
            { top: 0, right: 0, borderTop: "1px solid var(--color-accent)", borderRight: "1px solid var(--color-accent)" },
            { bottom: 0, left: 0, borderBottom: "1px solid var(--color-accent)", borderLeft: "1px solid var(--color-accent)" },
            { bottom: 0, right: 0, borderBottom: "1px solid var(--color-accent)", borderRight: "1px solid var(--color-accent)" },
          ].map((s, i) => (
            <div key={i} style={{ position: "absolute", width: 20, height: 20, zIndex: 2, ...s }} />
          ))}
          <img
            src={image.url}
            alt={title}
            style={{ display: "block", maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "1rem 1.25rem",
            background: "linear-gradient(to top, rgba(12,10,8,0.7), transparent)",
          }}>
            <span style={{
              fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: "1rem", fontWeight: 300, color: "rgba(255,255,255,0.7)",
            }}>{title}</span>
          </div>
        </motion.div>

        {/* next */}
        <button onClick={e => { e.stopPropagation(); onNext(); }} style={{
          position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)",
          width: 48, height: 48, background: "rgba(201,169,110,0.12)",
          border: "1px solid rgba(201,169,110,0.3)", color: "white",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>

        {/* close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          width: 40, height: 40, background: "rgba(201,169,110,0.1)",
          border: "1px solid rgba(201,169,110,0.25)", color: "white",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem",
        }}>×</button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   Bento tile
───────────────────────────────────────────── */
/*
  Bento span pattern per section (repeats every 5 tiles):
  0 → col-span-2 row-span-2  (hero)
  1 → col-span-1 row-span-1
  2 → col-span-1 row-span-1
  3 → col-span-1 row-span-2  (tall)
  4 → col-span-2 row-span-1  (wide)
*/
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
];

function BentoTile({
  image,
  title,
  index,
  onOpen,
}: {
  image: GalleryImage;
  title: string;
  index: number;
  onOpen: () => void;
}) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });
  const [hovered, setHovered] = useState(false);
  const span = SPANS[index % SPANS.length];
  const isHero = index % SPANS.length === 0;

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`${span} overflow-hidden relative cursor-pointer group`}
      style={{ background: "var(--color-surface)", minHeight: 180 }}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: (index % 5) * 0.07, ease: "easeOut" } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      {/* image */}
      <motion.img
        src={image.url}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
        animate={{ scale: hovered ? 1.07 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        loading="lazy"
        draggable={false}
      />

      {/* base gradient — always visible at bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(12,10,8,0.72) 0%, rgba(12,10,8,0.1) 45%, transparent 100%)",
        zIndex: 1,
      }} />

      {/* hover tint */}
      <motion.div
        style={{ position: "absolute", inset: 0, background: "rgba(201,169,110,0.08)", zIndex: 2 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* accent border on hover */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 3, border: "1px solid rgba(201,169,110,0)" }}
        animate={{ borderColor: hovered ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0)" }}
        transition={{ duration: 0.25 }}
      />

      {/* corner brackets */}
      <div style={{ position: "absolute", top: 10, left: 10, width: 18, height: 18, borderTop: "1px solid var(--color-accent-light)", borderLeft: "1px solid var(--color-accent-light)", zIndex: 4, opacity: 0.5 }} />
      <div style={{ position: "absolute", bottom: 10, right: 10, width: 18, height: 18, borderBottom: "1px solid var(--color-accent-light)", borderRight: "1px solid var(--color-accent-light)", zIndex: 4, opacity: 0.5 }} />

      {/* title — always in front */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: isHero ? "1.5rem 1.5rem" : "0.875rem 1rem",
        zIndex: 5,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "0.5rem",
      }}>
        <div>
          {/* eyebrow line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div style={{ width: 20, height: 1, background: "var(--color-accent)", opacity: 0.8 }} />
            <span style={{
              fontFamily: "var(--font-body)", fontSize: "0.58rem",
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: "var(--color-accent-light)", opacity: 0.8,
            }}>Our Work</span>
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: isHero ? "clamp(1.3rem, 2.5vw, 1.75rem)" : "1rem",
            fontWeight: 300, fontStyle: "italic",
            color: "white", margin: 0, lineHeight: 1.2,
            letterSpacing: "0.01em",
          }}>{title}</h3>
        </div>

        {/* view icon */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 6 }}
          transition={{ duration: 0.25 }}
          style={{
            width: 32, height: 32, flexShrink: 0,
            border: "1px solid rgba(201,169,110,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-light)" strokeWidth="1.5" style={{ width: 14, height: 14 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Gallery section
───────────────────────────────────────────── */
function GallerySection({
  gallery,
  index: sectionIndex,
}: {
  gallery: GalleryItem;
  index: number;
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openAt = (i: number) => setLightbox(i);
  const close = () => setLightbox(null);
  const prev = () => setLightbox(i => i !== null ? (i - 1 + gallery.images.length) % gallery.images.length : null);
  const next = () => setLightbox(i => i !== null ? (i + 1) % gallery.images.length : null);

  return (
    <div style={{ marginBottom: "5rem", padding: "0 clamp(1rem, 4vw, 3rem)" }}>

      {/* Section title bar */}
      {gallery.title && (
        <div style={{
          display: "flex", alignItems: "center", gap: "1.25rem",
          marginBottom: "1.5rem",
        }}>
          <div style={{ width: 3, height: 28, background: "var(--color-accent)", flexShrink: 0 }} />
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
            fontWeight: 300, color: "var(--color-text)", margin: 0,
          }}>{gallery.title}</h3>
          <div style={{ height: 1, flex: 1, background: "var(--color-border)" }} />
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "0.62rem",
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--color-text-muted)",
            whiteSpace: "nowrap",
          }}>{gallery.images.length} images</span>
        </div>
      )}

      {/* Bento grid */}
      <div
        className="grid grid-cols-3 gap-[10px]"
        style={{ gridAutoRows: "clamp(120px, 16vw, 220px)" }}
      >
        {gallery.images.map((image, i) => (
          <BentoTile
            key={image.id}
            image={image}
            title={gallery.title}
            index={i}
            onOpen={() => openAt(i)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          image={gallery.images[lightbox]}
          title={gallery.title}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Gallery({ galleryItems }: Props) {
  return (
    <>

      <AuthenticatedLayout>

           <PageHero
                eyebrow="Our Work"
                title={<>The Gallery <em></em></>}
                subtitle="A curated collection of our finest work — colour transformations, precision cuts, and restorative treatments."
                breadcrumbs={[{ label: "Home", href: route("home") }, { label: "Gallery" }]}
              />
      <Head title="Gallery" />
        <section style={{
          width: "100%",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          background: "var(--color-bg)",
          fontFamily: "var(--font-body)",
        }}>


          {galleryItems.map((gallery, i) => (
            <GallerySection key={gallery.id} gallery={gallery} index={i} />
          ))}

        </section>
      </AuthenticatedLayout>
    </>
  );
}
