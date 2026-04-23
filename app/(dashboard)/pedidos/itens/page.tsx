import { SelecionarFeiraEItens } from "@/features/pedidos/components/SelecionarFeiraEItens";
import { Suspense } from "react";

export default function ItensFeiraPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      }
    >
      <SelecionarFeiraEItens />
    </Suspense>
  );
}
