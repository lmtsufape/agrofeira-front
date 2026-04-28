"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { itemService } from "@/features/itens/api/itens.service";
import { ItemOpcaoDTO } from "../api/types";

export function ItemForm() {
  const [opcoes, setOpcoes] = useState<{
    categorias: ItemOpcaoDTO[];
    unidadesMedida: ItemOpcaoDTO[];
  }>({
    categorias: [],
    unidadesMedida: [],
  });

  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const data = await itemService.getOpcoes();
        setOpcoes(data);
      } catch (err) {
        console.error("Erro ao carregar opções do backend", err);
      }
    };
    carregarOpcoes();
  }, []);

  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  } = useFormSubmit({
    initialValues: {
      name: "",
      unit: "",
      price: "",
      category: "",
    },
    validate: (data) => {
      if (!data.name || !data.unit || !data.price || !data.category) {
        return "Todos os campos marcados com * são obrigatórios!";
      }
      return null;
    },
    onSubmit: async (data) => {
      // Converte preço do padrão brasileiro (10,50) para float (10.50)
      const numericPrice = parseFloat(
        data.price.replace(".", "").replace(",", "."),
      );

      await itemService.create({
        nome: data.name,
        unidadeMedida: data.unit,
        precoBase: numericPrice,
        categoria: data.category,
      });
    },
    errorMessageFallback: "Erro ao cadastrar item",
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove tudo que não é dígito
    value = value.replace(/\D/g, "");

    // Converte para decimal
    if (value) {
      const numericValue = (parseInt(value, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      handleInputChange({
        target: { name: "price", value: numericValue },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      handleInputChange({
        target: { name: "price", value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome do Item *"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Abacate, Feijão Preto, Melancia..."
              required
            />
            <Select
              label="Categoria *"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Selecione uma categoria..." },
                ...(opcoes?.categorias || []),
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Unidade de Medida *"
              name="unit"
              id="unit"
              value={formData.unit}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Selecione a medida..." },
                ...(opcoes?.unidadesMedida || []),
              ]}
              required
            />

            <Input
              label="Preço Base *"
              name="price"
              id="price"
              type="text"
              value={formData.price}
              onChange={handlePriceChange}
              placeholder="0,00"
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
