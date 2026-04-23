import { useState, useEffect } from "react";
import { clienteService } from "../api/clientes.service";
import { ClienteDTO } from "../api/types";
import { useRouter } from "next/navigation";

export function useCliente(clienteId?: string) {
  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [loading, setLoading] = useState(!!clienteId);
  const [error, setError] = useState<string | null>(null);
  const [savingChanges, setSavingChanges] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    descricao: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  useEffect(() => {
    if (!clienteId) return;

    const fetchData = async () => {
      try {
        const data = await clienteService.getById(clienteId);
        setCliente(data);
        setFormData({
          nome: data.nome || "",
          telefone: data.telefone || "",
          descricao: data.descricao || "",
          cep: data.cep || "",
          rua: data.rua || "",
          numero: data.numero || "",
          complemento: data.complemento || "",
          bairro: data.bairro || "",
          cidade: data.cidade || "",
          estado: data.estado || "",
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao buscar cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clienteId]);

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
      router.push("/clientes");
    } catch (err) {
      throw err;
    } finally {
      setSavingChanges(false);
    }
  };

  return {
    cliente,
    formData,
    loading,
    error,
    savingChanges,
    handleFormChange,
    saveChanges,
  };
}
