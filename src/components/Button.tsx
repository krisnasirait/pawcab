import React from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  icon,
  href,
  target,
  rel,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-colors duration-300 text-sm tracking-wide uppercase";

  const variants = {
    primary: "bg-pawcab-gold text-deep-midnight hover:bg-yellow-400",
    secondary: "bg-deep-midnight text-soft-white hover:bg-pawcab-navy",
    outline:
      "border border-deep-midnight text-deep-midnight hover:bg-deep-midnight hover:text-soft-white",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  // An action that goes somewhere is a link, so it stays keyboard-operable
  // and never nests a <button> inside an <a>.
  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
        {icon && <span className="ml-5 md:ml-2">{icon}</span>}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
      {icon && <span className="ml-5 md:ml-2">{icon}</span>}
    </button>
  );
}
