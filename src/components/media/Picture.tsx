import { cn } from "@/lib/cn";
import { fallbackSrc, media, srcSet, type MediaId } from "@/lib/media";

type PictureProps = {
  id: MediaId;
  /** Atributo `sizes` do srcset, ex.: "(min-width: 1024px) 33vw, 100vw" */
  sizes: string;
  /** Imagem de LCP: carrega já, com prioridade alta. Usar no máximo uma por página. */
  priority?: boolean;
  /** Primeira dobra, mas não é o LCP: carrega sem lazy e sem prioridade alta. */
  eager?: boolean;
  /** Sobrescreve o alt do manifest; passe "" para imagem decorativa. */
  alt?: string;
  className?: string;
  imgClassName?: string;
};

/** Foto responsiva (AVIF → WebP) com LQIP de fundo e dimensões intrínsecas para não causar CLS. */
export function Picture({ id, sizes, priority = false, eager = false, alt, className, imgClassName }: PictureProps) {
  const entry = media(id);
  return (
    <picture className={cn("block h-full w-full", className)}>
      <source type="image/avif" srcSet={srcSet(entry.sources.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(entry.sources.webp)} sizes={sizes} />
      <img
        src={fallbackSrc(entry)}
        width={entry.width}
        height={entry.height}
        alt={alt ?? entry.alt}
        loading={priority || eager ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={cn("h-full w-full object-cover", imgClassName)}
        style={{ backgroundImage: `url(${entry.lqip})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
    </picture>
  );
}
