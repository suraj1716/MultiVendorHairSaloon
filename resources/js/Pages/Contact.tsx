import React from "react";
import { useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import PageHero from "@/Components/Page/PageHero";

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

const Contact: React.FC = () => {
  const { departments: rawDepartments = [], contactReasons } =
    usePage<PageProps>().props;

  const departments: DepartmentOption[] = rawDepartments.map((dept: any) => ({
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
  }));

  const reasons = [
    { value: "", label: "Select reason" },
    ...((contactReasons as { value: string; label: string }[]) || []),
  ];

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData("file", file);
  };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  post("/contact", {
    forceFormData: true,
    preserveState: true,
    onSuccess: () => reset(),
  });
};
  return (
    <AuthenticatedLayout>
      <style>{`
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
          background: var(--color-primary-dark);
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
        title={<>Get in <em>Touch</em></>}
        subtitle="Whether you're after a quote, have a question, or simply want to say hello — our team is ready to help."
        breadcrumbs={[{ label: "Home", href: route("home") }, { label: "Contact" }]}
      />

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
                {/* Reason */}
                <div className="form-group">
                  <label htmlFor="reason">Reason for Contact</label>
                  <div className="select-wrapper">
                    <select
                      id="reason"
                      value={data.reason}
                      onChange={(e) => setData("reason", e.target.value)}
                      required
                    >
                      {reasons.map((r) => (
                        <option
                          key={r.value}
                          value={r.value}
                          disabled={r.value === ""}
                        >
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.reason && (
                    <p className="field-error">{errors.reason}</p>
                  )}
                </div>

                {/* Name + Email */}
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Jane Smith"
                      required
                    />
                    {errors.name && (
                      <p className="field-error">{errors.name}</p>
                    )}
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData("email", e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="field-error">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone + Preferred contact */}
                <div
                  className="form-row"
                  style={{ marginTop: "var(--space-xl)" }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="phone">Phone (optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setData("phone", e.target.value)}
                      placeholder="+61 4XX XXX XXX"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Preferred Contact Method</label>
                    <div className="radio-group">
                      {["email", "phone"].map((opt) => (
                        <div className="radio-option" key={opt}>
                          <input
                            type="radio"
                            id={`contact-${opt}`}
                            name="preferredContact"
                            value={opt}
                            checked={data.preferredContact === opt}
                            onChange={() => setData("preferredContact", opt)}
                          />
                          <label htmlFor={`contact-${opt}`}>{opt}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote fields */}
                {isGettingQuote && (
                  <>
                    <div
                      className="quote-section-divider"
                      style={{ marginTop: "var(--space-xl)" }}
                    >
                      <span>Quote Details</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <div className="select-wrapper">
                        <select
                          id="department"
                          value={data.department}
                          onChange={(e) => {
                            setData("department", e.target.value);
                            setData("category", "");
                            setData("product", "");
                          }}
                          required
                        >
                          <option value="">Select Department</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.department && (
                        <p className="field-error">{errors.department}</p>
                      )}
                    </div>

                    {selectedDepartment && (
                      <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <div className="select-wrapper">
                          <select
                            id="category"
                            value={data.category}
                            onChange={(e) => {
                              setData("category", e.target.value);
                              setData("product", "");
                            }}
                            required
                          >
                            <option value="">Select Category</option>
                            {selectedDepartment.categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.category && (
                          <p className="field-error">{errors.category}</p>
                        )}
                      </div>
                    )}

                    {selectedCategory && (
                      <div className="form-group">
                        <label htmlFor="product">Product</label>
                        <div className="select-wrapper">
                          <select
                            id="product"
                            value={data.product}
                            onChange={(e) => setData("product", e.target.value)}
                            required
                            style={{ color: "#1a1a1a", background: "#ffffff" }}
                          >
                            <option value="">Select Product</option>
                            {(() => {
                              return selectedCategory.products.map((p) => {
                                return (
                                  <option key={p.id} value={p.id}>
                                    {p.title}
                                  </option>
                                );
                              });
                            })()}
                          </select>
                        </div>
                        {errors.product && (
                          <p className="field-error">{errors.product}</p>
                        )}
                      </div>
                    )}

                    <div className="form-row">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label htmlFor="quantity">Quantity</label>
                        <input
                          id="quantity"
                          type="number"
                          min={1}
                          value={data.quantity}
                          onChange={(e) => setData("quantity", e.target.value)}
                          placeholder="e.g. 50"
                          required
                        />
                        {errors.quantity && (
                          <p className="field-error">{errors.quantity}</p>
                        )}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Upload File (optional)</label>
                       <div className="file-upload-area" onClick={() => document.getElementById('file-input')?.click()}>
  <input
    id="file-input"
    type="file"
    onChange={handleFileChange}
    accept="image/*,application/pdf"
    style={{ display: 'none' }}
  />
  <p className="file-upload-text">
    {data.file ? (
      <span style={{ color: "var(--color-primary)" }}>{(data.file as File).name}</span>
    ) : (
      <>
        <span>Browse</span> or drag & drop<br />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-light)" }}>
          PDF, JPG, PNG
        </span>
      </>
    )}
  </p>
</div>
                        {errors.file && (
                          <p className="field-error">{errors.file}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Message */}
                <div
                  className="form-group"
                  style={{ marginTop: "var(--space-xl)" }}
                >
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    placeholder="Tell us how we can help..."
                    required
                  />
                  {errors.message && (
                    <p className="field-error">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={processing}
                >
                  {processing ? "Sending…" : "Send Message →"}
                </button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              {/* Contact info */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Contact Information</h3>
                </div>
                <div className="info-card-body">
                  {[
                    {
                      icon: "📍",
                      label: "Address",
                      content: "123 Business Street, Melbourne VIC 3000",
                    },
                    {
                      icon: "📞",
                      label: "Phone",
                      content: "+61 2 3456 7890",
                      href: "tel:+61234567890",
                    },
                    {
                      icon: "✉️",
                      label: "Email",
                      content: "contact@yourcompany.com",
                      href: "mailto:contact@yourcompany.com",
                    },
                  ].map(({ icon, label, content, href }) => (
                    <div className="info-row" key={label}>
                      <div className="info-row-icon">{icon}</div>
                      <div className="info-row-content">
                        <strong>{label}</strong>
                        {href ? (
                          <a href={href}>{content}</a>
                        ) : (
                          <span>{content}</span>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="social-row">
                    {["Instagram", "Facebook", "LinkedIn"].map((s) => (
                      <a key={s} href="#" className="social-btn">
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="info-card">
                <div className="info-card-header">
                  <h3>Business Hours</h3>
                </div>
                <div className="info-card-body">
                  <div className="hours-grid">
                    <span className="hours-day">Monday – Friday</span>
                    <span className="hours-time">9:00 AM – 5:00 PM</span>
                    <span className="hours-day">Saturday</span>
                    <span className="hours-time">10:00 AM – 3:00 PM</span>
                    <span className="hours-day">Sunday</span>
                    <span className="hours-time hours-closed">Closed</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="map-card">
                <iframe
                  title="Company Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019777120943!2d144.96305831573905!3d-37.813611879751115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43b01b4e5b%3A0x8dd1a4a1d34c892a!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627485040554!5m2!1sen!2sus"
                  width="100%"
                  height="220"
                  loading="lazy"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  aria-hidden="false"
                  tabIndex={0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Contact;
