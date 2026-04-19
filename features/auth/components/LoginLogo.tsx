"use client";

export function LoginLogo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-14 h-14 rounded-xl bg-[#1a4731] flex items-center justify-center mb-3 shadow-lg shadow-[#1a4731]/20">
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[#1a4731]">EcoFeira</h2>
      <p className="text-sm text-gray-500 mt-1">
        Acesse sua conta para continuar
      </p>
    </div>
  );
}
