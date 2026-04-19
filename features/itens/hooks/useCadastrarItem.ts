"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { itemService } from "@/features/itens/api/itens.service";
import { CreateItemDTO } from "@/features/itens/api/types";

export function useCadastrarItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    price: "",
    categoriaId: "",
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

    if (
      !formData.name ||
      !formData.unit ||
      !formData.price ||
      !formData.categoriaId
    ) {
      setErro("Todos os campos são obrigatórios!");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateItemDTO = {
        id: "", // ID será gerado pelo banco, mas exigido pelo DTO atual (deve ser refinado)
        nome: formData.name,
        unidadeMedida: formData.unit,
        categoriaId: formData.categoriaId,
      };
      await itemService.create(payload);
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
