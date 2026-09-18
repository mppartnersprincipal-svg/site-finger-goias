"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export type GalleryPhoto = {
  key: string;
  title: string;
  alt: string;
  width: number;
  height: number;
  avif: string;
  webp: string;
  src: string;
  /** Miniatura (<Picture>) renderizada no servidor. */
  thumb: ReactNode;
};

/** Galeria do projeto com lightbox em <dialog> nativo: Esc fecha, setas e swipe navegam. */
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
    document.documentElement.classList.toggle("dialog-open", index !== null);
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, step]);

  const current = index === null ? null : photos[index];
  const navButton =
    "on-dark inline-flex size-11 items-center justify-center rounded-md border border-neutral-floral/40 text-neutral-floral transition-colors duration-180 ease-out hover:bg-neutral-floral hover:text-dark-eerie";

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <li key={photo.key} className={i % 5 === 0 ? "sm:col-span-2" : undefined}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ampliar foto: ${photo.title}`}
              data-cursor="Ampliar"
              className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-md bg-neutral-timberwolf/30 data-[wide=true]:sm:aspect-[16/9]"
              data-wide={i % 5 === 0}
            >
              <div className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">{photo.thumb}</div>
              <span className="photo-scrim pointer-events-none absolute inset-x-0 bottom-0 flex h-1/2 items-end p-4 font-heading text-sm font-semibold text-neutral-floral opacity-0 transition-opacity duration-320 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        data-lenis-prevent
        aria-label="Foto ampliada"
        className="menu-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-dark-eerie/95 p-0 text-neutral-floral backdrop:bg-transparent"
      >
        {current && (
          <div
            className="flex h-full flex-col"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 px-gutter py-4">
              <p className="font-heading text-sm font-semibold">
                {current.title}{" "}
                <span className="font-normal text-neutral-floral/70">
                  · {index! + 1} de {photos.length}
                </span>
              </p>
              <button type="button" onClick={() => setIndex(null)} aria-label="Fechar" className={navButton}>
                <X aria-hidden size={24} strokeWidth={1.5} />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 px-gutter">
              <picture key={current.key}>
                <source type="image/avif" srcSet={current.avif} sizes="100vw" />
                <source type="image/webp" srcSet={current.webp} sizes="100vw" />
                <img
                  src={current.src}
                  alt={current.alt}
                  width={current.width}
                  height={current.height}
                  className="mx-auto h-full w-full rounded-md object-contain"
                />
              </picture>
            </div>
            <div className="flex shrink-0 items-center justify-center gap-3 px-gutter py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => step(-1)} aria-label="Foto anterior" className={navButton}>
                <ChevronLeft aria-hidden size={24} strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Próxima foto" className={navButton}>
                <ChevronRight aria-hidden size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
