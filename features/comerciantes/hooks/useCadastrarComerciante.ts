"use client";

import { comercianteService } from "@/features/comerciantes/api/comerciantes.service";
import { useFormSubmit } from "@/hooks/useFormSubmit";

export function useCadastrarComerciante() {
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
      if (!data.name || !data.phone || !data.email) {
        return "Nome, Telefone e Email são obrigatórios!";
      }
      return null;
    },
    onSubmit: async (data) => {
      await comercianteService.create({
        nome: data.name,
        telefone: data.phone,
        email: data.email,
      });
    },
    errorMessageFallback: "Erro ao cadastrar comerciante",
  });

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  };
}
