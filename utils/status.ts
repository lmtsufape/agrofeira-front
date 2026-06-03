export const STATUS_LABELS: Record<string, string> = {
  PENDENTE: "Pendente",
  AGUARDANDO_SEPARACAO: "Aguardando Separação",
  PRONTO_RETIRADA: "Pronto p/ Retirada",
  SAIU_ENTREGA: "Saiu p/ Entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const getStatusLabel = (status: string): string =>
  STATUS_LABELS[status] ?? status;

export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (
    statusLower === "concluído" ||
    statusLower === "entregue" ||
    statusLower === "finalizado"
  ) {
    return {
      bg: "bg-[#E8F5EC]",
      border: "border-[#C2E5CC]",
      text: "text-[#1B6112]",
    };
  } else if (
    statusLower === "aguardando" ||
    statusLower === "pendente" ||
    statusLower === "aguardando_separacao"
  ) {
    return {
      bg: "bg-[#FFF8E6]",
      border: "border-[#FFE082]",
      text: "text-[#B38600]",
    };
  } else if (statusLower === "cancelado" || statusLower === "recusado") {
    return {
      bg: "bg-[#FFEBEE]",
      border: "border-[#EF9A9A]",
      text: "text-[#C62828]",
    };
  } else if (
    statusLower === "pronto_retirada" ||
    statusLower === "saiu_entrega"
  ) {
    return {
      bg: "bg-[#E3F2FD]",
      border: "border-[#90CAF9]",
      text: "text-[#1565C0]",
    };
  }
  return {
    bg: "bg-[#F3E5F5]",
    border: "border-[#CE93D8]",
    text: "text-[#6A1B9A]",
  };
};
