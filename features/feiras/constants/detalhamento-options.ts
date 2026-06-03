import { Users, Package, User, BarChart2, Scale } from "lucide-react";
import { ActionCardData } from "@/components/ui/ActionCard";

export const DETALHAMENTO_OPTIONS: ActionCardData[] = [
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
    icon: BarChart2,
    description: "Painel completo com todos os dados da feira",
    accent: "#3d9428",
    href: "/feiras/detalhamento/visao-geral",
  },
  {
    label: "Resultado do Rateio",
    icon: Scale,
    description: "Quanto cada feirante vendeu e deve receber",
    accent: "#4a7a2e",
    href: "/feiras/detalhamento/rateio",
  },
];
