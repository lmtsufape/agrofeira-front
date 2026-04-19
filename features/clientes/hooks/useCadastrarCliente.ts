"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cadastrarClienteService } from "../services/cadastrar-clientes.service";

export function useCadastrarCliente() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => router.push("/dashboard");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    if (!formData.name || !formData.phone) {
      setErro("Nome e Telefone são obrigatórios!");
      return;
    }

    setSubmitting(true);
    try {
      await cadastrarClienteService(formData);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao cadastrar cliente";
      setErro(message);
      console.error("Erro completo:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    handleInputChange,
    handleSubmit,
    handleCancel,
    submitting,
    erro,
  };
}
