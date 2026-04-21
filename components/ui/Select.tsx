"use client";

import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-semibold text-[#1a4731]"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-[#1a4731] focus:ring-2 focus:ring-[#1a4731]/10 transition disabled:opacity-70 disabled:cursor-not-allowed ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
              : ""
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
