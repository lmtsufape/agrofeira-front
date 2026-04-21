import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import ComercianteItemPage from "../page";
import { useDetalhamentoComerciante } from "@/features/feiras/hooks/useDetalhamentoComerciante";
import { useAuth } from "@/features/auth/contexts/AuthContext";

vi.mock("@/features/feiras/hooks/useDetalhamentoComerciante");
vi.mock("@/features/auth/contexts/AuthContext");
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams({ feiraId: "123" }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

vi.mock("@/features/feiras/components/ComercianteDropdown", () => ({
  ComercianteDropdown: () => <div data-testid="comerciante-dropdown" />,
}));
vi.mock("@/features/feiras/components/BancaItemTable", () => ({
  BancaItemTable: () => <div data-testid="banca-table" />,
}));

describe("ComercianteItemPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ token: "test-token" });
  });

  it("deve mostrar estado vazio se nenhuma banca estiver selecionada", () => {
    (useDetalhamentoComerciante as Mock).mockReturnValue({
      bancas: [{ id: "1" }],
      selected: null,
      loading: false,
      erro: null,
    });

    render(<ComercianteItemPage />);
    expect(
      screen.getByText("Nenhum comerciante selecionado"),
    ).toBeInTheDocument();
  });

  it("deve renderizar a tabela se uma banca for selecionada", () => {
    (useDetalhamentoComerciante as Mock).mockReturnValue({
      bancas: [{ id: "1" }],
      selected: { id: "1", comercianteNome: "Banca do Zé", itens: [] },
      loading: false,
      erro: null,
    });

    render(<ComercianteItemPage />);
    expect(screen.getByTestId("banca-table")).toBeInTheDocument();
  });
});
