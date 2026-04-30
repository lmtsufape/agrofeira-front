"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { swrFetcher } from "@/lib/swr-fetcher";
import { clienteService } from "../api/clientes.service";
import { ClienteDTO } from "../api/types";
import { useRouter } from "next/navigation";

export function useCliente(clienteId?: string) {
  const router = useRouter();

  const {
    data: cliente,
    error: swrError,
    isLoading,
    mutate,
  } = useSWR<ClienteDTO>(
    clienteId ? `/api/v1/clientes/${clienteId}` : null,
    swrFetcher,
  );

  const [savingChanges, setSavingChanges] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    descricao: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  // Sincroniza formData quando o cliente é carregado
  useEffect(() => {
    if (cliente && !formData.nome && !formData.telefone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        nome: cliente.nome || "",
        telefone: cliente.telefone || "",
        email: cliente.email || "",
        descricao: cliente.descricao || "",
        cep: cliente.cep || "",
        rua: cliente.rua || "",
        numero: cliente.numero || "",
        complemento: cliente.complemento || "",
        bairro: cliente.bairro || "",
        cidade: cliente.cidade || "",
        estado: cliente.estado || "",
      });
    }
  }, [cliente, formData.nome, formData.telefone]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    if (!clienteId) return;
    try {
      setSavingChanges(true);
      await clienteService.update(clienteId, formData);
      await mutate();
      router.push("/clientes");
    } finally {
      setSavingChanges(false);
    }
  };

  return {
    cliente,
    formData,
    loading: isLoading,
    error: swrError
      ? swrError instanceof Error
        ? swrError.message
        : "Erro ao carregar"
      : null,
    savingChanges,
    handleFormChange,
    saveChanges,
  };
}
