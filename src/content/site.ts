// Dados institucionais num só lugar: navegação, contatos, redes.
// A copy (Copy do Site.txt) manda em textos e navegação.

export const site = {
  name: "Finger Ambientes Personalizados",
  shortName: "Finger Goiás",
  // Usado em canonical, sitemap e JSON-LD. TODO(cliente): definir NEXT_PUBLIC_SITE_URL com o domínio
  // definitivo; até lá vale a URL de produção que a Vercel injeta no build.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  description:
    "Móveis planejados sob medida com precisão alemã. Cozinhas, dormitórios, salas e closets que traduzem a sua essência em conforto, elegância e bem-estar.",
  since: 1978,

  cta: { label: "Solicite seu projeto personalizado", short: "Solicite seu projeto", href: "/orcamento" },

  nav: [
    { label: "Ambientes", href: "/ambientes" },
    { label: "Sobre", href: "/sobre" },
    { label: "Como Funciona", href: "/como-funciona" },
    { label: "Para Arquitetos", href: "/para-arquitetos" },
    { label: "Blog", href: "/blog" },
  ],

  // Showroom de Goiás. Fonte: finger.ind.br/showrooms (HAUS DECOR, Instagram @fingergoias).
  // TODO(cliente): confirmar que este número é o WhatsApp que recebe os leads e informar o horário da loja.
  showroom: {
    label: "Showroom Goiânia",
    street: "Avenida T-10, esquina com Rua T-27, Quadra 102, nº 208",
    complement: "Ed. New Times Square, Sala 108",
    district: "Setor Bueno",
    city: "Goiânia",
    state: "GO",
    phoneDisplay: "(62) 99800-8080",
    whatsapp: "5562998008080",
    hours: null as string[] | null,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Finger+Ambientes+Personalizados+Avenida+T-10+Setor+Bueno+Goi%C3%A2nia",
  },

  // Fábrica (dados da copy).
  factory: {
    label: "Fábrica / Sede Industrial",
    street: "Rodovia RS 404 - KM 04, Distrito Industrial",
    city: "Sarandi",
    state: "RS",
    phoneDisplay: "+55 (54) 99153-1449",
    email: "atendimento@finger.ind.br",
    hours: ["Segunda a sexta-feira, das 09:00 às 18:00", "Sábados, das 09:00 às 12:00"],
  },

  social: {
    instagram: "https://www.instagram.com/fingergoias/",
    googleProfile: "https://share.google/EtJQWH4Zpqz4G27OB",
  },
} as const;

export type NavItem = (typeof site.nav)[number];
