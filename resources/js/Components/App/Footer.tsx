"use client";

const NAV_COLS = [
  {
    heading: "Services",
    links: ["Haircut & Blow-dry", "Colour & Balayage", "Keratin Treatment", "Hair Extensions", "Bridal Styling"],
  },
  {
    heading: "Explore",
    links: ["Our Story", "Meet the Team", "Gallery", "Press & Awards", "Gift Cards"],
  },
  {
    heading: "Support",
    links: ["Book Appointment", "Loyalty Club", "Student Offer", "Cancellation Policy", "FAQs"],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.27-5.38 1.27-5.38s-.32-.65-.32-1.6c0-1.5.87-2.63 1.95-2.63.92 0 1.37.69 1.37 1.52 0 .93-.59 2.32-.9 3.6-.25 1.07.53 1.95 1.58 1.95 1.9 0 3.17-2.44 3.17-5.33 0-2.2-1.49-3.74-3.62-3.74-2.47 0-3.92 1.85-3.92 3.77 0 .74.28 1.54.64 1.97.07.08.08.15.06.24-.07.27-.22.86-.25.98-.04.16-.13.2-.3.12-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.93-5.43 3.11 0 5.53 2.22 5.53 5.18 0 3.09-1.95 5.57-4.65 5.57-.91 0-1.76-.47-2.05-1.03l-.56 2.08c-.2.78-.75 1.75-1.12 2.34.85.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.78a4.85 4.85 0 01-1-.09z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-root {
          background-color: var(--color-bg-dark);
          color: var(--color-text-inverse);
          font-family: var(--font-body);
        }
        .footer-wave {
          display: block;
          width: 100%;
          height: 64px;
          color: var(--color-bg-dark);
        }

        /* ── TOP STRIP ── */
        .footer-top-strip {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 24px 0;
        }
        .footer-top-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-tagline {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--text-lg);
          font-weight: 300;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.03em;
        }
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.4);
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

        /* ── MAIN GRID ── */
        .footer-main {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 64px var(--space-xl) 56px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1.3fr;
          gap: 40px;
          align-items: start;
        }

        /* Brand */
        .footer-brand-logo {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          font-weight: 300;
          letter-spacing: 0.1em;
          color: white;
          text-decoration: none;
          display: block;
          margin-bottom: 14px;
          line-height: 1;
        }
        .footer-brand-logo em {
          font-style: italic;
          color: var(--color-accent-light);
        }
        .footer-brand-rule {
          width: 36px;
          height: 1px;
          background: var(--color-accent);
          margin-bottom: 18px;
        }
        .footer-brand-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          line-height: 1.8;
          margin-bottom: 20px;
        }
        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          line-height: 1.5;
        }
        .footer-contact-dot {
          color: var(--color-accent);
          flex-shrink: 0;
          font-size: 8px;
          margin-top: 4px;
        }

        /* Nav columns */
        .footer-col-heading {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent-light);
          margin-bottom: 18px;
          margin-top: 0;
        }
        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .footer-nav-list a {
          font-size: 13px;
          color: rgba(255,255,255,0.42);
          text-decoration: none;
          transition: color var(--transition-fast);
          display: inline-block;
          line-height: 1.4;
        }
        .footer-nav-list a:hover { color: white; }

        /* Newsletter column */
        .footer-nl-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.42);
          line-height: 1.7;
          margin-bottom: 14px;
        }
        .footer-email-input {
          display: block;
          width: 100%;
          padding: 9px 13px;
          font-family: var(--font-body);
          font-size: 13px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-sm);
          color: white;
          outline: none;
          margin-bottom: 8px;
          box-sizing: border-box;
          transition: border-color var(--transition-fast);
        }
        .footer-email-input::placeholder { color: rgba(255,255,255,0.22); }
        .footer-email-input:focus { border-color: var(--color-accent); }
        .footer-subscribe-btn {
          display: block;
          width: 100%;
          padding: 9px;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          background: var(--color-accent);
          color: var(--color-bg-dark);
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          margin-bottom: 24px;
          transition: background var(--transition-fast);
        }
        .footer-subscribe-btn:hover { background: var(--color-accent-dark); }

        /* Hours */
        .footer-hours {
          border-left: 2px solid var(--color-accent);
          padding: 12px 14px;
          background: rgba(201,169,110,0.05);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .footer-hours-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent-light);
          margin-bottom: 10px;
        }
        .footer-hours-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          padding: 3px 0;
        }
        .footer-hours-row span:last-child { color: rgba(255,255,255,0.6); }

        /* ── BOTTOM BAR ── */
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .footer-bottom-inner {
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 18px var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .footer-copy {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .footer-copy a {
          color: rgba(255,255,255,0.22);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer-copy a:hover { color: rgba(255,255,255,0.55); }
        .footer-copy-sep {
          margin: 0 8px;
          color: rgba(255,255,255,0.15);
        }
        .footer-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 0.05em;
        }
        .footer-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-accent);
          opacity: 0.55;
          flex-shrink: 0;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .footer-main {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 36px;
          }
          .footer-brand-col { grid-column: 1 / -1; max-width: 480px; }
          .footer-nl-col { grid-column: 1 / -1; }
          .footer-nl-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            align-items: start;
          }
          .footer-nl-form-wrap { display: flex; flex-direction: column; }
          .footer-email-input { margin-bottom: 8px; }
          .footer-subscribe-btn { margin-bottom: 0; }
        }

        @media (max-width: 640px) {
          .footer-wave { height: 40px; }
          .footer-main {
            grid-template-columns: 1fr 1fr;
            padding: 40px var(--space-lg) 40px;
            gap: 28px;
          }
          .footer-brand-col { grid-column: 1 / -1; max-width: 100%; }
          .footer-nl-col { grid-column: 1 / -1; }
          .footer-nl-row { grid-template-columns: 1fr; }
          .footer-subscribe-btn { margin-bottom: 24px; }
          .footer-top-inner { gap: 12px; }
          .footer-bottom-inner { gap: 8px; }
        }
      `}</style>

      <footer className="footer-root">
        {/* Wave */}
        <svg className="footer-wave" viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,32 C180,64 360,0 540,32 C720,64 900,0 1080,32 C1260,64 1380,16 1440,32 L1440,64 L0,64 Z" />
        </svg>

        {/* Top strip */}
        <div className="footer-top-strip">
          <div className="footer-top-inner">
            <span className="footer-tagline">Crafted for every strand, every story.</span>
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href="/" aria-label={s.label} className="footer-social-btn">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="footer-main">

          {/* Brand column */}
          <div className="footer-brand-col">
            <a href="/" className="footer-brand-logo">Maison <em>Éclat</em></a>
            <div className="footer-brand-rule" />
            <p className="footer-brand-desc">
              A luxury atelier where precision meets artistry. Every appointment
              is an experience tailored entirely to you.
            </p>
            <ul className="footer-contact-list">
              {[
                "12 Rue de la Beauté, Sydney NSW 2000",
                "hello@maisoneclat.com.au",
                "(02) 9123 4567",
              ].map((item) => (
                <li key={item}>
                  <span className="footer-contact-dot">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="footer-col-heading">{col.heading}</p>
              <ul className="footer-nav-list">
                {col.links.map((link) => (
                  <li key={link}><a href="/">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter + hours */}
          <div className="footer-nl-col">
            <p className="footer-col-heading">Newsletter</p>
            <div className="footer-nl-row">
              <div className="footer-nl-form-wrap">
                <p className="footer-nl-desc">
                  Seasonal edits, early booking access, and exclusive offers for our community.
                </p>
                <input type="email" placeholder="Your email address" className="footer-email-input" />
                <button className="footer-subscribe-btn">Subscribe</button>
              </div>
              <div className="footer-hours">
                <span className="footer-hours-label">Studio Hours</span>
                {[
                  ["Mon – Fri", "9:00 – 19:00"],
                  ["Saturday", "9:00 – 17:00"],
                  ["Sunday", "Closed"],
                ].map(([day, hrs]) => (
                  <div className="footer-hours-row" key={day}>
                    <span>{day}</span>
                    <span>{hrs}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="footer-copy">
              © {new Date().getFullYear()} Maison Éclat. All rights reserved.
              <span className="footer-copy-sep">·</span>
              <a href="/">Privacy Policy</a>
              <span className="footer-copy-sep">·</span>
              <a href="/">Terms of Service</a>
            </p>
            <div className="footer-badge">
              <span className="footer-badge-dot" />
              Proudly Australian — Sydney, NSW
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
