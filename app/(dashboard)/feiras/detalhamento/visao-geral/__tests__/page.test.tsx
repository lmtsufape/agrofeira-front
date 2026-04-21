import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import FeiraDetalhamentoVisaoGeral from "../page";
import { useVisaoGeralFeira } from "@/features/feiras/hooks/useVisaoGeralFeira";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

vi.mock("@/features/feiras/hooks/useVisaoGeralFeira");
vi.mock("next/navigation");
vi.mock("@/features/auth/contexts/AuthContext");

describe("FeiraDetalhamentoVisaoGeral", () => {
  const mockPush = vi.fn();
  const mockSearchParams = new URLSearchParams({ feiraId: "123" });

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as Mock).mockReturnValue(mockSearchParams);
    (useAuth as Mock).mockReturnValue({ token: "test-token" });
  });

  it("deve exibir loader enquanto estiver carregando", () => {
    (useVisaoGeralFeira as Mock).mockReturnValue({
      resumo: null,
      loading: true,
      erro: null,
    });

    const { container } = render(<FeiraDetalhamentoVisaoGeral />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("deve exibir mensagem de erro se o resumo for nulo após carregar", () => {
    (useVisaoGeralFeira as Mock).mockReturnValue({
      resumo: null,
      loading: false,
      erro: "Falha na API",
    });

    render(<FeiraDetalhamentoVisaoGeral />);
    expect(
      screen.getByText("Erro ao carregar dados do resumo."),
    ).toBeInTheDocument();
  });

  it("deve renderizar as tabelas de resumo em caso de sucesso", () => {
    const mockResumo = {
      dataFeira: "25/12/2024",
      localidade: "Centro",
      items: [{ id: "1", nome: "Tomate" }],
      comerciantes: [{ id: "1", nome: "João" }],
      clientes: [{ id: "1", nome: "Maria" }],
    };

    (useVisaoGeralFeira as Mock).mockReturnValue({
      resumo: mockResumo,
      loading: false,
      erro: null,
    });

    render(<FeiraDetalhamentoVisaoGeral />);

    expect(screen.getByText(/Visão Geral/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Detalhes da feira realizada em 25\/12\/2024 - Centro/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Tomate")).toBeInTheDocument();
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("deve navegar para o detalhamento específico ao clicar em detalhar", () => {
    const mockResumo = {
      dataFeira: "25/12/2024",
      localidade: "Centro",
      items: [{ id: "1", nome: "Tomate" }],
      comerciantes: [],
      clientes: [],
    };

    (useVisaoGeralFeira as Mock).mockReturnValue({
      resumo: mockResumo,
      loading: false,
      erro: null,
    });

    render(<FeiraDetalhamentoVisaoGeral />);

    const detailButtons = screen.getAllByText("Detalhar");
    fireEvent.click(detailButtons[0]);

    expect(mockPush).toHaveBeenCalledWith(
      "/feiras/detalhamento/item-comerciante?feiraId=123",
    );
  });
});
