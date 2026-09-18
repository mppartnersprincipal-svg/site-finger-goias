// Gera o fallback isométrico do "Módulo Finger" a partir da MESMA especificação da cena 3D.
// Saída: src/components/three/FurnitureFallback.tsx (SVG inline; cada peça é um <g data-part>
// com data-dx/data-dy = vetor de explosão já projetado, para animar em 2D sem WebGL).
// Uso: node scripts/media/build-furniture-svg.mjs [--preview]
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COTAS, MATERIALS, PARTS } from "../../src/components/three/module-spec.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "../..");

const C30 = Math.cos(Math.PI / 6);
const project = ([x, y, z]) => [(x - z) * C30, (x + z) * 0.5 - y];
const r = (n) => Math.round(n);

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s) => Math.round(((n >> s) & 255) * k).toString(16).padStart(2, "0");
  return `#${ch(16)}${ch(8)}${ch(0)}`;
}

// Faces visíveis com a câmera em (+x, +y, +z): topo, frente (+z) e lateral direita (+x).
function faces({ size: [sx, sy, sz], pos: [cx, cy, cz] }) {
  const [x0, x1, y0, y1, z0, z1] = [cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2, cz - sz / 2, cz + sz / 2];
  return {
    top: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]],
    front: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
    side: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]],
  };
}
const poly = (pts) => pts.map((p) => project(p).map(r).join(",")).join(" ");

