import { ResumoPedido } from "@/features/pedidos/components/ResumoPedido";
import { Suspense } from "react";

export default function ResumoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
          <main className="flex-1 flex items-center justify-center">
            <p>Carregando...</p>
          </main>
        </div>
      }
    >
      <ResumoPedido />
    </Suspense>
  );
}
