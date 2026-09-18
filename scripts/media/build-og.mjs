// Gera a imagem Open Graph (1200x630) a partir de foto real + logo, em src/app/opengraph-image.jpg.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "../..");
const curation = JSON.parse(await readFile(path.join(here, "curation.json"), "utf8"));
const photo = path.resolve(SITE, "..", curation.roots.SA, "2J4A7844-HDR.jpg");
const logo = (await readFile(path.join(SITE, "public/brand/logo.svg"), "utf8")).replace("currentColor", "#FFFCF2");

const W = 1200, H = 630;
const scrim = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" stop-color="#252422" stop-opacity=".1"/><stop offset="1" stop-color="#252422" stop-opacity=".85"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="72" y="566" font-family="Open Sans, Arial, sans-serif" font-size="30" font-weight="600" fill="#FFFCF2" letter-spacing="2.4">AMBIENTES PERSONALIZADOS · DESDE 1978</text></svg>`;
const logoPng = await sharp(Buffer.from(logo)).resize({ height: 130 }).png().toBuffer();

const out = await sharp(photo).rotate().resize(W, H, { fit: "cover", position: "centre" })
  .composite([{ input: Buffer.from(scrim) }, { input: logoPng, left: 70, top: 370 }])
  .jpeg({ quality: 82, mozjpeg: true }).toBuffer();
await writeFile(path.join(SITE, "src/app/opengraph-image.jpg"), out);
await writeFile(path.join(SITE, "src/app/opengraph-image.alt.txt"), "Área gourmet planejada pela Finger, com o logotipo Finger Ambientes Personalizados");
console.log(`opengraph-image.jpg: ${(out.length / 1024).toFixed(0)} KB`);
