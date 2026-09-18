import type { ComponentType } from "react";
import type { MediaId } from "@/lib/media";
import Biofilia, { meta as biofilia } from "./biofilia-e-texturas-naturais.mdx";
import Iluminacao, { meta as iluminacao } from "./iluminacao-indireta-no-projeto-de-interiores.mdx";
import Precisao, { meta as precisao } from "./origem-da-precisao-alema-nos-moveis-planejados.mdx";

export type PostMeta = {
  title: string;
  description: string;
  /** ISO (AAAA-MM-DD) */
  date: string;
  cover: MediaId;
  readingMinutes: number;
};

export type Post = PostMeta & { slug: string; Content: ComponentType };

// Um artigo novo = um .mdx nesta pasta + uma linha aqui. O slug é o nome do arquivo.
export const posts: Post[] = [
  { slug: "iluminacao-indireta-no-projeto-de-interiores", ...iluminacao, Content: Iluminacao },
  { slug: "biofilia-e-texturas-naturais", ...biofilia, Content: Biofilia },
  { slug: "origem-da-precisao-alema-nos-moveis-planejados", ...precisao, Content: Precisao },
].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
