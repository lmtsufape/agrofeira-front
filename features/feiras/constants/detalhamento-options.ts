import { Users, Package, User, BarChart2, LucideIcon } from "lucide-react";

export interface DetOption {
  label: string;
  leftIcon: LucideIcon;
  rightIcon: LucideIcon | null;
  description: string;
  accent: string;
  href: string;
}

export const DETALHAMENTO_OPTIONS: DetOption[] = [
  {
    label: "Comerciante > Item",
    leftIcon: Users,
    rightIcon: Package,
    description: "Veja os itens por comerciante cadastrado",
    accent: "#003d04",
    href: "/feiras/detalhamento/comerciante-item",
  },
  {
    label: "Item > Comerciante",
    leftIcon: Package,
    rightIcon: Users,
    description: "Veja os comerciantes por item ofertado",
    accent: "#1b6112",
    href: "/feiras/detalhamento/item-comerciante",
  },
  {
    label: "Cliente > Item",
    leftIcon: User,
    rightIcon: Package,
    description: "Veja os itens pedidos por cliente",
    accent: "#2d7a1f",
    href: "/feiras/detalhamento/cliente-item",
  },
  {
    label: "Visão Geral",
    leftIcon: BarChart2,
    rightIcon: null,
    description: "Painel completo com todos os dados da feira",
    accent: "#3d9428",
    href: "/feiras/detalhamento/visao-geral",
  },
];
