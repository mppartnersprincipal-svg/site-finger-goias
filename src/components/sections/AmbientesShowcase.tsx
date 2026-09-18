import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Picture } from "@/components/media/Picture";
import { Button } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/primitives";
import type { MediaId } from "@/lib/media";

// Cards de destaque da copy (Home, seção 2).
const cards: { title: string; text: string; href: string; image: MediaId }[] = [
  {
    title: "Cozinhas",
    text: "O ponto de encontro onde a funcionalidade abraça a convivência.",
    href: "/ambientes?c=cozinhas",
    image: "sa-cozinha-8004",
  },
  {
    title: "Dormitórios & Closets",
    text: "Refúgios de acolhimento e organização inteligente.",
    href: "/ambientes?c=dormitorios",
    image: "n23-dormitorio-5111",
  },
  {
    title: "Salas de Estar",
    text: "Espaços integrados que convidam ao conforto diário.",
    href: "/ambientes?c=salas",
    image: "n23-sala-5068",
  },
];

export function AmbientesShowcase() {
  return (
    <section className="overflow-hidden py-section" aria-labelledby="ambientes-titulo">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Ambientes"
          title={<span id="ambientes-titulo">Design sob medida para cada momento da sua vida</span>}
          lead="Ambientes planejados para cozinhas, dormitórios, salas, closets e banheiros que combinam funcionalidade impecável e beleza atemporal."
        />
        <Button href="/ambientes" variant="ghost" className="shrink-0">
          Ver todos os ambientes
        </Button>
      </Container>

      {/* Trilho horizontal: scroll-snap nativo no toque; no desktop o GSAP assume (pin + scrub). */}
      <div data-hgallery className="mt-12">
        <ul
          data-hgallery-track
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] lg:gap-8 [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card) => (
            <li key={card.title} className="w-[82vw] shrink-0 snap-center sm:w-[60vw] lg:w-[46vw] xl:w-[40rem]">
              <Link href={card.href} data-cursor="Ver" className="group flex flex-col gap-4">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-timberwolf/30 shadow-sm transition-shadow duration-320 ease-out group-hover:shadow-md">
                  <Picture
                    id={card.image}
                    sizes="(min-width: 1280px) 640px, (min-width: 1024px) 46vw, (min-width: 640px) 60vw, 82vw"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="flex items-center gap-2 text-2xl transition-colors duration-180 ease-out group-hover:text-primary-flame">
                    {card.title}
                    <ArrowRight
                      aria-hidden
                      size={20}
                      strokeWidth={1.5}
                      className="transition-transform duration-180 ease-out group-hover:translate-x-[3px]"
                    />
                  </h3>
                  <p className="max-w-[40ch] text-dark-olive">{card.text}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
