import * as THREE from "three";
import { portfolioPalette, THEME_EVENT } from "@/data/palette";
import { flowFieldPoint } from "@/components/visuals/flow-field-geometry";

// Shared by every wire and particle, so the cursor deforms the surface locally
// instead of rotating a rigid object. Vertex animation keeps CPU work minimal.
const deformation = `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uInfluence;
  varying float vCrest;
  varying float vBend;
  vec3 flow(vec3 p) {
    p.z += sin(p.x * .48 + p.y * .28 - uTime * .22) * .28;
    p.y += sin(p.x * .5 + uTime * .18) * .3;
    p.x += sin(p.y * .6 + uTime * .12) * .15;
    vec2 delta = p.xy - uPointer;
    float distanceToPointer = length(delta * vec2(1.0, 1.12));
    float bend = exp(-distanceToPointer * distanceToPointer * .22) * uInfluence;
    p.z += bend * 1.35;
    p.xy += normalize(delta + vec2(.001)) * bend * .38;
    p.y += sin(distanceToPointer * 1.1 - uTime * .9) * bend * .12;
    vCrest = smoothstep(-1.0, 3.0, p.z);
    vBend = bend;
    return p;
  }
`;

export function createHeroFlowRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-8, 8, 4.6, -4.6, .1, 40);
  camera.position.z = 14;
  camera.updateMatrixWorld();
  const group = new THREE.Group();
  scene.add(group);
  const segmentsU = 176, segmentsV = 80;
  const positions: number[] = [], indices: number[] = [];
  for (let i = 0; i <= segmentsU; i++) {
    for (let j = 0; j <= segmentsV; j++) {
      positions.push(...flowFieldPoint(i / segmentsU, j / segmentsV));
      const index = i * (segmentsV + 1) + j;
      if (i < segmentsU) indices.push(index, index + segmentsV + 1);
      if (j < segmentsV) indices.push(index, index + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uInfluence: { value: 0 },
    uColor: { value: new THREE.Color(portfolioPalette.signal) },
    uPixelRatio: { value: renderer.getPixelRatio() },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: deformation + `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(flow(position), 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vCrest;
      varying float vBend;
      void main() {
        gl_FragColor = vec4(uColor, .055 + vCrest * .14 + vBend * .055);
        #include <colorspace_fragment>
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.NormalBlending,
  });
  group.add(new THREE.LineSegments(geometry, material));

  const particleCount = 18;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: deformation + `
      uniform float uPixelRatio;
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(flow(position), 1.0);
        gl_PointSize = (2.6 + vBend) * uPixelRatio;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vCrest;
      varying float vBend;
      void main() {
        float r = length(gl_PointCoord - .5);
        if (r > .5) discard;
        float alpha = (1.0 - smoothstep(.08, .5, r)) * (.42 + vCrest * .28);
        gl_FragColor = vec4(uColor, alpha);
        #include <colorspace_fragment>
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.Points(particleGeometry, particleMaterial));
  const syncColor = () => {
    uniforms.uColor.value.set(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || portfolioPalette.signal);
    renderer.render(scene, camera);
  };
  syncColor();
  window.addEventListener(THEME_EVENT, syncColor);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const cursor = new THREE.Vector3();
  const plane = new THREE.Plane();
  const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1);
  let disposed = false, mouseX = 0, mouseY = 0, scroll = 0;
  const resize = (width: number, height: number) => {
    const aspect = Math.max(1, width) / Math.max(1, height);
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    camera.left = -4.6 * aspect;
    camera.right = 4.6 * aspect;
    camera.updateProjectionMatrix();
  };
  const draw = (time: number, targetX: number, targetY: number, targetScroll: number, dt: number, pointerActive = 0) => {
    if (disposed) return;
    const ease = 1 - Math.exp(-dt * 6);
    mouseX += (targetX - mouseX) * ease;
    mouseY += (targetY - mouseY) * ease;
    scroll += (targetScroll - scroll) * ease;
    group.position.y = scroll * .7;
    group.rotation.set(-.46 + scroll * .06, .04, -.12);
    group.updateMatrixWorld();
    pointer.set(mouseX, -mouseY);
    raycaster.setFromCamera(pointer, camera);
    plane.copy(localPlane).applyMatrix4(group.matrixWorld);
    if (raycaster.ray.intersectPlane(plane, cursor)) {
      group.worldToLocal(cursor);
      uniforms.uPointer.value.set(cursor.x, cursor.y);
    }
    uniforms.uInfluence.value += (pointerActive - uniforms.uInfluence.value) * ease;
    uniforms.uTime.value = time;
    for (let i = 0; i < particleCount; i++) {
      const u = (i * .61803398875 + time * .008) % 1;
      const v = .12 + (i * .41421356237 % 1) * .76;
      particlePositions.set(flowFieldPoint(u, v), i * 3);
    }
    particleGeometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.removeEventListener(THEME_EVENT, syncColor);
    geometry.dispose(); material.dispose(); particleGeometry.dispose(); particleMaterial.dispose(); renderer.dispose();
  };
  return { resize, draw, dispose };
}
