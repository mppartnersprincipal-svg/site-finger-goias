import type { Metadata } from "next";
import { Clock, Factory, MapPin } from "lucide-react";
import { WhatsAppForm, type FieldDef } from "@/components/forms/WhatsAppForm";
import { Picture } from "@/components/media/Picture";
import { PageHeader } from "@/components/sections/PageHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Orçamento e contato",
  description:
    "Dê o primeiro passo para transformar seu espaço. Preencha o formulário e fale pelo WhatsApp com um consultor da Finger em Goiânia.",
  alternates: { canonical: "/orcamento" },
};

const fields: FieldDef[] = [
  { name: "nome", label: "Nome completo", type: "text", required: true, autoComplete: "name", wide: true },
  { name: "email", label: "E-mail", type: "email", required: true, autoComplete: "email" },
  { name: "telefone", label: "Telefone / WhatsApp", type: "tel", required: true, autoComplete: "tel", placeholder: "(62) 90000-0000" },
  {
    name: "ambientes",
    label: "Ambientes que deseja projetar",
    type: "chips",
    required: true,
    options: ["Cozinha", "Dormitório", "Sala", "Closet", "Banheiro", "Residência Completa", "Corporativo"],
  },
  {
    name: "metragem",
    label: "Metragem aproximada",
    type: "text",
    placeholder: "Ex.: 85 m²",
    hint: "Tem a planta? Você pode enviá-la na conversa do WhatsApp.",
  },
  {
    name: "prazo",
    label: "Prazo estimado para execução",
    type: "select",
    options: ["O quanto antes", "Em até 3 meses", "De 3 a 6 meses", "Mais de 6 meses", "Ainda não sei"],
  },
];

const InfoBlock = ({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) => (
  <div className="flex gap-4">
    <Icon aria-hidden size={24} strokeWidth={1.5} className="mt-1 shrink-0 text-primary-flame" fill="currentColor" fillOpacity={0.15} />
    <div className="flex flex-col gap-1">
      <h3 className="font-heading text-base font-semibold tracking-normal">{title}</h3>
      <div className="text-dark-olive">{children}</div>
    </div>
  </div>
);

export default function OrcamentoPage() {
  const { showroom, factory } = site;
  const link = "link-underline text-primary-flame";
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Orçamento", path: "/orcamento" }])} />
      <PageHeader
        eyebrow="Orçamento e contato"
        title="Dê o primeiro passo para transformar seu espaço"
        lead="Preencha o formulário abaixo para receber o contato de um de nossos consultores de atendimento exclusivo."
      />

      <Container className="grid gap-16 pb-section lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div data-hide-wa>
          <WhatsAppForm
            intro="Olá! Gostaria de solicitar um projeto personalizado com a Finger."
            phone={showroom.whatsapp}
            fields={fields}
            submitLabel="Solicitar atendimento personalizado"
          />
        </div>

        <aside aria-label="Informações institucionais e showroom" className="flex flex-col gap-8">
          <div className="aspect-[4/3] overflow-hidden rounded-md shadow-md">
            <Picture id="sr-geral-3963" sizes="(min-width: 1024px) 38vw, 100vw" />
          </div>
          <InfoBlock icon={MapPin} title={showroom.label}>
            <address className="not-italic">
              {showroom.street}
              <br />
              {showroom.complement} · {showroom.district}
              <br />
              {showroom.city} - {showroom.state}
            </address>
            <p className="mt-2 flex flex-wrap gap-x-5">
              <a href={`https://wa.me/${showroom.whatsapp}`} className={link}>
                {showroom.phoneDisplay}
              </a>
              <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
                Ver no mapa
              </a>
            </p>
          </InfoBlock>
          <InfoBlock icon={Clock} title={showroom.hours?.length ? "Horário do showroom" : "Horário da fábrica"}>
            {(showroom.hours?.length ? showroom.hours : factory.hours).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </InfoBlock>
          <InfoBlock icon={Factory} title={factory.label}>
            <address className="not-italic">
              {factory.street}
              <br />
              {factory.city} - {factory.state}
            </address>
            <p className="mt-2 flex flex-wrap gap-x-5">
              <a href={`mailto:${factory.email}`} className={link}>
                {factory.email}
              </a>
              <span>{factory.phoneDisplay}</span>
            </p>
          </InfoBlock>
        </aside>
      </Container>

      <Section tone="muted" className="py-12">
        <p className="mx-auto max-w-[60ch] text-center text-dark-olive">
          Prefere ver antes de decidir? Visite o showroom e conheça de perto os acabamentos, as ferragens e os
          organizadores internos dos nossos móveis.
        </p>
      </Section>
    </>
  );
}
