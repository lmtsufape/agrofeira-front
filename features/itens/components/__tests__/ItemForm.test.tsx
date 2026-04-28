import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { ItemForm } from "../ItemForm";
import { itemService } from "../../api/itens.service";
import { useRouter } from "next/navigation";

// Mock do service
vi.mock("../../api/itens.service", () => ({
  itemService: {
    create: vi.fn(),
    getOpcoes: vi.fn(),
  },
}));

// Mock do next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("ItemForm Component", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush, back: mockBack });
    (itemService.getOpcoes as Mock).mockResolvedValue({
      categorias: [{ value: "HORTIFRUTI", label: "Hortifrúti" }],
      unidadesMedida: [{ value: "QUILO", label: "Quilograma (kg)" }],
    });
  });

  it("deve renderizar os campos corretamente", async () => {
    render(<ItemForm />);

    expect(screen.getByLabelText(/Nome do Item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unidade de Medida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preço Base/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hortifrúti")).toBeInTheDocument();
      expect(screen.getByText("Quilograma (kg)")).toBeInTheDocument();
    });
  });

  it("deve validar campos obrigatórios", async () => {
    const { container } = render(<ItemForm />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("Todos os campos marcados com * são obrigatórios!"),
      ).toBeInTheDocument();
    });
  });

  it("deve formatar o preço enquanto digita", async () => {
    render(<ItemForm />);

    const priceInput = screen.getByLabelText(/Preço Base/i) as HTMLInputElement;

    fireEvent.change(priceInput, { target: { value: "123" } });
    expect(priceInput.value).toBe("1,23");

    fireEvent.change(priceInput, { target: { value: "123456" } });
    expect(priceInput.value).toBe("1.234,56");
  });

  it("deve enviar o formulário com dados formatados corretamente", async () => {
    (itemService.create as Mock).mockResolvedValue({});
    render(<ItemForm />);

    fireEvent.change(screen.getByLabelText(/Nome do Item/i), {
      target: { value: "Tomate" },
    });

    // Espera as opções carregarem para selecionar
    await waitFor(() => screen.getByText("Hortifrúti"));

    fireEvent.change(screen.getByLabelText(/Categoria/i), {
      target: { value: "HORTIFRUTI" },
    });
    fireEvent.change(screen.getByLabelText(/Unidade de Medida/i), {
      target: { value: "QUILO" },
    });

    const priceInput = screen.getByLabelText(/Preço Base/i);
    fireEvent.change(priceInput, { target: { value: "1050" } }); // 10,50

    const submitButton = screen.getByText("Confirmar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(itemService.create).toHaveBeenCalledWith({
        nome: "Tomate",
        categoria: "HORTIFRUTI",
        unidadeMedida: "QUILO",
        precoBase: 10.5,
      });
    });
  });
});
