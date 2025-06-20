import React, { useEffect, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import ErrorPage from "@/Pages/ErrorPage";

// Optional loader
const Loader = () => (
  <div className="fixed inset-0 z-[9999] bg-white bg-opacity-60 flex items-center justify-center pointer-events-none">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

interface AppWrapperProps {
  App: React.ComponentType<any>;
  props: Record<string, any>;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ App, props }) => {
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number>(500);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const onStart = () => {
      timer = setTimeout(() => setLoading(true), 300);
    };

    const onFinish = () => {
      clearTimeout(timer);
      setLoading(false);
    };

    const onError = (event: any) => {
      console.error("Inertia error:", event.detail);
      const status = event.detail?.response?.status ?? 500;
      setErrorStatus(status);
      setNetworkError(true);
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled rejection (likely network error):", event.reason);
      setErrorStatus(0);
      setNetworkError(true);
    };

    Inertia.on("start", onStart);
    Inertia.on("finish", onFinish);
    Inertia.on("error", onError);
    Inertia.on("invalid", onFinish);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  if (networkError) {
    return (
      <ErrorPage
        statusCode={errorStatus}
        message={
          errorStatus === 0
            ? "Network error occurred. Please check your connection and try again."
            : `A server error occurred (status code: ${errorStatus}).`
        }
      />
    );
  }

  return (
    <>
      {loading && <Loader />}
      <App {...props} />
    </>
  );
};

export default AppWrapper;
