"use client";

import { Users, Hash, DollarSign, Receipt, Store } from "lucide-react";
import { type ItemAgrupado } from "@/features/feiras/api/types";
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

interface OfertaComercianteTableProps {
  item: ItemAgrupado;
}

export function OfertaComercianteTable({
  item,
}: Readonly<OfertaComercianteTableProps>) {
  const totalQtd = item.comerciantes.reduce((acc, c) => acc + c.quantidade, 0);
  const totalGeral = item.comerciantes.reduce(
    (acc, c) => acc + c.quantidade * c.valorUnitario,
    0,
  );

  return (
    <DataTableList
      data={item.comerciantes}
      getKey={(c) => c.id}
      mobileHeaderTitle="Comerciantes Ofertantes"
      columns={[
        { label: "Comerciante", icon: Store, align: "left" },
        { label: "Quantidade", icon: Hash, align: "right" },
        { label: "Preço Ofertado", icon: DollarSign, align: "right" },
        { label: "Total", icon: Receipt, align: "right" },
      ]}
      renderRowDesktop={(c) => {
        const rowTotal = c.quantidade * c.valorUnitario;
        return (
          <>
            <TableCellIcon icon={Users} label={c.nome} />
            <TableCellBadge value={c.quantidade} />
            <TableCellText value={formatarMoeda(c.valorUnitario)} />
            <TableCellBold value={formatarMoeda(rowTotal)} />
          </>
        );
      }}
      renderRowMobile={(c) => {
        const rowTotal = c.quantidade * c.valorUnitario;
        return (
          <MobileTableRow
            icon={Users}
            title={c.nome}
            subtitle={`${c.quantidade} un. x ${formatarMoeda(c.valorUnitario)}`}
            rightValue={formatarMoeda(rowTotal)}
          />
        );
      }}
      renderFooterDesktop={() => (
        <>
          <TableFooterLabel icon={Receipt} label="Totais Gerais" />
          <TableFooterBadge value={totalQtd} />
          <TableFooterText value="—" />
          <TableFooterBold value={formatarMoeda(totalGeral)} />
        </>
      )}
      renderFooterMobile={() => (
        <MobileTableFooter
          icon={Receipt}
          label={`Total (${totalQtd} un.)`}
          value={formatarMoeda(totalGeral)}
        />
      )}
    />
  );
}
