import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useFormSubmit } from "../useFormSubmit";
import { useRouter } from "next/navigation";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("useFormSubmit", () => {
  const mockPush = vi.fn();
  const initialValues = { nome: "Teste" };
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue({ push: mockPush });
  });

  it("deve inicializar com os valores corretos", () => {
    const { result } = renderHook(() =>
      useFormSubmit({ initialValues, onSubmit }),
    );

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.submitting).toBe(false);
    expect(result.current.erro).toBe(null);
  });

  it("deve atualizar formData ao chamar handleInputChange", () => {
    const { result } = renderHook(() =>
      useFormSubmit({ initialValues, onSubmit }),
    );

    act(() => {
      result.current.handleInputChange({
        target: { name: "nome", value: "Novo Nome" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe("Novo Nome");
  });

  it("deve chamar onSubmit e navegar em caso de sucesso", async () => {
    onSubmit.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() =>
      useFormSubmit({
        initialValues,
        onSubmit,
        onSuccessRoute: "/sucesso",
      }),
    );

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
    expect(mockPush).toHaveBeenCalledWith("/sucesso");
    expect(result.current.submitting).toBe(false);
  });

  it("deve setar erro se a validação falhar", async () => {
    const validate = vi.fn().mockReturnValue("Erro de validação");
    const { result } = renderHook(() =>
      useFormSubmit({ initialValues, onSubmit, validate }),
    );

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe("Erro de validação");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it("deve lidar com erros no onSubmit", async () => {
    const error = new Error("Erro da API");
    onSubmit.mockRejectedValueOnce(error);
    const { result } = renderHook(() =>
      useFormSubmit({ initialValues, onSubmit }),
    );

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe("Erro da API");
    expect(result.current.submitting).toBe(false);
  });

  it("deve usar o fallback de erro se o erro não for instância de Error", async () => {
    onSubmit.mockRejectedValueOnce("Erro genérico");
    const { result } = renderHook(() =>
      useFormSubmit({
        initialValues,
        onSubmit,
        errorMessageFallback: "Erro Customizado",
      }),
    );

    const event = {
      preventDefault: vi.fn(),
    } as unknown as React.SyntheticEvent<HTMLFormElement>;

    await act(async () => {
      await result.current.handleSubmit(event);
    });

    expect(result.current.erro).toBe("Erro Customizado");
  });

  it("deve navegar para onCancelRoute ao cancelar", () => {
    const { result } = renderHook(() =>
      useFormSubmit({ initialValues, onSubmit, onCancelRoute: "/cancelado" }),
    );

    act(() => {
      result.current.handleCancel();
    });

    expect(mockPush).toHaveBeenCalledWith("/cancelado");
  });
});
