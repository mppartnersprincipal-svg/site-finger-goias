// Decide quanto de 3D o dispositivo aguenta. T0 = sem WebGL (fica o desenho isométrico em SVG),
// T1 = celular/tablet (DPR ≤ 1,5), T2 = desktop (DPR ≤ 2).

export type DeviceTier = 0 | 1 | 2;

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function getDeviceTier(): DeviceTier {
  const nav = navigator as NavigatorHints;
  if (prefersReducedMotion() || nav.connection?.saveData) return 0;
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return 0;
  if (!hasWebGL()) return 0;
  return matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024 ? 1 : 2;
}

export const maxPixelRatio = (tier: DeviceTier) => Math.min(window.devicePixelRatio || 1, tier === 2 ? 2 : 1.5);
