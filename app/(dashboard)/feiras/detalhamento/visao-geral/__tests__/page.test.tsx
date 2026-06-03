import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import FeiraVisaoGeralPage from "../page";
import { useVisaoGeralFeira } from "@/features/feiras/hooks/useVisaoGeralFeira";
import { useSearchParams } from "next/navigation";

vi.mock("@/features/feiras/hooks/useVisaoGeralFeira");
vi.mock("next/navigation");

describe("FeiraVisaoGeralPage", () => {
  const mockSearchParams = new URLSearchParams({ feiraId: "123" });

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
  });

  it("deve exibir loader enquanto carrega", () => {
    (useVisaoGeralFeira as Mock).mockReturnValue({
      detalhes: null,
      loading: true,
      erro: null,
    });

    const { container } = render(<FeiraVisaoGeralPage />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve exibir erro quando a API falha", () => {
    (useVisaoGeralFeira as Mock).mockReturnValue({
      detalhes: null,
      loading: false,
      erro: "Não foi possível carregar os detalhes da feira.",
    });

    render(<FeiraVisaoGeralPage />);
    expect(
      screen.getByText("Não foi possível carregar os detalhes da feira."),
    ).toBeInTheDocument();
  });

  it("deve renderizar métricas em caso de sucesso", () => {
    const mockDetalhes = {
      id: "123",
      dataHora: "2025-05-01T08:00:00",
      status: "FINALIZADA",
      totalPedidos: 10,
      totalComerciantes: 3,
      totalProdutos: 5,
      valorTotalPedidos: 500,
      valorTotalProdutos: 400,
      totalTaxasEntrega: 70,
      pedidosPorStatus: { ENTREGUE: 8, CANCELADO: 2 },
      totalRateado: 400,
    };

    (useVisaoGeralFeira as Mock).mockReturnValue({
      detalhes: mockDetalhes,
      loading: false,
      erro: null,
    });

    render(<FeiraVisaoGeralPage />);

    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
