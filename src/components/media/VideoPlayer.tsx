"use client";

import { Play } from "lucide-react";
import { useState, type ReactNode } from "react";

type Props = { src: string; title: string; poster: ReactNode };

/** Vídeo com som, sob demanda: nada é baixado até o clique; depois, controles nativos. */
export function VideoPlayer({ src, title, poster }: Props) {
  const [started, setStarted] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-md bg-dark-eerie shadow-lg">
      {started ? (
        <video src={src} controls autoPlay playsInline aria-label={title} className="h-full w-full" />
      ) : (
        <>
          {poster}
          <div aria-hidden className="photo-scrim absolute inset-0" />
          <button
            type="button"
            onClick={() => setStarted(true)}
            aria-label={`Assistir: ${title}`}
            className="on-dark group absolute inset-0 flex items-end gap-4 p-5 text-left text-neutral-floral md:p-8"
          >
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-flame transition-colors duration-180 ease-out group-hover:bg-neutral-floral group-hover:text-dark-eerie">
              <Play aria-hidden size={24} strokeWidth={1.5} />
            </span>
            <span className="font-heading text-base leading-snug font-semibold md:text-lg">{title}</span>
          </button>
        </>
      )}
    </div>
  );
}