// Ordem de desenho para caixas alinhadas aos eixos, câmera em (+x, +y, +z): A fica atrás de B quando
// existe um eixo em que A termina antes de B começar. Ordenar pela soma dos centros (pintor ingênuo)
// erra com peças de tamanhos muito diferentes (tampo x travessa, rodapé x gaveta).
const bounds = (p) => p.pos.map((c, i) => [c - p.size[i] / 2, c + p.size[i] / 2]);
// Silhueta projetada da caixa (casco convexo dos 8 vértices) e interseção exata por eixos separadores.
// Retângulo envolvente não serve: na isometria as silhuetas são hexágonos inclinados e o retângulo
// acusa sobreposição entre peças que não se tocam na tela, criando restrições falsas (e ciclos).
function silhouette(p) {
  const [bx, by, bz] = bounds(p);
  const pts = [];
  for (const x of bx) for (const y of by) for (const z of bz) pts.push(project([x, y, z]));
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => list.reduce((h, q) => { while (h.length > 1 && cross(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop(); h.push(q); return h; }, []);
  const lower = half(pts), upper = half([...pts].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
function overlapOnScreen(A, B) {
  for (const poly of [A, B])
    for (let i = 0; i < poly.length; i++) {
      const [p1, p2] = [poly[i], poly[(i + 1) % poly.length]];
      const axis = [p1[1] - p2[1], p2[0] - p1[0]];
      const span = (P) => P.map((q) => q[0] * axis[0] + q[1] * axis[1]);
      const [a, b] = [span(A), span(B)];
      if (Math.max(...a) <= Math.min(...b) + 0.5 || Math.max(...b) <= Math.min(...a) + 0.5) return false;
    }
  return true;
}
function behindGap(a, b) { // maior folga com que `a` está atrás de `b` em algum eixo (ou -Infinity)
  const [A, B] = [bounds(a), bounds(b)];
  return Math.max(...[0, 1, 2].map((i) => (A[i][1] <= B[i][0] + 0.01 ? B[i][0] - A[i][1] : -Infinity)));
}
function drawOrder(list) {
  const n = list.length, after = list.map(() => new Set()), indeg = Array(n).fill(0);
  const shapes = list.map(silhouette);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      if (!overlapOnScreen(shapes[i], shapes[j])) continue;
      const [ij, ji] = [behindGap(list[i], list[j]), behindGap(list[j], list[i])];
      if (ij === -Infinity && ji === -Infinity) throw new Error(`Peças se interpenetram: ${list[i].id} x ${list[j].id}`);
      const [from, to] = ij >= ji ? [i, j] : [j, i];
      if (!after[from].has(to)) { after[from].add(to); indeg[to]++; }
    }
  const out = [], ready = indeg.map((d, i) => (d === 0 ? i : -1)).filter((i) => i >= 0);
  while (ready.length) {
    const i = ready.shift();
    out.push(list[i]);
    for (const j of after[i]) if (--indeg[j] === 0) ready.push(j);
  }
  if (out.length !== n) throw new Error("Ciclo na ordem de desenho das peças");
  return out;
}
const sorted = drawOrder(PARTS);

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
const grow = ([u, v]) => { minX = Math.min(minX, u); maxX = Math.max(maxX, u); minY = Math.min(minY, v); maxY = Math.max(maxY, v); };
for (const p of PARTS) Object.values(faces(p)).flat().forEach((pt) => grow(project(pt)));
for (const c of COTAS) { grow(project(c.a)); grow(project(c.b)); }

const parts = sorted.map((p) => {
  const f = faces(p);
  const color = MATERIALS[p.material];
  const [dx, dy] = project(p.explode);
  const glow = p.material === "led" ? ' filter="url(#led-glow)"' : "";
  return `<g data-part="${p.id}" data-order="${p.order}" data-dx="${r(dx)}" data-dy="${r(dy)}"${glow}><polygon points="${poly(f.top)}" fill="${color}"/><polygon points="${poly(f.front)}" fill="${shade(color, 0.86)}"/><polygon points="${poly(f.side)}" fill="${shade(color, 0.7)}"/></g>`;
});

const center = [(minX + maxX) / 2, (minY + maxY) / 2];
const cotas = COTAS.map((c) => {
  const [ax, ay] = project(c.a).map(r);
  const [bx, by] = project(c.b).map(r);
  const len = Math.hypot(bx - ax, by - ay) || 1;
  // traço perpendicular nas pontas da cota
  const [nx, ny] = [(-(by - ay) / len) * 22, ((bx - ax) / len) * 22];
  const tick = (x, y) => `M${r(x - nx)} ${r(y - ny)}L${r(x + nx)} ${r(y + ny)}`;
  const [mx, my] = [(ax + bx) / 2, (ay + by) / 2];
  const short = len < 80; // cota pequena (espessura): rótulo ao lado, não no meio
  // rótulo sempre do lado de fora do móvel: a normal aponta para longe do centro do desenho
  const out = (mx - center[0]) * nx + (my - center[1]) * ny >= 0 ? 1 : -1;
  const [tx, ty] = short ? [ax - 40, ay - 46] : [mx + out * nx * 6, my + out * ny * 6 + 18];
  const halfW = c.label.length * 54 * 0.31; // largura aproximada do rótulo (Open Sans 600, 54 u)
  grow([short ? tx - halfW * 2 : tx - halfW, ty - 54]);
  grow([short ? tx : tx + halfW, ty + 14]);
  return `<g data-cota=""><path d="M${ax} ${ay}L${bx} ${by}${tick(ax, ay)}${tick(bx, by)}" stroke="#C44E2A" stroke-width="5" fill="none" vector-effect="non-scaling-stroke"/><text x="${r(tx)}" y="${r(ty)}" text-anchor="${short ? "end" : "middle"}">${c.label}</text></g>`;
});

const pad = 150;
const vb = [r(minX - pad), r(minY - pad), r(maxX - minX + pad * 2), r(maxY - minY + pad * 2)];
const inner = `<defs><filter id="led-glow" x="-20%" y="-400%" width="140%" height="900%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g stroke="#FFFCF2" stroke-opacity=".28" stroke-width="1" stroke-linejoin="round" vector-effect="non-scaling-stroke">${parts.join("")}</g><g fill="#FFFCF2" font-family="var(--font-open-sans), sans-serif" font-size="54" font-weight="600" letter-spacing="1">${cotas.join("")}</g>`;

const tsx = `// GERADO por scripts/media/build-furniture-svg.mjs a partir de module-spec.mjs. Não editar à mão.
import type { SVGProps } from "react";

export const FURNITURE_VIEWBOX = "${vb.join(" ")}";

/** Desenho isométrico do Módulo Finger: placeholder da cena 3D e versão final sem WebGL. */
export function FurnitureFallback(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={FURNITURE_VIEWBOX}
      role="img"
      aria-label="Desenho técnico de um módulo de cozinha planejada: balcão de 1800 por 720 por 580 milímetros em MDF de 18 milímetros, com gavetas, portas, tampo e armário aéreo iluminado"
      {...props}
      dangerouslySetInnerHTML={{ __html: ${JSON.stringify(inner)} }}
    />
  );
}
`;

await writeFile(path.join(SITE, "src/components/three/FurnitureFallback.tsx"), tsx);
console.log(`FurnitureFallback.tsx: viewBox ${vb.join(" ")}, ${(inner.length / 1024).toFixed(1)} KB`);

if (process.argv.includes("--preview")) {
  const { default: sharp } = await import("sharp");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(" ")}" width="1400"><rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="#252422"/>${inner.replace("var(--font-open-sans), sans-serif", "Arial")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(here, "_out/furniture-preview.png"));
}
