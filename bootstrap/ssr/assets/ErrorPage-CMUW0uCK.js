import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
function ErrorPage({
  statusCode = 500,
  message = "An unexpected error occurred.",
  componentStack
}) {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-6xl font-bold text-red-600 mb-4", children: statusCode }),
    /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-800 mb-6", children: message }),
    componentStack && /* @__PURE__ */ jsxs("div", { className: "bg-red-100 text-left text-sm p-4 rounded mb-6 max-w-2xl w-full", children: [
      /* @__PURE__ */ jsx("strong", { children: "Component Stack Trace:" }),
      /* @__PURE__ */ jsx("pre", { className: "whitespace-pre-wrap", children: componentStack })
    ] }),
    /* @__PURE__ */ jsx(
      Link,
      {
        href: "/",
        className: "inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium",
        children: "⬅ Back to Home"
      }
    )
  ] });
}
export {
  ErrorPage as default
};
