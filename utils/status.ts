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
  } else if (statusLower === "aguardando" || statusLower === "pendente") {
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
  }
  return {
    bg: "bg-[#F3E5F5]",
    border: "border-[#CE93D8]",
    text: "text-[#6A1B9A]",
  };
};
