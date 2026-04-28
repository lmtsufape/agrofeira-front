import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const { pathname, search } = new URL(request.url);

  // Remove o prefixo /api/proxy para obter o caminho real da API
  const apiPath = pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${apiPath}${search}`;

  const headers = new Headers(request.headers);

  // Adiciona o header para pular o aviso do ngrok no lado do servidor
  headers.set("ngrok-skip-browser-warning", "true");

  // Remove o host original para evitar problemas de proxy
  headers.delete("host");

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.blob()
          : undefined,
      cache: "no-store",
    });

    const data = await response.blob();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Erro de conexão com o backend" },
      { status: 502 },
    );
  }
}
