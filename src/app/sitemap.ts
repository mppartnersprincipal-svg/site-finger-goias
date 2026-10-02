import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const pages = ["/", "/ambientes", "/sobre", "/como-funciona", "/orcamento", "/politica-de-privacidade"];
  return [
    ...pages.map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: url(`/ambientes/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
