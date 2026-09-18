// Gera miniaturas de 480px de todas as fotos brutas para classificar a curadoria.
// Saída fora do repo: scripts/media/_out/contact/<pasta>/<arquivo>.jpg
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const RAW = path.resolve(here, "../../..");
const OUT = path.join(here, "_out/contact");

const FOLDERS = {
  "sousa-andrade": "Empreendimentos Feitos/4 - Sousa Andrade T3-20260918T161544Z-1-001/4 - Sousa Andrade T3",
  "nest-23": "Empreendimentos Feitos/Nest 23-20260918T153900Z-1-001/Nest 23/Fotos",
  showroom: "Fotos Show Room - Finger",
};

for (const [key, rel] of Object.entries(FOLDERS)) {
  const dir = path.join(RAW, rel);
  const out = path.join(OUT, key);
  await mkdir(out, { recursive: true });
  const files = (await readdir(dir)).filter((f) => /\.jpe?g$/i.test(f)).sort();
  for (const f of files) {
    const dest = path.join(out, f.replace(/\.jpe?g$/i, ".jpg").toLowerCase());
    try {
      await sharp(path.join(dir, f), { failOn: "error" })
        .rotate()
        .resize({ width: 480 })
        .jpeg({ quality: 70 })
        .toFile(dest);
    } catch (e) {
      console.warn(`SKIP ${key}/${f}: ${e.message}`);
    }
  }
  console.log(`${key}: ${files.length} arquivos`);
}
