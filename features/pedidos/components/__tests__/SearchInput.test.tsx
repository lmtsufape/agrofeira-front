import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchInput } from "../SearchInput";

describe("SearchInput Component", () => {
  it("deve renderizar com o valor inicial e placeholder", () => {
    render(
      <SearchInput
        value="test"
        onChange={vi.fn()}
        placeholder="Custom Placeholder"
      />,
    );

    const input = screen.getByPlaceholderText(
      "Custom Placeholder",
    ) as HTMLInputElement;
    expect(input.value).toBe("test");
  });

  it("deve chamar onChange ao digitar", () => {
    const mockOnChange = vi.fn();
    render(<SearchInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("Buscar...");
    fireEvent.change(input, { target: { value: "new search" } });

    expect(mockOnChange).toHaveBeenCalledWith("new search");
  });
});
