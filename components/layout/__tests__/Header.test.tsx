import { render, screen, fireEvent } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import Header from "../Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";

// Mocks
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/features/auth/contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Header", () => {
  const mockPush = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
    (useAuth as Mock).mockReturnValue({ logout: mockLogout });
  });

  it("deve renderizar o nome da plataforma", () => {
    render(<Header />);
    expect(screen.getByText("EcoFeira")).toBeInTheDocument();
  });

  it("deve chamar logout e redirecionar ao clicar em sair", () => {
    render(<Header />);
    const logoutButton = screen.getByText("Sair");
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("deve redirecionar para a home ao clicar no logo", () => {
    render(<Header />);
    const logoButton = screen.getByRole("button", { name: /logo ecofeira/i });
    fireEvent.click(logoButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
