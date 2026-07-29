import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import React from "react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import VendorDetails from "./Partials/VendorDetails";
import ShippingAddresses, { ShippingAddress } from "./ShippingAddresses";
import Card from "@/Components/App/Card";
import SectionHeading from "@/Components/App/ui/SectionHeading";

export default function Edit() {
  const page =
    usePage<
      PageProps<{
        mustVerifyEmail: boolean;
        status?: string;
        shipping_addresses: ShippingAddress[];
      }>
    >();
  const { mustVerifyEmail, status, shipping_addresses } = page.props;
  return (
    <AuthenticatedLayout>
      <Head title="Profile" />

      <div
        style={{
          fontFamily: "var(--font-body)",
          background: "var(--color-bg)",
          minHeight: "100%",
        }}
      >
        <style>{`
          .pf-card {
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            padding: 2rem;
            position: relative;
            overflow: hidden;
            transition: border-color var(--transition-base), box-shadow var(--transition-base);
          }
          .pf-card:hover {
            border-color: var(--color-accent-light);
            box-shadow: var(--shadow-lg);
          }
          .pf-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-accent);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.4s ease;
          }
          .pf-card:hover::before {
            transform: scaleX(1);
          }
          .pf-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          @media (min-width: 900px) {
            .pf-grid {
              grid-template-columns: 1fr 1fr;
              align-items: start;
            }
          }
          .pf-stack {
            display: flex;
            flex-direction: column;
            gap: 1.75rem;
          }
        `}</style>

        {/* ── Hero ── */}
        <section
          style={{
            background: "var(--color-bg-dark)",
            padding: "4rem 0 3rem",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 7vw",
            }}
          >
            <SectionHeading
              eyebrow="Account"
              title={
                <>
                  Your{" "}
                  <em style={{ fontStyle: "italic", color: "var(--color-accent-light)" }}>
                    Profile
                  </em>
                </>
              }
              tone="light"
              marginBottom="0"
            />
          </div>
        </section>

        {/* ── Content ── */}
        <section style={{ padding: "3.5rem 0 5rem" }}>
          <div
            style={{
              maxWidth: "var(--container-max)",
              margin: "0 auto",
              padding: "0 7vw",
            }}
          >
            <div className="pf-grid">
              {/* ---------- LEFT SIDE ---------- */}

              <div className="pf-stack">
                <Card title="Profile Information">
                  <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                  />
                </Card>
                <Card title="Security">
                  <UpdatePasswordForm />
                </Card>
                <Card title="Danger Zone">
                  <DeleteUserForm />
                </Card>
              </div>

              <div className="pf-stack">
                <Card
                  title="Vendor Details"
                  badge={/* e.g. user.vendor?.status_label */ undefined}
                >
                  <VendorDetails />
                </Card>
                <Card title="Shipping Addresses">
                  <ShippingAddresses shipping_addresses={shipping_addresses} />
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AuthenticatedLayout>
  );
}
