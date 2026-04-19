"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ItemForm } from "@/features/itens/components/ItemForm";

export default function CadastrarItemPage() {
  return (
    <main className="flex-1 px-4 md:px-6 py-6 max-w-3xl w-full mx-auto flex flex-col gap-6">
      <PageHeader
        title="Cadastrar Item"
        subtitle="Insira as informações do novo produto"
        backHref="/dashboard"
      />

      <ItemForm />
    </main>
  );
}
