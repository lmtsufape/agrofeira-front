"use client";

import { Store, LayoutGrid } from "lucide-react";
import { DashboardSection } from "@/features/dashboard/components/DashboardSection";
import {
  REGISTER_CARDS,
  MANAGE_CARDS,
} from "@/features/dashboard/constants/dashboard-cards";

export default function DashboardPage() {
  return (
    <div className="flex-1 px-6 py-6 flex flex-col gap-8 max-w-7xl mx-auto w-full">
      <DashboardSection
        title="Cadastrar"
        description="Adicione novos registros ao sistema"
        icon={Store}
        cards={REGISTER_CARDS}
      />

      <DashboardSection
        title="Gerenciar"
        description="Edite e administre os dados existentes"
        icon={LayoutGrid}
        cards={MANAGE_CARDS}
        idPrefix="manage-"
      />
    </div>
  );
}
