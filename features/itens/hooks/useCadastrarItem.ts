"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cadastrarItemService } from "../services/cadastrar-itens.service";

export function useCadastrarItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    price: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => router.push("/dashboard");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro(null);

    if (!formData.name || !formData.unit || !formData.price) {
      setErro("Todos os campos são obrigatórios!");
      return;
    }

    setSubmitting(true);
    try {
      await cadastrarItemService(formData);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao cadastrar item";
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
