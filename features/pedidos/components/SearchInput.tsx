"use client";

import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: Readonly<SearchInputProps>) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-white rounded-xl border border-[#d4e8d6] focus:outline-none focus:ring-2 focus:ring-[#5bc48b1a] focus:border-[#5bc48b] transition-all text-sm text-[#1A3D1F] shadow-sm placeholder:text-[#9DB89F]"
      />
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9DB89F]"
      />
    </div>
  );
}
