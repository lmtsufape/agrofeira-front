import { render, screen } from "@testing-library/react";
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
} from "../TableCell";

describe("TableCell Components", () => {
  it("TableCellIcon deve renderizar ícone e label", () => {
    render(
      <TableCellIcon icon={() => <svg data-testid="icon" />} label="Texto" />,
    );
    expect(screen.getByText("Texto")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("TableCellBadge deve renderizar valor", () => {
    render(<TableCellBadge value="Badge" />);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("TableCellText deve renderizar valor", () => {
    render(<TableCellText value="Texto" />);
    expect(screen.getByText("Texto")).toBeInTheDocument();
  });

  it("TableCellBold deve renderizar valor em negrito", () => {
    render(<TableCellBold value="Bold" />);
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it("MobileTableRow deve renderizar todos os campos", () => {
    render(
      <MobileTableRow
        icon={() => <svg data-testid="mobile-icon" />}
        title="Título"
        subtitle="Subtítulo"
        rightValue="R$ 10,00"
      />,
    );
    expect(screen.getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-icon")).toBeInTheDocument();
  });

  it("TableFooterLabel deve renderizar ícone e label", () => {
    render(
      <TableFooterLabel
        icon={() => <svg data-testid="foot-icon" />}
        label="Total"
      />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByTestId("foot-icon")).toBeInTheDocument();
  });

  it("TableFooterBadge deve renderizar valor", () => {
    render(<TableFooterBadge value="FootBadge" />);
    expect(screen.getByText("FootBadge")).toBeInTheDocument();
  });

  it("TableFooterText deve renderizar valor", () => {
    render(<TableFooterText value="FootText" />);
    expect(screen.getByText("FootText")).toBeInTheDocument();
  });

  it("TableFooterBold deve renderizar valor", () => {
    render(<TableFooterBold value="FootBold" />);
    expect(screen.getByText("FootBold")).toBeInTheDocument();
  });

  it("MobileTableFooter deve renderizar label e valor", () => {
    render(
      <MobileTableFooter icon={() => null} label="Total" value="R$ 50,00" />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("R$ 50,00")).toBeInTheDocument();
  });
});
