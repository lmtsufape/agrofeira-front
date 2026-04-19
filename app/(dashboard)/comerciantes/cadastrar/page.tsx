"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ComercianteForm } from "@/features/comerciantes/components/ComercianteForm";

export default function CadastrarComerciantePage() {
  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-3xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Cadastrar Comerciante"
        subtitle="Insira as informações do comerciante"
        backHref="/dashboard"
      />

      <ComercianteForm />
    </main>
  );
}
