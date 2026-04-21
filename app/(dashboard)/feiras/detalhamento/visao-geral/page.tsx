"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SummaryTable } from "@/features/feiras/components/SummaryTable";
import { useVisaoGeralFeira } from "@/features/feiras/hooks/useVisaoGeralFeira";

function DetalhamentoVisaoGeralContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const feiraId = searchParams.get("feiraId");

  const { resumo, loading, erro } = useVisaoGeralFeira(token, feiraId);

  const handleDetailClick = (
    type: "item" | "comerciante" | "cliente",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: string,
  ) => {
    const query = feiraId ? `?feiraId=${feiraId}` : "";
    const routes: Record<string, string> = {
      item: `/feiras/detalhamento/item-comerciante${query}`,
      comerciante: `/feiras/detalhamento/comerciante-item${query}`,
      cliente: `/feiras/detalhamento/cliente-item${query}`,
    };
    router.push(routes[type]);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
      </div>
    );
  }

  if (!resumo) {
    return (
      <main className="flex-1 px-4 md:px-6 py-8 max-w-6xl w-full mx-auto text-center">
        <p className="text-[#9db89f] font-medium">
          Erro ao carregar dados do resumo.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 md:px-6 py-8 max-w-6xl w-full mx-auto flex flex-col gap-8">
      <PageHeader
        title="Visão Geral"
        subtitle={`Detalhes da feira realizada em ${resumo.dataFeira} - ${resumo.localidade}`}
      />

      {erro && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SummaryTable
          type="item"
          data={resumo.items}
          onDetailClick={handleDetailClick}
        />

        <SummaryTable
          type="comerciante"
          data={resumo.comerciantes}
          onDetailClick={handleDetailClick}
        />

        <SummaryTable
          type="cliente"
          data={resumo.clientes}
          onDetailClick={handleDetailClick}
        />
      </div>
    </main>
  );
}

export default function FeiraDetalhamentoVisaoGeral() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-[#f6faf4] to-[#edf5eb]">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5bc48b]" />
          </div>
        }
      >
        <DetalhamentoVisaoGeralContent />
      </Suspense>
    </div>
  );
}
