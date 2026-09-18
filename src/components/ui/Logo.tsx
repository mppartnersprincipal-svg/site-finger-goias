import Link from "next/link";
import { cn } from "@/lib/cn";
import { LOGO_FLAME, LOGO_INK, LOGO_VIEWBOX } from "./logo-paths";

/** Define o símbolo do logo uma única vez por página (layout); <Logo> o referencia com <use>. */
export function LogoSprite() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <symbol id="finger-logo" viewBox={LOGO_VIEWBOX}>
        <path fill="currentColor" fillRule="evenodd" d={LOGO_INK} />
        <path fill="#C44E2A" fillRule="evenodd" d={LOGO_FLAME} />
      </symbol>
    </svg>
  );
}

type LogoProps = {
  /** Versão Floral + Flame, para fundos Eerie (manual de marca, "Assinatura principal", Fig. 2). */
  inverse?: boolean;
  /** Assinatura com a tagline "Ambientes Personalizados" (versão horizontal do manual). */
  tagline?: boolean;
  href?: string | null;
  className?: string;
};

export function Logo({ inverse = false, tagline = false, href = "/", className }: LogoProps) {
  const mark = (
    <span className={cn("inline-flex h-full items-center gap-3", inverse ? "text-neutral-floral" : "text-dark-eerie", className)}>
      <svg viewBox={LOGO_VIEWBOX} aria-hidden className="h-full w-auto">
        <use href="#finger-logo" />
      </svg>
      {tagline && (
        <span aria-hidden className="font-heading text-[0.6875rem] leading-[1.2] font-normal">
          Ambientes
          <br />
          Personalizados
        </span>
      )}
    </span>
  );
  if (href === null) return <span role="img" aria-label="Finger Ambientes Personalizados">{mark}</span>;
  return (
    <Link href={href} aria-label="Finger Ambientes Personalizados — página inicial" className="inline-flex h-full items-center">
      {mark}
    </Link>
  );
}
