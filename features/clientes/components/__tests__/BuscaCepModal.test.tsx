import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { BuscaCepModal } from "../BuscaCepModal";

describe("BuscaCepModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("não deve renderizar quando isOpen for false", () => {
    render(
      <BuscaCepModal
        isOpen={false}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("deve renderizar quando isOpen for true", () => {
    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("deve validar tamanho mínimo do termo de busca", async () => {
    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    const input = screen.getByPlaceholderText(/Ex: Alipio Medeiros/i);
    fireEvent.change(input, { target: { value: "ab" } });

    const searchButton = screen.getByRole("button", { name: "" }); // Search button has no text, only icon
    fireEvent.click(searchButton);

    expect(
      screen.getByText(/Digite pelo menos 3 caracteres do logradouro/i),
    ).toBeInTheDocument();
  });

  it("deve buscar endereços e exibir resultados", async () => {
    const mockResults = [
      {
        cep: "55290-000",
        logradouro: "Rua Teste",
        bairro: "Centro",
        localidade: "Garanhuns",
        uf: "PE",
      },
    ];

    (global.fetch as Mock).mockResolvedValue({
      json: async () => mockResults,
    });

    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    const input = screen.getByPlaceholderText(/Ex: Alipio Medeiros/i);
    fireEvent.change(input, { target: { value: "Rua Teste" } });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(screen.getByText("55290-000")).toBeInTheDocument();
      expect(screen.getByText("Rua Teste")).toBeInTheDocument();
    });
  });

  it("deve chamar onSelect e onClose ao selecionar um endereço", async () => {
    const mockAddress = {
      cep: "55290-000",
      logradouro: "Rua Teste",
      bairro: "Centro",
      localidade: "Garanhuns",
      uf: "PE",
    };

    (global.fetch as Mock).mockResolvedValue({
      json: async () => [mockAddress],
    });

    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Ex: Alipio Medeiros/i), {
      target: { value: "Rua Teste" },
    });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      const resultButton = screen.getByText("55290-000").closest("button");
      fireEvent.click(resultButton!);
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockAddress);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("deve lidar com nenhum resultado encontrado", async () => {
    (global.fetch as Mock).mockResolvedValue({
      json: async () => [],
    });

    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Ex: Alipio Medeiros/i), {
      target: { value: "Rua Inexistente" },
    });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Nenhum endereço encontrado em Garanhuns/i),
      ).toBeInTheDocument();
    });
  });

  it("deve lidar com erro na API", async () => {
    (global.fetch as Mock).mockRejectedValue(new Error("Network error"));

    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/Ex: Alipio Medeiros/i), {
      target: { value: "Rua Teste" },
    });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao buscar endereços. Tente novamente/i),
      ).toBeInTheDocument();
    });
  });

  it("deve fechar ao clicar no botão fechar", () => {
    render(
      <BuscaCepModal
        isOpen={true}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
