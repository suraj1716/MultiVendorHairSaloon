import Card from "@/Components/App/Card";
import Button from "@/Components/App/ui/Button";
import FileDropzone from "@/Components/App/ui/Filedropzone";
import FormField from "@/Components/App/ui/Formfield";
import RadioGroup from "@/Components/App/ui/Radiogroup";
import Select from "@/Components/App/ui/Select";
import PageHero from "@/Components/Page/PageHero";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import React, { useMemo } from "react";
import { InertiaPage } from "@/types/InertiaPage";
interface DepartmentOption {
  id: number;
  name: string;
  slug: string;
  categories: {
    id: number;
    name: string;
    products: {
      id: number;
      title: string;
    }[];
  }[];
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(time?: string) {
  if (!time) return "—";
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

const Contact: InertiaPage = () => {
  const {
    departments: rawDepartments = [],
    contactReasons,
    vendor = null,
  } = usePage<PageProps>().props;

  // Was rebuilt on every render (i.e. every keystroke in the form below).
  // rawDepartments only changes on a fresh page load, so memoize the
  // transform against it — avoids re-mapping departments/categories/products
  // on every single form field update.
  const departments: DepartmentOption[] = useMemo(
    () =>
      rawDepartments.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        slug: dept.slug,
        categories: (dept.categories || []).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          products: (cat.products || []).map((prod: any) => ({
            id: prod.id,
            title: prod.title,
          })),
        })),
      })),
    [rawDepartments]
  );

  const reasonOptions = useMemo(
    () => (contactReasons as { value: string; label: string }[]) || [],
    [contactReasons]
  );

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    phone: "",
    reason: "",
    department: "",
    category: "",
    product: "",
    quantity: "",
    file: null as File | null,
    message: "",
    preferredContact: "email",
  });

  const isGettingQuote = data.reason === "getting_quote";

  const selectedDepartment = departments.find(
    (d) => d.id.toString() === data.department,
  );
  const selectedCategory = selectedDepartment?.categories.find(
    (c) => c.id.toString() === data.category,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/contact", {
      forceFormData: true,
      preserveState: true,
      onSuccess: () => reset(),
    });
  };

  // Also recomputed on every keystroke before — cheap on its own, but
  // memoized anyway since it only actually depends on vendor.
  const closedDays: number[] = useMemo(
    () => (vendor?.data?.recurring_closed_days ?? []).map(Number),
    [vendor]
  );

  return (

  <><style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

.file-upload-error {
  border-color: var(--color-error);
}

        .contact-page * {
          box-sizing: border-box;
        }



        /* Info Strip */
        .contact-strip {
          background: var(--color-primary);
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .strip-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-lg) var(--space-2xl);
          border-right: 1px solid rgba(201,169,110,0.2);
          color: var(--color-text-inverse);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 300;
          letter-spacing: 0.04em;
        }
        .strip-item:last-child { border-right: none; }
        .strip-icon {
          color: var(--color-accent);
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .strip-item a {
          color: inherit;
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .strip-item a:hover { color: var(--color-accent-light); }

        /* Main layout */
        .contact-body {
          background: var(--color-bg);
          padding: var(--space-4xl) var(--space-xl);
        }
        .contact-grid {
          max-width: var(--container-max);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: var(--space-3xl);
          align-items: start;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-strip { flex-direction: column; }
          .strip-item { border-right: none; border-bottom: 1px solid rgba(201,169,110,0.2); }
        }

        /* Form */
        .form-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--space-3xl);
          box-shadow: var(--shadow-md);
        }
        .form-section-label {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent-dark);
          margin-bottom: var(--space-xl);
          padding-bottom: var(--space-sm);
          border-bottom: 1px solid var(--color-border);
        }
        .form-title {
          font-family: var(--font-display);
          font-size: var(--text-3xl);
          font-weight: 400;
          color: var(--color-text);
          margin: 0 0 var(--space-2xl);
          line-height: 1.2;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .form-card { padding: var(--space-xl); }
        }
        .form-group {
          margin-bottom: var(--space-xl);
        }
        .form-group label {
          display: block;
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: var(--space-sm);
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.875rem var(--space-lg);
          font-family: var(--font-body);
          font-size: var(--text-base);
          color: var(--color-text);
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          appearance: none;
          -webkit-appearance: none;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: var(--color-primary-light);
          box-shadow: 0 0 0 3px rgba(74,124,47,0.1);
          background: var(--color-surface);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.6;
        }
        .select-wrapper {
          position: relative;
        }
        .select-wrapper::after {
          content: '↓';
          position: absolute;
          right: var(--space-lg);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-accent-dark);
          pointer-events: none;
          font-size: var(--text-sm);
        }
        .field-error {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          color: var(--color-error);
          margin-top: var(--space-xs);
        }

        /* File upload */
        .file-upload-area {
          border: 1.5px dashed var(--color-border-dark);
          border-radius: var(--radius-md);
          padding: var(--space-xl);
          text-align: center;
          cursor: pointer;
          transition: border-color var(--transition-fast), background var(--transition-fast);
          background: var(--color-bg);
          position: relative;
        }
        .file-upload-area:hover {
          border-color: var(--color-accent);
          background: var(--color-bg-alt);
        }
        .file-upload-area input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }
        .file-upload-text {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        .file-upload-text span {
          color: var(--color-accent-dark);
          font-weight: 500;
        }

        /* Preferred contact toggle */
        .radio-group {
          display: flex;
          gap: var(--space-sm);
        }
        .radio-option {
          flex: 1;
          position: relative;
        }
        .radio-option input[type="radio"] {
          position: absolute;
          opacity: 0;
          width: 0;
        }
        .radio-option label {
          display: block;
          text-align: center;
          padding: 0.6rem var(--space-md);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: var(--text-xs) !important;
          letter-spacing: 0.1em !important;
          color: var(--color-text-muted) !important;
          transition: all var(--transition-fast);
          text-transform: uppercase !important;
          background: var(--color-bg);
        }
        .radio-option input[type="radio"]:checked + label {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-text-inverse) !important;
        }

        /* Submit button */
        .btn-submit {
          width: 100%;
          background: var(--color-primary);
          color: var(--color-text-inverse);
          border: 1px solid var(--color-primary);
          border-radius: var(--radius-sm);
          padding: 1rem var(--space-xl);
          font-family: var(--font-body);
          font-size: var(--text-sm);
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background var(--transition-base), transform var(--transition-fast);
          margin-top: var(--space-sm);
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--color-primary-dark);
          border-color: var(--color-primary-dark);
        }
        .btn-submit:active:not(:disabled) {
          transform: translateY(1px);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sidebar */
        .sidebar { display: flex; flex-direction: column; gap: var(--space-xl); }

        .info-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .info-card-header {
          background: var(--color-primary);
          padding: var(--space-lg) var(--space-xl);
        }
        .info-card-header h3 {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          font-weight: 400;
          color: var(--color-text-inverse);
          margin: 0;
          letter-spacing: 0.02em;
        }
        .info-card-body {
          padding: var(--space-xl);
        }
        .info-row {
          display: flex;
          gap: var(--space-md);
          align-items: flex-start;
          padding: var(--space-md) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .info-row:last-child { border-bottom: none; }
        .info-row-icon {
          width: 36px;
          height: 36px;
          background: var(--color-bg-alt);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-accent-dark);
          font-size: 1rem;
          flex-shrink: 0;
        }
        .info-row-content strong {
          display: block;
          font-family: var(--font-body);
          font-size: var(--text-xs);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 2px;
        }
        .info-row-content span,
        .info-row-content a {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-text);
          text-decoration: none;
          line-height: 1.5;
        }
        .info-row-content a:hover { color: var(--color-primary-light); }

        /* Hours card */
        .hours-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: var(--space-sm) var(--space-xl);
          font-family: var(--font-body);
          font-size: var(--text-sm);
        }
        .hours-day { color: var(--color-text-muted); font-weight: 300; }
        .hours-time { color: var(--color-text); font-weight: 500; text-align: right; }
        .hours-closed { color: var(--color-text-light); }

        /* Map */
        .map-card {
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          height: 220px;
        }
        .map-card iframe { display: block; }

        /* Quote section indicator */
        .quote-section-divider {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin: var(--space-xl) 0;
        }
        .quote-section-divider span {
          font-family: var(--font-body);
          font-size: var(--text-xs);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-accent-dark);
          white-space: nowrap;
          font-weight: 500;
        }
        .quote-section-divider::before,
        .quote-section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }

        /* Social links */
        .social-row {
          display: flex;
          gap: var(--space-sm);
          padding-top: var(--space-md);
        }
        .social-btn {
          flex: 1;
          padding: var(--space-sm);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-bg);
          font-family: var(--font-body);
          font-size: var(--text-xs);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          text-align: center;
          text-decoration: none;
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .social-btn:hover {
          border-color: var(--color-primary-light);
          color: var(--color-primary);
          background: var(--color-surface-warm);
        }
      `}</style>

      <div className="contact-page">
        <PageHero
          eyebrow="We'd love to hear from you"
          title={<>Get in Touch</>}
          subtitle="Whether you're after a quote, have a question, or simply want to say hello — our team is ready to help."
          breadcrumbs={[
            { label: "Home", href: route("home") },
            { label: "Contact" },
          ]} />

        {/* Body */}
        <div className="contact-body">
          <div className="contact-grid">
            {/* Form */}
            <div className="form-card">
              <p className="form-section-label">Contact Form</p>
              <h2 className="form-title">Send Us a Message</h2>

              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                noValidate
              >
                <FormField id="reason" label="Reason for Contact" error={errors.reason}>
                  <Select
                    id="reason"
                    value={data.reason}
                    onChange={(v) => setData("reason", v)}
                    placeholder="Select reason"
                    options={reasonOptions}
                    required />
                </FormField>

                {/* Name + Email */}
                <div className="form-row">
                  <FormField id="name" label="Full Name" error={errors.name} noMargin>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Jane Smith"
                      required />
                  </FormField>
                  <FormField id="email" label="Email Address" error={errors.email} noMargin>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="you@example.com"
                      required />
                  </FormField>
                </div>

                {/* Phone + Preferred contact */}
                <div className="form-row" style={{ marginTop: "var(--space-xl)" }}>
                  <FormField id="phone" label="Phone (optional)" noMargin>
                    <input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder="+61 4XX XXX XXX" />
                  </FormField>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Preferred Contact Method</label>
                    <RadioGroup
                      name="preferredContact"
                      value={data.preferredContact}
                      onChange={(v) => setData("preferredContact", v)}
                      options={[
                        { value: "email", label: "email" },
                        { value: "phone", label: "phone" },
                      ]} />
                  </div>
                </div>

                {/* Quote fields */}
                {isGettingQuote && (
                  <>
                    <div className="quote-section-divider" style={{ marginTop: "var(--space-xl)" }}>
                      <span>Quote Details</span>
                    </div>

                    <FormField id="department" label="Department" error={errors.department}>
                      <Select
                        id="department"
                        value={data.department}
                        onChange={(v) => {
                          setData("department", v);
                          setData("category", "");
                          setData("product", "");
                        } }
                        placeholder="Select Department"
                        options={departments.map((d) => ({ value: d.id, label: d.name }))}
                        required />
                    </FormField>

                    {selectedDepartment && (
                      <FormField id="category" label="Category" error={errors.category}>
                        <Select
                          id="category"
                          value={data.category}
                          onChange={(v) => {
                            setData("category", v);
                            setData("product", "");
                          } }
                          placeholder="Select Category"
                          options={selectedDepartment.categories.map((c) => ({
                            value: c.id,
                            label: c.name,
                          }))}
                          required />
                      </FormField>
                    )}

                    {selectedCategory && (
                      <FormField id="product" label="Product" error={errors.product}>
                        <Select
                          id="product"
                          value={data.product}
                          onChange={(v) => setData("product", v)}
                          placeholder="Select Product"
                          options={selectedCategory.products.map((p) => ({
                            value: p.id,
                            label: p.title,
                          }))}
                          required
                          style={{ color: "#1a1a1a", background: "#ffffff" }} />
                      </FormField>
                    )}

                    <div className="form-row">
                      <FormField id="quantity" label="Quantity" error={errors.quantity} noMargin>
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          value={data.quantity}
                          onChange={(e) => setData("quantity", e.target.value)}
                          placeholder="e.g. 50"
                          required />
                      </FormField>
                      <FormField id="file-input" label="Upload File (optional)" error={errors.file} noMargin>
                        <FileDropzone
                          id="file-input"
                          file={data.file}
                          onChange={(file) => setData("file", file)}
                          accept="image/*,application/pdf"
                          hint="PDF, JPG, PNG" />
                      </FormField>
                    </div>
                  </>
                )}

                {/* Message */}
                <FormField
                  id="message"
                  label="Your Message"
                  error={errors.message}
                  style={{ marginTop: "var(--space-xl)" }}
                >
                  <textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    placeholder="Tell us how we can help..."
                    required />
                </FormField>

                <Button
                  type="submit"
                  variant="accent"
                  disabled={processing}
                  className="btn-submit"
                  style={{ width: "100%" }}
                >
                  {processing ? "Sending…" : "Send Message →"}
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Contact info */}
              <Card title="Contact Information" titleSize="14px">
                {[
                  {
                    icon: "📍",
                    label: "Address",
                    content: vendor?.data?.store_address || "Address not set",
                  },
                  {
                    icon: "📞",
                    label: "Phone",
                    content: vendor?.data?.phone || "Phone not set",
                    href: vendor?.data?.phone
                      ? `tel:${vendor?.data?.phone.replace(/\s+/g, "")}`
                      : undefined,
                  },
                  {
                    icon: "✉️",
                    label: "Email",
                    content: vendor?.data?.email || "Email not set",
                    href: vendor?.data?.email
                      ? `mailto:${vendor?.data?.email}`
                      : undefined,
                  },
                ].map(({ icon, label, content, href }) => (
                  <div className="info-row" key={label}>
                    <div className="info-row-icon">{icon}</div>
                    <div className="info-row-content">
                      <strong>{label}</strong>
                      {href ? <a href={href}>{content}</a> : <span>{content}</span>}
                    </div>
                  </div>
                ))}

                <div className="social-row">
                  {[
                    { label: "Facebook", url: vendor?.data?.facebook_url },
                    { label: "Instagram", url: vendor?.data?.instagram_url },
                    { label: "TikTok", url: vendor?.data?.tiktok_url },
                  ]
                    .filter((s) => s.url)
                    .map((s) => (
                      <a
                        key={s.label}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                      >
                        {s.label}
                      </a>
                    ))}
                </div>
              </Card>

              {/* Hours */}
              <Card title="Business Hours" titleSize="14px">
                <div className="hours-grid">
                  {dayNames.map((day, index) => {
                    const isClosed = closedDays.includes(index);
                    return (
                      <React.Fragment key={day}>
                        <span className="hours-day">
                          {day} {isClosed ? "(Closed)" : "(Open)"}
                        </span>
                        <span className={isClosed ? "hours-time hours-closed" : "hours-time"}>
                          {isClosed
                            ? "Closed"
                            : `${formatTime(vendor?.data?.business_start_time)} – ${formatTime(vendor?.data?.business_end_time)}`}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </Card>

              {/* Map */}
              <div className="map-card">
                <iframe
                  title="Location"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    vendor?.data?.store_address ?? ""
                  )}&output=embed`} />
              </div>
            </div>
          </div>
        </div>
      </div></>
  );
};

Contact.layout = (page) => <AuthenticatedLayout>{page}</AuthenticatedLayout>;

export default Contact;
