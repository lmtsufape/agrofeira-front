import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://agrofeira.ufape.edu.br/sitemap.xml", // TODO Atualizar para URL real
  };
}
