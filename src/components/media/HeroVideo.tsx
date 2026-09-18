"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = { mobileSrc: string; desktopSrc: string };

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Vídeo de fundo do hero. O LCP é o pôster (renderizado no servidor); este componente só
 * busca o vídeo depois do `load` da página e de um período ocioso, e não busca nada com
 * economia de dados, rede 2G ou movimento reduzido. Faz crossfade sobre o pôster ao tocar.
 */
export function HeroVideo({ mobileSrc, desktopSrc }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData ||
      /(^|-)2g$/.test(connection?.effectiveType ?? "")
    )
      return;

    let idle = 0;
    const start = () => {
      const pick = () => setSrc(matchMedia("(max-width: 767px)").matches ? mobileSrc : desktopSrc);
      idle = window.requestIdleCallback ? window.requestIdleCallback(pick, { timeout: 2000 }) : window.setTimeout(pick, 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [mobileSrc, desktopSrc]);

  // Pausa fora da viewport e com a aba em segundo plano.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [src]);

  if (!src) return null;
  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
        playing ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
