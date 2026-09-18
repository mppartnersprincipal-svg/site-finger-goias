import type { Metadata } from "next";
import { Award, Compass, Leaf, ShieldCheck, Target } from "lucide-react";
import { LoopVideo } from "@/components/media/LoopVideo";
import { Picture } from "@/components/media/Picture";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { FinalCta } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Accent, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Sobre a Finger: tradição desde 1978",
  description:
    "Desde 1978, a Finger une a solidez de sua descendência germânica ao dinamismo da modernidade para criar móveis planejados com estética, longevidade e respeito ao meio ambiente.",
  alternates: { canonical: "/sobre" },
};

const pillars = [
  { icon: Target, title: "Missão", text: "Transformar ambientes para o bem-estar das pessoas!" },
  { icon: Compass, title: "Visão", text: "Fazer parte da vida das pessoas!" },
];
const values = [
  { icon: Leaf, label: "Inovação e Sustentabilidade" },
  { icon: ShieldCheck, label: "Credibilidade e Respeito" },
  { icon: Award, label: "Disciplina" },
];

export default function SobrePage() {
  const { showroom } = site;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Sobre", path: "/sobre" }])} />
      <PageHeader
        eyebrow="Sobre a Finger"
        title="Tradição em evoluir para honrar nossa essência"
        lead="Uma trajetória guiada pela disciplina, pelo respeito e pela ousadia de projetar o novo."
      />

      {/* A nossa história */}
      <section className="overflow-hidden pb-section" aria-labelledby="historia-titulo">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="relative">
            {/* Numeral decorativo (o ano já está no texto ao lado): vai em ::before, fora da árvore de
                texto — é decoração pura, isenta de contraste pela WCAG 1.4.3, e não é lida duas vezes. */}
            <div
              aria-hidden
              data-parallax-text
              data-numeral={site.since}
              className="pointer-events-none font-heading text-[clamp(7rem,24vw,17rem)] leading-[0.9] font-bold tracking-tight text-neutral-timberwolf/50 select-none before:content-[attr(data-numeral)]"
            />
            <div className="mt-2 flex flex-col gap-6 pl-1">
              <h2 id="historia-titulo" data-reveal="lines" className="text-[clamp(2rem,3.5vw,3rem)]">
                A nossa história
              </h2>
              <p data-reveal className="max-w-[52ch] text-lg text-dark-olive">
                Em 1978, no município de Sarandi (RS), o Sr. Pedro Lauri Finger deu início a uma trajetória guiada pela
                disciplina, pelo respeito e pela ousadia de projetar o novo. Hoje, a Finger combina o dinamismo da
                modernidade com a solidez de sua descendência germânica, entregando móveis planejados que unem estética,
                longevidade e respeito ao meio ambiente.
              </p>
            </div>
          </div>
          <div data-parallax className="mx-auto aspect-[4/5] w-full max-w-[28rem] overflow-hidden rounded-md shadow-lg">
            <Picture id="fabrica-drone" sizes="(min-width: 1024px) 448px, 100vw" />
          </div>
        </Container>
      </section>

      {/* Vídeo institucional, sob demanda */}
      <Section tone="muted" aria-labelledby="video-titulo">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading
            eyebrow="Por dentro da fábrica"
            title={<span id="video-titulo">Tecnologia de ponta e cuidado artesanal</span>}
            lead="Da chapa ao acabamento, conheça a linha de produção que dá forma a cada projeto."
          />
          <VideoPlayer
            src="/media/video/finger-institucional.mp4"
            title="Conheça a fábrica da Finger"
            poster={<Picture id="institucional-poster" alt="" sizes="(min-width: 1024px) 58vw, 100vw" className="absolute inset-0" />}
          />
        </div>
      </Section>

      {/* Propósito, missão, visão e valores */}
      <Section tone="dark" aria-labelledby="proposito-titulo">
        <div className="flex flex-col gap-16">
          <div className="flex max-w-4xl flex-col gap-6">
            <Eyebrow className="text-neutral-timberwolf">Propósito</Eyebrow>
            <h2 id="proposito-titulo" data-reveal="lines" className="text-[clamp(1.75rem,3.2vw,2.75rem)] leading-snug font-semibold">
              Transformar ambientes, inspirando e traduzindo a <Accent>essência</Accent> única de cada pessoa,
              proporcionando uma experiência completa de design, conforto e bem-estar.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pillars.map(({ icon: Icon, title, text }) => (
              <article key={title} data-reveal className="flex flex-col gap-4 rounded-md bg-dark-olive/60 p-8">
                <Icon aria-hidden size={28} strokeWidth={1.5} className="text-neutral-timberwolf" />
                <h3 className="text-2xl">{title}</h3>
                <p className="text-lg text-neutral-floral/80">{text}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            <Eyebrow className="text-neutral-timberwolf">Valores</Eyebrow>
            <ul className="grid gap-x-8 gap-y-4 border-t border-dark-olive pt-8 sm:grid-cols-3">
              {values.map(({ icon: Icon, label }) => (
                <li key={label} data-reveal className="flex items-center gap-3 font-heading text-lg font-semibold">
                  <Icon aria-hidden size={24} strokeWidth={1.5} className="shrink-0 text-neutral-timberwolf" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Compromisso com o futuro */}
      <Section aria-labelledby="futuro-titulo">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div data-parallax className="aspect-[4/5] overflow-hidden rounded-md shadow-md">
              <Picture id="fabrica-mdf" sizes="(min-width: 1024px) 25vw, 50vw" />
            </div>
            <LoopVideo
              src="/media/video/loop-fabrica-cnc.mp4"
              className="mt-10 aspect-[4/5] rounded-md shadow-md"
              poster={<Picture id="fabrica-cnc" alt="" sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0" />}
            />
          </div>
          <SectionHeading
            eyebrow="Compromisso com o futuro"
            title={<span id="futuro-titulo">Sustentabilidade e longevidade</span>}
            lead="Acreditamos que o design consciente melhora a vida hoje e preserva o amanhã. Por isso, nossos processos produtivos adotam práticas sustentáveis e rígidos padrões de qualidade para garantir que cada peça mantenha sua beleza e funcionalidade ao longo dos anos."
          />
        </div>
      </Section>

      {/* Showroom de Goiânia */}
      <Section tone="muted" aria-labelledby="showroom-titulo">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start gap-8">
            <SectionHeading
              eyebrow={showroom.label}
              title={<span id="showroom-titulo">Veja, abra e toque antes de decidir</span>}
              lead="No showroom você conhece os acabamentos, testa as ferragens e conversa com quem vai desenhar o seu projeto."
            />
            <address className="text-lg text-dark-olive not-italic">
              {showroom.street}
              <br />
              {showroom.complement} · {showroom.district}
              <br />
              {showroom.city} - {showroom.state}
            </address>
            <div className="flex flex-wrap gap-3">
              <Button href={site.cta.href} size="lg" className="max-sm:w-full max-sm:px-5">
                {site.cta.label}
              </Button>
              <Button href={showroom.mapsUrl} variant="secondary" size="lg" target="_blank" rel="noopener noreferrer" className="max-sm:w-full">
                Ver no mapa
              </Button>
            </div>
          </div>
          <div data-parallax className="aspect-[4/3] overflow-hidden rounded-md shadow-lg">
            <Picture id="sr-geral-3941" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
