import { HeroVideo } from "@/components/media/HeroVideo";
import { Button } from "@/components/ui/Button";
import { Accent, Container, Eyebrow } from "@/components/ui/primitives";
import { fallbackSrc, media, srcSet } from "@/lib/media";

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Hero full-bleed da Home (copy: "Hero — vídeo fullscreen"). O <img> do pôster é o elemento de LCP. */
export function HomeHero() {
  const mobile = media("hero-mobile-poster");
  const desktop = media("hero-desktop-poster");
  const mobileQuery = "(max-width: 767px)";

  return (
    <section className="on-dark relative isolate flex min-h-[calc(100svh-var(--header-h))] items-end overflow-hidden bg-dark-eerie text-neutral-floral lg:max-h-[56.25rem]">
      <div className="absolute inset-0 -z-10">
        {/* Direção de arte: quadro vertical da fábrica no celular, área gourmet horizontal no desktop. */}
        <picture>
          <source media={mobileQuery} type="image/avif" srcSet={srcSet(mobile.sources.avif)} sizes="100vw" />
          <source media={mobileQuery} type="image/webp" srcSet={srcSet(mobile.sources.webp)} sizes="100vw" />
          <source type="image/avif" srcSet={srcSet(desktop.sources.avif)} sizes="100vw" />
          <source type="image/webp" srcSet={srcSet(desktop.sources.webp)} sizes="100vw" />
          <img
            src={fallbackSrc(desktop)}
            alt=""
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <HeroVideo mobileSrc="/media/video/hero-mobile.mp4" desktopSrc="/media/video/hero-desktop.mp4" />
        <div aria-hidden className="hero-scrim absolute inset-0" />
      </div>

      <Container className="pt-40 pb-12 md:pb-20">
        <div className="flex max-w-[44rem] flex-col items-start gap-6">
          <Eyebrow className="hero-rise text-neutral-floral/80" style={rise(0)}>
            Ambientes personalizados · Desde 1978
          </Eyebrow>
          <h1 className="hero-rise text-[clamp(2.5rem,5vw,4.25rem)]" style={rise(1)}>
            A precisão da engenharia e a arte de <Accent>viver bem</Accent>
          </h1>
          <p className="hero-rise max-w-[46ch] text-lg text-neutral-floral/90" style={rise(2)}>
            Transformamos ambientes inspirando e traduzindo a sua essência única em espaços de conforto, elegância e
            bem-estar.
          </p>
          <div className="hero-rise flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={rise(3)}>
            <Button href="/orcamento" size="lg" className="max-sm:px-5">
              Solicite seu projeto personalizado
            </Button>
            <Button href="/ambientes" variant="inverse" size="lg">
              Explore nossos ambientes
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
