import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import CadastrarFeiraPage from "../page";
import { useCadastrarFeira } from "@/features/feiras/hooks/useCadastrarFeira";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/features/feiras/hooks/useCadastrarFeira");

interface TransferItem {
  id: string;
  label: string;
}

vi.mock("@/features/feiras/components/TransferList", () => ({
  TransferList: vi.fn(
    ({
      title,
      leftItems,
      rightItems,
      onLeftSelect,
      onRightSelect,
      onMoveToRight,
      onMoveToLeft,
      onMoveAllToRight,
      onMoveAllToLeft,
      loading,
    }) => (
      <div data-testid={`transfer-list-${title}`}>
        <span data-testid={`count-${title}`}>
          {leftItems.length + rightItems.length}
        </span>
        <div data-testid={`items-${title}`}>
          {leftItems.concat(rightItems).map((it: TransferItem) => (
            <span key={it.id} data-testid={`item-label-${title}`}>
              {it.label}
            </span>
          ))}
        </div>
        {loading && <span data-testid="loading">Carregando...</span>}
        <button
          onClick={() => onLeftSelect("item-1")}
          data-testid={`select-left-${title}`}
        >
          Select Left
        </button>
        <button
          onClick={() => onRightSelect("item-2")}
          data-testid={`select-right-${title}`}
        >
          Select Right
        </button>
        <button onClick={onMoveToRight} data-testid={`move-right-${title}`}>
          To Right
        </button>
        <button onClick={onMoveToLeft} data-testid={`move-left-${title}`}>
          To Left
        </button>
        <button onClick={onMoveAllToRight} data-testid={`all-right-${title}`}>
          All Right
        </button>
        <button onClick={onMoveAllToLeft} data-testid={`all-left-${title}`}>
          All Left
        </button>
      </div>
    ),
  ),
}));

