// Vetoriza o logo oficial (PNG opaco sobre Floral) em SVG: wordmark em currentColor + pingo Flame.
// Uso único: node scripts/media/trace-logo.mjs  (requer `potrace` instalado como devDependency)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import potrace from "potrace";
import sharp from "sharp";
import { optimize } from "svgo";

const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(here, "../..");
const SRC = path.resolve(SITE, "../Design System/Finger Ambientes Design System/assets/logo-primary-floral.png");
const SCALE = 4; // amplia antes de limiarizar para curvas mais limpas

const { data, info } = await sharp(SRC)
  .removeAlpha()
  .resize({ width: 1217 * SCALE, kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

const isFlame = (r, g, b) => r > 140 && g < 140 && b < 110 && r - b > 90;
const isInk = (r, g, b) => Math.max(r, g, b) < 120;

// Caixa delimitadora da marca (tinta + pingo).
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    if (isInk(data[i], data[i + 1], data[i + 2]) || isFlame(data[i], data[i + 1], data[i + 2])) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
const bw = x1 - x0 + 1, bh = y1 - y0 + 1;

async function tracePath(test) {
  const mask = Buffer.alloc(bw * bh, 255);
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const i = ((y + y0) * W + (x + x0)) * 3;
      if (test(data[i], data[i + 1], data[i + 2])) mask[y * bw + x] = 0;
    }
  const png = await sharp(mask, { raw: { width: bw, height: bh, channels: 1 } }).png().toBuffer();
  return new Promise((resolve, reject) => {
    const tracer = new potrace.Potrace({ threshold: 128, turdSize: 40, optTolerance: 1.2, alphaMax: 1.334, optCurve: true });
    tracer.loadImage(png, (err) => {
      if (err) return reject(err);
      resolve(tracer.getPathTag().match(/ d="([^"]+)"/)[1]);
    });
  });
}

const ink = await tracePath(isInk);
const flame = await tracePath(isFlame);

const raw = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bw} ${bh}"><path fill="currentColor" fill-rule="evenodd" d="${ink}"/><path fill="#C44E2A" fill-rule="evenodd" d="${flame}"/></svg>`;
// convertPathData com baixa precisão faceta as curvas do wordmark: só arredonda, sem simplificar.
const { data: svg } = optimize(raw, {
  plugins: [{ name: "preset-default", params: { overrides: { convertPathData: { floatPrecision: 0, straightCurves: false, makeArcs: false, curveSmoothShorthands: false } } } }],
});

const outDir = path.join(SITE, "public/brand");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "logo.svg"), svg);
console.log(`logo.svg: viewBox 0 0 ${bw} ${bh}, ${(svg.length / 1024).toFixed(1)} KB`);
