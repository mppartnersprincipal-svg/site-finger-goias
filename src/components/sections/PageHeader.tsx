import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

type Props = { eyebrow: string; title: ReactNode; lead?: ReactNode; tone?: "light" | "dark"; children?: ReactNode };

/** Cabeçalho das páginas internas. Título e descrição já nascem visíveis para não atrasar o LCP. */
export function PageHeader({ eyebrow, title, lead, tone = "light", children }: Props) {
  const dark = tone === "dark";
  return (
    <header className={cn("pt-16 pb-12 md:pt-24 md:pb-16", dark && "on-dark bg-dark-eerie text-neutral-floral")}>
      <Container className="flex flex-col items-start gap-6">
        <Eyebrow className={cn("hero-rise", dark ? "text-neutral-timberwolf" : "text-dark-olive")}>{eyebrow}</Eyebrow>
        <h1 className="max-w-[20ch] text-[clamp(2.5rem,5vw,4.25rem)]">
          {title}
        </h1>
        {lead && (
          <p
            className={cn("max-w-[56ch] text-lg", dark ? "text-neutral-floral/80" : "text-dark-olive")}
          >
            {lead}
          </p>
        )}
        {children && (
          <div className="hero-rise" style={{ "--i": 3 } as React.CSSProperties}>
            {children}
          </div>
        )}
      </Container>
    </header>
  );
}
