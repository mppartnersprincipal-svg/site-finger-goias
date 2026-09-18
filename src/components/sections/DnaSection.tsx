import { FurnitureStage } from "@/components/three/FurnitureStage";
import { Button } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/content/site";

const facts = [`Desde ${site.since}`, "Sarandi, RS", "Origem alemã"];

/** Home, seção 3 — "O DNA Finger": manifesto em bloco Eerie com o Módulo Finger em 3D. */
export function DnaSection() {
  return (
    // No desktop a seção é um trilho alto com o conteúdo sticky: o scroll ao longo do trilho conduz a
    // animação 3D (pin em CSS puro, sem JS). No celular não há trilho: a cena acompanha a passagem do palco.
    <section data-furniture-track="section" className="on-dark bg-dark-eerie text-neutral-floral lg:h-[280vh]" aria-labelledby="dna-titulo">
      <Container className="grid items-center gap-12 py-section lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))] lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-0">
        <div className="flex flex-col items-start gap-8">
          <SectionHeading
            tone="dark"
            eyebrow="O DNA Finger"
            title={<span id="dna-titulo">Precisão alemã inspirada no seu jeito de viver</span>}
          />
          <p data-reveal className="max-w-[52ch] text-lg text-neutral-floral/80">
            Fundada em 1978 pelo Sr. Pedro Lauri Finger, a Finger traz em suas raízes a paixão pelo design e a busca
            constante pela inovação tecnológica. Nossa herança germânica nos confere o rigor da precisão em cada
            detalhe, permitindo criar móveis com texturas e acabamentos exclusivos que transformam a rotina em uma
            experiência contínua de bem-estar.
          </p>
          <ul data-reveal className="flex flex-wrap gap-x-6 gap-y-2">
            {facts.map((fact) => (
              <li
                key={fact}
                className="flex items-center gap-2.5 font-heading text-xs font-semibold tracking-wide text-neutral-timberwolf uppercase"
              >
                <span aria-hidden className="size-2 rounded-[0_100%_0_0] bg-primary-flame" />
                {fact}
              </li>
            ))}
          </ul>
          <Button href="/sobre" variant="inverse" size="lg">
            Conheça nossa história
          </Button>
        </div>

        <FurnitureStage className="lg:aspect-auto lg:h-[min(78svh,48rem)] lg:max-w-none" />
      </Container>
    </section>
  );
}
