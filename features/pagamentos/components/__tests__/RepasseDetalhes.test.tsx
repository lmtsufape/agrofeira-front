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
  },
}));

describe("RepasseDetalhes", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();
  const mockId = "comerciante-123";

  const mockDados = {
    repasse: {
      id: "rep-1",
      rateioResultadoId: "rat-1",
      comerciante: {
        id: mockId,
        nome: "João do Queijo",
        telefone: "1199999999",
        email: "joao@queijo.com",
      },
      feiraId: "feira-1",
      valorBruto: 550.5,
      valorLiquido: 550.5,
      status: "PAGO",
      repassadoEm: null,
      criadoEm: "2026-06-01T00:00:00",
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
      expect(screen.getByText("Status: Pago")).toBeInTheDocument();
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

  it("deve desabilitar botão se o repasse já estiver pago", async () => {
    render(<RepasseDetalhes />);

    await waitFor(() => {
      const btn = screen.getByText("Já Foi Pago");
      expect(btn.closest("button")).toBeDisabled();
    });
  });

  it("deve voltar ao clicar no botão de cancelar", async () => {
    render(<RepasseDetalhes />);

    await waitFor(() => {
      const cancelBtn = screen.getByText("Cancelar Operação");
      fireEvent.click(cancelBtn);
    });

    expect(mockBack).toHaveBeenCalled();
  });
});
