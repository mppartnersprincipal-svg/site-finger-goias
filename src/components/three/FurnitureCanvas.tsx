"use client";

import { useEffect, useRef } from "react";
import { getDeviceTier, maxPixelRatio, prefersReducedMotion } from "@/lib/device-tier";

/**
 * Liga o palco do Módulo Finger ao scroll.
 *  - Dispositivo capaz: importa three + a cena sob demanda (quando o palco se aproxima da tela)
 *    e faz crossfade do desenho isométrico para o canvas.
 *  - Sem WebGL / aparelho modesto: anima o próprio SVG (explosão 2D), sem baixar three.
 *  - Movimento reduzido: nada acontece; fica o desenho técnico estático.
 * O progresso vem do ScrollTrigger ao longo do trilho [data-furniture-track] ativo, dentro do qual
 * o palco (celular) ou a seção inteira (desktop) fica sticky — ver FurnitureStage.
 */
export function FurnitureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const labelLayer = labelsRef.current;
    const stage = canvas?.closest<HTMLElement>("[data-furniture-stage]");
    if (!canvas || !labelLayer || !stage || prefersReducedMotion()) return;

    const fallback = stage.querySelector<SVGSVGElement>("[data-furniture-fallback]");
    let cleanup = () => {};
    let cancelled = false;

    const start = async () => {
      const tier = getDeviceTier();
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Trilho ativo = ancestral [data-furniture-track] bem mais alto que a tela (o conteúdo fica
      // sticky dentro dele). O progresso percorre o trilho inteiro, então a animação sempre termina
      // com o palco parado na tela. Sem trilho ativo (ex.: CSS sem sticky), cai na passagem do palco.
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) * 16 || 80;
      let track: HTMLElement | null = null;
      for (let el = stage.parentElement; el; el = el.parentElement) {
        if (el.hasAttribute("data-furniture-track") && el.offsetHeight > window.innerHeight * 1.5) {
          track = el;
          break;
        }
      }
      // Nos dois tipos de trilho a moldura sticky tem a altura da tela (menos o header): ela prende
      // quando o topo do trilho encosta no header e solta quando a base do trilho chega à base da tela.
      const triggerVars = track
        ? { trigger: track, start: `top ${headerH}px`, end: "bottom bottom" }
        : { trigger: stage, start: "top 85%", end: "bottom 15%" };
      // A animação fecha em 90 % do trilho: o módulo montado, com o LED aceso, ainda fica um
      // instante na tela antes de a seção soltar.
      const HOLD = 0.9;

      if (tier === 0) {
        // Explosão 2D do próprio SVG: cada <g data-part> leva o vetor já projetado em data-dx/dy.
        if (!fallback) return;
        const parts = gsap.utils.toArray<SVGGElement>("[data-part]", fallback);
        const timeline = gsap
          .timeline({ scrollTrigger: { ...triggerVars, scrub: 0.6 } })
          .to("[data-cota]", { opacity: 0, duration: 0.15 }, 0.2)
          .to(parts, { x: (_, el) => Number(el.dataset.dx) * 0.8, y: (_, el) => Number(el.dataset.dy) * 0.8, duration: 0.3, ease: "power2.inOut", stagger: { amount: 0.12 } }, 0.25)
          .to(parts, { x: 0, y: 0, duration: 0.3, ease: "power2.inOut", stagger: { amount: 0.12, from: "start" } }, 0.65);
        cleanup = () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set([...parts, "[data-cota]"], { clearProps: "all" });
        };
        return;
      }

      const { FurnitureScene } = await import("./FurnitureScene");
      if (cancelled) return;

      let failed = false;
      const showFallback = () => {
        failed = true;
        canvas.style.opacity = "0";
        if (fallback) fallback.style.opacity = "1";
      };
      const scene = new FurnitureScene(canvas, labelLayer, maxPixelRatio(tier), showFallback);

      const resize = () => scene.resize(stage.clientWidth, stage.clientHeight);
      const observer = new ResizeObserver(resize);
      observer.observe(stage);
      resize();

      // Guarda de desempenho: se os primeiros quadros passarem de ~32 ms, volta para o SVG.
      const samples: number[] = [];
      const trigger = ScrollTrigger.create({
        ...triggerVars,
        scrub: 0.6,
        onUpdate: (self) => {
          if (failed) return;
          const t0 = performance.now();
          scene.setProgress(Math.min(1, self.progress / HOLD));
          if (samples.length < 20) {
            samples.push(performance.now() - t0);
            if (samples.length === 20 && samples.reduce((a, b) => a + b, 0) / 20 > 32) showFallback();
          }
        },
      });
      scene.setProgress(Math.min(1, trigger.progress / HOLD));

      canvas.style.opacity = "1";
      if (fallback) fallback.style.opacity = "0";

      cleanup = () => {
        trigger.kill();
        observer.disconnect();
        scene.dispose();
        if (fallback) fallback.style.opacity = "1";
      };
    };

    // Só começa a baixar quando o palco está a menos de uma tela de distância.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void start();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 ease-out" />
      <div ref={labelsRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
    </>
  );
}
