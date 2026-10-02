// Formulário de solicitação de projeto: o mesmo no pop-up dos CTAs e na página /orcamento.
// TODO(cliente): confirmar o texto sobre a taxa (o que ela cobre e se é abatida no fechamento do contrato).

import type { FieldDef } from "@/components/forms/WhatsAppForm";

export const BUDGET_FEE = "R$ 400";

export const budget = {
  title: "Solicite seu projeto personalizado",
  lead: "Conte um pouco sobre o seu espaço. Ao enviar, abrimos o WhatsApp com as respostas preenchidas e um consultor da Finger continua o atendimento por lá.",
  fee: {
    label: "Projeto e orçamento",
    value: BUDGET_FEE,
    text: `Cada projeto Finger é desenhado sob medida para o seu espaço. Para desenvolver o projeto e o orçamento detalhado do seu ambiente, cobramos uma taxa de ${BUDGET_FEE}.`,
  },
  intro: "Olá! Gostaria de solicitar um projeto personalizado com a Finger.",
  submitLabel: "Solicitar atendimento personalizado",
};

export const budgetFields: FieldDef[] = [
  { name: "nome", label: "Nome completo", type: "text", required: true, autoComplete: "name", wide: true },
  { name: "telefone", label: "Telefone / WhatsApp", type: "tel", required: true, autoComplete: "tel", placeholder: "(62) 90000-0000" },
  { name: "email", label: "E-mail", type: "email", required: true, autoComplete: "email" },
  {
    name: "ambientes",
    label: "Ambientes que deseja projetar",
    type: "chips",
    required: true,
    options: ["Cozinha", "Dormitório", "Sala", "Closet", "Banheiro", "Área Gourmet", "Residência Completa", "Corporativo"],
  },
  {
    name: "imovel",
    label: "Tipo de imóvel",
    type: "select",
    options: ["Apartamento", "Casa", "Sala comercial / escritório", "Outro"],
  },
  {
    name: "fase",
    label: "Fase do imóvel",
    type: "select",
    options: ["Na planta", "Em construção", "Em reforma", "Pronto para receber os móveis", "Já moro no imóvel"],
  },
  { name: "local", label: "Bairro e cidade do imóvel", type: "text", placeholder: "Ex.: Setor Bueno, Goiânia" },
  { name: "metragem", label: "Metragem aproximada", type: "text", placeholder: "Ex.: 85 m²" },
  {
    name: "planta",
    label: "Já tem planta ou projeto de arquitetura?",
    type: "select",
    options: ["Tenho a planta do imóvel", "Tenho projeto de arquiteto(a)", "Ainda não tenho"],
    hint: "Você pode enviar os arquivos na conversa do WhatsApp.",
  },
  {
    name: "prazo",
    label: "Prazo estimado para execução",
    type: "select",
    options: ["O quanto antes", "Em até 3 meses", "De 3 a 6 meses", "Mais de 6 meses", "Ainda não sei"],
  },
  {
    name: "detalhes",
    label: "Conte um pouco sobre o projeto",
    type: "textarea",
    placeholder: "Estilo que você gosta, o que não pode faltar, quem vai usar o espaço…",
    wide: true,
  },
  {
    name: "taxa",
    label: `Taxa do projeto (${BUDGET_FEE})`,
    type: "consent",
    required: true,
    consentText: `Estou ciente de que o desenvolvimento do projeto e do orçamento tem uma taxa de ${BUDGET_FEE}.`,
    consentValue: "Ciente",
    wide: true,
  },
];
