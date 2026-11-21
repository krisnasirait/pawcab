import React from "react";

// R-31: radius is hierarchy. Every action is a flat pill; only fill and
// border separate primary from secondary. No offset shadows, no lifts.
type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "quiet";
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
    "inline-flex items-center justify-center gap-2.5 px-[22px] py-3 min-h-[48px] font-medium transition-colors duration-200 text-[16px] tracking-normal";

  const variants = {
    primary:
      "bg-accent text-forest border-2 border-line rounded-full hover:bg-accent-hover",
    secondary:
      "bg-forest text-white border-2 border-forest rounded-full hover:bg-deepgreen hover:border-deepgreen",
    outline:
      "bg-transparent text-forest border-2 border-forest/35 rounded-full hover:border-forest hover:bg-forest hover:text-white",
    quiet:
      "text-forest underline underline-offset-4 decoration-1 decoration-accent hover:decoration-2 px-2 py-2 min-h-[44px]",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
        {icon && <span aria-hidden="true" className="shrink-0">{icon}</span>}
      </a>
    );
  }

  return (
    <button type="button" className={classes}>
      {children}
      {icon && <span aria-hidden="true" className="shrink-0">{icon}</span>}
    </button>
  );
}
