"use client";

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormSection({
  icon,
  title,
  subtitle,
  children,
}: Readonly<FormSectionProps>) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#003d04] to-[#1b6112]">
          {icon}
        </div>
        <div>
          <h3 className="text-[#1a3d1f] font-bold text-base tracking-tight">
            {title}
          </h3>
          {subtitle && <p className="text-[#8aaa8d] text-xs">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
