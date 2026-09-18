"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";

export type GridItem = {
  key: string;
  title: string;
  category: string;
  categoryLabel: string;
  project: string;
  href: string;
  /** <Picture> já renderizado no servidor — o manifest de mídia não entra no bundle do cliente. */
  picture: ReactNode;
};

type Props = { items: GridItem[]; filters: { id: string; label: string }[] };

const ALL = "todos";

/**
 * O fallback inclui a grade completa no HTML estático, com a foto de LCP visível.
 * Após hidratar, a categoria acompanha tanto o histórico quanto a navegação do Next.js.
 */
export function FilterableGrid(props: Props) {
  return (
    <Suspense fallback={<Grid {...props} active={ALL} />}>
      <CategoryGrid {...props} />
    </Suspense>
  );
}

function CategoryGrid({ items, filters }: Props) {
  const searchParams = useSearchParams();
  const category = searchParams.get("c") ?? ALL;
  const active = filters.some((filter) => filter.id === category) ? category : ALL;
  const [animateItems, setAnimateItems] = useState(false);

  const select = (id: string) => {
    // A entrada animada é só para a interação; a foto de LCP já nasce visível no HTML.
    setAnimateItems(true);
    const url = new URL(window.location.href);
    if (id === ALL) url.searchParams.delete("c");
    else url.searchParams.set("c", id);
    window.history.replaceState(window.history.state, "", url);
  };

  return <Grid items={items} filters={filters} active={active} animateItems={animateItems} onSelect={select} />;
}

function Grid({ items, filters, active, animateItems = false, onSelect }: Props & {
  active: string;
  animateItems?: boolean;
  onSelect?: (id: string) => void;
}) {
  const visible = active === ALL ? items : items.filter((item) => item.category === active);

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Filtrar por ambiente" className="-mx-gutter flex gap-2 overflow-x-auto px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[{ id: ALL, label: "Todos" }, ...filters].map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={active === filter.id}
            onClick={() => onSelect?.(filter.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-md border px-5 font-heading text-sm font-semibold transition-colors duration-180 ease-out",
              active === filter.id
                ? "border-dark-eerie bg-dark-eerie text-neutral-floral"
                : "border-neutral-timberwolf text-dark-eerie hover:bg-neutral-timberwolf/20",
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} {visible.length === 1 ? "ambiente exibido" : "ambientes exibidos"}
      </p>

      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.key} className={animateItems ? "grid-item-in" : undefined}>
            <Link href={item.href} data-cursor="Ver" className="group flex flex-col gap-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-timberwolf/30 shadow-sm transition-shadow duration-320 ease-out group-hover:shadow-md">
                <div className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]">{item.picture}</div>
                <Badge tone="inverse" className="absolute top-3 left-3">
                  {item.categoryLabel}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl transition-colors duration-180 ease-out group-hover:text-primary-flame">{item.title}</h3>
                <p className="text-dark-olive">{item.project}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
