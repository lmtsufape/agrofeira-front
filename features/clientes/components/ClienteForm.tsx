"use client";

import { useState } from "react";
import { Users, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { clienteService } from "@/features/clientes/api/clientes.service";
import { BuscaCepModal, type ViaCepAddress } from "./BuscaCepModal";
import { mascararTelefone, formatarMoeda } from "@/utils/formatters";
import { generateSecurePassword } from "@/utils/crypto";
import { useZonasEntrega } from "../hooks/useZonasEntrega";

const STATE_OPTIONS = [
  { value: "", label: "UF" },
  { value: "PE", label: "PE" },
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
  const [isCepModalOpen, setIsCepModalOpen] = useState(false);
  const { zonas, isLoading: isLoadingZonas } = useZonasEntrega();

  const {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  } = useFormSubmit({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      description: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zonaEntregaId: "",
    },
    validate: (data) => {
      if (!data.name) {
        return "O nome é obrigatório!";
      }
      if (!data.zonaEntregaId) {
        return "A zona de entrega é obrigatória!";
      }
      if (data.city && data.city.trim().toLowerCase() !== "garanhuns") {
        return "Apenas clientes de Garanhuns podem ser cadastrados no sistema.";
      }
      return null;
    },
    onSubmit: async (data) => {
      // Gera uma senha aleatória pois o backend exige mas o usuário não terá acesso
      const generatedPassword = generateSecurePassword();

      const cepLimpo = (data.cep as string)?.replace(/\D/g, "");
      const telefoneLimpo = (data.phone as string)?.replace(/\D/g, "");

      await clienteService.create({
        nome: data.name,
        telefone: telefoneLimpo || null,
        email: data.email || null,
        descricao: data.description || null,
        senha: generatedPassword,
        endereco: {
          rua: data.street || null,
          numero: data.number || null,
          complemento: data.complement || null,
          bairro: data.neighborhood || null,
          cidade: data.city || null,
          estado: data.state || null,
          cep: cepLimpo || null,
          zonaEntregaId: data.zonaEntregaId || null,
        },
      });
    },
    errorMessageFallback: "Erro ao cadastrar cliente",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = mascararTelefone(e.target.value);
    handleInputChange({
      target: { name: "phone", value },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    }
    handleInputChange({
      target: { name: "cep", value: value.slice(0, 9) },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro && data.localidade === "Garanhuns") {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const handleCepSelect = (endereco: ViaCepAddress) => {
    setFormData((prev) => ({
      ...prev,
      cep: endereco.cep,
      street: endereco.logradouro || "",
      neighborhood: endereco.bairro || "",
      city: endereco.localidade || "",
      state: endereco.uf || "",
    }));
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
          icon={<Users size={17} className="text-white" />}
          title="Dados Pessoais"
          subtitle="Informações do cliente"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Maria Oliveira"
              required
            />
            <Input
              label="Telefone"
              name="phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(87) 98888-7777"
            />
            <div className="md:col-span-2">
              <Input
                label="Email"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
          <Textarea
            label="Descrição / Observações"
            name="description"
            id="description"
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
            <div className="flex flex-col gap-1 w-full max-w-xs mb-4">
              <Input
                label="CEP"
                name="cep"
                id="cep"
                value={formData.cep}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setIsCepModalOpen(true)}
                    className="p-1 hover:bg-gray-100 rounded-full text-[#5bc48b] transition-colors"
                    title="Não sei meu CEP"
                  >
                    <Search size={18} />
                  </button>
                }
              />
              <button
                type="button"
                onClick={() => setIsCepModalOpen(true)}
                className="text-[10px] text-[#5bc48b] hover:underline font-bold text-left px-1"
              >
                NÃO SEI MEU CEP
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Rua / Avenida"
                  name="street"
                  id="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Ex: Av. Paulista"
                />
              </div>
              <Input
                label="Número"
                name="number"
                id="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="S/N"
              />
            </div>
            <Input
              label="Complemento"
              name="complement"
              id="complement"
              value={formData.complement}
              onChange={handleInputChange}
              placeholder="Apto, Bloco..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Bairro"
                name="neighborhood"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder="Centro"
              />
              <Input
                label="Cidade"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Garanhuns"
              />
              <Select
                label="Estado"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                options={STATE_OPTIONS}
              />
            </div>
            <div className="mt-4">
              <Select
                label="Zona de Entrega *"
                name="zonaEntregaId"
                id="zonaEntregaId"
                value={formData.zonaEntregaId}
                onChange={handleInputChange}
                options={[
                  { value: "", label: "Selecione uma zona..." },
                  ...zonas.map((z) => ({
                    value: z.id,
                    label: `${z.nome} (${formatarMoeda(z.taxa)})`,
                  })),
                ]}
                disabled={isLoadingZonas}
                required
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

      <BuscaCepModal
        isOpen={isCepModalOpen}
        onClose={() => setIsCepModalOpen(false)}
        onSelect={handleCepSelect}
      />
    </div>
  );
}
