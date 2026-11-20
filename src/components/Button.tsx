import React from "react";

// R-31: radius is hierarchy. Primary booking keeps the taxi-token pill.
// Secondary and quiet actions use a small 10px radius so pills mean "book".
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
    "inline-flex items-center justify-center gap-2.5 px-7 py-3.5 min-h-[48px] font-semibold transition-colors duration-200 text-[15px] tracking-normal";

  const variants = {
    primary:
      "bg-[#FFC61A] text-[#0E2A21] rounded-full hover:bg-[#ffd14d] shadow-[0_2px_12px_rgba(14,42,33,0.18)]",
    secondary:
      "bg-[#0E2A21] text-[#FFFEFA] rounded-[10px] hover:bg-[#16453a]",
    outline:
      "border border-[#0E2A21]/25 text-[#0E2A21] rounded-[10px] hover:border-[#0E2A21] hover:bg-[#0E2A21] hover:text-[#FFFEFA]",
    quiet:
      "text-[#0E6B5E] underline underline-offset-4 decoration-1 hover:text-[#0E2A21] px-2 py-2 min-h-[44px]",
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
