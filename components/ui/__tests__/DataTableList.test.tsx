import { render, screen } from "@testing-library/react";
import { DataTableList } from "../DataTableList";

describe("DataTableList", () => {
  const mockColumns = [
    { label: "Coluna 1", icon: () => null, align: "left" as const },
    { label: "Coluna 2", icon: () => null, align: "right" as const },
    { label: "Coluna 3", icon: () => null, align: "center" as const },
    { label: "Coluna 4", icon: () => null, align: "left" as const },
  ];

  const mockData = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
  ];

  it("deve renderizar os cabeçalhos corretamente", () => {
    render(
      <DataTableList
        data={mockData}
        columns={mockColumns}
        mobileHeaderTitle="Título Mobile"
        getKey={(item) => item.id}
        renderRowDesktop={(item) => <div key={item.id}>{item.name}</div>}
        renderRowMobile={(item) => <div key={item.id}>{item.name}</div>}
      />,
    );

    expect(screen.getByText("Coluna 1")).toBeInTheDocument();
    expect(screen.getByText("Título Mobile")).toBeInTheDocument();
  });

  it("deve renderizar as linhas de dados corretamente", () => {
    render(
      <DataTableList
        data={mockData}
        columns={mockColumns}
        mobileHeaderTitle="Título Mobile"
        getKey={(item) => item.id}
        renderRowDesktop={(item) => <div>{item.name}</div>}
        renderRowMobile={(item) => <div>{item.name}</div>}
      />,
    );

    expect(screen.getAllByText("Item 1")).toHaveLength(2); // Desktop e Mobile
    expect(screen.getAllByText("Item 2")).toHaveLength(2);
  });

  it("deve renderizar o rodapé se fornecido", () => {
    render(
      <DataTableList
        data={mockData}
        columns={mockColumns}
        mobileHeaderTitle="Título Mobile"
        getKey={(item) => item.id}
        renderRowDesktop={(item) => <div>{item.name}</div>}
        renderRowMobile={(item) => <div>{item.name}</div>}
        renderFooterDesktop={() => <div>Rodapé Desktop</div>}
        renderFooterMobile={() => <div>Rodapé Mobile</div>}
      />,
    );

    expect(screen.getByText("Rodapé Desktop")).toBeInTheDocument();
    expect(screen.getByText("Rodapé Mobile")).toBeInTheDocument();
  });

  it("deve renderizar nada se o array de dados estiver vazio", () => {
    const { container } = render(
      <DataTableList
        data={[]}
        columns={mockColumns}
        mobileHeaderTitle="Título Mobile"
        getKey={(item) => item.id}
        renderRowDesktop={(item) => <div>{item.name}</div>}
        renderRowMobile={(item) => <div>{item.name}</div>}
      />,
    );

    // Deve renderizar apenas o cabeçalho
    expect(screen.getByText("Coluna 1")).toBeInTheDocument();
    expect(container.querySelectorAll(".bg-white > div")).toHaveLength(0);
  });
});
