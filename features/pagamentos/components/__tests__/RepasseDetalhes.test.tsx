import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { RepasseDetalhes } from "../RepasseDetalhes";
import { useRouter, useParams } from "next/navigation";
import { pagamentosService } from "../../api/pagamentos.service";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("../../api/pagamentos.service", () => ({
  pagamentosService: {
    obterPagamentoDetalhes: vi.fn(),
    confirmarPagamento: vi.fn(),
  },
}));

describe("RepasseDetalhes", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  const mockId = "comerciante-123";

  const mockDados = {
    comerciante: {
      id: mockId,
      nome: "João do Queijo",
      telefone: "1199999999",
      email: "joao@queijo.com",
    },
    repasse: {
      id: "rep-1",
      valor: 550.5,
      status: "PENDENTE",
      mes: 4,
      ano: 2026,
      comercianteId: mockId,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
    (useParams as Mock).mockReturnValue({ id: mockId });
    (pagamentosService.obterPagamentoDetalhes as Mock).mockResolvedValue(
      mockDados,
    );
  });

  it("deve carregar e exibir os detalhes ao montar", async () => {
    render(<RepasseDetalhes />);

    expect(
      screen.getByText("Carregando detalhes do pagamento..."),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("João do Queijo")).toBeInTheDocument();
      expect(screen.getByText("550,50")).toBeInTheDocument();
      expect(screen.getByText("Status: Pendente")).toBeInTheDocument();
    });
  });

  it("deve lidar com erro ao carregar dados", async () => {
    (pagamentosService.obterPagamentoDetalhes as Mock).mockRejectedValueOnce(
      new Error("Falha na carga"),
    );

    render(<RepasseDetalhes />);

    await waitFor(() => {
      expect(screen.getByText("Falha na carga")).toBeInTheDocument();
    });
  });

  it("deve confirmar pagamento com sucesso", async () => {
    (pagamentosService.confirmarPagamento as Mock).mockResolvedValueOnce({});

    render(<RepasseDetalhes />);

    await waitFor(() => {
      expect(screen.getByText("João do Queijo")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText("Confirmar Pagamento");
    fireEvent.click(confirmBtn);

    expect(screen.getByText("Processando...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByText("Pagamento confirmado com sucesso!"),
        ).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Espera o redirecionamento (setTimeout de 1.5s no componente)
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith("/pagamentos/repasses");
      },
      { timeout: 3000 },
    );
  });

  it("deve lidar com erro na confirmação do pagamento", async () => {
    (pagamentosService.confirmarPagamento as Mock).mockRejectedValueOnce(
      new Error("Erro ao confirmar"),
    );

    render(<RepasseDetalhes />);

    await waitFor(() => {
      expect(screen.getByText("João do Queijo")).toBeInTheDocument();
    });

    const confirmBtn = screen.getByText("Confirmar Pagamento");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText("Erro ao confirmar")).toBeInTheDocument();
    });
  });

  it("deve desabilitar botão se o repasse já estiver pago", async () => {
    (pagamentosService.obterPagamentoDetalhes as Mock).mockResolvedValue({
      ...mockDados,
      repasse: { ...mockDados.repasse, status: "PAGO" },
    });

    render(<RepasseDetalhes />);

    await waitFor(() => {
      const btn = screen.getByText("Já Foi Pago");
      expect(btn).toBeDisabled();
    });
  });

  it("deve voltar ao clicar no botão de cancelar ou voltar", async () => {
    render(<RepasseDetalhes />);

    await waitFor(() => {
      const cancelBtn = screen.getByText("Cancelar Operação");
      fireEvent.click(cancelBtn);
    });

    expect(mockBack).toHaveBeenCalled();
  });
});
