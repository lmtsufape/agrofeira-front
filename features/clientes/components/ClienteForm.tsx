"use client";

import { Users, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { useCadastrarCliente } from "../hooks/useCadastrarCliente";

const STATE_OPTIONS = [
  { value: "", label: "UF" },
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
];

export function ClienteForm() {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  } = useCadastrarCliente();

  return (
    <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
      {erro && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection
          icon={<Users size={17} className="text-white" />}
          title="Dados Pessoais"
          subtitle="Informações do cliente"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Maria Oliveira"
              required
            />
            <Input
              label="Telefone *"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          <Textarea
            label="Descrição / Observações"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Preferências de compra, observações sobre entregas..."
            className="min-h-[100px]"
          />
        </FormSection>

        <div className="border-t border-[#eef5ee] pt-8">
          <FormSection
            icon={<MapPin size={17} className="text-white" />}
            title="Endereço"
            subtitle="Localização para entrega"
          >
            <Input
              label="CEP"
              name="cep"
              value={formData.cep}
              onChange={handleInputChange}
              placeholder="00000-000"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Rua / Avenida"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Ex: Av. Paulista"
                />
              </div>
              <Input
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="S/N"
              />
            </div>
            <Input
              label="Complemento"
              name="complement"
              value={formData.complement}
              onChange={handleInputChange}
              placeholder="Apto, Bloco..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder="Centro"
              />
              <Input
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="São Paulo"
              />
              <Select
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                options={STATE_OPTIONS}
              />
            </div>
          </FormSection>
        </div>

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
