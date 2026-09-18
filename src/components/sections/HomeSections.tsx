import { Picture } from "@/components/media/Picture";
import { StoriesReel } from "@/components/media/StoriesReel";
import { Button } from "@/components/ui/Button";
import { Container, Section, SectionHeading } from "@/components/ui/primitives";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";

/** Passeio em vídeo pelos decorados (material real, filmado na vertical). */
export function DecoradosReel() {
  const lodge = getProject("lodge-vaca-brava");
  if (!lodge?.reels?.length) return null;
  return (
    <section className="overflow-hidden py-section" aria-labelledby="decorados-titulo">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Decorados"
          title={<span id="decorados-titulo">Um passeio pelo {lodge.name}</span>}
          lead="Texturas naturais de madeira e pedra valorizadas sob iluminação suave. Toque em um vídeo para caminhar pelos ambientes."
        />
        <Button href={`/ambientes/${lodge.slug}`} variant="ghost" className="shrink-0">
          Ver detalhes do projeto e iluminação
        </Button>
      </Container>
      <div className="mt-12">
        <StoriesReel
          items={lodge.reels.map((reel) => ({
            src: reel.src,
            title: reel.title,
            poster: <Picture id={reel.poster} alt="" sizes="(min-width: 640px) 304px, 62vw" className="absolute inset-0" />,
          }))}
        />
      </div>
    </section>
  );
}

/**
 * Home, seção 4 — prova social. A copy traz um depoimento sem autoria: fica como bloco tipográfico,
 * sem nome inventado e sem schema Review. O link leva às avaliações reais no Google.
 */
export function Testimonial() {
  return (
    <Section tone="muted" aria-labelledby="depoimentos-titulo">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        <SectionHeading
          align="center"
          eyebrow="Depoimentos"
          title={<span id="depoimentos-titulo">Histórias reais de transformação e aconchego</span>}
        />
        <figure data-reveal className="flex flex-col items-center gap-6">
          <span aria-hidden className="font-heading text-7xl leading-[0.6] font-bold text-primary-flame">
            “
          </span>
          <blockquote className="text-[clamp(1.375rem,2.6vw,2rem)] leading-snug text-dark-eerie italic">
            Ao renovar nosso lar com a Finger, sentimos uma profunda mudança na atmosfera e no bem-estar da nossa casa.
            É uma experiência que vai muito além da decoração; é sobre viver melhor todos os dias.
          </blockquote>
          <figcaption className="font-heading text-xs font-semibold tracking-wide text-dark-olive uppercase">
            Cliente Finger
          </figcaption>
        </figure>
        <Button href={site.social.googleProfile} variant="secondary" target="_blank" rel="noopener noreferrer">
          Ver avaliações no Google
        </Button>
      </div>
    </Section>
  );
}

/** Home, seção 5 — parceiros e arquitetura. Sem logos de terceiros: faixa com os empreendimentos reais. */
export function Partners() {
  const names = projects.filter((p) => p.kind === "Empreendimento").map((p) => p.name);
  const loop = [...names, ...names, ...names, ...names];
  return (
    <section className="overflow-hidden py-section" aria-labelledby="parceiros-titulo">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-8">
          <SectionHeading
            eyebrow="Parceiros & Arquitetura"
            title={<span id="parceiros-titulo">Aliados estratégicos na criação de projetos de alto padrão</span>}
            lead="Unimos nossa precisão de fabricação ao talento dos melhores arquitetos e designers para dar vida a espaços verdadeiramente únicos."
          />
          <Button href="/para-arquitetos" variant="secondary" size="lg">
            Conheça nosso programa para parceiros
          </Button>
        </div>
        <div data-parallax className="aspect-[4/3] overflow-hidden rounded-md shadow-lg">
          <Picture id="sa-gourmet-7979" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </Container>

      <div
        aria-hidden
        className="marquee mt-16 flex border-y border-neutral-timberwolf/50 py-5 font-heading text-[clamp(1.5rem,4vw,2.75rem)] leading-none font-bold tracking-tight whitespace-nowrap text-dark-olive/80"
      >
        <div className="marquee-track flex shrink-0 items-center">
          {loop.map((name, i) => (
            <span key={i} className="flex items-center">
              <span className="px-8">{name}</span>
              <span className="size-2 rounded-[0_100%_0_0] bg-primary-flame/60" />
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">Empreendimentos com ambientes Finger: {names.join(", ")}.</p>
    </section>
  );
}

/** Fechamento das páginas: chamada única para o orçamento. */
export function FinalCta({ title, lead }: { title?: string; lead?: string }) {
  return (
    <Section tone="dark" aria-labelledby="cta-final-titulo">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <SectionHeading
          tone="dark"
          align="center"
          title={<span id="cta-final-titulo">{title ?? "Dê o primeiro passo para transformar seu espaço"}</span>}
          lead={lead ?? "Conte o que você imagina. Um consultor da Finger responde pelo WhatsApp com atendimento exclusivo."}
        />
        <Button href={site.cta.href} size="lg" className="max-sm:w-full max-sm:px-5">
          {site.cta.label}
        </Button>
      </div>
    </Section>
  );
}
