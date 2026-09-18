// Acesso tipado ao manifest gerado por scripts/media/build-images.mjs.
// Importar só em Server Components: o JSON traz os LQIP em base64 e não deve ir para o bundle do cliente.
import manifest from "@/content/media-manifest.json";

export type MediaId = keyof typeof manifest;
export type MediaSource = { w: number; src: string };
export type MediaEntry = {
  width: number;
  height: number;
  alt: string;
  lqip: string;
  sources: { avif: MediaSource[]; webp: MediaSource[] };
};

export function media(id: MediaId): MediaEntry {
  return manifest[id] as MediaEntry;
}

export const srcSet = (sources: MediaSource[]) => sources.map((s) => `${s.src} ${s.w}w`).join(", ");

/** Fonte de fallback do <img>: o WebP mais próximo de `target` px de largura. */
export function fallbackSrc(entry: MediaEntry, target = 1280): string {
  const list = entry.sources.webp;
  return (list.find((s) => s.w >= target) ?? list[list.length - 1]).src;
}
