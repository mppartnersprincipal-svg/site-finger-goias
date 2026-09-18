// "Módulo Finger": especificação única do móvel procedural (balcão + tampo + aéreo).
// Fonte de verdade para a cena Three.js (FurnitureScene) e para o SVG isométrico de fallback
// (scripts/media/build-furniture-svg.mjs). JS puro para ser importável pelos dois.
//
// Unidades em milímetros. Eixos: x = largura (esq→dir), y = altura, z = profundidade (fundo→frente),
// origem no piso, no centro do balcão. Medidas ilustrativas de um módulo típico — não são
// especificação de produto.

/** @typedef {"madeira"|"frente"|"frenteEscura"|"tampo"|"eerie"|"fundo"|"led"} Material */
/** @typedef {{ id:string, material:Material, size:[number,number,number], pos:[number,number,number], explode:[number,number,number], order:number }} Part */

const T = 18; // espessura do MDF
export const DIMENSIONS = { width: 1800, baseHeight: 720, depth: 580, plinth: 100, top: 30, upperHeight: 600, upperDepth: 350, upperGap: 550, thickness: T };

const BASE_Y = DIMENSIONS.plinth; // o corpo do balcão começa acima do rodapé
const FRONT_Z = DIMENSIONS.depth / 2; // 290
const UP_Y = BASE_Y + DIMENSIONS.baseHeight + DIMENSIONS.top + DIMENSIONS.upperGap; // base do aéreo = 1400
const UP_Z = -FRONT_Z + DIMENSIONS.upperDepth / 2; // aéreo alinhado ao fundo

