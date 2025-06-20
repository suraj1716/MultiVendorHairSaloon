import "../css/app.css";
import "./bootstrap";

import React, { useState, useEffect } from "react";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Inertia } from "@inertiajs/inertia";
import ErrorPage from "@/Pages/ErrorPage";
import { ErrorBoundary } from "./Components/Core/ErrorBoundary";
import AppWrapper from "./Components/Core/AppWrapper";


// Loader component for page loading state
const Loader = () => (
  <div className="fixed inset-0 z-[9999] bg-white bg-opacity-60 flex items-center justify-center pointer-events-none">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
    // Wrapper to handle Inertia loading, network/server errors


    // Root component wraps InertiaWrapper with ErrorBoundary
    const RootComponent = () => (
     <ErrorBoundary>
    <AppWrapper App={App} props={props} />
  </ErrorBoundary>
    );

    if (import.meta.env.SSR) {
      hydrateRoot(el, <RootComponent />);
    } else {
      if (!root) {
        root = createRoot(el);
      }
      root.render(<RootComponent />);
    }
  },
});
