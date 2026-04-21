import { render, screen } from "@testing-library/react";
import {
  DetalhamentoSelectorHeader,
  DetalhamentoTableSeparator,
} from "../DetalhamentoHeaders";

describe("DetalhamentoHeaders", () => {
  describe("DetalhamentoSelectorHeader", () => {
    it("deve renderizar título e subtítulo", () => {
      render(
        <DetalhamentoSelectorHeader
          icon={() => <svg data-testid="icon" />}
          title="Título"
          subtitle="Subtítulo"
        />,
      );
      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Subtítulo")).toBeInTheDocument();
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("deve renderizar badge se label for fornecido", () => {
      render(
        <DetalhamentoSelectorHeader
          icon={() => null}
          title="Título"
          subtitle="Subtítulo"
          badgeLabel="Ativo"
        />,
      );
      expect(screen.getByText("Ativo")).toBeInTheDocument();
    });
  });

  describe("DetalhamentoTableSeparator", () => {
    it("deve renderizar o label e ícone", () => {
      render(
        <DetalhamentoTableSeparator
          icon={() => <svg data-testid="sep-icon" />}
          label="Separador"
        />,
      );
      expect(screen.getByText("Separador")).toBeInTheDocument();
      expect(screen.getByTestId("sep-icon")).toBeInTheDocument();
    });
  });
});
