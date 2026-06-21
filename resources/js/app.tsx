import "../css/app.css"
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import AppWrapper from "./Components/Core/AppWrapper";
import ErrorBoundary from "./Components/Core/ErrorBoundary";
import { AuthModalProvider } from "./Contexts/AuthModalContext";
const appName = import.meta.env.VITE_APP_NAME || "Laravel";

let root: ReturnType<typeof createRoot> | null = null;

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
        </ErrorBoundary>
        </AuthModalProvider>
      );
    }
  },
});
