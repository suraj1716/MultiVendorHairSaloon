import { jsxs, jsx } from "react/jsx-runtime";
import { I as InputError } from "./InputError-DiSBWiye.js";
import { I as InputLabel } from "./InputLabel-BRjg4SBP.js";
import { P as PrimaryButton } from "./PrimaryButton-Bj3LWgL6.js";
import { S as SecondaryButton } from "./SecondaryButton-CJNtUGec.js";
import { T as TextInput } from "./TextInput-kwtITkQ9.js";
import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
function Modal({ show, onClose, children }) {
  if (!show) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
      onClick: onClose,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6",
          onClick: (e) => e.stopPropagation(),
          children
        }
      )
    }
  );
}
function ShippingAddresses({
  className = "",
  shipping_addresses
}) {
  var _a;
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDefaultId, setSelectedDefaultId] = useState(
    ((_a = shipping_addresses.find((addr) => addr.is_default)) == null ? void 0 : _a.id) || null
  );
  const [editingAddress, setEditingAddress] = useState(null);
  const closeModal = () => {
    reset();
    setShowModal(false);
    setEditingAddressId(null);
    setEditingAddress(null);
  };
  const { data, setData, post, reset, errors, processing } = useForm({
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false
  });
  useEffect(() => {
    if (editingAddress) {
      setData({
        full_name: editingAddress.full_name || "",
        phone: editingAddress.phone || "",
        address_line1: editingAddress.address_line1 || "",
        address_line2: editingAddress.address_line2 || "",
        city: editingAddress.city || "",
        state: editingAddress.state || "",
        postal_code: editingAddress.postal_code || "",
        country: editingAddress.country || "",
        is_default: editingAddress.is_default || false
      });
      setShowModal(true);
    }
  }, [editingAddress]);
  const submit = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      Inertia.put(route("shipping-addresses.update", editingAddressId), data, {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setShowModal(false);
          setEditingAddressId(null);
          Inertia.visit(route("profile.edit"));
        }
      });
    } else {
      post(route("shipping-addresses.store"), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
          setShowModal(false);
          Inertia.visit(route("profile.edit"));
        }
      });
    }
  };
  return /* @__PURE__ */ jsxs("section", { className, children: [
    /* @__PURE__ */ jsx("header", { children: /* @__PURE__ */ jsx("h2", { className: "flex justify-between mb-6 text-lg font-medium text-gray-900 dark:text-gray-100", children: "Shipping Addresses" }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: shipping_addresses && shipping_addresses.length > 0 ? shipping_addresses.map((addr) => /* @__PURE__ */ jsx("div", { className: "p-4 border rounded-md bg-white shadow-sm relative", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: addr.address_line1 }),
        addr.address_line2 && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: addr.address_line2 }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-700", children: [
          addr.city,
          ", ",
          addr.state,
          " ",
          addr.postal_code
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700", children: addr.country })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-4 mt-3", children: /* @__PURE__ */ jsxs("label", { className: "flex items-center text-sm text-gray-700", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "radio",
            name: "defaultAddress",
            value: addr.id,
            checked: selectedDefaultId === addr.id,
            onChange: () => {
              setSelectedDefaultId(addr.id || null);
              Inertia.patch(route("shipping-addresses.set-default", addr.id));
            },
            className: "mr-2"
          }
        ),
        "Default"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setEditingAddress(addr);
              setEditingAddressId(addr.id);
              setData({
                full_name: addr.full_name || "",
                phone: addr.phone || "",
                address_line1: addr.address_line1 || "",
                address_line2: addr.address_line2 || "",
                city: addr.city || "",
                state: addr.state || "",
                postal_code: addr.postal_code || "",
                country: addr.country || "",
                is_default: addr.is_default || false
              });
              setShowModal(true);
            },
            className: "ml-2 mt-2 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700",
            children: "Edit"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (!addr.id) return;
              if (confirm("Are you sure you want to delete this address?")) {
                Inertia.delete(route("shipping-addresses.destroy", addr.id), {
                  preserveScroll: true,
                  onSuccess: () => {
                    if (editingAddressId === addr.id) {
                      setEditingAddress(null);
                      setEditingAddressId(null);
                      reset();
                      setShowModal(false);
                    }
                    if (selectedDefaultId === addr.id) {
                      setSelectedDefaultId(null);
                    }
                  }
                });
              }
            },
            className: "ml-2 mt-2 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700",
            children: "Delete"
          }
        )
      ] })
    ] }) }, addr.id)) : /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: "No addresses saved yet." }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(PrimaryButton, { onClick: () => setShowModal(true), children: "Add New Address" }) }),
    /* @__PURE__ */ jsx(Modal, { show: showModal, onClose: closeModal, children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "p-6 space-y-4 pt-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-gray-100", children: editingAddressId ? "Edit Shipping Address" : "Add Shipping Address" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "full_name", value: "Full Name" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "full_name",
            value: data.full_name,
            onChange: (e) => setData("full_name", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.full_name, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "phone", value: "Phone" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "phone",
            value: data.phone,
            onChange: (e) => setData("phone", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.phone, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "address_line1", value: "Address Line 1" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "address_line1",
            value: data.address_line1,
            onChange: (e) => setData("address_line1", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.address_line1, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "address_line2", value: "Address Line 2" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "address_line2",
            value: data.address_line2 || "",
            onChange: (e) => setData("address_line2", e.target.value),
            className: "mt-1 block w-full"
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.address_line2, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "city", value: "City" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "city",
            value: data.city,
            onChange: (e) => setData("city", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.city, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "state", value: "State" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "state",
            value: data.state,
            onChange: (e) => setData("state", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.state, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "postal_code", value: "Postal Code" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "postal_code",
            value: data.postal_code,
            onChange: (e) => setData("postal_code", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.postal_code, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(InputLabel, { htmlFor: "country", value: "Country" }),
        /* @__PURE__ */ jsx(
          TextInput,
          {
            id: "country",
            value: data.country,
            onChange: (e) => setData("country", e.target.value),
            className: "mt-1 block w-full",
            required: true
          }
        ),
        /* @__PURE__ */ jsx(InputError, { message: errors.country, className: "mt-2" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 mt-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            id: "is_default",
            checked: data.is_default,
            onChange: (e) => setData("is_default", e.target.checked),
            className: "h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          }
        ),
        /* @__PURE__ */ jsx("label", { htmlFor: "is_default", className: "text-sm text-gray-700", children: "Set as default address" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(SecondaryButton, { onClick: closeModal, type: "button", children: "Cancel" }),
        /* @__PURE__ */ jsx(PrimaryButton, { type: "submit", disabled: processing, children: editingAddressId ? "Update Address" : "Add Address" })
      ] })
    ] }) })
  ] });
}
export {
  ShippingAddresses as default
};
