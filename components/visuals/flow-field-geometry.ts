// An open, folded surface: no closed loops or torus silhouette.
export function flowFieldPoint(u: number, v: number) {
  const x = (u - .5) * 20;
  const y = (v - .5) * 13;
  const fold = y - x * .36 + Math.sin(x * .32) * .7;
  const z = Math.sin(x * .34 + y * .42) * 1.05
    + Math.cos(y * .4 - x * .17) * .55
    + Math.exp(-fold * fold * .28) * 2.1;
  return [x, y, z] as const;
}

function project(u: number, v: number) {
  const [x, y, z] = flowFieldPoint(u, v);
  const tilt = -.46, turn = -.12;
  const y1 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const x2 = x * Math.cos(turn) - y1 * Math.sin(turn);
  const y2 = x * Math.sin(turn) + y1 * Math.cos(turn);
  return `${(600 + x2 * 86).toFixed(1)},${(390 - y2 * 86).toFixed(1)}`;
}

export const flowFieldFallbackPaths = [
  ...Array.from({ length: 48 }, (_, index) =>
    Array.from({ length: 81 }, (_, step) =>
      `${step ? "L" : "M"}${project(index / 47, step / 80)}`).join(" ")),
  ...Array.from({ length: 28 }, (_, index) =>
    Array.from({ length: 121 }, (_, step) =>
      `${step ? "L" : "M"}${project(step / 120, index / 27)}`).join(" ")),
];
