import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { createPortal } from "react-dom";
import ErrorPage from "@/Pages/ErrorPage";
import { useAuthModal } from "@/Contexts/AuthModalContext";
import LoginModal from "@/Pages/Auth/Login";
import RegisterModal from "@/Pages/Auth/Register";

const Loader = () =>
    createPortal(
        <div className="fixed inset-0 z-[9999] bg-white bg-opacity-60 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>,
        document.body
    );

interface AppWrapperProps {
    App: React.ComponentType<any>;
    props: Record<string, any>;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ App, props }) => {
    const { loginOpen, registerOpen, openLogin, openRegister, closeAll } = useAuthModal();
    const [loading, setLoading] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [errorStatus, setErrorStatus] = useState<number>(500);

    useEffect(() => {
  let lastUrl = window.location.pathname; // track current page before any navigation

  let timer: NodeJS.Timeout;

  const removeStart = router.on("start", (event: any) => {
    timer = setTimeout(() => setLoading(true), 300);
  });

  const removeFinish = router.on("finish", () => {
    clearTimeout(timer);
    setLoading(false);
  });

  const removeError = router.on("error", (event: any) => {
    const status = event.detail?.response?.status ?? 500;
    setErrorStatus(status);
    setNetworkError(true);
  });

  const removeInvalid = router.on("invalid", () => {
    clearTimeout(timer);
    setLoading(false);
  });

  const removeSuccess = router.on("success", (event: any) => {
    const page = event.detail.page;
    const isLoginPage = page.component === "Auth/LoginPage";
    const cameFromRedirect = !page.props?.auth?.user;

    if (isLoginPage && cameFromRedirect) {
      const returnTo = lastUrl; // the page user was actually on before this redirect
      router.visit(returnTo, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setTimeout(() => openLogin(), 50);
        },
      });
      return; // don't update lastUrl to the login page itself
    }

    lastUrl = page.url; // remember this page for next time
  });

 const onUnhandledRejection = (event: PromiseRejectionEvent) => {
+   console.error("Unhandled rejection:", event.reason);
    setErrorStatus(0);
    setNetworkError(true);
};

  window.addEventListener("unhandledrejection", onUnhandledRejection);

  return () => {
    clearTimeout(timer);
    removeStart();
    removeFinish();
    removeError();
    removeInvalid();
    removeSuccess();
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
  };
}, [openLogin]);

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
            <LoginModal
                isOpen={loginOpen}
                onClose={closeAll}
                onSwitchToRegister={openRegister}
                canResetPassword
            />
            <RegisterModal
                isOpen={registerOpen}
                onClose={closeAll}
                onSwitchToLogin={openLogin}
            />
        </>
    );
};

export default AppWrapper;
