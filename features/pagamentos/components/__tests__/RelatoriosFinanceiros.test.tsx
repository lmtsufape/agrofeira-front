import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { RelatoriosFinanceiros } from "../RelatoriosFinanceiros";
import { useRouter } from "next/navigation";
import { pagamentosService } from "../../api/pagamentos.service";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../api/pagamentos.service", () => ({
  pagamentosService: {
    listarRelatorios: vi.fn(),
    relatorioMensal: vi.fn().mockResolvedValue([]),
    relatorioGeralPorComerciante: vi.fn().mockResolvedValue([]),
    listarFeiras: vi.fn().mockResolvedValue([]),
    detalhesFeira: vi.fn(),
    totaisRepassesPorFeira: vi.fn(),
  },
}));

// Mock Recharts para evitar erros de renderização em ambiente de teste
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
}));

describe("RelatoriosFinanceiros", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (pagamentosService.relatorioMensal as Mock).mockResolvedValue([]);
    (pagamentosService.relatorioGeralPorComerciante as Mock).mockResolvedValue(
      [],
    );
    (pagamentosService.listarFeiras as Mock).mockResolvedValue([]);
  });

  it("deve renderizar os títulos das seções ao montar", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(
        screen.getByText("Evolução Mensal de Faturamento"),
      ).toBeInTheDocument();
    });

    expect(pagamentosService.relatorioMensal).toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro se a API falhar", async () => {
    (pagamentosService.relatorioMensal as Mock).mockRejectedValueOnce(
      new Error("Erro ao carregar dados"),
    );

    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();
    });
  });

  it("deve atualizar dados ao clicar no botão atualizar", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(
        screen.getByText("Evolução Mensal de Faturamento"),
      ).toBeInTheDocument();
    });

    const updateBtn = screen.getByText("Atualizar");
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(pagamentosService.relatorioMensal).toHaveBeenCalledTimes(2);
    });
  });

  it("deve exibir a opção padrão no seletor de feira quando não há feiras", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      expect(screen.getByText("Selecionar feira...")).toBeInTheDocument();
    });
  });

  it("deve exibir mensagem de nenhum dado quando fair selecionada não tem dados", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum dado para 2026")).toBeInTheDocument();
    });
  });

  it("deve navegar de volta para pagamentos", async () => {
    render(<RelatoriosFinanceiros />);
    const backBtn = screen.getAllByRole("button")[0];
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith("/pagamentos");
  });

  it("deve alterar o ano ao clicar nos botões de navegação", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(screen.getByText("2026")).toBeInTheDocument();
    });

    // Actually simpler to find by looking at buttons that aren't "Atualizar" or "Voltar"
    const buttons = screen.getAllByRole("button");
    const prevBtn = buttons[2]; // Index 0: Back, 1: Refresh, 2: PrevYear

    fireEvent.click(prevBtn);

    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(pagamentosService.relatorioMensal).toHaveBeenCalledWith(2025);
  });

  it("deve carregar detalhes quando uma feira é selecionada", async () => {
    const mockFeiras = [
      { id: "f1", dataHora: "2026-04-15T12:00:00Z", status: "ENCERRADA" },
    ];
    (pagamentosService.listarFeiras as Mock).mockResolvedValue(mockFeiras);
    (pagamentosService.detalhesFeira as Mock).mockResolvedValue({
      totalPedidos: 5,
      valorTotalPedidos: 100,
      totalRateado: 80,
      totalTaxasEntrega: 20,
      totalComerciantes: 2,
      pedidosPorStatus: {},
    });
    (pagamentosService.totaisRepassesPorFeira as Mock).mockResolvedValue([]);

    render(<RelatoriosFinanceiros />);

    const select = await screen.findByRole("combobox");

    await waitFor(() => {
      expect(screen.getAllByRole("option").length).toBeGreaterThan(1);
    });

    fireEvent.change(select, { target: { value: "f1" } });

    await waitFor(() => {
      expect(pagamentosService.detalhesFeira).toHaveBeenCalledWith("f1");
      expect(screen.getByText("5")).toBeInTheDocument(); // totalPedidos
    });
  });
});
