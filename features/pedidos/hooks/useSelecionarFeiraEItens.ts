import { useState } from "react";

export interface Feira {
  id: string;
  dataHora: string;
  local: string;
  status: string;
}

export interface ItemPedido {
  id: string;
  nome: string;
  unidadeMedida: string;
  quantidade: number;
}

const MOCK_FEIRAS: Feira[] = [
  {
    id: "feira-1",
    dataHora: "2026-04-15",
    local: "Garanhuns - PE",
    status: "ABERTA_PEDIDOS",
  },
  {
    id: "feira-2",
    dataHora: "2026-04-22",
    local: "Recife - PE",
    status: "ABERTA_PEDIDOS",
  },
  {
    id: "feira-3",
    dataHora: "2026-04-29",
    local: "Caruaru - PE",
    status: "ABERTA_OFERTAS",
  },
  {
    id: "feira-4",
    dataHora: "2026-05-06",
    local: "Garanhuns - PE",
    status: "ABERTA_PEDIDOS",
  },
];

const MOCK_ITENS: ItemPedido[] = [
  {
    id: "1",
    nome: "Tomate Orgânico",
    unidadeMedida: "Unidade / Kg",
    quantidade: 0,
  },
  { id: "2", nome: "Alface Crespa", unidadeMedida: "Maço", quantidade: 0 },
  { id: "3", nome: "Cenoura Fresca", unidadeMedida: "Maço", quantidade: 0 },
  { id: "4", nome: "Cebola Roxa", unidadeMedida: "Rede / Kg", quantidade: 0 },
  { id: "5", nome: "Batata Doce", unidadeMedida: "Bandeja", quantidade: 0 },
  { id: "6", nome: "Pimentão Verde", unidadeMedida: "Bandeja", quantidade: 0 },
  { id: "7", nome: "Cheiro Verde", unidadeMedida: "Maço", quantidade: 0 },
  { id: "8", nome: "Mandioca", unidadeMedida: "Pacote / Kg", quantidade: 0 },
];

export function useSelecionarFeiraEItens() {
  const [feiras] = useState<Feira[]>(MOCK_FEIRAS);
  const [selectedFeira, setSelectedFeira] = useState<Feira | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itens, setItens] = useState<ItemPedido[]>(MOCK_ITENS);

  const feirasFiltradasPorPesquisa = feiras.filter((feira) =>
    new Date(feira.dataHora).toLocaleDateString("pt-BR").includes(searchTerm),
  );

  const itensSelecionados = itens.filter((item) => item.quantidade > 0);

  const handleQuantidadeChange = (id: string, delta: number) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item,
      ),
    );
  };

  return {
    feiras,
    feirasFiltradasPorPesquisa,
    selectedFeira,
    setSelectedFeira,
    searchTerm,
    setSearchTerm,
    itens,
    itensSelecionados,
    handleQuantidadeChange,
  };
}
