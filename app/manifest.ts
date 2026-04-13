import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Agro Feira",
    short_name: "AgroFeira",
    description: "Plataforma de gestão para feiras agroecológicas",
    start_url: "/",
    display: "standalone",
    background_color: "#f6faf4",
    theme_color: "#003d04",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
