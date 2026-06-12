import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RepassesTable } from "../RepassesTable";
import { type RepasseDTO } from "@/features/repasses/api/types";

const mockRepasses: RepasseDTO[] = [
  {
    id: "r1",
    rateioResultadoId: "rr1",
    comerciante: { id: "c1", nome: "Comerciante A", email: "a@test.com" },
    feiraId: "f1",
    produtoNome: "Produto 1",
    produtoUnidade: "KG",
    quantidadeVendida: 10,
    valorBruto: 100,
    valorLiquido: 90,
    status: "PAGO",
    repassadoEm: "2023-01-01T10:00:00Z",
    criadoEm: "2023-01-01T09:00:00Z",
  },
  {
    id: "r2",
    rateioResultadoId: "rr2",
    comerciante: { id: "c1", nome: "Comerciante A", email: "a@test.com" },
    feiraId: "f1",
    produtoNome: "Produto 2",
    produtoUnidade: "UN",
    quantidadeVendida: 5,
    valorBruto: 50,
    valorLiquido: 45,
    status: "PAGO",
    repassadoEm: "2023-01-01T10:00:00Z",
    criadoEm: "2023-01-01T09:00:00Z",
  },
  {
    id: "r3",
    rateioResultadoId: "rr3",
    comerciante: { id: "c2", nome: "Comerciante B", email: "b@test.com" },
    feiraId: "f1",
    produtoNome: "Produto 3",
    produtoUnidade: "MAÇO",
    quantidadeVendida: 2,
    valorBruto: 20,
    valorLiquido: 18,
    status: "PENDENTE",
    repassadoEm: null,
    criadoEm: "2023-01-01T09:00:00Z",
  },
];

describe("RepassesTable", () => {
  it("deve agrupar repasses por comerciante e feira", () => {
    render(<RepassesTable repasses={mockRepasses} />);

    // Deve haver 2 linhas no tbody (Comerciante A e Comerciante B)
    // Como adicionamos role="button" nas tr, elas são encontradas como buttons
    const rows = screen.getAllByRole("button");
    expect(rows).toHaveLength(2);

    expect(screen.getByText("Comerciante A")).toBeDefined();
    expect(screen.getByText("Comerciante B")).toBeDefined();
  });

  it("deve exibir totais corretos por grupo", () => {
    render(<RepassesTable repasses={mockRepasses} />);

    // Comerciante A: 100 + 50 = 150 bruto, 90 + 45 = 135 líquido
    expect(screen.getByText("R$ 150,00")).toBeDefined();
    expect(screen.getByText("R$ 135,00")).toBeDefined();

    // Comerciante B: 20 bruto, 18 líquido
    expect(screen.getByText("R$ 20,00")).toBeDefined();
    expect(screen.getByText("R$ 18,00")).toBeDefined();
  });

  it("deve exibir o status correto", () => {
    render(<RepassesTable repasses={mockRepasses} />);

    expect(screen.getByText("Pago")).toBeDefined();
    expect(screen.getByText("Pendente")).toBeDefined();
  });

  it("deve abrir o modal ao clicar em uma linha", () => {
    render(<RepassesTable repasses={mockRepasses} />);

    const row = screen.getByText("Comerciante A").closest("tr")!;
    fireEvent.click(row);

    // Verifica se o modal abriu exibindo os produtos do Comerciante A
    expect(screen.getByText("Produto 1")).toBeDefined();
    expect(screen.getByText("Produto 2")).toBeDefined();
    expect(screen.queryByText("Produto 3")).toBeNull();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    render(<RepassesTable repasses={mockRepasses} />);

    const row = screen.getByText("Comerciante A").closest("tr")!;
    fireEvent.click(row);

    // O modal tem um botão com ícone X, e o backdrop também é um botão agora.
    // O botão de fechar (X) é o que queremos.
    const closeButton = screen
      .getAllByRole("button")
      .find((btn) => btn.querySelector("svg"));
    fireEvent.click(closeButton!);

    expect(screen.queryByText("Produto 1")).toBeNull();
  });
});
