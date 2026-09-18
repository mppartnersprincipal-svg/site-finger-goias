"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { site } from "@/content/site";

const href = buildWhatsAppUrl(site.showroom.whatsapp, "Olá! Vim pelo site e gostaria de falar sobre um projeto.");

/**
 * Atalho fixo para o WhatsApp (único canal de leads). Exceção consciente à regra do DS
 * "layout fixo: só o header". Aparece depois da primeira dobra e some sobre qualquer
 * elemento marcado com [data-hide-wa] (formulários e rodapé), para não cobrir conteúdo.
 */
export function WhatsAppFloat() {
  const pathname = usePathname();
  const [pastFold, setPastFold] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastFold(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCovered(visible.size > 0);
    });
    document.querySelectorAll("[data-hide-wa]").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [pathname]);

  const shown = pastFold && !covered;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a Finger no WhatsApp"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      className={cn(
        "on-dark fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-13 items-center justify-center rounded-md border border-neutral-floral/25 bg-dark-eerie text-neutral-floral shadow-lg transition-[opacity,transform,background-color] duration-320 ease-out hover:bg-dark-olive active:scale-[0.98]",
        shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <MessageCircle aria-hidden size={24} strokeWidth={1.5} />
    </a>
  );
}
