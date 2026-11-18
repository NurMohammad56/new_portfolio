import * as THREE from "three";

/**
 * Particle field that morphs between five shapes, one per stage of a request's
 * life: sphere (request) → lattice cube (logic) → database stack (data) →
 * torus knot (real-time) → spiral galaxy (production).
 *
 * Every particle carries all five target positions; the vertex shader blends
 * the current pair with a per-particle delay and a turbulence burst mid-morph.
 */

export type CorePalette = {
  primary: string;
  secondary: string;
  highlight: string;
  /** Additive light on dark backgrounds; normal blending on light ones. */
  additive: boolean;
  opacity: number;
};

export type CoreFrame = {
  time: number;
  /** 0..4, fractional between stages. */
  progress: number;
  pointerX: number;
  pointerY: number;
  /** Turbulence and drift; off for reduced motion. */
  animate: boolean;
};

const SHAPES = 5;
const TAU = Math.PI * 2;

function randomGenerator(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildShapes(count: number) {
  const random = randomGenerator(20261118);
  const gaussian = () => {
    const u = Math.max(random(), 1e-6), v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
  };
  const shapes = Array.from({ length: SHAPES }, () => new Float32Array(count * 3));
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const o = i * 3;

    // 0 · Request: a luminous sphere with a soft, thick shell.
    {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const r = 1.55 * (0.86 + random() * 0.14);
      shapes[0][o] = Math.cos(theta) * radius * r;
      shapes[0][o + 1] = y * r;
      shapes[0][o + 2] = Math.sin(theta) * radius * r;
    }

    // 1 · Logic: a lattice cube, particles running along its grid lines.
    {
      const half = 1.15;
      const grid = [-1, -0.5, 0, 0.5, 1];
      const face = Math.floor(random() * 6);
      const along = (random() * 2 - 1) * half;
      const snapped = grid[Math.floor(random() * grid.length)] * half;
      const [a, b] = random() < 0.5 ? [along, snapped] : [snapped, along];
      const sign = face % 2 === 0 ? half : -half;
      const axis = Math.floor(face / 2);
      const point = axis === 0 ? [sign, a, b] : axis === 1 ? [a, sign, b] : [a, b, sign];
      shapes[1][o] = point[0];
      shapes[1][o + 1] = point[1];
      shapes[1][o + 2] = point[2];
    }

    // 2 · Data: the database glyph, three stacked cylinders.
    {
      const disc = Math.floor(random() * 3);
      const centerY = (disc - 1) * 0.92;
      const angle = random() * TAU;
      const radius = 1.3;
      const pick = random();
      let x: number, y: number, z: number;
      if (pick < 0.55) {
        // Side band.
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = centerY + (random() - 0.5) * 0.62;
      } else if (pick < 0.85) {
        // Rims, top and bottom of each disc.
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = centerY + (random() < 0.5 ? -0.31 : 0.31);
      } else {
        // Concentric rings on the lid.
        const ring = (Math.floor(random() * 4) + 1) / 4;
        x = Math.cos(angle) * radius * ring;
        z = Math.sin(angle) * radius * ring;
        y = centerY + 0.31;
      }
      shapes[2][o] = x;
      shapes[2][o + 1] = y;
      shapes[2][o + 2] = z;
    }

    // 3 · Real-time: a (2,3) torus knot, an endless loop of messages.
    {
      const t = random() * TAU;
      const p = 2, q = 3;
      const r = Math.cos(q * t) + 2.1;
      const cx = r * Math.cos(p * t) * 0.58;
      const cy = -Math.sin(q * t) * 0.58;
      const cz = r * Math.sin(p * t) * 0.58;
      const spread = 0.09;
      shapes[3][o] = cx + gaussian() * spread;
      shapes[3][o + 1] = cy + gaussian() * spread;
      shapes[3][o + 2] = cz + gaussian() * spread;
    }

    // 4 · Production: a three-arm spiral galaxy, shipped outward. It lies
    // flat (normal = y); the renderer tilts it toward the camera at this stage.
    {
      const arm = i % 3;
      const r = Math.pow(random(), 0.65) * 2;
      const angle = r * 2.7 + (arm / 3) * TAU + gaussian() * 0.22 * (1 - r / 2.6);
      shapes[4][o] = Math.cos(angle) * r;
      shapes[4][o + 1] = gaussian() * 0.1 * (1.25 - r / 2);
      shapes[4][o + 2] = Math.sin(angle) * r;
    }
  }

  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = random();
  return { shapes, seeds };
}

