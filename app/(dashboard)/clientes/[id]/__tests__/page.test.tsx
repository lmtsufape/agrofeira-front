import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditarClientePage from "../page";

// Mock do componente ClienteEdit
vi.mock("@/features/clientes/components/ClienteEdit", () => ({
  ClienteEdit: ({ clienteId }: { clienteId: string }) => (
    <div data-testid="cliente-edit">Mocked Cliente Edit - ID: {clienteId}</div>
  ),
}));

describe("EditarClientePage", () => {
  it("deve renderizar o componente ClienteEdit com o ID correto extraído dos params", async () => {
    const mockParams = Promise.resolve({ id: "client-123" });

    // Como a página é um async component que retorna JSX, podemos renderizá-lo e aguardar
    const Page = await EditarClientePage({ params: mockParams });
    render(Page);

    const editComponent = screen.getByTestId("cliente-edit");
    expect(editComponent).toBeInTheDocument();
    expect(editComponent).toHaveTextContent(
      "Mocked Cliente Edit - ID: client-123",
    );
  });

  it("deve lidar corretamente com a falha na resolução dos params", async () => {
    const mockParams = Promise.reject(new Error("Param error"));

    // Testamos se a Promise rejeita conforme esperado se o Next.js não capturar o erro antes
    await expect(EditarClientePage({ params: mockParams })).rejects.toThrow(
      "Param error",
    );
  });
});
