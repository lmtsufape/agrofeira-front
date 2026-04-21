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
    listarRelatoriosPorMes: vi.fn(),
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
  const mockRelatorios = [
    {
      id: "1",
      titulo: "Relatório Jan 2026",
      mes: "1",
      ano: 2026,
      valor: 1000,
      status: "OK",
    },
    {
      id: "2",
      titulo: "Relatório Fev 2026",
      mes: "2",
      ano: 2026,
      valor: 2000,
      status: "OK",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (pagamentosService.listarRelatoriosPorMes as Mock).mockResolvedValue(
      mockRelatorios,
    );
  });

  it("deve carregar e exibir relatórios ao montar", async () => {
    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      // O título principal deve conter o nome do relatório
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("Relatório Jan 2026");
    });

    expect(pagamentosService.listarRelatoriosPorMes).toHaveBeenCalled();
  });

  it("deve exibir mensagem de erro se a API falhar", async () => {
    (pagamentosService.listarRelatoriosPorMes as Mock).mockRejectedValueOnce(
      new Error("Erro API"),
    );

    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      expect(
        screen.getByText("Erro ao carregar relatórios"),
      ).toBeInTheDocument();
    });
  });

  it("deve atualizar dados ao clicar no botão atualizar", async () => {
    render(<RelatoriosFinanceiros />);

    // Espera o carregamento inicial
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Relatório Jan 2026",
      );
    });

    const updateBtn = screen.getByText("Atualizar Dados");
    fireEvent.click(updateBtn);

    await waitFor(() => {
      // 1 vez no useEffect inicial + 1 vez no clique
      expect(pagamentosService.listarRelatoriosPorMes).toHaveBeenCalledTimes(2);
    });
  });

  it("deve mudar o relatório selecionado no dropdown", async () => {
    render(<RelatoriosFinanceiros />);

    // Espera o carregamento inicial
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        "Relatório Jan 2026",
      );
    });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });

    await waitFor(
      () => {
        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Relatório Fev 2026");
      },
      { timeout: 2000 },
    );
  });

  it("deve desabilitar o dropdown e mostrar mensagem correta quando não houver relatórios", async () => {
    (pagamentosService.listarRelatoriosPorMes as Mock).mockResolvedValueOnce(
      [],
    );

    render(<RelatoriosFinanceiros />);

    await waitFor(() => {
      const select = screen.getByRole("combobox");
      expect(select).toBeDisabled();
      expect(screen.getByText("Carregando relatórios...")).toBeInTheDocument();
    });
  });

  it("deve navegar de volta para pagamentos", () => {
    render(<RelatoriosFinanceiros />);
    const backBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(backBtn);
    expect(mockPush).toHaveBeenCalledWith("/pagamentos");
  });
});
