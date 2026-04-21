import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import RootPage from "../page";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("RootPage (Server Component)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve redirecionar para /dashboard se o token existir", async () => {
    (cookies as Mock).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "valid-token" }),
    });

    await RootPage();

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("deve redirecionar para /login se o token não existir", async () => {
    (cookies as Mock).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    await RootPage();

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
