import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { RepassesComerciantes } from "../RepassesComerciantes";
import { useRouter } from "next/navigation";
import { pagamentosService } from "../../api/pagamentos.service";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../api/pagamentos.service", () => ({
  pagamentosService: {
    listarRepasses: vi.fn(),
  },
}));

describe("RepassesComerciantes", () => {
  const mockPush = vi.fn();
  const mockRepasses = [
    {
      id: "1",
      comercianteId: "c1",
      commercianteName: "Comerciante A",
      valor: 1500.0,
      status: "PENDENTE",
      mes: 4,
      ano: 2026,
    },
    {
      id: "2",
      comercianteId: "c2",
      commercianteName: "Comerciante B",
      valor: 2500.0,
      status: "PAGO",
      mes: 4,
      ano: 2026,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (pagamentosService.listarRepasses as Mock).mockResolvedValue(mockRepasses);
  });

  it("deve listar repasses ao montar", async () => {
    render(<RepassesComerciantes />);

    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Comerciante A")).toBeInTheDocument();
      expect(screen.getByText("Comerciante B")).toBeInTheDocument();
      expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
    });
  });

  it("deve navegar para detalhes ao clicar em comerciante pendente", async () => {
    render(<RepassesComerciantes />);

    await waitFor(() => {
      const rowA = screen.getByText("Comerciante A").closest("div.grid");
      const actionBtn = rowA?.querySelector("button");
      if (actionBtn) fireEvent.click(actionBtn);
    });

    expect(mockPush).toHaveBeenCalledWith("/pagamentos/repasses/c1");
  });

  it("deve desabilitar botão de ação para comerciantes já pagos", async () => {
    render(<RepassesComerciantes />);

    await waitFor(() => {
      const rowB = screen.getByText("Comerciante B").closest("div.grid");
      const actionBtn = rowB?.querySelector("button");
      expect(actionBtn).toBeDisabled();
    });
  });

  it("deve exibir estado vazio quando não houver repasses", async () => {
    (pagamentosService.listarRepasses as Mock).mockResolvedValue([]);
    render(<RepassesComerciantes />);

    await waitFor(() => {
      expect(
        screen.getByText("Nenhum pagamento encontrado"),
      ).toBeInTheDocument();
    });
  });

  it("deve lidar com erro na API", async () => {
    (pagamentosService.listarRepasses as Mock).mockRejectedValue(
      new Error("Erro ao buscar repasses"),
    );
    render(<RepassesComerciantes />);

    await waitFor(() => {
      expect(screen.getByText("Erro ao buscar repasses")).toBeInTheDocument();
    });
  });

  it("deve atualizar dados ao clicar no botão atualizar", async () => {
    render(<RepassesComerciantes />);

    // Espera o carregamento inicial terminar
    await waitFor(() => {
      expect(screen.getByText("Comerciante A")).toBeInTheDocument();
    });

    const updateBtn = screen.getByText("Atualizar Dados");
    fireEvent.click(updateBtn);

    await waitFor(() => {
      // 1 vez no useEffect + 1 vez no clique
      expect(pagamentosService.listarRepasses).toHaveBeenCalledTimes(2);
    });
  });

  it("deve exibir a contagem correta de comerciantes no rodapé", async () => {
    render(<RepassesComerciantes />);

    await waitFor(() => {
      expect(
        screen.getByText(/Mostrando 8 de 2 comerciantes/i),
      ).toBeInTheDocument();
    });
  });
});
