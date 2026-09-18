import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LoopVideo } from "@/components/media/LoopVideo";
import { Picture } from "@/components/media/Picture";
import { FloorPlan } from "@/components/sections/FloorPlan";
import { FinalCta } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { FurnitureStage } from "@/components/three/FurnitureStage";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Como funciona: do briefing à instalação",
  description:
    "Conheça a jornada de um projeto Finger: escuta empática, projeto 3D personalizado, produção com precisão alemã e instalação cuidadosa.",
  alternates: { canonical: "/como-funciona" },
};

type Step = {
  number: string;
  title: string;
  text: string;
  visual: ReactNode;
  dark?: boolean;
  /** Passo com a cena 3D: no desktop a seção fica presa (sticky) enquanto o scroll conduz a animação. */
  track?: boolean;
};

const steps: Step[] = [
  {
    number: "01",
    title: "Briefing & Escuta Empática",
    text: "Ouvimos suas necessidades práticas e seus desejos estéticos para entender a história que seu ambiente deve contar.",
    visual: (
      <div className="rounded-md border border-neutral-timberwolf bg-neutral-floral p-6 shadow-sm md:p-10">
        <FloorPlan className="w-full" />
      </div>
    ),
  },
  {
    number: "02",
    title: "Projeto 3D & Personalização",
    text: "Desenvolvemos uma proposta tridimensional exclusiva, harmonizando cores, materiais e soluções de iluminação indireta.",
    dark: true,
    track: true,
    visual: <FurnitureStage className="lg:aspect-auto lg:h-[min(78svh,48rem)] lg:max-w-none" />,
  },
  {
    number: "03",
    title: "Produção com Precisão Alemã",
    text: "Seu projeto ganha vida em nossa fábrica, onde a tecnologia de ponta e o cuidado artesanal garantem acabamentos impecáveis.",
    visual: (
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <LoopVideo
          src="/media/video/loop-fabrica-cnc.mp4"
          className="aspect-[4/5] rounded-md shadow-md"
          poster={<Picture id="fabrica-cnc" sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0" />}
        />
        <LoopVideo
          src="/media/video/loop-fabrica-mao.mp4"
          className="mt-10 aspect-[4/5] rounded-md shadow-md"
          poster={<Picture id="fabrica-mao" sizes="(min-width: 1024px) 25vw, 50vw" className="absolute inset-0" />}
        />
      </div>
    ),
  },
  {
    number: "04",
    title: "Entrega e Instalação Cuidadosa",
    text: "Nossa equipe especializada realiza a montagem final com agilidade e respeito ao seu espaço, entregando um ambiente pronto para ser vivido com conforto.",
    visual: (
      <div data-parallax className="aspect-[4/3] overflow-hidden rounded-md shadow-lg">
        <Picture id="sa-gourmet-7979" sizes="(min-width: 1024px) 50vw, 100vw" />
      </div>
    ),
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Como Funciona", path: "/como-funciona" }])} />
      <PageHeader
        eyebrow="Como Funciona"
        title="A jornada de transformação do seu lar"
        lead="Um processo estruturado com rigor técnico e escuta empática do início à instalação final."
      />

      <ol data-process>
        {steps.map((step, i) => (
          <li
            key={step.number}
            data-step
            data-furniture-track={step.track ? "section" : undefined}
            className={cn(!step.track && "py-section", step.track && "max-lg:py-section lg:h-[280vh]", step.dark && "on-dark bg-dark-eerie text-neutral-floral", !step.dark && i % 2 === 0 && "bg-neutral-timberwolf/30")}
          >
            <Container
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                step.track && "lg:sticky lg:top-(--header-h) lg:h-[calc(100svh-var(--header-h))]",
              )}
            >
              <div className={cn("flex flex-col gap-5", i % 2 === 1 && "lg:order-2")}>
                <p
                  aria-hidden
                  className={cn(
                    "font-heading text-[clamp(4rem,9vw,7rem)] leading-[0.85] font-bold tracking-tight",
                    step.dark ? "text-dark-olive" : "text-neutral-timberwolf",
                  )}
                >
                  {step.number}
                </p>
                <h2 data-reveal="lines" className="text-[clamp(1.875rem,3.2vw,2.75rem)]">
                  <span className="sr-only">Passo {Number(step.number)}: </span>
                  {step.title}
                </h2>
                <p data-reveal className={cn("max-w-[48ch] text-lg", step.dark ? "text-neutral-floral/80" : "text-dark-olive")}>
                  {step.text}
                </p>
              </div>
              <div data-reveal>{step.visual}</div>
            </Container>
          </li>
        ))}
      </ol>

      <FinalCta title="Pronto para começar pela primeira conversa?" />
    </>
  );
}
