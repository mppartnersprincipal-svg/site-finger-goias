import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como o site da Finger Goiás trata os seus dados pessoais.",
  alternates: { canonical: "/politica-de-privacidade" },
};

// TODO(cliente): texto-base descrevendo o funcionamento real deste site. Deve ser revisado pelo
// responsável jurídico/LGPD da empresa antes da publicação (controlador, encarregado e contato).
const sections = [
  {
    title: "Quais dados este site coleta",
    body: [
      "Este site não possui cadastro, área de login nem banco de dados de visitantes. Os formulários de orçamento e de parceria não gravam as suas respostas em nossos servidores: ao enviar, o site apenas monta uma mensagem e abre uma conversa no WhatsApp da Finger, no seu aparelho. A mensagem só chega até nós se você optar por enviá-la.",
      "Para entender como o site é utilizado, coletamos estatísticas agregadas e anônimas de navegação e de desempenho (páginas visitadas, tipo de dispositivo, tempo de carregamento). Essa medição não usa cookies e não identifica você individualmente.",
    ],
  },
  {
    title: "Como usamos os dados enviados pelo WhatsApp",
    body: [
      "As informações que você nos envia pelo WhatsApp (nome, contato, ambientes de interesse e demais detalhes do projeto) são usadas exclusivamente para retornar o seu contato, elaborar o seu projeto e o seu orçamento. Não vendemos nem cedemos esses dados a terceiros para fins de marketing.",
      "A conversa acontece na plataforma WhatsApp, que possui termos e política de privacidade próprios.",
    ],
  },
  {
    title: "Links para outros sites",
    body: [
      "Este site contém links para serviços de terceiros, como WhatsApp, Instagram e Google Maps. Ao acessá-los, valem as políticas de privacidade de cada serviço.",
    ],
  },
  {
    title: "Seus direitos",
    body: [
      "A Lei Geral de Proteção de Dados (Lei nº 13.709/2018) garante a você o direito de confirmar a existência de tratamento, acessar, corrigir e solicitar a exclusão dos seus dados pessoais, entre outros. Para exercer esses direitos, fale com a gente pelos canais abaixo.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <PageHeader eyebrow="Institucional" title="Política de privacidade" lead="Transparência sobre o que acontece com os seus dados quando você navega por este site." />
      <Container className="max-w-[46rem] pb-section">
        {sections.map((section) => (
          <section key={section.title} className="mb-10">
            <h2 className="mb-4 text-2xl">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="my-4 text-lg">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        <section>
          <h2 className="mb-4 text-2xl">Contato</h2>
          <p className="my-4 text-lg">
            {site.name} · {site.showroom.label}: {site.showroom.phoneDisplay} ·{" "}
            <a href={`mailto:${site.factory.email}`} className="link-underline text-primary-flame">
              {site.factory.email}
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
