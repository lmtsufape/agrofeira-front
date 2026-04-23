import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { SelecionarParticipante } from "../SelecionarParticipante";
import { useSelecionarParticipante } from "../../hooks/useSelecionarParticipante";
import { useRouter } from "next/navigation";

vi.mock("../../hooks/useSelecionarParticipante");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("SelecionarParticipante Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  const defaultHookReturn = {
    filteredParticipantes: [],
    searchTerm: "",
    setSearchTerm: vi.fn(),
    selectedParticipante: null,
    setSelectedParticipante: vi.fn(),
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
  });

  it("deve exibir carregamento", () => {
    (useSelecionarParticipante as Mock).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });
    render(<SelecionarParticipante />);
    expect(screen.getByText("Carregando participantes...")).toBeInTheDocument();
  });

  it("deve renderizar lista de participantes", () => {
    const mockParticipantes = [
      { id: "1", nome: "João Silva", tipo: "cliente" },
      { id: "2", nome: "Carlos Comerciante", tipo: "comerciante" },
    ];
    (useSelecionarParticipante as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredParticipantes: mockParticipantes,
    });

    render(<SelecionarParticipante />);
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Carlos Comerciante")).toBeInTheDocument();
  });

  it("deve chamar setSelectedParticipante ao clicar em um participante", () => {
    const mockSetSelected = vi.fn();
    const mockParticipante = { id: "1", nome: "João Silva", tipo: "cliente" };
    (useSelecionarParticipante as Mock).mockReturnValue({
      ...defaultHookReturn,
      filteredParticipantes: [mockParticipante],
      setSelectedParticipante: mockSetSelected,
    });

    render(<SelecionarParticipante />);
    fireEvent.click(screen.getByText("João Silva"));
    expect(mockSetSelected).toHaveBeenCalledWith(mockParticipante);
  });

  it("deve navegar para próxima etapa ao clicar no botão Próximo", () => {
    (useSelecionarParticipante as Mock).mockReturnValue({
      ...defaultHookReturn,
      selectedParticipante: { id: "1", nome: "João Silva", tipo: "cliente" },
    });

    render(<SelecionarParticipante />);
    fireEvent.click(screen.getByText("Próximo"));
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining("/pedidos/itens?participante=1&tipo=cliente"),
    );
  });

  it("deve desabilitar botão Próximo se nenhum participante estiver selecionado", () => {
    (useSelecionarParticipante as Mock).mockReturnValue(defaultHookReturn);
    render(<SelecionarParticipante />);
    expect(screen.getByRole("button", { name: /Próximo/i })).toBeDisabled();
  });
});
