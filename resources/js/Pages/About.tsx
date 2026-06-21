import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

/* ─────────────────────────────────────────────
   Static data
───────────────────────────────────────────── */
const team = [
  {
    name: "Isabella Rossi",
    role: "Founder & Creative Director",
    bio: "With over 20 years behind the chair, Isabella built Dhurva on a single belief — that every client deserves a transformative experience.",
    img: "https://i.pravatar.cc/300?img=47",
    specialty: "Colour Artistry",
  },
  {
    name: "Marcus Chen",
    role: "Senior Colourist",
    bio: "Trained in Paris and Milan, Marcus brings an architectural eye to every balayage and colour correction he touches.",
    img: "https://i.pravatar.cc/300?img=68",
    specialty: "Balayage & Highlights",
  },
  {
    name: "Priya Nair",
    role: "Head of Treatments",
    bio: "Priya's deep knowledge of hair science makes her the go-to stylist for restorative rituals and scalp health.",
    img: "https://i.pravatar.cc/300?img=16",
    specialty: "Scalp & Hair Rituals",
  },
  {
    name: "Luca Ferretti",
    role: "Precision Cut Specialist",
    bio: "Luca's signature cuts are known for growing out beautifully — structured, considered, and always flattering.",
    img: "https://i.pravatar.cc/300?img=52",
    specialty: "Cut & Styling",
  },
];

const values = [
  {
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M6.343 6.343l-.707-.707M6.343 17.657l-.707.707M15.536 15.536l.707.707M12 21v-1",
    title: "Artistry",
    body: "Every service is a craft. We treat hair as a medium for self-expression and approach each client as a unique canvas.",
  },
  {
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Care",
    body: "From the moment you walk in, our team is focused entirely on you — your comfort, your goals, your confidence.",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Integrity",
    body: "We only recommend what your hair truly needs. Honest consultations, transparent pricing, zero pressure.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Excellence",
    body: "Our team pursues ongoing education, staying at the forefront of technique, trend, and hair science.",
  },
];

