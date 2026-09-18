// Cena Three.js do "Módulo Finger". Carregada sob demanda (chunk próprio) por FurnitureCanvas.
// Renderiza só quando o progresso muda ou o palco é redimensionado — sem loop contínuo.
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { COTAS, MATERIALS, PARTS } from "./module-spec.mjs";

const MM = 0.001; // a especificação está em milímetros
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
// Easing da marca, cubic-bezier(.22, 1, .36, 1), aproximado por uma saída exponencial suave.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type PartNode = { mesh: Mesh; edges: LineSegments; home: Vector3; explode: Vector3; delay: number; isLed: boolean };

/** Textura de madeira gerada em canvas (zero download). */
function woodTexture(base: string): CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * size;
    ctx.strokeStyle = `rgba(80, 48, 16, ${0.04 + Math.random() * 0.1})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + 6, size * 0.33, x - 6, size * 0.66, x + (Math.random() * 8 - 4), size);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping;
  return texture;
}

export class FurnitureScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(26, 1, 0.1, 50);
  private root = new Group();
  private parts: PartNode[] = [];
  private fillMaterials: MeshStandardMaterial[] = [];
  private ledMaterial = new MeshBasicMaterial({ color: new Color(MATERIALS.led) });
  private edgeMaterial = new LineBasicMaterial({ color: 0xfffcf2, transparent: true, opacity: 0 });
  private cotaMaterial = new LineBasicMaterial({ color: 0xc44e2a, transparent: true, opacity: 0 });
  private cotaLines: LineSegments;
  private labels: { el: HTMLElement; anchor: Vector3 }[] = [];
  private textures: CanvasTexture[] = [];
  private progress = 0;
  private size = { w: 1, h: 1 };
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private labelLayer: HTMLElement,
    pixelRatio: number,
    private onContextLost: () => void,
  ) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: pixelRatio < 2, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    canvas.addEventListener("webglcontextlost", this.handleContextLost);

    this.scene.add(new HemisphereLight(0xfffcf2, 0x403d39, 1.5), new AmbientLight(0xffffff, 0.35));
    const key = new DirectionalLight(0xfff1dc, 2.2);
    key.position.set(3, 4, 5);
    const fill = new DirectionalLight(0xffe8c8, 0.9);
    fill.position.set(-4, 2, 2);
    this.scene.add(key, fill, this.root);

    // Materiais: um por tipo, compartilhado entre as peças (menos trocas de estado na GPU).
    const wood = woodTexture(MATERIALS.madeira);
    const back = woodTexture(MATERIALS.fundo);
    this.textures.push(wood, back);
    const make = (color: string, map?: CanvasTexture, roughness = 0.82) => {
      const material = new MeshStandardMaterial({ color: map ? 0xffffff : new Color(color), roughness, metalness: 0, transparent: true });
      if (map) material.map = map;
      this.fillMaterials.push(material);
      return material;
    };
    const materials: Record<string, MeshStandardMaterial | MeshBasicMaterial> = {
      madeira: make(MATERIALS.madeira, wood),
      fundo: make(MATERIALS.fundo, back),
      frente: make(MATERIALS.frente, undefined, 0.9),
      frenteEscura: make(MATERIALS.frenteEscura, undefined, 0.9),
      tampo: make(MATERIALS.tampo, undefined, 0.55),
      eerie: make(MATERIALS.eerie, undefined, 0.75),
      led: this.ledMaterial,
    };

    const maxOrder = Math.max(...PARTS.map((p) => p.order));
    for (const part of PARTS) {
      const geometry = new BoxGeometry(part.size[0] * MM, part.size[1] * MM, part.size[2] * MM);
      const mesh = new Mesh(geometry, materials[part.material]);
      const home = new Vector3(part.pos[0] * MM, part.pos[1] * MM, part.pos[2] * MM);
      mesh.position.copy(home);
      const edges = new LineSegments(new EdgesGeometry(geometry), this.edgeMaterial);
      mesh.add(edges);
      this.root.add(mesh);
      this.parts.push({
        mesh,
        edges,
        home,
        explode: new Vector3(part.explode[0] * MM, part.explode[1] * MM, part.explode[2] * MM),
        delay: part.order / maxOrder,
        isLed: part.material === "led",
      });
    }

    // Cotas: uma geometria só, revelada com drawRange; rótulos em DOM (texto nítido e acessível).
    const positions: number[] = [];
    for (const cota of COTAS) {
      positions.push(...cota.a.map((v) => v * MM), ...cota.b.map((v) => v * MM));
      const el = document.createElement("span");
      el.textContent = cota.label;
      el.className =
        "pointer-events-none absolute top-0 left-0 font-heading text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap text-neutral-floral opacity-0 will-change-transform";
      this.labelLayer.appendChild(el);
      this.labels.push({
        el,
        anchor: new Vector3((cota.a[0] + cota.b[0]) / 2, (cota.a[1] + cota.b[1]) / 2, (cota.a[2] + cota.b[2]) / 2).multiplyScalar(MM),
      });
    }
    const cotaGeometry = new BufferGeometry();
    cotaGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    this.cotaLines = new LineSegments(cotaGeometry, this.cotaMaterial);
    this.root.add(this.cotaLines);

    this.root.position.y = -1.0; // centraliza o conjunto (2 m de altura) na origem
    this.setProgress(0);
  }

  resize(width: number, height: number) {
    if (this.disposed || width === 0 || height === 0) return;
    this.size = { w: width, h: height };
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  /** p de 0 a 1: montado → desenho técnico com cotas → explodido → remontado → LED aceso. */
  setProgress(p: number) {
    if (this.disposed) return;
    this.progress = clamp01(p);
    const t = this.progress;

    const technical = easeInOut(range(t, 0.1, 0.3)) * (1 - easeInOut(range(t, 0.62, 0.85)));
    const cotas = easeOut(range(t, 0.16, 0.36)) * (1 - easeInOut(range(t, 0.4, 0.5)));
    const led = easeOut(range(t, 0.9, 1));

    for (const material of this.fillMaterials) material.opacity = 1 - technical * 0.88;
    this.edgeMaterial.opacity = technical;
    this.cotaMaterial.opacity = cotas;
    this.cotaLines.geometry.setDrawRange(0, Math.round(easeOut(range(t, 0.16, 0.36)) * COTAS.length) * 2);
    this.ledMaterial.color.set(MATERIALS.led).multiplyScalar(0.25 + led * 0.95);

    for (const part of this.parts) {
      const out = easeInOut(clamp01((range(t, 0.45, 0.68) - part.delay * 0.35) / 0.65));
      const back = easeInOut(clamp01((range(t, 0.7, 0.96) - part.delay * 0.5) / 0.5));
      part.mesh.position.copy(part.home).addScaledVector(part.explode, out * (1 - back));
    }

    // Câmera: três-quartos no início, mais frontal no desenho técnico, abre para caber a explosão.
    const spread = easeInOut(range(t, 0.45, 0.68)) * (1 - easeInOut(range(t, 0.72, 0.96)));
    const angle = 0.62 - technical * 0.22 + t * 0.12;
    const distance = 6.2 + spread * 2.6;
    this.camera.position.set(Math.sin(angle) * distance, 1.5 - technical * 0.7, Math.cos(angle) * distance);
    this.camera.lookAt(0, 0.05, 0);

    this.render(cotas);
  }

  private render(cotaOpacity = this.cotaMaterial.opacity) {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
    const v = new Vector3();
    for (const { el, anchor } of this.labels) {
      v.copy(anchor).add(this.root.position).project(this.camera);
      // Mantém o rótulo inteiro dentro do palco (em telas estreitas a cota de altura fica na borda).
      const half = el.offsetWidth / 2 + 4;
      const x = Math.min(this.size.w - half, Math.max(half, (v.x * 0.5 + 0.5) * this.size.w));
      const y = (-v.y * 0.5 + 0.5) * this.size.h;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -160%)`;
      el.style.opacity = cotaOpacity.toFixed(2);
    }
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.onContextLost();
  };

  dispose() {
    this.disposed = true;
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    for (const part of this.parts) {
      part.mesh.geometry.dispose();
      part.edges.geometry.dispose();
    }
    this.cotaLines.geometry.dispose();
    [...this.fillMaterials, this.ledMaterial, this.edgeMaterial, this.cotaMaterial].forEach((m) => m.dispose());
    this.textures.forEach((texture) => texture.dispose());
    this.labels.forEach(({ el }) => el.remove());
    this.renderer.dispose();
  }
}
