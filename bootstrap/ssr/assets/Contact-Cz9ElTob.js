import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { usePage, useForm } from "@inertiajs/react";
import { A as AuthenticatedLayout } from "./AuthenticatedLayout-BxONmVZd.js";
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
const Contact = () => {
  const { departments: rawDepartments, contactReasons } = usePage().props;
  const departments = rawDepartments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    slug: dept.slug,
    categories: (dept.categories || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      products: (cat.products || []).map((prod) => ({
        id: prod.id,
        name: prod.name
      }))
    }))
  }));
  const reasons = [
    { value: "", label: "Select reason" },
    ...contactReasons || []
  ];
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    reason: "",
    department: "",
    category: "",
    product: "",
    quantity: "",
    file: null,
    message: ""
  });
  const isGettingQuote = data.reason === "getting_quote";
  const selectedDepartment = departments.find(
    (d) => d.id.toString() === data.department
  );
  const selectedCategory = selectedDepartment == null ? void 0 : selectedDepartment.categories.find(
    (c) => c.id.toString() === data.category
  );
  const handleFileChange = (e) => {
    var _a;
    setData("file", ((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/contact", {
      forceFormData: true,
      onSuccess: () => reset()
    });
  };
  return /* @__PURE__ */ jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12", children: [
    /* @__PURE__ */ jsxs("header", { className: "mb-12 text-center md:text-left", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold text-gray-900 mb-2", children: "Contact Us / Get Quotes" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto md:mx-0", children: "We’re here to help. Fill out the form or use the contact details provided." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsx("section", { children: /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "bg-white rounded-lg shadow-md p-8 space-y-6",
          encType: "multipart/form-data",
          noValidate: true,
          children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "Send a Message" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block mb-1 font-medium text-gray-700",
                  htmlFor: "name",
                  children: "Full Name"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "name",
                  type: "text",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600",
                  required: true,
                  placeholder: "John Doe"
                }
              ),
              errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block mb-1 font-medium text-gray-700",
                  htmlFor: "email",
                  children: "Email Address"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "email",
                  type: "email",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600",
                  required: true,
                  placeholder: "you@example.com"
                }
              ),
              errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block mb-1 font-medium text-gray-700",
                  htmlFor: "reason",
                  children: "Reason for Contact"
                }
              ),
              /* @__PURE__ */ jsx(
                "select",
                {
                  id: "reason",
                  value: data.reason,
                  onChange: (e) => setData("reason", e.target.value),
                  className: "w-full border border-gray-300 rounded-md px-4 py-3 bg-white appearance-none focus:outline-none",
                  style: { transition: "none" },
                  required: true,
                  children: reasons.map((r) => /* @__PURE__ */ jsx(
                    "option",
                    {
                      value: r.value,
                      disabled: r.value === "",
                      children: r.label
                    },
                    r.value
                  ))
                }
              ),
              errors.reason && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.reason })
            ] }),
            isGettingQuote && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "block mb-1 font-medium text-gray-700",
                    htmlFor: "department",
                    children: "Department"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "department",
                    value: data.department,
                    onChange: (e) => {
                      setData("department", e.target.value);
                      setData("category", "");
                      setData("product", "");
                    },
                    className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white",
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Department" }),
                      departments.map((d) => /* @__PURE__ */ jsx("option", { value: d.id, children: d.name }, d.id))
                    ]
                  }
                ),
                errors.department && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.department })
              ] }),
              selectedDepartment && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "block mb-1 font-medium text-gray-700",
                    htmlFor: "category",
                    children: "Category"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "category",
                    value: data.category,
                    onChange: (e) => {
                      setData("category", e.target.value);
                      setData("product", "");
                    },
                    className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white",
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Category" }),
                      selectedDepartment.categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
                    ]
                  }
                ),
                errors.category && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.category })
              ] }),
              selectedCategory && /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "block mb-1 font-medium text-gray-700",
                    htmlFor: "product",
                    children: "Product"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "product",
                    value: data.product,
                    onChange: (e) => setData("product", e.target.value),
                    className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none bg-white",
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "Select Product" }),
                      selectedCategory.products.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.name }, p.id))
                    ]
                  }
                ),
                errors.product && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.product })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "block mb-1 font-medium text-gray-700",
                    htmlFor: "quantity",
                    children: "Quantity"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "quantity",
                    type: "number",
                    min: 1,
                    value: data.quantity,
                    onChange: (e) => setData("quantity", e.target.value),
                    className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600",
                    required: true,
                    placeholder: "Quantity needed"
                  }
                ),
                errors.quantity && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.quantity })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "label",
                  {
                    className: "block mb-1 font-medium text-gray-700",
                    htmlFor: "file",
                    children: "Upload File (optional)"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    id: "file",
                    type: "file",
                    onChange: handleFileChange,
                    className: "w-full",
                    accept: "image/*,application/pdf"
                  }
                ),
                errors.file && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.file })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block mb-1 font-medium text-gray-700",
                  htmlFor: "message",
                  children: "Message"
                }
              ),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  rows: 5,
                  value: data.message,
                  onChange: (e) => setData("message", e.target.value),
                  className: "w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600",
                  required: true,
                  placeholder: "Write your message here..."
                }
              ),
              errors.message && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.message })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                disabled: processing,
                className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition",
                children: processing ? "Sending..." : "Send Message"
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6 text-gray-800", children: "Contact Information" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-700", children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { className: "block mb-1", children: "Address:" }),
              "123 Business Street,",
              /* @__PURE__ */ jsx("br", {}),
              " Melbourne, VIC 3000, Australia"
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { className: "block mb-1", children: "Phone:" }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "tel:+61234567890",
                  className: "text-blue-600 hover:underline",
                  children: "+61 2 3456 7890"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { className: "block mb-1", children: "Email:" }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "mailto:contact@yourcompany.com",
                  className: "text-blue-600 hover:underline",
                  children: "contact@yourcompany.com"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("strong", { className: "block mb-1", children: "Business Hours:" }),
              "Mon - Fri: 9:00 AM - 5:00 PM"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full h-80 rounded-lg overflow-hidden shadow-md", children: /* @__PURE__ */ jsx(
          "iframe",
          {
            title: "Company Location",
            src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019777120943!2d144.96305831573905!3d-37.813611879751115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d43b01b4e5b%3A0x8dd1a4a1d34c892a!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1627485040554!5m2!1sen!2sus",
            width: "100%",
            height: "100%",
            loading: "lazy",
            className: "border-0",
            allowFullScreen: true,
            "aria-hidden": "false",
            tabIndex: 0
          }
        ) })
      ] })
    ] })
  ] }) });
};
export {
  Contact as default
};
