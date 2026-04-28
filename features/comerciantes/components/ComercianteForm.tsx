"use client";

import { Store } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FormSection } from "@/components/ui/FormSection";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";

export function ComercianteForm() {
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
      phone: "",
      email: "",
      description: "",
    },
    validate: (data) => {
      if (!data.name) {
        return "O nome é obrigatório!";
      }
      return null;
    },
    onSubmit: async (data) => {
      // Gera uma senha aleatória pois o backend exige mas o usuário não terá acesso
      const generatedPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10);

      await comercianteService.create({
        nome: data.name,
        telefone: data.phone || null,
        email: data.email || null,
        descricao: data.description || null,
        senha: generatedPassword,
      });
    },
    errorMessageFallback: "Erro ao cadastrar comerciante",
  });

  return (
    <div className="rounded-2xl p-5 md:p-6 bg-white shadow-[0_2px_16px_rgba(0,61,4,0.07),0_0_0_1px_rgba(0,61,4,0.06)]">
      {erro && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm animate-shake">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection
          icon={<Store size={17} className="text-white" />}
          title="Dados do Comerciante"
          subtitle="Preencha as informações"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: João da Silva"
              required
            />
            <Input
              label="Telefone"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(87) 98888-7777"
            />
            <div className="md:col-span-2">
              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemplo@email.com"
              />
            </div>
          </div>
          <Textarea
            label="Descrição"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detalhes sobre os produtos, localização..."
            className="min-h-[120px]"
          />
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
