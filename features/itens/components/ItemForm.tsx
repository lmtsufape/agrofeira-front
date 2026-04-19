"use client";

import { Package } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { useCadastrarItem } from "../hooks/useCadastrarItem";

const UNIT_OPTIONS = [
  { value: "", label: "Selecione a medida..." },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "l", label: "Litro (L)" },
  { value: "ml", label: "Mililitro (ml)" },
  { value: "un", label: "Unidade (un)" },
  { value: "dz", label: "Dúzia (dz)" },
  { value: "cx", label: "Caixa (cx)" },
  { value: "sc", label: "Saco (sc)" },
];

export function ItemForm() {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  } = useCadastrarItem();

  return (
    <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
      {erro && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection
          icon={<Package size={17} className="text-white" />}
          title="Detalhes do Produto"
          subtitle="Preencha todas as informações"
        >
          <Input
            label="Nome do Item *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Ex: Abacate, Feijão Preto, Melancia..."
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Unidade de Medida *"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              options={UNIT_OPTIONS}
              required
            />

            <Input
              label="Preço Base *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              icon={
                <span className="text-[#5bc48b] font-bold text-xs">R$</span>
              }
            />
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-6 border-t border-[#eef5ee]">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={submitting}>
            {submitting ? "Salvando..." : "Confirmar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
