import "../css/app.css"
import "./bootstrap";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import AppWrapper from "./Components/Core/AppWrapper";
import ErrorBoundary from "./Components/Core/ErrorBoundary";
import { AuthModalProvider } from "./Contexts/AuthModalContext";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
let root: ReturnType<typeof createRoot> | null = null;

router.on("error", (event) => {
  const errors = event.detail.errors;
  if (errors && Object.keys(errors).length > 0) {
    const firstError = Object.values(errors)[0] as string;
    toast.error(firstError);
  }
});

router.on("invalid", (event) => {
  const isAdminRoute = window.location.pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    event.preventDefault();
    toast.error("Something went wrong. Please try again.");
    console.error("Invalid Inertia response:", event.detail.response);
  }
});

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob("./Pages/**/*.tsx")
    ),
  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(el,
        <ErrorBoundary>
          <AppWrapper App={App} props={props} />
        </ErrorBoundary>
      );
    } else {
      if (!root) {
        root = createRoot(el);
      }
      root.render(
         <AuthModalProvider>
        <ErrorBoundary>
          <AppWrapper App={App} props={props} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                padding: "10px 16px",
              },
              success: {
                iconTheme: {
                  primary: "var(--color-success)",
                  secondary: "var(--color-surface)",
                },
                style: {
                  borderColor: "rgba(58,125,68,0.2)",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--color-error)",
                  secondary: "var(--color-surface)",
                },
                style: {
                  borderColor: "rgba(192,57,43,0.2)",
                },
              },
            }}
          />
        </ErrorBoundary>
        </AuthModalProvider>
      );
    }
  },
});