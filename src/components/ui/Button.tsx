import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full border font-heading font-semibold leading-none tracking-[0.01em] whitespace-nowrap max-sm:text-center max-sm:leading-snug max-sm:whitespace-normal transition-[background-color,color,border-color,transform] duration-180 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-primary-flame text-neutral-floral hover:bg-dark-olive",
  secondary: "border-dark-olive text-dark-eerie hover:bg-neutral-timberwolf/20",
  ghost: "border-transparent text-primary-flame hover:text-dark-olive",
  inverse: "border-neutral-floral text-neutral-floral hover:bg-neutral-floral hover:text-dark-eerie",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 py-2 text-sm",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-13 px-8 py-4 text-base",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type ButtonProps = CommonProps &
  (({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) |
    ({ href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">));

export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps) {
  const isGhost = variant === "ghost";
  // Forma arredondada (pílula) em todos os botões: pedido do cliente, sobrepõe o "sem pílulas" do DS.
  // O ghost é um link textual: ignora padding/altura, mas mantém alvo de toque de 44 px.
  const classes = cn(base, variants[variant], isGhost ? "min-h-11 px-0 py-1 text-sm" : sizes[size], className);
  const content = (
    <>
      {children}
      {isGhost && (
        <ArrowRight
          aria-hidden
          size={16}
          strokeWidth={1.5}
          className="transition-transform duration-180 ease-out group-hover:translate-x-[3px]"
        />
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...linkProps } = rest;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
