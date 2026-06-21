import { jsxs, jsx } from "react/jsx-runtime";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
import { usePage, Head } from "@inertiajs/react";
import DeleteUserForm from "./DeleteUserForm-D20a5Kmq.js";
import UpdatePasswordForm from "./UpdatePasswordForm-vDfzGLco.js";
import UpdateProfileInformation from "./UpdateProfileInformationForm-BZz3Om5U.js";
import VendorDetails from "./VendorDetails-CNO2O9Hv.js";
import ShippingAddresses from "./ShippingAddresses-ROMZPwtm.js";
import "react";
import "@headlessui/react";
import "@heroicons/react/24/outline";
import "./Login-CRSv4mrB.js";
import "react-dom";
import "./InputError-DiSBWiye.js";
import "./PrimaryButton-Bj3LWgL6.js";
import "clsx";
import "lucide-react";
import "@heroicons/react/20/solid";
import "./InputLabel-BRjg4SBP.js";
import "./Modal-BeSeEOS3.js";
import "./SecondaryButton-CJNtUGec.js";
import "./TextInput-kwtITkQ9.js";
import "@inertiajs/inertia";
function Edit() {
  const page = usePage();
  const { mustVerifyEmail, status, shipping_addresses } = page.props;
  return /* @__PURE__ */ jsxs(
    AuthenticatedLayout,
    {
      header: /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold leading-tight text-gray-800", children: "Profile" }),
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Profile" }),
        /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(
              UpdateProfileInformation,
              {
                mustVerifyEmail,
                status,
                className: "max-w-xl"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(UpdatePasswordForm, { className: "max-w-xl" }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8", children: /* @__PURE__ */ jsx(DeleteUserForm, { className: "max-w-xl" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800", children: [
            /* @__PURE__ */ jsx(VendorDetails, {}),
            /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsx(ShippingAddresses, { shipping_addresses }) })
          ] })
        ] })
      ]
    }
  );
}
export {
  Edit as default
};
