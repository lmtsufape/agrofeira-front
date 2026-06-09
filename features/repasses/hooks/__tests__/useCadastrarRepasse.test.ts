import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useCadastrarRepasse } from "../useCadastrarRepasse";
import { feiraService } from "@/features/feiras/api/feiras.service";
import { repasseService } from "@/features/repasses/api/repasses.service";
import { ComercianteRateioDTO } from "@/features/feiras/api/types";

vi.mock("@/features/feiras/api/feiras.service", () => ({
  feiraService: {
    getAll: vi.fn(),
    getRateio: vi.fn(),
  },
}));

vi.mock("@/features/repasses/api/repasses.service", () => ({
  repasseService: {
    listarPorFeira: vi.fn(),
    registrar: vi.fn(),
  },
}));

const mockFeiras = [
  { id: "f1", status: "ENCERRADA", dataHora: "2023-01-01" },
  { id: "f2", status: "ABERTA", dataHora: "2023-01-02" },
];

const mockRateio = {
  comerciantes: [
    {
      comerciante: { id: "c1", nome: "Comerciante 1" },
      produtos: [{ id: "p1", nome: "Produto 1" }],
    },
  ],
};

const mockRepasses = [{ id: "r1", rateioResultadoId: "p1" }];

describe("useCadastrarRepasse", () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (feiraService.getAll as Mock).mockResolvedValue({
      content: mockFeiras,
    });
  });

  it("deve carregar feiras encerradas ao montar", async () => {
    const { result } = renderHook(() => useCadastrarRepasse(onSuccess));

    expect(result.current.loadingFeiras).toBe(true);

    await act(async () => {
      // Aguarda o useEffect
    });

    expect(result.current.loadingFeiras).toBe(false);
    expect(result.current.feirasEncerradas).toHaveLength(1);
    expect(result.current.feirasEncerradas[0].id).toBe("f1");
  });

  it("deve selecionar uma feira e carregar rateio e repasses", async () => {
    (feiraService.getRateio as Mock).mockResolvedValue(mockRateio);
    (repasseService.listarPorFeira as Mock).mockResolvedValue(mockRepasses);

    const { result } = renderHook(() => useCadastrarRepasse(onSuccess));

    await act(async () => {
      await result.current.handleSelecionarFeira("f1");
    });

    expect(result.current.feiraId).toBe("f1");
    expect(result.current.rateio).toEqual(mockRateio);
    expect(result.current.loadingRateio).toBe(false);
    expect(feiraService.getRateio).toHaveBeenCalledWith("f1");
    expect(repasseService.listarPorFeira).toHaveBeenCalledWith("f1");
  });

  it("deve identificar se um comerciante já está registrado", async () => {
    (feiraService.getRateio as Mock).mockResolvedValue(mockRateio);
    (repasseService.listarPorFeira as Mock).mockResolvedValue(mockRepasses);

    const { result } = renderHook(() => useCadastrarRepasse(onSuccess));

    await act(async () => {
      await result.current.handleSelecionarFeira("f1");
    });

    const comerciante = mockRateio.comerciantes[0];
    const registrado = result.current.isComercianteRegistrado(
      comerciante as unknown as ComercianteRateioDTO,
    );

    expect(registrado).toBe(true);
  });

  it("deve registrar repasse com sucesso", async () => {
    (feiraService.getRateio as Mock).mockResolvedValue(mockRateio);
    (repasseService.listarPorFeira as Mock).mockResolvedValue([]); // Nenhum repasse ainda
    (repasseService.registrar as Mock).mockResolvedValue({});

    const { result } = renderHook(() => useCadastrarRepasse(onSuccess));

    await act(async () => {
      await result.current.handleSelecionarFeira("f1");
    });

    const comerciante = mockRateio.comerciantes[0];

    await act(async () => {
      await result.current.handleRegistrar(
        comerciante as unknown as ComercianteRateioDTO,
      );
    });

    expect(repasseService.registrar).toHaveBeenCalledWith("p1");
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.registrando).toBe(null);
  });

  it("deve lidar com erro ao registrar repasse", async () => {
    (feiraService.getRateio as Mock).mockResolvedValue(mockRateio);
    (repasseService.listarPorFeira as Mock).mockResolvedValue([]);
    (repasseService.registrar as Mock).mockRejectedValue(
      new Error("Erro ao registrar"),
    );

    const { result } = renderHook(() => useCadastrarRepasse(onSuccess));

    await act(async () => {
      await result.current.handleSelecionarFeira("f1");
    });

    const comerciante = mockRateio.comerciantes[0];

    await act(async () => {
      await result.current.handleRegistrar(
        comerciante as unknown as ComercianteRateioDTO,
      );
    });

    expect(result.current.erro).toBe("Erro ao registrar");
    expect(result.current.registrando).toBe(null);
  });
});
