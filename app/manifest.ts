import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agro Feira",
    short_name: "Agro Feira",
    description:
      "Plataforma de gestão para feiras agroecológicas e comercialização de alimentos.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6faf4",
    theme_color: "#003d04",
    lang: "pt-BR",
    categories: ["business", "food", "productivity"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
