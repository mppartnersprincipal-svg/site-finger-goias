"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/device-tier";

type Lenis = import("lenis").default;
type Gsap = typeof import("gsap").gsap;

/**
 * Camada de movimento do site: scroll suave (Lenis), revelações por scroll, parallax, galeria
 * horizontal, desenho de SVG, transição de página e cursor. Tudo é importado de forma dinâmica
 * depois do carregamento — nada disso entra no caminho crítico do LCP — e nada roda com
 * prefers-reduced-motion. Easing único da marca: cubic-bezier(.22, 1, .36, 1), sem bounces.
 */
export function MotionProvider() {
  const pathname = usePathname();
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const lib = useRef<{ gsap: Gsap; lenis: Lenis; setupPage: () => () => void } | null>(null);
  const pageCleanup = useRef<() => void>(() => {});
  const navigating = useRef(false);

  // ------------------------------------------------------------- inicialização (uma vez)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let disposed = false;
    const teardown: (() => void)[] = [];

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }, { SplitText }, { DrawSVGPlugin }, { CustomEase }, { default: LenisCtor }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("gsap/SplitText"),
          import("gsap/DrawSVGPlugin"),
          import("gsap/CustomEase"),
          import("lenis"),
        ]);
      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);
      CustomEase.create("finger", "0.22, 1, 0.36, 1");
      gsap.defaults({ ease: "finger", duration: 0.9 });
      ScrollTrigger.config({ ignoreMobileResize: true });

      // Scroll suave só na roda do mouse; no toque fica o scroll nativo (syncTouch desligado).
      const lenis = new LenisCtor({ duration: 1.1, anchors: { offset: -80 }, autoRaf: false });
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      teardown.push(() => {
        gsap.ticker.remove(raf);
        lenis.destroy();
      });

      const setupPage = () => {
        const main = document.getElementById("conteudo");
        if (!main) return () => {};
        const splits: InstanceType<typeof SplitText>[] = [];
        const mm = gsap.matchMedia();

        const ctx = gsap.context(() => {
          // Regra de ouro do LCP: NADA nasce oculto no HTML/CSS. Só recebem animação de entrada os
          // elementos que estão abaixo da dobra no momento em que o GSAP assume (depois do load);
          // o que já está na tela fica como está. Sem JS, tudo simplesmente aparece.
          const fold = window.innerHeight * 0.92;
          const belowFold = (el: Element) => el.getBoundingClientRect().top > fold;

          // Títulos: revelação por linha, com máscara.
          gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').filter(belowFold).forEach((el) => {
            splits.push(
              SplitText.create(el, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) =>
                  gsap.from(self.lines, {
                    yPercent: 110,
                    duration: 1,
                    stagger: 0.09,
                    scrollTrigger: { trigger: el, start: "top 88%", once: true },
                  }),
              }),
            );
          });

          // Blocos: sobem 24 px com fade ao entrar na tela.
          const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal]:not([data-reveal="lines"])').filter(belowFold);
          if (blocks.length) {
            gsap.set(blocks, { opacity: 0, y: 24 });
            ScrollTrigger.batch(blocks, {
              start: "top 90%",
              once: true,
              onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, overwrite: true }),
            });
          }

          // Parallax interno das fotos (a imagem é maior que a moldura; só transform).
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((frame) => {
            const img = frame.querySelector("img");
            if (!img) return;
            gsap.fromTo(
              img,
              { yPercent: -7, scale: 1.16 },
              { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } },
            );
          });
          gsap.utils.toArray<HTMLElement>("[data-parallax-text]").forEach((el) => {
            gsap.fromTo(el, { yPercent: 18 }, { yPercent: -18, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          });

          // Desenho técnico: os traços se desenham ao entrar na tela.
          gsap.utils.toArray<SVGElement>("svg:has([data-draw])").forEach((svg) => {
            gsap.from(svg.querySelectorAll("[data-draw]"), {
              drawSVG: "0%",
              duration: 1.4,
              stagger: 0.07,
              ease: "power2.inOut",
              scrollTrigger: { trigger: svg, start: "top 80%", once: true },
            });
          });

          // Galeria horizontal: no desktop, o scroll vertical conduz o trilho (pin + scrub).
          mm.add("(min-width: 1024px)", () => {
            gsap.utils.toArray<HTMLElement>("[data-hgallery]").forEach((wrap) => {
              const track = wrap.querySelector<HTMLElement>("[data-hgallery-track]");
              if (!track) return;
              const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
              if (distance() < 80) return;
              gsap.set(track, { overflowX: "visible" });
              gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: { trigger: wrap, start: "center center", end: () => `+=${distance()}`, pin: true, scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1 },
              });
            });
          });
        }, main);

        ScrollTrigger.refresh();

        return () => {
          mm.revert();
          splits.forEach((split) => split.revert());
          ctx.revert();
        };
      };

      // Cursor: anel que segue o ponteiro (só mouse, telas ≥ 1024 px). O cursor nativo continua.
      const cursor = cursorRef.current;
      if (cursor && matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches) {
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          xTo(e.clientX);
          yTo(e.clientY);
          cursor.dataset.visible = "true";
          const target = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor]");
          cursor.dataset.active = target ? "true" : "false";
          cursor.dataset.label = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
        };
        const onLeave = () => (cursor.dataset.visible = "false");
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        teardown.push(() => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
        });
      }

      lib.current = { gsap, lenis, setupPage };
      document.fonts.ready.then(() => {
        if (!disposed) pageCleanup.current = setupPage();
      });
    };

    // Depois do load + ocioso: o LCP não espera por nenhuma linha de animação.
    const schedule = () => (window.requestIdleCallback ? window.requestIdleCallback(() => void init(), { timeout: 1500 }) : setTimeout(() => void init(), 200));
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener("load", schedule);
      pageCleanup.current();
      teardown.forEach((fn) => fn());
      lib.current = null;
    };
  }, []);

  // ------------------------------------------------------------- a cada troca de rota
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const current = lib.current;
    if (!current) return;
    const { gsap, lenis, setupPage } = current;

    pageCleanup.current();
    lenis.scrollTo(0, { immediate: true, force: true });
    pageCleanup.current = setupPage();

    // Cortina sai, revelando a nova página.
    const curtain = curtainRef.current;
    if (curtain && navigating.current) {
      gsap.to(curtain, { yPercent: -100, duration: 0.7, delay: 0.05, onComplete: () => gsap.set(curtain, { visibility: "hidden" }) });
    }
    navigating.current = false;
    lenis.start();
  }, [pathname]);

  // ------------------------------------------------------------- transição de página
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const current = lib.current;
      const curtain = curtainRef.current;
      if (!current || !curtain || navigating.current) return;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      // Navegação interna para outra rota: cortina Eerie sobe, depois o router troca a página.
      event.preventDefault();
      navigating.current = true;
      current.lenis.stop();
      const href = url.pathname + url.search + url.hash;
      router.prefetch(href);
      current.gsap.set(curtain, { visibility: "visible", yPercent: 100 });
      current.gsap.to(curtain, { yPercent: 0, duration: 0.32, ease: "power2.inOut", onComplete: () => router.push(href) });

      // Rede de segurança: se a rota não trocar em 4 s, libera a tela.
      window.setTimeout(() => {
        if (!navigating.current) return;
        navigating.current = false;
        current.gsap.set(curtain, { visibility: "hidden" });
        current.lenis.start();
      }, 4000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <>
      <div ref={curtainRef} aria-hidden className="pointer-events-none invisible fixed inset-0 z-[70] bg-dark-eerie" />
      <div ref={cursorRef} aria-hidden className="site-cursor" data-visible="false" data-active="false" data-label="" />
    </>
  );
}
