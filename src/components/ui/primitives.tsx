import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Container do DS: 80rem, gutters de 20–64 px. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-container px-gutter", className)} {...props} />;
}

type SectionProps = ComponentProps<"section"> & {
  /** Bloco Eerie de alto contraste (manifesto, footer): sem sombra nem borda, foco em Floral. */
  tone?: "light" | "dark" | "muted";
  bleed?: boolean;
};

export function Section({ tone = "light", bleed = false, className, children, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "py-section",
        tone === "dark" && "on-dark bg-dark-eerie text-neutral-floral",
        tone === "muted" && "bg-neutral-timberwolf/30",
        className,
      )}
      {...props}
    >
      {bleed ? children : <Container>{children}</Container>}
    </section>
  );
}

/** Eyebrow do DS: caixa alta, Open Sans SemiBold 12 px, tracking 0.08em. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("font-heading text-xs leading-snug font-semibold tracking-wide uppercase", className)}
      {...props}
    />
  );
}

/**
 * Palavra de destaque em Ephesis. Regras do DS (type-accent): ≥ 32 px, uma por tela,
 * nunca em parágrafo, botão ou navegação. Em em relativo ao título que a contém.
 */
export function Accent({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-block translate-y-[0.08em] font-accent text-[1.35em] leading-[0.8] font-normal tracking-normal text-primary-flame",
        className,
      )}
      {...props}
    />
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: ElementType;
  align?: "left" | "center";
  size?: "h1" | "h2";
  tone?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  align = "left",
  size = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <Eyebrow className={tone === "dark" ? "text-neutral-timberwolf" : "text-dark-olive"}>{eyebrow}</Eyebrow>}
      <Tag
        data-reveal="lines"
        className={cn(size === "h1" ? "text-[clamp(2.5rem,5vw,4.25rem)]" : "text-[clamp(2rem,3.5vw,3rem)]")}
      >
        {title}
      </Tag>
      {lead && (
        <p
          data-reveal
          className={cn("max-w-[52ch] text-lg", tone === "dark" ? "text-neutral-floral/80" : "text-dark-olive")}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

/** Etiqueta de categoria (Badge do DS). `inverse` é a variante sobre foto, com blur. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: "neutral" | "accent" | "inverse" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-[5px] font-heading text-xs leading-[1.2] font-semibold tracking-wide uppercase",
        tone === "neutral" && "bg-neutral-timberwolf/30 text-dark-eerie",
        tone === "accent" && "bg-primary-flame text-neutral-floral",
        tone === "inverse" && "bg-neutral-floral/90 text-dark-eerie backdrop-blur-[6px]",
        className,
      )}
      {...props}
    />
  );
}
