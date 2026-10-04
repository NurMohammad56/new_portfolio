import * as THREE from "three";
import { galleryVertex, galleryFragment } from "./gallery-shaders";
import type { ShowcaseProject } from "@/data/project-showcase";
import { portfolioPalette } from "@/data/palette";

export interface GalleryFrame {
  axes: number[];
  width: number;
  height: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
  hovered: number;
}

// The DOM remains the accessible hit layer. Only the visible images are GPU planes.
export async function createGalleryRenderer(
  root: HTMLElement,
  canvas: HTMLCanvasElement,
  projects: readonly ShowcaseProject[],
  signal: AbortSignal,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 5000);
  camera.position.z = 1000;
  const geometry = new THREE.PlaneGeometry(1, 1, 64, 24);
  const entries: { texture: THREE.CanvasTexture; material: THREE.ShaderMaterial; mesh: THREE.Mesh; hover: number }[] = [];
  let disposed = false;
  let sizeX = 0;
  let sizeY = 0;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    root.dataset.webgl = "false";
    geometry.dispose();
    entries.forEach(entry => { entry.texture.dispose(); entry.material.dispose(); });
    renderer.dispose();
  };
  const contextLost = (event: Event) => { event.preventDefault(); dispose(); };
  canvas.addEventListener("webglcontextlost", contextLost);
  signal.addEventListener("abort", dispose, { once: true });

  try {
    // Sequential preparation keeps all in-flight resources tracked on cancellation.
    for (const project of projects) {
      if (signal.aborted || disposed) throw new DOMException("Cancelled", "AbortError");
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const media = new window.Image();
        const abort = () => { media.src = ""; reject(new DOMException("Cancelled", "AbortError")); };
        media.crossOrigin = "anonymous";
        media.onload = () => { signal.removeEventListener("abort", abort); resolve(media); };
        media.onerror = () => { signal.removeEventListener("abort", abort); reject(new Error("Gallery image unavailable")); };
        signal.addEventListener("abort", abort, { once: true });
        media.src = project.cover;
      });
      if (signal.aborted || disposed) throw new DOMException("Cancelled", "AbortError");
      const surface = document.createElement("canvas");
      surface.width = 1200;
      surface.height = 800;
      const ctx = surface.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      const scale = Math.max(1200 / image.naturalWidth, 800 / image.naturalHeight);
      ctx.drawImage(image, (1200 - image.naturalWidth * scale) / 2, (800 - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
      const shade = ctx.createLinearGradient(0, 570, 0, 800);
      shade.addColorStop(0, "transparent");
      shade.addColorStop(1, portfolioPalette.ink);
      ctx.fillStyle = shade;
      ctx.fillRect(0, 570, 1200, 230);
      ctx.fillStyle = portfolioPalette.signal;
      ctx.font = root.clientWidth < 650 ? "32px Arial, sans-serif" : "18px Arial, sans-serif";
      ctx.fillText(project.category.toUpperCase(), 44, 689);
      ctx.fillStyle = portfolioPalette.text;
      ctx.font = root.clientWidth < 650 ? "76px Arial, sans-serif" : "46px Arial, sans-serif";
      ctx.fillText(project.title, 44, 751);
      ctx.fillStyle = portfolioPalette.signal;
      ctx.beginPath(); ctx.arc(1116, 728, 36, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = portfolioPalette.ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(1103, 740); ctx.lineTo(1127, 716); ctx.moveTo(1106, 716); ctx.lineTo(1127, 716); ctx.lineTo(1127, 737); ctx.stroke();

      const texture = new THREE.CanvasTexture(surface);
      // Canvas data is already display-referred; the reference shader samples it directly.
      const uniforms = {
        uMap: { value: texture }, uTitleMap: { value: texture }, uAffordanceMap: { value: texture },
        uTextureSize: { value: new THREE.Vector2(1200, 800) },
        uPlaneSize: { value: new THREE.Vector2() }, uViewportSize: { value: new THREE.Vector2() },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uWorldCenterX: { value: 0 }, uVelocity: { value: 0 }, uHover: { value: 0 }, uRail: { value: 0 },
        uSheet: { value: 0 }, uFlatten: { value: 0 }, uTime: { value: 0 },
        uDent: { value: 0.35 }, uWave: { value: 0.15 }, uTwist: { value: 0.03 },
        uOpacity: { value: 1 }, uCorner: { value: 20 }, uDim: { value: 0 },
        uTitleOpacity: { value: 0 }, uAffordanceOpacity: { value: 0 },
        uLens: { value: 1 }, uReach: { value: 0.3 }, uOrbit: { value: 0.6 }, uAberr: { value: 0.004 },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: galleryVertex, fragmentShader: galleryFragment, uniforms, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      scene.add(mesh);
      entries.push({ texture, material, mesh, hover: 0 });
    }
  } catch (error) {
    dispose();
    canvas.removeEventListener("webglcontextlost", contextLost);
    signal.removeEventListener("abort", dispose);
    throw error;
  }

  return {
    draw(frame: GalleryFrame) {
      if (disposed) return false;
      const viewportW = root.clientWidth;
      const viewportH = root.clientHeight;
      if (viewportW !== sizeX || viewportH !== sizeY) {
        sizeX = viewportW; sizeY = viewportH;
        camera.aspect = viewportW / viewportH;
        camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(viewportH / 2000));
        camera.updateProjectionMatrix();
        renderer.setSize(viewportW, viewportH, false);
      }
      let settling = false;
      entries.forEach((entry, index) => {
        const axis = frame.axes[index];
        const desiredHover = frame.hovered === index ? 1 : 0;
        entry.hover += (desiredHover - entry.hover) * 0.14;
        if (Math.abs(desiredHover - entry.hover) > 0.005) settling = true;
        entry.mesh.visible = Math.abs(axis) < viewportW / 2 + frame.width;
        entry.mesh.position.set(axis, 0, 0);
        const u = entry.material.uniforms;
        u.uPlaneSize.value.set(frame.width, frame.height);
        u.uViewportSize.value.set(viewportW, viewportH);
        u.uWorldCenterX.value = axis;
        u.uRail.value = axis / viewportW;
        u.uVelocity.value = frame.velocity;
        u.uHover.value = entry.hover;
        u.uTime.value = performance.now() / 1000;
        u.uPointer.value.set(Math.max(0, Math.min(1, (frame.pointerX - viewportW / 2 - axis) / frame.width + 0.5)), Math.max(0, Math.min(1, 0.5 - (frame.pointerY - viewportH / 2) / frame.height)));
      });
      renderer.render(scene, camera);
      root.dataset.webgl = "true";
      return settling;
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", contextLost);
      signal.removeEventListener("abort", dispose);
      dispose();
    },
  };
}
