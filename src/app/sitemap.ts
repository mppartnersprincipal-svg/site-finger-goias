import type { MetadataRoute } from "next";
import { posts } from "@/content/blog/registry";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const pages = ["/", "/ambientes", "/sobre", "/como-funciona", "/para-arquitetos", "/orcamento", "/blog", "/politica-de-privacidade"];
  return [
    ...pages.map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: url(`/ambientes/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
