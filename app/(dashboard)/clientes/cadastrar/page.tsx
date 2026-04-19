"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ClienteForm } from "@/features/clientes/components/ClienteForm";

export default function CadastrarClientePage() {
  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-5xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Cadastrar Cliente"
        subtitle="Preencha as informações pessoais e de endereço"
        backHref="/dashboard"
      />

      <ClienteForm />
    </main>
  );
}
