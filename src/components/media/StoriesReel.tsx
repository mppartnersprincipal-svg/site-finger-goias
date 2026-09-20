"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ReelItem = { src: string; title: string; poster: ReactNode };

/**
 * Trilho de vídeos verticais (decorados filmados em formato de stories). Nenhum vídeo é
 * requisitado até o usuário tocar em um cartão; só um toca por vez; pausa ao sair da tela.
 * Com movimento reduzido continua funcionando — o play é sempre uma ação explícita.
 */
export function StoriesReel({ items }: { items: ReelItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  // Cartões que já foram tocados ao menos uma vez: só esses têm <video> no DOM.
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(new Set());
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) video.play().catch(() => setActive(null));
      else video.pause();
    });
  }, [active]);

  // Pausa o vídeo ativo quando ele sai da viewport.
  useEffect(() => {
    if (active === null) return;
    const video = videos.current[active];
    if (!video) return;
    const io = new IntersectionObserver(([entry]) => !entry.isIntersecting && setActive(null), { threshold: 0.25 });
    io.observe(video);
    return () => io.disconnect();
  }, [active]);

  return (
    <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden">
      {items.map((item, i) => {
        const isActive = active === i;
        return (
          <li key={item.src} className="w-[62vw] max-w-[19rem] shrink-0 snap-center sm:w-[19rem]">
            <div className="relative aspect-[9/16] overflow-hidden rounded-md bg-dark-olive">
              {item.poster}
              {/* O <video> só existe (e só baixa) depois do primeiro play deste cartão. */}
              {loaded.has(i) ? (
                <video
                  ref={(el) => {
                    videos.current[i] = el;
                  }}
                  src={item.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-opacity duration-320 ease-out",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                />
              ) : null}
              <div aria-hidden className="photo-scrim absolute inset-0" />
              <button
                type="button"
                onClick={() => {
                  setLoaded((prev) => new Set(prev).add(i));
                  setActive(isActive ? null : i);
                }}
                aria-pressed={isActive}
                aria-label={`${isActive ? "Pausar" : "Reproduzir"} vídeo: ${item.title}`}
                className="on-dark group absolute inset-0 flex flex-col justify-end gap-3 p-4 text-left text-neutral-floral"
              >
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full border border-neutral-floral/70 bg-dark-eerie/40 backdrop-blur-[6px] transition-[background-color,opacity] duration-180 ease-out group-hover:bg-neutral-floral group-hover:text-dark-eerie",
                    isActive && "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                >
                  {isActive ? (
                    <Pause aria-hidden size={20} strokeWidth={1.5} />
                  ) : (
                    <Play aria-hidden size={20} strokeWidth={1.5} />
                  )}
                </span>
                <span className="font-heading text-sm leading-snug font-semibold">{item.title}</span>
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
