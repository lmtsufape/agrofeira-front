"use client";

import { Package, Hash, DollarSign, Receipt } from "lucide-react";
import { type ClienteAgrupado } from "../hooks/useDetalhamentoCliente";
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

interface ItemTableProps {
  cliente: ClienteAgrupado;
}

export function ItemTable({ cliente }: Readonly<ItemTableProps>) {
  const totalQtd = cliente.itens.reduce(
    (acc, it) => acc + Number(it.quantidade),
    0,
  );

  return (
    <DataTableList
      data={cliente.itens}
      getKey={(it) => it.produtoId}
      mobileHeaderTitle="Itens do pedido"
      columns={[
        { label: "Nome", icon: Package, align: "left" },
        { label: "Quantidade", icon: Hash, align: "right" },
        { label: "Valor unitário", icon: DollarSign, align: "right" },
        { label: "Total", icon: Receipt, align: "right" },
      ]}
      renderRowDesktop={(item) => (
        <>
          <TableCellIcon icon={Package} label={item.nomeItem} />
          <TableCellBadge value={Number(item.quantidade)} />
          <TableCellText value={formatarMoeda(Number(item.valorUnitario))} />
          <TableCellBold
            value={formatarMoeda(
              Number(item.quantidade) * Number(item.valorUnitario),
            )}
          />
        </>
      )}
      renderRowMobile={(item) => (
        <MobileTableRow
          icon={Package}
          title={item.nomeItem}
          subtitle={`${Number(item.quantidade)}x ${formatarMoeda(
            Number(item.valorUnitario),
          )}`}
          rightValue={formatarMoeda(
            Number(item.quantidade) * Number(item.valorUnitario),
          )}
        />
      )}
      renderFooterDesktop={() => (
        <>
          <TableFooterLabel icon={Receipt} label="Resumo do Pedido" />
          <TableFooterBadge value={totalQtd} />
          <TableFooterText value="—" />
          <TableFooterBold value={formatarMoeda(cliente.totalGeral)} />
        </>
      )}
      renderFooterMobile={() => (
        <MobileTableFooter
          icon={Receipt}
          label={`Total (${totalQtd} itens)`}
          value={formatarMoeda(cliente.totalGeral)}
        />
      )}
    />
  );
}
