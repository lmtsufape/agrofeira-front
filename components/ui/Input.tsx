"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-[#1a4731]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-[#1a4731] focus:ring-2 focus:ring-[#1a4731]/10 transition disabled:opacity-70 disabled:cursor-not-allowed ${
              icon ? "pl-10" : "pl-4"
            } ${rightElement ? "pr-12" : "pr-4"} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                : ""
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
