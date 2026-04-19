"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
      primary:
        "bg-gradient-to-br from-[#003d04] via-[#1b6112] to-[#2d7a1f] text-white shadow-[0_4px_16px_rgba(0,61,4,0.3)] hover:shadow-[0_6px_20px_rgba(0,61,4,0.4)] hover:-translate-y-0.5",
      secondary:
        "bg-[rgba(154,142,142,0.15)] border border-[rgba(154,142,142,0.3)] text-[#6b6060] hover:bg-[rgba(154,142,142,0.25)]",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      ghost: "bg-transparent hover:bg-black/5 text-gray-600",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
