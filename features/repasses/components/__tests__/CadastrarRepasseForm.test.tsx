import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { CadastrarRepasseForm } from "../CadastrarRepasseForm";
import { useCadastrarRepasse } from "@/features/repasses/hooks/useCadastrarRepasse";

vi.mock("@/features/repasses/hooks/useCadastrarRepasse");

const mockFeiras = [
  { id: "f1", dataHora: "2023-01-01T10:00:00Z", status: "ENCERRADA" },
];

const mockRateio = {
  comerciantes: [
    {
      comerciante: { id: "c1", nome: "Comerciante Teste" },
      produtos: [
        { id: "p1", produto: { nome: "Produto 1" }, valorBrutoVenda: 100 },
      ],
      totalBrutoVenda: 100,
    },
  ],
};

describe("CadastrarRepasseForm", () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve exibir carregando feiras inicialmente", () => {
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: [],
      feiraId: "",
      handleSelecionarFeira: vi.fn(),
      rateio: null,
      loadingFeiras: true,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);
    expect(screen.getByText(/Carregando feiras.../i)).toBeDefined();
  });

  it("deve exibir mensagem quando não houver feiras encerradas", () => {
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: [],
      feiraId: "",
      handleSelecionarFeira: vi.fn(),
      rateio: null,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);
    expect(
      screen.getByText(/Nenhuma feira encerrada encontrada/i),
    ).toBeDefined();
  });

  it("deve permitir selecionar uma feira", () => {
    const handleSelecionarFeira = vi.fn();
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: mockFeiras,
      feiraId: "",
      handleSelecionarFeira,
      rateio: null,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "f1" } });

    expect(handleSelecionarFeira).toHaveBeenCalledWith("f1");
  });

  it("deve exibir o rateio quando uma feira for selecionada", () => {
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: mockFeiras,
      feiraId: "f1",
      handleSelecionarFeira: vi.fn(),
      rateio: mockRateio,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(() => false),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);

    expect(screen.getByText("Comerciante Teste")).toBeDefined();
    expect(screen.getByText("Confirmar Repasse")).toBeDefined();
  });

  it("deve chamar handleRegistrar ao clicar no botão de confirmar", () => {
    const handleRegistrar = vi.fn();
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: mockFeiras,
      feiraId: "f1",
      handleSelecionarFeira: vi.fn(),
      rateio: mockRateio,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(() => false),
      handleRegistrar,
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);

    const button = screen.getByText("Confirmar Repasse");
    fireEvent.click(button);

    expect(handleRegistrar).toHaveBeenCalledWith(mockRateio.comerciantes[0]);
  });

  it("deve exibir estado de pago quando comerciante estiver registrado", () => {
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: mockFeiras,
      feiraId: "f1",
      handleSelecionarFeira: vi.fn(),
      rateio: mockRateio,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: null,
      isComercianteRegistrado: vi.fn(() => true),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);

    expect(screen.getByText("Pago")).toBeDefined();
    expect(screen.queryByText("Confirmar Repasse")).toBeNull();
  });

  it("deve exibir erro se houver", () => {
    (useCadastrarRepasse as Mock).mockReturnValue({
      feirasEncerradas: mockFeiras,
      feiraId: "",
      handleSelecionarFeira: vi.fn(),
      rateio: null,
      loadingFeiras: false,
      loadingRateio: false,
      registrando: null,
      erro: "Erro de teste",
      isComercianteRegistrado: vi.fn(),
      handleRegistrar: vi.fn(),
    });

    render(<CadastrarRepasseForm onSuccess={onSuccess} />);
    expect(screen.getByText("Erro de teste")).toBeDefined();
  });
});