const milestones = [
  { year: "2009", event: "Dhurva opens its doors in Sydney CBD with a team of three." },
  { year: "2013", event: "Expanded to a full-floor atelier and launched our signature Scalp Ritual." },
  { year: "2017", event: "Named Best Luxury Salon in NSW at the Australian Hair Awards." },
  { year: "2021", event: "Launched our online product boutique and gift voucher experience." },
  { year: "2024", event: "Celebrated 15 years and 2,700+ transformed clients." },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function Ornament({ center = false }: { center?: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      margin: "1.25rem 0",
      justifyContent: center ? "center" : "flex-start",
    }}>
      <div style={{ width: 36, height: 1, background: "var(--color-accent)" }} />
      <div style={{ width: 5, height: 5, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
      <div style={{ width: 36, height: 1, background: "var(--color-accent)" }} />
    </div>
  );
}

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <span style={{
      fontFamily: "var(--font-body)",
      fontSize: "0.68rem",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: "var(--color-accent)",
      display: "block",
      textAlign: center ? "center" : "left",
    }}>
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, center = false }: {
  eyebrow: string;
  title: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: "3rem" }}>
      <Eyebrow center={center}>{eyebrow}</Eyebrow>
      <Ornament center={center} />
      <h2 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
        fontWeight: 300,
        color: "var(--color-text)",
        lineHeight: 1.15,
      }}>
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const About: React.FC = () => {
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out" });
    const el = document.getElementById("about-stats");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <AuthenticatedLayout>
      <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg)", overflowX: "hidden" }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section style={{
          position: "relative",
          paddingTop:"6rem",
          paddingBottom:"6rem",
          minHeight: "72vh",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: "var(--color-bg-dark)",
        }}>
          {/* bg image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          {/* overlays */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(28,26,23,0.85) 0%, rgba(28,26,23,0.5) 60%, rgba(28,26,23,0.2) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(28,26,23,0.6) 0%, transparent 50%)",
          }} />

          {/* decorative circles */}
          {[500, 350, 220].map((size, i) => (
            <div key={i} style={{
              position: "absolute",
              right: -size / 3,
              top: "50%",
              transform: "translateY(-50%)",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid rgba(201,169,110,${0.12 - i * 0.03})`,
              pointerEvents: "none",
            }} />
          ))}

          <div style={{
            position: "relative", zIndex: 2,
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 7vw",
            width: "100%",
          }}>
            <div style={{ maxWidth: 580 }} data-aos="fade-right">
              <Eyebrow>Our Story</Eyebrow>
              <Ornament />
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 6vw, 5rem)",
                fontWeight: 300,
                color: "white",
                lineHeight: 1.08,
                marginBottom: "1.25rem",
              }}>
                More Than a Salon,{" "}
                <em style={{ fontStyle: "italic", color: "var(--color-accent-light)" }}>
                  a Ritual
                </em>
              </h1>
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.8,
                maxWidth: 440,
                marginBottom: "2.5rem",
              }}>
                Since 2009, Dhurva has been Sydney's destination for those who regard their hair not as an afterthought, but as an expression of who they are.
              </p>
              {/* trust row */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {["Est. 2009", "Sydney CBD", "Award Winning"].map((b) => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 4, height: 4, background: "var(--color-accent)", transform: "rotate(45deg)" }} />
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2, textAlign: "center",
          }}>
            <div style={{
              width: 1, height: 48,
              background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.6))",
              margin: "0 auto",
            }} />
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INTRO / STORY
        ══════════════════════════════════════════ */}
        <section style={{ background: "var(--color-surface)", padding: "6rem 0" }}>
          <div style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 7vw",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem",
            alignItems: "center",
          }}
            className="lg:grid-cols-2 grid-cols-1"
          >
            {/* text */}
            <div data-aos="fade-right">
              <SectionHeading
                eyebrow="Who We Are"
                title={<>Built on <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>passion</em>, refined by mastery</>}
              />
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                Dhurva was born from a simple but profound belief — that a great hair appointment should feel less like a transaction and more like a transformation. Our founder Isabella Rossi opened our doors in 2009 with that vision, and fifteen years on, it remains the heartbeat of everything we do.
              </p>
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "2rem" }}>
                We've grown from a boutique team of three into Sydney's most awarded luxury hair atelier, but our approach has never changed. Every client is greeted by name. Every consultation begins with listening. Every service is delivered with the care and precision of a true artisan.
              </p>
              <div style={{ display: "flex", gap: "3rem" }}>
                {[["15+", "Years"], ["2,700+", "Clients"], ["48", "Stylists"]].map(([num, label]) => (
                  <div key={label}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "2.25rem",
                      fontWeight: 400,
                      color: "var(--color-primary)",
                      lineHeight: 1,
                    }}>{num}</div>
                    <div style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--color-text-light)",
                      marginTop: 4,
                    }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* image */}
            <div data-aos="fade-left" style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
                alt="Dhurva interior"
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  borderRadius: "var(--radius-md)",
                  display: "block",
                }}
              />
              {/* gold accent frame */}
              <div style={{
                position: "absolute",
                top: -16, right: -16,
                width: "60%", height: "60%",
                border: "1px solid var(--color-accent-light)",
                borderRadius: "var(--radius-md)",
                pointerEvents: "none",
                zIndex: -1,
              }} />
              {/* floating badge */}
              <div style={{
                position: "absolute",
                bottom: "1.5rem", left: "-2rem",
                background: "var(--color-primary)",
                padding: "1.25rem 1.5rem",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 400,
                  color: "var(--color-accent-light)",
                  lineHeight: 1,
                }}>15</div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  marginTop: 4,
                }}>Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            VALUES
        ══════════════════════════════════════════ */}
        <section style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "6rem 0",
        }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 7vw" }}>
            <div data-aos="fade-up">
              <SectionHeading
                eyebrow="What We Stand For"
                title={<>Our <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Values</em></>}
                center
              />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}>
              {values.map((v, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    padding: "2.25rem 2rem",
                    position: "relative",
                    overflow: "hidden",
                    transition: "box-shadow var(--transition-base), border-color var(--transition-base)",
                  }}
                  className="group hover:border-[var(--color-accent)] hover:shadow-lg"
                >
                  {/* top accent */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "var(--color-accent)",
                    transform: "scaleX(0)", transformOrigin: "left",
                    transition: "transform 0.4s ease",
                  }} className="group-hover:scale-x-100" />

                  <div style={{
                    width: 48, height: 48,
                    border: "1px solid var(--color-accent-light)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" style={{ width: 20, height: 20 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                    </svg>
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    fontWeight: 400,
                    color: "var(--color-text)",
                    marginBottom: "0.75rem",
                  }}>{v.title}</h3>
                  <p style={{ color: "var(--color-text-muted)", lineHeight: 1.75, fontSize: "0.9rem" }}>
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TEAM
        ══════════════════════════════════════════ */}
        <section style={{ background: "var(--color-surface)", padding: "6rem 0" }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 7vw" }}>
            <div data-aos="fade-up">
              <SectionHeading
                eyebrow="The Artisans"
                title={<>Meet Our <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Team</em></>}
                center
              />
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "2rem",
            }}>
              {team.map((member, i) => (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 80}
                  style={{
                    background: "var(--color-surface-warm)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    transition: "box-shadow var(--transition-base), transform var(--transition-base)",
                  }}
                  className="group hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* image */}
                  <div style={{ position: "relative", overflow: "hidden", height: 260 }}>
                    <img
                      src={member.img}
                      alt={member.name}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover",
                        transition: "transform 0.6s ease",
                      }}
                      className="group-hover:scale-105"
                    />
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(28,26,23,0.5) 0%, transparent 50%)",
                    }} />
                    {/* specialty badge */}
                    <div style={{
                      position: "absolute", bottom: "1rem", left: "1rem",
                      background: "rgba(201,169,110,0.9)",
                      padding: "3px 12px",
                      borderRadius: "var(--radius-full)",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.6rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--color-bg-dark)",
                        fontWeight: 500,
                      }}>{member.specialty}</span>
                    </div>
                  </div>

                  {/* body */}
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: "var(--color-text)",
                      marginBottom: 2,
                    }}>{member.name}</h3>
                    <p style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--color-accent-dark)",
                      marginBottom: "0.875rem",
                    }}>{member.role}</p>
                    <p style={{ color: "var(--color-text-muted)", fontSize: "0.875rem", lineHeight: 1.7 }}>
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TIMELINE
        ══════════════════════════════════════════ */}
        <section style={{
          background: "var(--color-bg-alt)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
          padding: "6rem 0",
        }}>
          <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 7vw" }}>
            <div data-aos="fade-up">
              <SectionHeading
                eyebrow="Our Journey"
                title={<>Fifteen Years of <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>Excellence</em></>}
                center
              />
            </div>

            <div style={{
              position: "relative",
              maxWidth: 720,
              margin: "0 auto",
            }}>
              {/* centre line */}
              <div style={{
                position: "absolute",
                left: "50%",
                top: 0, bottom: 0,
                width: 1,
                background: "var(--color-border)",
                transform: "translateX(-50%)",
              }} className="hidden md:block" />

              <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    data-aos={i % 2 === 0 ? "fade-right" : "fade-left"}
                    data-aos-delay={i * 60}
                    style={{
                      display: "flex",
                      gap: "2rem",
                      alignItems: "flex-start",
                      justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                    }}
                    className="md:pr-[calc(50%+2rem)] even:md:pr-0 even:md:pl-[calc(50%+2rem)]"
                  >
                    <div style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      padding: "1.25rem 1.5rem",
                      flex: 1,
                      position: "relative",
                    }}>
                      <span style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        fontStyle: "italic",
                        color: "var(--color-accent)",
                        display: "block",
                        marginBottom: 4,
                      }}>{m.year}</span>
                      <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        {m.event}
                      </p>
                      {/* dot on line */}
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        right: -42,
                        transform: "translateY(-50%)",
                        width: 10, height: 10,
                        background: "var(--color-accent)",
                        borderRadius: "50%",
                        border: "2px solid var(--color-bg-alt)",
                      }} className="hidden md:block" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA
        ══════════════════════════════════════════ */}
        <section style={{
          background: "var(--color-primary)",
          padding: "6rem 0",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative rings */}
          {[440, 300, 180].map((size, i) => (
            <div key={i} style={{
              position: "absolute",
              right: -size / 3, top: "50%",
              transform: "translateY(-50%)",
              width: size, height: size,
              borderRadius: "50%",
              border: `1px solid rgba(201,169,110,${0.14 - i * 0.04})`,
              pointerEvents: "none",
            }} />
          ))}

          <div style={{
            maxWidth: "var(--container-max)",
            margin: "0 auto",
            padding: "0 7vw",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }} data-aos="fade-up">
            <Eyebrow center>Ready to Experience Dhurva?</Eyebrow>
            <Ornament center />
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "white",
              lineHeight: 1.15,
              maxWidth: 600,
              margin: "0 auto 1.25rem",
            }}>
              Your most beautiful hair starts with a{" "}
              <em style={{ fontStyle: "italic", color: "var(--color-accent-light)" }}>conversation</em>
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "1rem",
              lineHeight: 1.75,
              maxWidth: 460,
              margin: "0 auto 2.5rem",
            }}>
              Book a complimentary consultation and let our team craft a personalised plan for your hair goals.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/shop"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px",
                  background: "var(--color-accent)",
                  color: "var(--color-bg-dark)",
                  border: "1px solid var(--color-accent)",
                  fontFamily: "var(--font-body)", fontSize: "0.7rem",
                  fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Book a Consultation
              </a>
              <a
                href="/contact"
                style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "13px 28px",
                  background: "transparent",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-body)", fontSize: "0.7rem",
                  fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

      </div>
    </AuthenticatedLayout>
  );
};

export default About;
