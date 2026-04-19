import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import "@/app/globals.css";

export const viewport: Viewport = {
  themeColor: "#003d04",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "EcoFeira",
  description: "Plataforma EcoFeira",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EcoFeira",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
