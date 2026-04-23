import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ComercianteDetailsPage from "../page";

// Mock do componente ComercianteDetails
vi.mock("@/features/comerciantes/components/ComercianteDetails", () => ({
  ComercianteDetails: ({ comercianteId }: { comercianteId: string }) => (
    <div data-testid="comerciante-details">
      Mocked Comerciante Details - ID: {comercianteId}
    </div>
  ),
}));

describe("ComercianteDetailsPage", () => {
  it("deve renderizar o componente ComercianteDetails com o ID correto extraído dos params", async () => {
    const mockParams = Promise.resolve({ id: "merchant-789" });

    const Page = await ComercianteDetailsPage({ params: mockParams });
    render(Page);

    const detailsComponent = screen.getByTestId("comerciante-details");
    expect(detailsComponent).toBeInTheDocument();
    expect(detailsComponent).toHaveTextContent(
      "Mocked Comerciante Details - ID: merchant-789",
    );
  });

  it("deve lidar com falha na resolução dos params", async () => {
    const mockParams = Promise.reject(new Error("Param failure"));
    await expect(
      ComercianteDetailsPage({ params: mockParams }),
    ).rejects.toThrow("Param failure");
  });
});
