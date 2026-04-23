import { useState } from "react";
import { useRouter } from "next/navigation";

export interface ItemPedido {
  id: string;
  nome: string;
  unidadeMedida: string;
  quantidade: number;
  preco?: number;
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

const MOCK_ITENS: ItemPedido[] = [
  {
    id: "1",
    nome: "Tomate Orgânico",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 5.5,
  },
  {
    id: "2",
    nome: "Alface Crespa",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 3.0,
  },
  {
    id: "3",
    nome: "Cenoura Fresca",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 4.0,
  },
  {
    id: "4",
    nome: "Cebola Roxa",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 2.5,
  },
  {
    id: "5",
    nome: "Batata Doce",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 3.5,
  },
  {
    id: "6",
    nome: "Pimentão Verde",
    unidadeMedida: "Kg",
    quantidade: 0,
    preco: 6.0,
  },
  {
    id: "7",
    nome: "Cheiro Verde",
    unidadeMedida: "Maço",
    quantidade: 0,
    preco: 2.0,
  },
  { id: "8", nome: "Mandioca", unidadeMedida: "Kg", quantidade: 0, preco: 4.5 },
];

export function useResumoPedido(itensList: string) {
  const router = useRouter();

  const [itensCarrinho, setItensCarrinho] = useState<ItemPedido[]>(() => {
    if (!itensList) return [];
    const itensParsed: ItemPedido[] = [];
    const pares = itensList.split(",");
    pares.forEach((par) => {
      const [id, qty] = par.split(":");
      const itemOriginal = MOCK_ITENS.find((i) => i.id === id);
      if (itemOriginal) {
        itensParsed.push({
          ...itemOriginal,
          quantidade: parseInt(qty, 10),
        });
      }
    });
    return itensParsed;
  });

  const [opcaoRetirada, setOpcaoRetirada] = useState<"local" | "endereco">(
    "local",
  );
  const [enderecoModal, setEnderecoModal] = useState(false);
  const [pedidoRealizado, setPedidoRealizado] = useState(false);
  const [endereco, setEndereco] = useState<Endereco>({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const handleQuantidadeChange = (id: string, delta: number) => {
    setItensCarrinho((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
          : item,
      ),
    );
  };

  const handleRemover = (id: string) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const valorTotal = itensCarrinho.reduce(
    (acc, item) => acc + (item.preco || 0) * item.quantidade,
    0,
  );

  const finalizarPedido = async () => {
    // Simulando chamada API
    setPedidoRealizado(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 3000);
  };

  return {
    itensCarrinho,
    opcaoRetirada,
    setOpcaoRetirada,
    enderecoModal,
    setEnderecoModal,
    pedidoRealizado,
    endereco,
    setEndereco,
    valorTotal,
    handleQuantidadeChange,
    handleRemover,
    finalizarPedido,
  };
}
