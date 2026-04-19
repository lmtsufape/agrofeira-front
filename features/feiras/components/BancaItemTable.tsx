"use client";

import { Package, Hash, DollarSign, Receipt } from "lucide-react";
import { type EstoqueBancaDTO } from "@/features/feiras/api/types";
import { formatarMoeda } from "@/utils/formatters";
import { DataTableList } from "@/components/ui/DataTableList";
import {
  TableCellIcon,
  TableCellBadge,
  TableCellText,
  TableCellBold,
  MobileTableRow,
  TableFooterLabel,
  TableFooterBadge,
  TableFooterText,
  TableFooterBold,
  MobileTableFooter,
} from "@/components/ui/TableCell";

interface BancaItemTableProps {
  banca: EstoqueBancaDTO;
}

export function BancaItemTable({ banca }: Readonly<BancaItemTableProps>) {
  const totalQtd = banca.itens.reduce(
    (acc, it) => acc + Number(it.quantidadeDisponivel),
    0,
  );

  const totalGeral = banca.itens.reduce(
    (acc, it) => acc + Number(it.quantidadeDisponivel) * Number(it.precoBase),
    0,
  );

  return (
    <DataTableList
      data={banca.itens}
      getKey={(it) => it.id}
      mobileHeaderTitle="Estoque da Banca"
      columns={[
        { label: "Item", icon: Package, align: "left" },
        { label: "Qtd. Disponível", icon: Hash, align: "right" },
        { label: "Preço Base", icon: DollarSign, align: "right" },
        { label: "Subtotal", icon: Receipt, align: "right" },
      ]}
      renderRowDesktop={(item) => (
        <>
          <TableCellIcon icon={Package} label={item.itemNome} />
          <TableCellBadge value={Number(item.quantidadeDisponivel)} />
          <TableCellText value={formatarMoeda(Number(item.precoBase))} />
          <TableCellBold
            value={formatarMoeda(
              Number(item.quantidadeDisponivel) * Number(item.precoBase),
            )}
          />
        </>
      )}
      renderRowMobile={(item) => (
        <MobileTableRow
          icon={Package}
          title={item.itemNome}
          subtitle={`${Number(item.quantidadeDisponivel)} un. x ${formatarMoeda(
            Number(item.precoBase),
          )}`}
          rightValue={formatarMoeda(
            Number(item.quantidadeDisponivel) * Number(item.precoBase),
          )}
        />
      )}
      renderFooterDesktop={() => (
        <>
          <TableFooterLabel icon={Receipt} label="Resumo da Banca" />
          <TableFooterBadge value={totalQtd} />
          <TableFooterText value="—" />
          <TableFooterBold value={formatarMoeda(totalGeral)} />
        </>
      )}
      renderFooterMobile={() => (
        <MobileTableFooter
          icon={Receipt}
          label={`Total da Banca (${totalQtd} un.)`}
          value={formatarMoeda(totalGeral)}
        />
      )}
    />
  );
}
