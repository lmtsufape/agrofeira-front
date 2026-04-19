import {
  Store,
  UserPlus,
  Users,
  Package,
  ClipboardList,
  LayoutGrid,
  Briefcase,
  UserCog,
  PackageOpen,
  Wallet,
} from "lucide-react";
import { ElementType } from "react";

export type CardItem = {
  label: string;
  sublabel: string;
  icon: ElementType;
  description: string;
  accent: string;
  href: string;
};

export const REGISTER_CARDS: CardItem[] = [
  {
    label: "Cadastrar",
    sublabel: "Feira",
    icon: Store,
    description: "Adicione novas feiras ao sistema",
    accent: "#003d04",
    href: "/feiras/nova",
  },
  {
    label: "Cadastrar",
    sublabel: "Comerciante",
    icon: UserPlus,
    description: "Registre novos comerciantes",
    accent: "#1b6112",
    href: "/comerciantes/cadastrar",
  },
  {
    label: "Cadastrar",
    sublabel: "Cliente",
    icon: Users,
    description: "Cadastre clientes na plataforma",
    accent: "#2d7a1f",
    href: "/clientes/cadastrar",
  },
  {
    label: "Cadastrar",
    sublabel: "Itens",
    icon: Package,
    description: "Insira produtos e itens",
    accent: "#3d9428",
    href: "/itens/cadastrar",
  },
  {
    label: "Ver",
    sublabel: "Pedidos",
    icon: ClipboardList,
    description: "Acompanhe todos os pedidos",
    accent: "#5bc48b",
    href: "/pedidos",
  },
];

export const MANAGE_CARDS: CardItem[] = [
  {
    label: "Gerenciar",
    sublabel: "Feira",
    icon: LayoutGrid,
    description: "Organize e edite as feiras",
    accent: "#003d04",
    href: "/feiras",
  },
  {
    label: "Gerenciar",
    sublabel: "Comerciante",
    icon: Briefcase,
    description: "Gerencie os comerciantes",
    accent: "#1b6112",
    href: "/comerciantes",
  },
  {
    label: "Gerenciar",
    sublabel: "Cliente",
    icon: UserCog,
    description: "Administre os clientes",
    accent: "#2d7a1f",
    href: "/clientes",
  },
  {
    label: "Gerenciar",
    sublabel: "Itens",
    icon: PackageOpen,
    description: "Edite o catálogo de produtos",
    accent: "#3d9428",
    href: "/itens",
  },
  {
    label: "Ver",
    sublabel: "Pagamentos",
    icon: Wallet,
    description: "Controle financeiro e transações",
    accent: "#5bc48b",
    href: "/pagamentos",
  },
];