/** @type {Part[]} — `order` é a sequência real de montagem (caixaria → fundo → gavetas → portas → tampo → aéreo → LED). */
export const PARTS = [
  // ---------- balcão: caixaria
  { id: "rodape", material: "eerie", size: [1800, 100, T], pos: [0, 50, 221], explode: [0, -160, 160], order: 0 },
  { id: "base", material: "madeira", size: [1764, T, 580], pos: [0, BASE_Y + 9, 0], explode: [0, -90, 0], order: 1 },
  { id: "lateral-esq", material: "madeira", size: [T, 720, 580], pos: [-891, BASE_Y + 360, 0], explode: [-340, 0, 0], order: 2 },
  { id: "lateral-dir", material: "madeira", size: [T, 720, 580], pos: [891, BASE_Y + 360, 0], explode: [340, 0, 0], order: 2 },
  { id: "divisoria", material: "madeira", size: [T, 684, 550], pos: [-300, BASE_Y + 360, -11], explode: [0, 0, -40], order: 3 },
  { id: "travessa-frente", material: "madeira", size: [1764, T, 100], pos: [0, BASE_Y + 711, 226], explode: [0, 120, 60], order: 4 },
  { id: "travessa-tras", material: "madeira", size: [1764, T, 100], pos: [0, BASE_Y + 711, -240], explode: [0, 120, -60], order: 4 },
  { id: "fundo", material: "fundo", size: [1764, 684, 3], pos: [0, BASE_Y + 360, -288], explode: [0, 0, -420], order: 5 },
  { id: "prateleira", material: "madeira", size: [1172, T, 540], pos: [295, BASE_Y + 360, -10], explode: [0, 0, 300], order: 6 },
  // ---------- balcão: gavetas (vão de 600) e portas (vão de 1200)
  { id: "gaveta-1-caixa", material: "fundo", size: [540, 150, 500], pos: [-600, 205, 20], explode: [0, 0, 420], order: 7 },
  { id: "gaveta-2-caixa", material: "fundo", size: [540, 150, 500], pos: [-600, 440, 20], explode: [0, 0, 560], order: 7 },
  { id: "gaveta-3-caixa", material: "fundo", size: [540, 150, 500], pos: [-600, 675, 20], explode: [0, 0, 700], order: 7 },
  { id: "gaveta-1-frente", material: "frenteEscura", size: [596, 230, T], pos: [-600, 215, 299], explode: [0, 0, 480], order: 8 },
  { id: "gaveta-2-frente", material: "frenteEscura", size: [596, 230, T], pos: [-600, 450, 299], explode: [0, 0, 620], order: 8 },
  { id: "gaveta-3-frente", material: "frenteEscura", size: [596, 230, T], pos: [-600, 685, 299], explode: [0, 0, 760], order: 8 },
  { id: "porta-1", material: "frente", size: [596, 700, T], pos: [0, 450, 299], explode: [0, 0, 520], order: 9 },
  { id: "porta-2", material: "frente", size: [596, 700, T], pos: [600, 450, 299], explode: [120, 0, 520], order: 9 },
  { id: "gola", material: "eerie", size: [1800, 20, 14], pos: [0, 810, 297], explode: [0, 60, 300], order: 10 },
  { id: "tampo", material: "tampo", size: [1840, 30, 600], pos: [0, 835, 10], explode: [0, 300, 0], order: 11 },
  // ---------- aéreo
  { id: "aereo-lateral-esq", material: "madeira", size: [T, 600, 350], pos: [-891, UP_Y + 300, UP_Z], explode: [-340, 260, 0], order: 12 },
  { id: "aereo-lateral-dir", material: "madeira", size: [T, 600, 350], pos: [891, UP_Y + 300, UP_Z], explode: [340, 260, 0], order: 12 },
  { id: "aereo-base", material: "madeira", size: [1764, T, 350], pos: [0, UP_Y + 9, UP_Z], explode: [0, 170, 0], order: 12 },
  { id: "aereo-topo", material: "madeira", size: [1764, T, 350], pos: [0, UP_Y + 591, UP_Z], explode: [0, 420, 0], order: 12 },
  { id: "aereo-divisoria", material: "madeira", size: [T, 564, 336], pos: [450, UP_Y + 300, UP_Z - 3], explode: [0, 260, -30], order: 13 },
  { id: "aereo-fundo", material: "fundo", size: [1764, 564, 3], pos: [0, UP_Y + 300, -288], explode: [0, 260, -420], order: 13 },
  { id: "aereo-prateleira", material: "madeira", size: [422, T, 330], pos: [670.5, UP_Y + 300, UP_Z - 5], explode: [0, 260, 260], order: 14 },
  { id: "aereo-porta-1", material: "frente", size: [446, 596, T], pos: [-675, UP_Y + 300, 69], explode: [-120, 260, 480], order: 15 },
  { id: "aereo-porta-2", material: "frente", size: [446, 596, T], pos: [-225, UP_Y + 300, 69], explode: [0, 260, 560], order: 15 },
  { id: "aereo-porta-3", material: "frente", size: [446, 596, T], pos: [225, UP_Y + 300, 69], explode: [0, 260, 480], order: 15 },
  // ---------- iluminação indireta
  { id: "led-bancada", material: "led", size: [1764, 10, 14], pos: [0, UP_Y - 5, 45], explode: [0, 120, 200], order: 16 },
  { id: "led-nicho", material: "led", size: [422, 10, 12], pos: [670.5, UP_Y + 23, -278], explode: [0, 200, 200], order: 16 },
];

// Cores de marca por material (DS: nunca preto puro; Flame fica reservado às cotas).
export const MATERIALS = {
  madeira: "#B98A55",
  frente: "#CCC5B9",
  frenteEscura: "#403D39",
  tampo: "#FFFCF2",
  eerie: "#252422",
  fundo: "#D9C3A0",
  led: "#FFE3B0",
};

/** Cotas exibidas no modo "desenho técnico": [rótulo, ponto A, ponto B] em mm, no modelo montado. */
export const COTAS = [
  { label: "1800 mm", a: [-900, 0, 420], b: [900, 0, 420] },
  { label: "720 mm", a: [-1060, BASE_Y, 308], b: [-1060, BASE_Y + 720, 308] },
  { label: "580 mm", a: [1040, 0, -290], b: [1040, 0, 290] },
  { label: "MDF 18 mm", a: [-900, UP_Y + 680, UP_Z], b: [-882, UP_Y + 680, UP_Z] },
];
