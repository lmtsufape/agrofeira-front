"use client";

import { clienteService } from "@/features/clientes/api/clientes.service";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import { CreateClienteDTO } from "@/features/clientes/api/types";

export function useCadastrarCliente() {
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
      cpf: "",
      description: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    validate: (data) => {
      if (!data.name || !data.phone || !data.email || !data.cpf) {
        return "Nome, Telefone, Email e CPF são obrigatórios!";
      }
      return null;
    },
    onSubmit: async (data) => {
      const payload: CreateClienteDTO = {
        nome: data.name,
        telefone: data.phone,
        email: data.email,
        cpf: data.cpf,
      };
      // Envia apenas o que o DTO suporta no momento
      await clienteService.create(payload);
    },
    errorMessageFallback: "Erro ao cadastrar cliente",
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
