import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../route";

describe("Proxy API Route", () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "http://api.test";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  it("deve encaminhar a requisição GET para o backend", async () => {
    const jsonResponse = { data: "ok" };
    const mockResponse = new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    fetchSpy.mockResolvedValueOnce(mockResponse);

    const request = new NextRequest(
      "http://localhost:3000/api/proxy/v1/test?param=1",
      {
        method: "GET",
      },
    );

    const response = await GET(request);

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://api.test/v1/test?param=1",
      expect.objectContaining({
        method: "GET",
      }),
    );

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(JSON.parse(text)).toEqual(jsonResponse);
  });

  it("deve encaminhar a requisição POST com corpo para o backend", async () => {
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
    fetchSpy.mockResolvedValueOnce(mockResponse);

    const body = JSON.stringify({ name: "test" });
    const request = new NextRequest("http://localhost:3000/api/proxy/v1/test", {
      method: "POST",
      body: body,
    });

    const response = await POST(request);

    expect(fetchSpy).toHaveBeenCalledWith(
      "http://api.test/v1/test",
      expect.objectContaining({
        method: "POST",
      }),
    );

    expect(response.status).toBe(201);
  });

  it("deve retornar 502 se o backend falhar", async () => {
    fetchSpy.mockRejectedValueOnce(new Error("Connection failed"));

    const request = new NextRequest("http://localhost:3000/api/proxy/v1/test");
    const response = await GET(request);

    expect(response.status).toBe(502);
    const text = await response.text();
    const data = JSON.parse(text);
    expect(data.message).toBe("Erro de conexão com o backend");
  });
});
