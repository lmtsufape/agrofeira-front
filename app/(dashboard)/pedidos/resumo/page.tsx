import { ResumoPedido } from "@/features/pedidos/components/ResumoPedido";
import { Suspense } from "react";

export default function ResumoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      }
    >
      <ResumoPedido />
    </Suspense>
  );
}
