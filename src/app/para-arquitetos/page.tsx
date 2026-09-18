import type { Metadata } from "next";
import { Megaphone, PenTool, ShieldCheck } from "lucide-react";
import { WhatsAppForm, type FieldDef } from "@/components/forms/WhatsAppForm";
import { Picture } from "@/components/media/Picture";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Accent, Section, SectionHeading } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Para arquitetos e designers: programa de parceiros",
  description:
    "Potencialize a autoridade dos seus projetos com o suporte técnico, a flexibilidade fabril e a precisão germânica da Finger. Seja um parceiro.",
  alternates: { canonical: "/para-arquitetos" },
};

const benefits = [
  {
    icon: PenTool,
    title: "Liberdade criativa sem limites",
    text: "Padrões, texturas e possibilidades de fabricação que permitem traduzir a individualidade de cada cliente em realidade.",
  },
  {
    icon: ShieldCheck,
    title: "Credibilidade e segurança técnica",
    text: "O respaldo de uma marca consolidada com rigor industrial que garante prazos e fidelidade ao seu desenho.",
  },
  {
    icon: Megaphone,
    title: "Co-marketing e visibilidade",
    text: "Produção de conteúdos compartilhados, divulgação de projetos finalizados em nossos canais e fortalecimento mútuo de autoridade.",
  },
];

const fields: FieldDef[] = [
  { name: "nome", label: "Nome completo", type: "text", required: true, autoComplete: "name" },
  { name: "registro", label: "Registro profissional (CAU/ABD)", type: "text", required: true, placeholder: "Ex.: CAU A00000-0" },
  { name: "escritorio", label: "Nome do escritório", type: "text", autoComplete: "organization" },
  { name: "cidade", label: "Cidade/Estado", type: "text", required: true, placeholder: "Ex.: Goiânia/GO", autoComplete: "address-level2" },
  { name: "email", label: "E-mail", type: "email", required: true, autoComplete: "email" },
  { name: "whatsapp", label: "WhatsApp", type: "tel", required: true, autoComplete: "tel", placeholder: "(62) 90000-0000" },
];

export default function ParaArquitetosPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Para Arquitetos", path: "/para-arquitetos" }])} />
      <PageHeader
        tone="dark"
        eyebrow="Para arquitetos e designers"
        title={
          <>
            Não somos apenas fornecedores. Somos seus <Accent>aliados</Accent> estratégicos
          </>
        }
        lead="Potencialize a autoridade dos seus projetos com o suporte técnico, a flexibilidade fabril e a precisão germânica da Finger."
      >
        <Button href="#parceria" size="lg" className="max-sm:px-5">
          Quero me tornar um parceiro estratégico
        </Button>
      </PageHeader>

      <Section aria-labelledby="diferenciais-titulo">
        <div className="flex flex-col gap-12">
          <SectionHeading eyebrow="Diferenciais" title={<span id="diferenciais-titulo">O que muda no seu projeto</span>} />
          <ul className="grid gap-6 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title} data-reveal className="flex flex-col gap-2 rounded-md border border-neutral-timberwolf p-6">
                <Icon aria-hidden size={28} strokeWidth={1.5} className="mb-2 text-primary-flame" fill="currentColor" fillOpacity={0.15} />
                <h3 className="text-xl">{title}</h3>
                <p className="text-dark-olive">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <section className="overflow-hidden pb-section" aria-label="Detalhes de marcenaria">
        <div className="mx-auto grid max-w-container gap-4 px-gutter sm:grid-cols-[1.6fr_1fr] md:gap-6">
          <div data-parallax className="aspect-[4/3] overflow-hidden rounded-md shadow-md sm:aspect-auto">
            <Picture id="sr-gavetas-3899" sizes="(min-width: 640px) 60vw, 100vw" />
          </div>
          <div data-parallax className="aspect-[4/3] overflow-hidden rounded-md shadow-md sm:aspect-[4/5]">
            <Picture id="sr-detalhe-3987" sizes="(min-width: 640px) 40vw, 100vw" />
          </div>
        </div>
      </section>

      <Section id="parceria" tone="muted" data-hide-wa aria-labelledby="parceria-titulo" className="scroll-mt-(--header-h)">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Formulário de parceria"
            title={<span id="parceria-titulo">Seja um arquiteto ou designer parceiro Finger</span>}
            lead="Preencha os seus dados. A conversa continua pelo WhatsApp, com alguém da nossa equipe."
          />
          <WhatsAppForm
            intro="Olá! Sou arquiteto(a)/designer e quero me tornar um parceiro estratégico da Finger."
            phone={site.showroom.whatsapp}
            fields={fields}
            submitLabel="Quero me tornar um parceiro estratégico"
          />
        </div>
      </Section>
    </>
  );
}
