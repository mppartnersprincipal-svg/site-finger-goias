import type { MediaId } from "@/lib/media";

// Portfólio. Só material real da Finger. Campos sem fonte confirmada (cidade, arquiteto,
// construtora, ano) ficam de fora até o cliente informar — ver checklist de materiais.

export const categories = [
  { id: "cozinhas", label: "Cozinhas" },
  { id: "dormitorios", label: "Dormitórios" },
  { id: "salas", label: "Salas" },
  { id: "closets", label: "Closets" },
  { id: "area-gourmet", label: "Área Gourmet" },
  { id: "banheiros", label: "Banheiros" },
  // Está nos filtros da copy, mas ainda não há material: o filtro só aparece quando houver fotos.
  { id: "corporativo", label: "Corporativo" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type ProjectPhoto = { id: MediaId; category: CategoryId; title: string };
export type ProjectReel = { src: string; poster: MediaId; title: string };

export type Project = {
  slug: string;
  name: string;
  kind: "Empreendimento" | "Showroom";
  summary: string;
  cover: MediaId;
  photos: ProjectPhoto[];
  reels?: ProjectReel[];
};

export const projects: Project[] = [
  {
    slug: "sousa-andrade-t3",
    name: "Sousa Andrade T3",
    kind: "Empreendimento",
    summary:
      "Ambientes integrados em que travertino, madeira e tons de verde-água se encontram sob iluminação suave. Cada módulo foi desenhado para o uso diário, do preparo na bancada gourmet à organização do closet.",
    cover: "sa-gourmet-7844",
    photos: [
      { id: "sa-gourmet-7844", category: "area-gourmet", title: "Área gourmet integrada" },
      { id: "sa-gourmet-7854", category: "area-gourmet", title: "Bancada gourmet" },
      { id: "sa-gourmet-7979", category: "area-gourmet", title: "Gourmet com jardim vertical" },
      { id: "sa-cozinha-7843", category: "cozinhas", title: "Cozinha linear" },
      { id: "sa-cozinha-7849", category: "cozinhas", title: "Ilha de cozinha" },
      { id: "sa-cozinha-8004", category: "cozinhas", title: "Cozinha e jantar integrados" },
      { id: "sa-cozinha-7983", category: "cozinhas", title: "Cozinha com frontão de mármore" },
      { id: "sa-cozinha-7989", category: "cozinhas", title: "Cozinha com nichos iluminados" },
      { id: "sa-sala-7866", category: "salas", title: "Sala de estar" },
      { id: "sa-sala-7879", category: "salas", title: "Canto de estar" },
      { id: "sa-sala-7966", category: "salas", title: "Sala integrada" },
      { id: "sa-dormitorio-7883", category: "dormitorios", title: "Suíte do casal" },
      { id: "sa-dormitorio-7897", category: "dormitorios", title: "Suíte com penteadeira" },
      { id: "sa-dormitorio-7938", category: "dormitorios", title: "Suíte com tijolinho" },
      { id: "sa-dormitorio-7946", category: "dormitorios", title: "Penteadeira" },
      { id: "sa-dormitorio-7904", category: "dormitorios", title: "Dormitório juvenil" },
      { id: "sa-dormitorio-7914", category: "dormitorios", title: "Dormitório com escrivaninha" },
      { id: "sa-dormitorio-7919", category: "dormitorios", title: "Dormitório infantil" },
      { id: "sa-dormitorio-7927", category: "dormitorios", title: "Dormitório infantil com cama embutida" },
      { id: "sa-closet-7963", category: "closets", title: "Closet em vidro fumê" },
      { id: "sa-closet-7949", category: "closets", title: "Corredor de closet" },
      { id: "sa-closet-7894", category: "closets", title: "Closet em vidro bronze" },
      { id: "sa-banheiro-7901", category: "banheiros", title: "Banheiro da suíte" },
    ],
  },
  {
    slug: "nest-23",
    name: "Nest 23",
    kind: "Empreendimento",
    summary:
      "Um apartamento compacto resolvido com marcenaria contínua: madeira em tom de mel, cinza fendi e granito preto atravessam cozinha, sala e dormitórios, com aproveitamento inteligente de cada centímetro.",
    cover: "n23-sala-5068",
    photos: [
      { id: "n23-sala-5068", category: "salas", title: "Sala de estar integrada" },
      { id: "n23-sala-5072", category: "salas", title: "Sala de jantar" },
      { id: "n23-cozinha-5090", category: "cozinhas", title: "Cozinha compacta" },
      { id: "n23-cozinha-5079", category: "cozinhas", title: "Cozinha com ilha" },
      { id: "n23-cozinha-5082", category: "cozinhas", title: "Cozinha e lavanderia" },
      { id: "n23-cozinha-5140", category: "cozinhas", title: "Cozinha em perspectiva" },
      { id: "n23-dormitorio-5111", category: "dormitorios", title: "Suíte com painel em treliça" },
      { id: "n23-dormitorio-5108", category: "dormitorios", title: "Armário e nicho da suíte" },
      { id: "n23-dormitorio-5124", category: "dormitorios", title: "Suíte com cortina iluminada" },
      { id: "n23-dormitorio-5104", category: "dormitorios", title: "Dormitório com home office" },
    ],
  },
  {
    slug: "lodge-vaca-brava",
    name: "Lodge Vaca Brava",
    kind: "Empreendimento",
    summary:
      "Dois decorados em paleta sóbria: painéis ripados em madeira escura, pedra natural e iluminação embutida em cada nicho. Um passeio em vídeo pelos ambientes.",
    cover: "reel-lodge-1",
    photos: [],
    reels: [
      { src: "/media/video/reel-lodge-1.mp4", poster: "reel-lodge-1", title: "Decorado 1 — sala e jantar" },
      { src: "/media/video/reel-lodge-2.mp4", poster: "reel-lodge-2", title: "Decorado 1 — home office e suíte" },
      { src: "/media/video/reel-lodge-3.mp4", poster: "reel-lodge-3", title: "Decorado 2 — canto de refeições e quarto infantil" },
      { src: "/media/video/reel-lodge-4.mp4", poster: "reel-lodge-4", title: "Decorado 2 — sala de estar" },
      { src: "/media/video/reel-lodge-5.mp4", poster: "reel-lodge-5", title: "Decorado 2 — detalhes da cozinha" },
    ],
  },
  {
    slug: "showroom-goiania",
    name: "Showroom Goiânia",
    kind: "Showroom",
    summary:
      "O espaço onde você vê, abre e toca: cozinha completa em verde-musgo e madeira, cristaleiras iluminadas, closet e os organizadores internos que fazem a diferença na rotina.",
    cover: "sr-geral-3941",
    photos: [
      { id: "sr-geral-3941", category: "cozinhas", title: "Cozinha e jantar do showroom" },
      { id: "sr-geral-3963", category: "cozinhas", title: "Ilha central" },
      { id: "sr-cozinha-3836", category: "cozinhas", title: "Cozinha em U" },
      { id: "sr-geral-3960", category: "cozinhas", title: "Vista a partir da ilha" },
      { id: "sr-gavetas-3899", category: "cozinhas", title: "Organizadores internos" },
      { id: "sr-gavetas-3898", category: "cozinhas", title: "Gaveta de talheres" },
      { id: "sr-detalhe-3987", category: "cozinhas", title: "Detalhe da ilha" },
      { id: "sr-detalhe-3935", category: "cozinhas", title: "Banquetas em couro" },
      { id: "sr-cristaleira-3861", category: "salas", title: "Cristaleira" },
      { id: "sr-cristaleira-3875", category: "salas", title: "Cristaleira dupla" },
      { id: "sr-gavetas-3869", category: "salas", title: "Gavetas da cristaleira" },
      { id: "sr-sala-3971", category: "salas", title: "Estar" },
      { id: "sr-closet-3913", category: "closets", title: "Armário planejado" },
      { id: "sr-closet-3846", category: "closets", title: "Closet aberto" },
      { id: "sr-cozinha-3857", category: "closets", title: "Closet ao lado da cozinha" },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Categorias que têm ao menos uma foto, na ordem da copy. */
export const activeCategories = categories.filter((c) =>
  projects.some((p) => p.photos.some((photo) => photo.category === c.id)),
);