const vertexShader = /* glsl */ `
  attribute vec3 aShape0;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  attribute vec3 aShape4;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uMotion;

  varying float vSeed;
  varying float vDepth;

  vec3 shapeAt(float index) {
    if (index < 0.5) return aShape0;
    if (index < 1.5) return aShape1;
    if (index < 2.5) return aShape2;
    if (index < 3.5) return aShape3;
    return aShape4;
  }

  void main() {
    float segment = clamp(floor(uProgress), 0.0, 3.0);
    float local = uProgress - segment;
    // Each particle leaves on its own beat, so shapes dissolve rather than slide.
    float t = smoothstep(0.0, 1.0, clamp((local - aSeed * 0.35) / 0.65, 0.0, 1.0));
    vec3 position = mix(shapeAt(segment), shapeAt(segment + 1.0), t);

    // Turbulence peaks mid-transition and settles to zero at rest.
    float burst = 4.0 * t * (1.0 - t);
    float phase = uTime * 0.6 + aSeed * 6.2831;
    vec3 swirl = vec3(
      sin(position.y * 2.1 + phase),
      cos(position.z * 2.3 + phase * 1.1),
      sin(position.x * 1.9 - phase * 0.9)
    );
    position += swirl * (0.42 * burst + 0.018 * uMotion);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float twinkle = 0.75 + 0.25 * sin(uTime * 2.0 + aSeed * 40.0) * uMotion;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * twinkle * (1.0 + burst * 0.4) / -mvPosition.z;

    vSeed = aSeed;
    vDepth = clamp((mvPosition.z + 9.0) / 4.5, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uHighlight;
  uniform float uOpacity;

  varying float vSeed;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 1.7);
    vec3 color = mix(uSecondary, uPrimary, smoothstep(0.15, 0.85, vSeed));
    color = mix(color, uHighlight, step(0.93, vSeed) * 0.85);
    gl_FragColor = vec4(color, glow * uOpacity * (0.35 + 0.65 * vDepth));
  }
`;

export function createSystemCoreRenderer(canvas: HTMLCanvasElement, options: { count: number; maxPixelRatio: number }) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, options.maxPixelRatio);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
  camera.position.set(0, 0, 7);

  const { shapes, seeds } = buildShapes(options.count);
  const geometry = new THREE.BufferGeometry();
  // three.js needs a position attribute for bounds; the shader ignores it.
  geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
  shapes.forEach((shape, index) => geometry.setAttribute(`aShape${index}`, new THREE.BufferAttribute(shape, 3)));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4);

  const uniforms = {
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 26 },
    uPixelRatio: { value: pixelRatio },
    uMotion: { value: 1 },
    uPrimary: { value: new THREE.Color() },
    uSecondary: { value: new THREE.Color() },
    uHighlight: { value: new THREE.Color() },
    uOpacity: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  });
  const points = new THREE.Points(geometry, material);
  // Nested on purpose: `spin` turns each shape about its own vertical axis,
  // then the outer `group` tilts and places the spinning shape.
  const spin = new THREE.Group();
  spin.add(points);
  const group = new THREE.Group();
  group.add(spin);
  scene.add(group);

  let wide = true;
  let disposed = false;

  const setPalette = (palette: CorePalette) => {
    uniforms.uPrimary.value.set(palette.primary);
    uniforms.uSecondary.value.set(palette.secondary);
    uniforms.uHighlight.value.set(palette.highlight);
    uniforms.uOpacity.value = palette.opacity;
    material.blending = palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  };

  const resize = (width: number, height: number) => {
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    wide = camera.aspect > 1.05;
    // Keep the shape fully in frame on tall phone screens.
    camera.position.z = wide ? 7 : 7 + (1.05 - camera.aspect) * 9;
    // A farther camera shrinks points; compensate so density reads the same.
    uniforms.uSize.value = 26 * (camera.position.z / 7);
    camera.updateProjectionMatrix();
  };

  const render = (frame: CoreFrame) => {
    if (disposed) return;
    uniforms.uTime.value = frame.time;
    uniforms.uProgress.value = frame.progress;
    uniforms.uMotion.value = frame.animate ? 1 : 0;
    // Desktop: the shape sits right of the captions. Phones: in the gap
    // between the heading and the captions.
    group.position.set(wide ? 1.55 : 0, wide ? 0 : 0.55, 0);
    const drift = frame.animate ? frame.time * 0.12 : 0;
    // On the last stage the galaxy tips toward the camera so its arms read.
    const galaxy = Math.min(Math.max(frame.progress - 3, 0), 1);
    const galaxyTilt = galaxy * galaxy * (3 - 2 * galaxy) * 0.95;
    spin.rotation.y = drift + frame.progress * 0.9;
    group.rotation.x = 0.18 + galaxyTilt + frame.pointerY * 0.3 + Math.sin(frame.progress * 1.3) * 0.12 * (1 - galaxy);
    group.rotation.y = frame.pointerX * 0.45;
    renderer.render(scene, camera);
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };

  return { setPalette, resize, render, dispose };
}

export type SystemCoreRenderer = ReturnType<typeof createSystemCoreRenderer>;
