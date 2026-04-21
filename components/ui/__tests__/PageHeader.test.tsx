import { render, screen, fireEvent } from "@testing-library/react";
import { PageHeader } from "../PageHeader";
import { useRouter } from "next/navigation";
import { vi, type Mock } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("PageHeader", () => {
  const mockBack = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ back: mockBack, push: mockPush });
  });

  it("deve renderizar título e subtítulo", () => {
    render(
      <PageHeader title="Título da Página" subtitle="Subtítulo da página" />,
    );
    expect(screen.getByText("Título da Página")).toBeInTheDocument();
    expect(screen.getByText("Subtítulo da página")).toBeInTheDocument();
  });

  it("deve chamar router.back() ao clicar no botão de voltar sem backHref", () => {
    render(<PageHeader title="Título" />);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("deve chamar router.push() ao clicar no botão de voltar com backHref", () => {
    render(<PageHeader title="Título" backHref="/dashboard" />);
    fireEvent.click(screen.getByRole("button", { name: /voltar/i }));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });
});
