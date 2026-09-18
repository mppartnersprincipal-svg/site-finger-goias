// Falha (exit 1) se a mídia gerada estourar o orçamento de peso. Rodar antes do deploy.
// Uso: node scripts/media/check-budget.mjs
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const KB = 1024;

// [padrão do nome do arquivo, limite em KB, descrição]
const RULES = [
  [/^hero-mobile-poster-.*\.avif$/, 70, "pôster do hero mobile (elemento de LCP)"],
  [/^hero-desktop-poster-.*\.avif$/, 110, "pôster do hero desktop (elemento de LCP)"],
  [/-640\.[0-9a-f]+\.avif$/, 60, "foto 640w AVIF"],
  [/-960\.[0-9a-f]+\.avif$/, 110, "foto 960w AVIF"],
  [/-1280\.[0-9a-f]+\.avif$/, 170, "foto 1280w AVIF"],
  [/-1920\.[0-9a-f]+\.avif$/, 300, "foto 1920w AVIF"],
  [/^hero-mobile\.mp4$/, 2300, "vídeo do hero mobile"],
  [/^hero-desktop\.mp4$/, 3000, "vídeo do hero desktop"],
  [/^reel-.*\.mp4$/, 1400, "reel vertical"],
  [/^loop-.*\.mp4$/, 500, "loop de fábrica"],
];

let failures = 0;
let total = 0;
for (const dir of ["public/media/img", "public/media/video"]) {
  for (const file of await readdir(path.join(SITE, dir))) {
    const { size } = await stat(path.join(SITE, dir, file));
    total += size;
    const rule = RULES.find(([pattern]) => pattern.test(file));
    if (rule && size > rule[1] * KB) {
      failures++;
      console.error(`ACIMA DO ORÇAMENTO  ${(size / KB).toFixed(0)} KB > ${rule[1]} KB  ${dir}/${file}  (${rule[2]})`);
    }
  }
}
console.log(`mídia total: ${(total / KB / KB).toFixed(1)} MB`);
if (failures) {
  console.error(`${failures} arquivo(s) acima do orçamento.`);
  process.exit(1);
}
console.log("orçamento de mídia: ok");
