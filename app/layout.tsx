import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { getAuthData } from "@/features/auth/actions/auth.actions";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "#003d04",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Agro Feira",
    template: "%s | Agro Feira",
  },
  description:
    "Plataforma de gestão para feiras agroecológicas e circuitos curtos de comercialização.",
  manifest: "/manifest.json",
  keywords: [
    "agroecologia",
    "feira",
    "gestão",
    "comercialização",
    "pwa",
    "agricultura familiar",
  ],
  authors: [{ name: "LMTS" }],
  creator: "LMTS",
  publisher: "LMTS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Agro Feira",
    description: "Plataforma de gestão para feiras agroecológicas",
    url: "https://agrofeira.ufape.edu.br", // TDDO: Atualizar para URL real
    siteName: "Agro Feira",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Agro Feira Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agro Feira",
    description: "Plataforma de gestão para feiras agroecológicas",
    images: ["/logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agro Feira",
    startupImage: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialAuthData = await getAuthData();

  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider initialData={initialAuthData}>{children}</AuthProvider>
      </body>
    </html>
  );
}
