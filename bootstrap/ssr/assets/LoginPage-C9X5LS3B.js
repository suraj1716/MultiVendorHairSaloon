import { jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import LoginModal from "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "@inertiajs/react";
import "clsx";
function LoginPage(props) {
  const [isOpen, setIsOpen] = useState(true);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
    LoginModal,
    {
      isOpen,
      onClose: () => setIsOpen(false),
      status: props.status,
      canResetPassword: props.canResetPassword ?? true
    }
  ) });
}
export {
  LoginPage as default
};
