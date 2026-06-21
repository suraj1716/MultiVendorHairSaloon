import { jsx, jsxs } from "react/jsx-runtime";
function InputLabel({
  value,
  className = "",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "label",
    {
      ...props,
      className: `label ` + className,
      children: /* @__PURE__ */ jsxs("span", { className: "label-text", children: [
        "    ",
        value ? value : children,
        " "
      ] })
    }
  );
}
export {
  InputLabel as I
};
