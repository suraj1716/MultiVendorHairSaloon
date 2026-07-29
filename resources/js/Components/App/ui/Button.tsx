// resources/js/Components/App/ui/Button.tsx
//
// Wraps the .btn / .btn-primary / .btn-accent / .btn-outline / .btn-ghost /
// .btn-outline-light classes already defined in index.css, so every button
// in the app pulls from the same source of truth instead of:
//   - Breeze's PrimaryButton / SecondaryButton / DangerButton (Components/Core)
//   - shadcn's Button (Components/ui/button.tsx)
//   - hand-rolled inline style={{...}} buttons per page
//
// Usage:
//   <Button variant="primary">Save</Button>
//   <Button variant="outline" size="sm" disabled={processing}>Cancel</Button>
//   <Button variant="accent" as="a" href="/shop">Book a Consultation</Button>

import React from "react";

type Variant = "primary" | "accent" | "outline" | "outline-light" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  accent: "btn-accent",
  outline: "btn-outline",
  "outline-light": "btn-outline-light",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  as,
  ...rest
}: ButtonProps) {
  const classes = ["btn", variantClass[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(" ");

  if (as === "a") {
    return (
      <a
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
