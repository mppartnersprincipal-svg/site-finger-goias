// Pipeline de imagens: fotos brutas (fora do repo) -> AVIF/WebP responsivos + LQIP + manifest.
// Uso: node scripts/media/build-images.mjs [--force]
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "../..");
const RAW = path.resolve(SITE, "..");
const OUT_DIR = path.join(SITE, "public/media/img");
const MANIFEST = path.join(SITE, "src/content/media-manifest.json");
const WIDTHS = [640, 960, 1280, 1920];
const force = process.argv.includes("--force");

const curation = JSON.parse(await readFile(path.join(here, "curation.json"), "utf8"));
await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
const keep = new Set();

for (const item of curation.images) {
  // "SA/arquivo.jpg" -> roots.SA + "/arquivo.jpg". Raízes em _out/ (stills de vídeo) ficam em scripts/media.
  const [prefix, ...rest] = item.src.split("/");
  const root = curation.roots[prefix];
  if (!root) throw new Error(`Raiz desconhecida em ${item.id}: ${prefix}`);
  const srcPath = path.join(root.startsWith("_out/") ? here : RAW, root, ...rest);
  const buf = await readFile(srcPath);
  const params = JSON.stringify([item.crop ?? null, item.grade ?? null, item.widths ?? WIDTHS, item.quality ?? null]);
  const hash = createHash("md5").update(buf).update(params).digest("hex").slice(0, 8);

  let pipeline = sharp(buf, { failOn: "error" }).rotate();
  if (item.crop) {
    // crop em frações da imagem já orientada: { left, top, width, height } de 0 a 1
    const meta = await sharp(buf).rotate().toBuffer({ resolveWithObject: true });
    const { width: W, height: H } = meta.info;
    pipeline = sharp(meta.data).extract({
      left: Math.round(item.crop.left * W),
      top: Math.round(item.crop.top * H),
      width: Math.round(item.crop.width * W),
      height: Math.round(item.crop.height * H),
    });
  }
  if (item.grade) pipeline = pipeline.modulate(item.grade);
  const base = await pipeline.toBuffer({ resolveWithObject: true });
  const { width: fullW, height: fullH } = base.info;

  const widths = (item.widths ?? WIDTHS).filter((w) => w <= fullW);
  const sources = { avif: [], webp: [] };
  for (const w of widths) {
    for (const fmt of ["avif", "webp"]) {
      const name = `${item.id}-${w}.${hash}.${fmt}`;
      const dest = path.join(OUT_DIR, name);
      keep.add(name);
      const exists = await stat(dest).then(() => true, () => false);
      if (!exists || force) {
        const r = sharp(base.data).resize({ width: w });
        // `quality` por item: pôsteres que ficam sob gradiente escuro aceitam compressão mais forte.
        const [qa, qw] = item.quality ?? [50, 72];
        await (fmt === "avif" ? r.avif({ quality: qa, effort: 6 }) : r.webp({ quality: qw })).toFile(dest);
      }
      sources[fmt].push({ w, src: `/media/img/${name}` });
    }
  }

  const lqip = await sharp(base.data).resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
  manifest[item.id] = {
    width: fullW,
    height: fullH,
    alt: item.alt,
    lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
    sources,
  };
  console.log(`ok ${item.id} (${fullW}x${fullH}, ${widths.join("/")})`);
}

// Remove saídas órfãs de builds anteriores.
for (const f of await readdir(OUT_DIR)) if (!keep.has(f)) await unlink(path.join(OUT_DIR, f));

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} imagens -> ${path.relative(SITE, MANIFEST)}`);
