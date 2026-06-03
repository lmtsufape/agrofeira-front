"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { EstoqueFeira } from "@/features/feiras/components/EstoqueFeira";

export const dynamic = "force-dynamic";

function EstoqueFeiraContent() {
  const searchParams = useSearchParams();
  const feiraId = searchParams.get("feiraId") ?? "";

  return <EstoqueFeira feiraId={feiraId} />;
}

export default function EstoqueFeiraPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <Suspense
        fallback={
          <div className="min-h-screen w-full flex items-center justify-center bg-[#f6faf4]">
            <Loader2 className="animate-spin text-[#5bc48b]" size={32} />
          </div>
        }
      >
        <EstoqueFeiraContent />
      </Suspense>
    </div>
  );
}
