import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InfoCard } from "../InfoCard";
import { User } from "lucide-react";

describe("InfoCard Component", () => {
  it("deve renderizar o label e o valor corretamente", () => {
    render(<InfoCard icon={User} label="TEST LABEL" value="Test Value" />);

    expect(screen.getByText("TEST LABEL")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("deve truncar valores muito longos (verificação visual via classe)", () => {
    render(
      <InfoCard
        icon={User}
        label="L"
        value="Extremely Long Value That Should Truncate"
      />,
    );
    const valueElement = screen.getByText(
      "Extremely Long Value That Should Truncate",
    );
    expect(valueElement).toHaveClass("truncate");
  });
});