describe("CadastrarFeiraPage - Deep Unit Test", () => {
  const mockPush = vi.fn();
  const mockSetDataFeira = vi.fn();
  const mockHandleConfirmar = vi.fn();
  const mockToggleSel = vi.fn();

  const mockComerciantes = {
    left: [{ id: "c1", nome: "Comerciante 1" }],
    right: [{ id: "c2", nome: "Comerciante 2" }],
    leftSel: [],
    rightSel: [],
    toLeft: vi.fn(),
    toRight: vi.fn(),
    allToLeft: vi.fn(),
    allToRight: vi.fn(),
    setLeftSel: vi.fn(),
    setRightSel: vi.fn(),
  };

  const mockItens = {
    left: [{ id: "i1", nome: "Item 1", unidadeMedida: "KG" }],
    right: [{ id: "i2", nome: "Item 2", unidadeMedida: "UN" }],
    leftSel: [],
    rightSel: [],
    toLeft: vi.fn(),
    toRight: vi.fn(),
    allToLeft: vi.fn(),
    allToRight: vi.fn(),
    setLeftSel: vi.fn(),
    setRightSel: vi.fn(),
  };

  const baseHookValue = {
    dataFeira: "",
    setDataFeira: mockSetDataFeira,
    comerciantes: mockComerciantes,
    itens: mockItens,
    toggleSel: mockToggleSel,
    loadingData: false,
    submitting: false,
    erro: null,
    handleConfirmar: mockHandleConfirmar,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useCadastrarFeira as Mock).mockReturnValue(baseHookValue);
  });

  it("deve renderizar os componentes com dados mapeados e formatados corretamente", () => {
    render(<CadastrarFeiraPage />);

    expect(screen.getByTestId("count-Comerciantes Elegíveis").textContent).toBe(
      "2",
    );
    expect(screen.getByTestId("count-Itens Elegíveis").textContent).toBe("2");

    const itemLabels = screen.getAllByTestId("item-label-Itens Elegíveis");
    expect(itemLabels[0].textContent).toBe("Item 1 (KG)");
    expect(itemLabels[1].textContent).toBe("Item 2 (UN)");
  });

  it("deve atualizar a data quando o input for alterado", () => {
    render(<CadastrarFeiraPage />);
    const input = screen.getByLabelText(/Data e Horário/i);

    fireEvent.change(input, { target: { value: "2026-05-20T10:00" } });
    expect(mockSetDataFeira).toHaveBeenCalledWith("2026-05-20T10:00");
  });

  it("deve navegar para o dashboard ao clicar em cancelar", () => {
    render(<CadastrarFeiraPage />);
    const cancelBtn = screen.getByRole("button", { name: /Cancelar/i });

    fireEvent.click(cancelBtn);
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("deve chamar handleConfirmar ao clicar em confirmar", () => {
    render(<CadastrarFeiraPage />);
    const confirmBtn = screen.getByRole("button", { name: /Confirmar/i });

    fireEvent.click(confirmBtn);
    expect(mockHandleConfirmar).toHaveBeenCalled();
  });

  it("deve passar o estado loadingData para as TransferLists", () => {
    (useCadastrarFeira as Mock).mockReturnValue({
      ...baseHookValue,
      loadingData: true,
    });

    render(<CadastrarFeiraPage />);
    const loadingIndicators = screen.getAllByTestId("loading");
    expect(loadingIndicators.length).toBeGreaterThan(0);
    expect(loadingIndicators[0].textContent).toBe("Carregando...");
  });

  it("deve disparar toggleSel corretamente para Comerciantes", () => {
    render(<CadastrarFeiraPage />);

    fireEvent.click(screen.getByTestId("select-left-Comerciantes Elegíveis"));
    expect(mockToggleSel).toHaveBeenCalledWith(
      "item-1",
      mockComerciantes.leftSel,
      mockComerciantes.setLeftSel,
    );

    fireEvent.click(screen.getByTestId("select-right-Comerciantes Elegíveis"));
    expect(mockToggleSel).toHaveBeenCalledWith(
      "item-2",
      mockComerciantes.rightSel,
      mockComerciantes.setRightSel,
    );
  });

  it("deve disparar toggleSel corretamente para Itens", () => {
    render(<CadastrarFeiraPage />);

    fireEvent.click(screen.getByTestId("select-left-Itens Elegíveis"));
    expect(mockToggleSel).toHaveBeenCalledWith(
      "item-1",
      mockItens.leftSel,
      mockItens.setLeftSel,
    );
  });

  it("deve encaminhar ações de movimento para o hook (Comerciantes)", () => {
    render(<CadastrarFeiraPage />);

    fireEvent.click(screen.getByTestId("move-right-Comerciantes Elegíveis"));
    expect(mockComerciantes.toRight).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("move-left-Comerciantes Elegíveis"));
    expect(mockComerciantes.toLeft).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("all-right-Comerciantes Elegíveis"));
    expect(mockComerciantes.allToRight).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("all-left-Comerciantes Elegíveis"));
    expect(mockComerciantes.allToLeft).toHaveBeenCalled();
  });

  it("deve encaminhar ações de movimento para o hook (Itens)", () => {
    render(<CadastrarFeiraPage />);

    fireEvent.click(screen.getByTestId("move-right-Itens Elegíveis"));
    expect(mockItens.toRight).toHaveBeenCalled();
  });

  it("deve lidar com o estado de submissão desabilitando interações", () => {
    (useCadastrarFeira as Mock).mockReturnValue({
      ...baseHookValue,
      submitting: true,
    });

    render(<CadastrarFeiraPage />);
    const confirmBtn = screen.getByText("Salvando...");
    expect(confirmBtn).toBeInTheDocument();
  });

  it("deve lidar com erros de borda: listas nulas ou vazias do hook", () => {
    (useCadastrarFeira as Mock).mockReturnValue({
      ...baseHookValue,
      comerciantes: { ...mockComerciantes, left: [], right: [] },
      itens: { ...mockItens, left: [], right: [] },
    });

    render(<CadastrarFeiraPage />);
    expect(screen.getByTestId("count-Comerciantes Elegíveis").textContent).toBe(
      "0",
    );
    expect(
      screen.queryByTestId("item-label-Comerciantes Elegíveis"),
    ).not.toBeInTheDocument();
  });

  it("deve verificar a formatação de data no preview e não mostrar se vazio", () => {
    const { rerender } = render(<CadastrarFeiraPage />);
    expect(screen.queryByText("Agendado para")).not.toBeInTheDocument();

    (useCadastrarFeira as Mock).mockReturnValue({
      ...baseHookValue,
      dataFeira: "2026-12-31T23:59",
    });

    rerender(<CadastrarFeiraPage />);
    expect(screen.getByText("31 de dezembro de 2026")).toBeInTheDocument();
    expect(screen.getByText("23:59")).toBeInTheDocument();
  });

  it("deve exibir alerta de erro com animação de shake", () => {
    (useCadastrarFeira as Mock).mockReturnValue({
      ...baseHookValue,
      erro: "Falha Crítica",
    });

    render(<CadastrarFeiraPage />);
    const alert = screen.getByText("Falha Crítica");
    expect(alert.closest(".animate-shake")).toBeInTheDocument();
  });

  it("deve garantir que o PageHeader receba as props corretas", () => {
    render(<CadastrarFeiraPage />);
    expect(screen.getByText("Cadastrar Feira")).toBeInTheDocument();
    expect(screen.getByText(/Preencha as informações/i)).toBeInTheDocument();
  });
});
