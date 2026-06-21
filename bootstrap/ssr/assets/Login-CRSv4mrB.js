import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { I as InputError } from "./InputError-DiSBWiye.js";
import { P as PrimaryButton } from "./PrimaryButton-Bj3LWgL6.js";
import { useForm, Head, Link } from "@inertiajs/react";
import clsx from "clsx";
function Checkbox({
  className = "",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      ...props,
      type: "checkbox",
      className: "checkbox checkbox-primary" + className
    }
  );
}
const GoogleLoginButton = ({
  processing = false,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: processing ? void 0 : "/auth/google",
      className: clsx(
        "flex items-center justify-center w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 font-medium shadow-sm",
        "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        processing && "opacity-50 cursor-not-allowed",
        className
      ),
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://developers.google.com/identity/images/g-logo.png",
            alt: "Google logo",
            className: "w-5 h-5 mr-3"
          }
        ),
        processing ? "Signing in..." : "Sign in with Google"
      ]
    }
  );
};
function LoginModal({
  isOpen,
  onClose,
  status,
  canResetPassword = true
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false
  });
  const modalRef = useRef(null);
  const submit = (e) => {
    e.preventDefault();
    post(route("login"), {
      onFinish: () => {
        reset("password");
        onClose();
      }
    });
  };
  if (!isOpen) return null;
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  const modalContent = /* @__PURE__ */ jsx(
    "div",
    {
      onClick: handleOverlayClick,
      className: "fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4",
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref: modalRef,
          onClick: (e) => e.stopPropagation(),
          className: "relative bg-white shadow-xl rounded-2xl max-w-md w-full p-8",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: onClose,
                className: "absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold",
                "aria-label": "Close modal",
                children: "×"
              }
            ),
            /* @__PURE__ */ jsx(Head, { title: "Log in" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-center mb-4", children: "Login" }),
            status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-sm font-medium text-green-600", children: status }),
            /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoComplete: "username",
                    onChange: (e) => setData("email", e.target.value),
                    value: data.email,
                    id: "email",
                    name: "email",
                    type: "text",
                    className: "peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600",
                    placeholder: "Email address"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "email",
                    className: "absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600",
                    children: "Email Address"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.email, className: "mt-1" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    autoComplete: "current-password",
                    onChange: (e) => setData("password", e.target.value),
                    value: data.password,
                    id: "password",
                    name: "password",
                    type: "password",
                    className: "peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600",
                    placeholder: "Password"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    htmlFor: "password",
                    className: "absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600",
                    children: "Password"
                  }
                ),
                /* @__PURE__ */ jsx(InputError, { message: errors.password, className: "mt-1" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "block", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(
                  Checkbox,
                  {
                    name: "remember",
                    checked: data.remember,
                    onChange: (e) => setData("remember", e.target.checked)
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Remember me" })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: canResetPassword && /* @__PURE__ */ jsx(
                Link,
                {
                  href: route("password.request"),
                  className: "text-sm text-cyan-600 hover:underline",
                  children: "Forgot your password?"
                }
              ) }),
              /* @__PURE__ */ jsx(PrimaryButton, { className: "w-full", disabled: processing, children: "Log in" }),
              /* @__PURE__ */ jsx(GoogleLoginButton, { className: "w-full" })
            ] })
          ]
        }
      )
    }
  );
  return createPortal(modalContent, document.body);
}
export {
  LoginModal as default
};
