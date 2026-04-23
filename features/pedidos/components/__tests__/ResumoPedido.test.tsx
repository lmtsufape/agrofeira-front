import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ResumoPedido } from "../ResumoPedido";
import { useResumoPedido } from "../../hooks/useResumoPedido";
import { useRouter, useSearchParams } from "next/navigation";

vi.mock("../../hooks/useResumoPedido");
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("ResumoPedido Component", () => {
  const mockPush = vi.fn();
  const mockFinalizar = vi.fn();

  const defaultHookReturn = {
    itensCarrinho: [],
    opcaoRetirada: "local",
    setOpcaoRetirada: vi.fn(),
    enderecoModal: false,
    setEnderecoModal: vi.fn(),
    pedidoRealizado: false,
    endereco: { rua: "", numero: "" },
    setEndereco: vi.fn(),
    valorTotal: 0,
    handleQuantidadeChange: vi.fn(),
    handleRemover: vi.fn(),
    finalizarPedido: mockFinalizar,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: vi.fn() });
    (useSearchParams as Mock).mockReturnValue({
      get: vi.fn((key) => {
        if (key === "itens") return "1:2";
        if (key === "feiraNome") return "15/04/2026 - Garanhuns";
        return null;
      }),
    });
  });

  it("deve renderizar itens do carrinho e valor total", () => {
    (useResumoPedido as Mock).mockReturnValue({
      ...defaultHookReturn,
      itensCarrinho: [
        {
          id: "1",
          nome: "Tomate",
          quantidade: 2,
          preco: 5.0,
          unidadeMedida: "Kg",
        },
      ],
      valorTotal: 10.0,
    });

    render(<ResumoPedido />);
    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,00")).toBeInTheDocument();
  });

  it("deve abrir modal de endereço ao selecionar Endereço Específico", () => {
    const mockSetEnderecoModal = vi.fn();
    (useResumoPedido as Mock).mockReturnValue({
      ...defaultHookReturn,
      setEnderecoModal: mockSetEnderecoModal,
    });

    render(<ResumoPedido />);
    fireEvent.click(screen.getByText("Endereço Específico"));
    expect(mockSetEnderecoModal).toHaveBeenCalledWith(true);
  });

  it("deve chamar finalizarPedido ao clicar no botão Finalizar", () => {
    (useResumoPedido as Mock).mockReturnValue({
      ...defaultHookReturn,
      itensCarrinho: [{ id: "1", nome: "Tomate", quantidade: 2 }],
    });

    render(<ResumoPedido />);
    fireEvent.click(screen.getByText("Finalizar"));
    expect(mockFinalizar).toHaveBeenCalled();
  });

  it("deve mostrar modal de sucesso quando o pedido for realizado", () => {
    (useResumoPedido as Mock).mockReturnValue({
      ...defaultHookReturn,
      pedidoRealizado: true,
    });

    render(<ResumoPedido />);
    expect(
      screen.getByText("Pedido Realizado com Sucesso!"),
    ).toBeInTheDocument();
  });

  it("deve exibir endereço selecionado quando a opção for endereço", () => {
    (useResumoPedido as Mock).mockReturnValue({
      ...defaultHookReturn,
      opcaoRetirada: "endereco",
      endereco: {
        rua: "Rua A",
        numero: "123",
        bairro: "Centro",
        cidade: "Garanhuns",
        estado: "PE",
        cep: "55290-000",
      },
    });

    render(<ResumoPedido />);
    expect(screen.getByText("Rua A, 123")).toBeInTheDocument();
    expect(screen.getByText("Garanhuns, PE")).toBeInTheDocument();
  });
});
