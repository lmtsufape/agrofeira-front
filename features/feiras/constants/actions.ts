import { Package, ShoppingCart, FileText, BarChart2 } from "lucide-react";

export interface ActionOption {
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  description: string;
  accent: string;
  href?: string;
}

export const FEIRA_ACTIONS: ActionOption[] = [
  {
    label: "Cadastrar",
    sublabel: "Itens",
    icon: Package,
    description: "Adicione produtos à feira selecionada",
    accent: "#003d04",
  },
  {
    label: "Cadastrar",
    sublabel: "Pedidos",
    icon: ShoppingCart,
    description: "Registre novos pedidos da feira",
    accent: "#1b6112",
  },
  {
    label: "Visualizar",
    sublabel: "Detalhamento",
    icon: FileText,
    description: "Visualize todos os detalhes da feira",
    accent: "#2d7a1f",
    href: "/feiras/detalhamento",
  },
  {
    label: "Balanço",
    sublabel: "Financeiro",
    icon: BarChart2,
    description: "Acompanhe receitas e despesas",
    accent: "#3d9428",
  },
];
