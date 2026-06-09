import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import RateioPage from "../page";
import { useSearchParams } from "next/navigation";
import { useRateioFeira } from "@/features/feiras/hooks/useRateioFeira";

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("@/features/feiras/hooks/useRateioFeira");

const mockRateio = {
  totalComerciantes: 2,
  totalRateado: 500,
  comerciantes: [
    {
      comerciante: { id: "c1", nome: "Agricultor 1" },
      totalBrutoVenda: 300,
      produtos: [
        {
          id: "p1",
          produto: { nome: "Tomate", unidadeMedida: "KG" },
          quantidadeSequestrada: 10,
          valorBrutoVenda: 300,
        },
      ],
    },
  ],
};

describe("RateioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn().mockReturnValue("f1"),
    });
  });

  it("deve exibir loader durante o carregamento", () => {
    (useRateioFeira as Mock).mockReturnValue({
      rateio: null,
      loading: true,
      erro: null,
    });

    render(<RateioPage />);
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro ou instrução se não houver feiraId ou dados", () => {
    (useRateioFeira as Mock).mockReturnValue({
      rateio: null,
      loading: false,
      erro: "Erro ao carregar",
    });

    render(<RateioPage />);
    expect(screen.getByText("Erro ao carregar")).toBeInTheDocument();
  });

  it("deve exibir os dados do rateio corretamente", () => {
    (useRateioFeira as Mock).mockReturnValue({
      rateio: mockRateio,
      loading: false,
      erro: null,
    });

    render(<RateioPage />);

    expect(screen.getByText("Agricultor 1")).toBeInTheDocument();
    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("R$ 500,00")).toBeInTheDocument(); // Total Rateado
    expect(screen.getAllByText("R$ 300,00")).toHaveLength(3); // Badge, Valor Bruto do Produto, e Total do Comerciante
  });

  it("deve exibir mensagem quando a lista de comerciantes for vazia", () => {
    (useRateioFeira as Mock).mockReturnValue({
      rateio: { ...mockRateio, comerciantes: [] },
      loading: false,
      erro: null,
    });

    render(<RateioPage />);
    expect(
      screen.getByText(/Nenhum resultado de rateio encontrado/i),
    ).toBeInTheDocument();
  });
});
