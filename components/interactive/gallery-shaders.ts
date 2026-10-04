// Adapted from the supplied Jesper reference: shared world-space curved planes.
export const galleryVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vRail;
  varying float vVelocity;
  varying float vHover;
  varying float vCurve;
  varying float vEdge;

  uniform vec2 uPlaneSize;
  uniform vec2 uPointer;
  uniform vec2 uViewportSize;
  uniform float uWorldCenterX;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uRail;
  uniform float uSheet;
  uniform float uFlatten;
  uniform float uTime;
  uniform float uDent;
  uniform float uWave;
  uniform float uTwist;

  const float PI = 3.141592653589793;

  float sat(float v) { return clamp(v, 0.0, 1.0); }

  /*
   * One gallery-wide deformation field.
   * Every vertex samples the SAME wave from its world/gallery X coordinate.
   * Card boundaries therefore do not reset the deformation.
   */
  void main() {
    vUv = uv;
    vRail = uRail;
    vVelocity = uVelocity;
    vHover = uHover;

    float flatten = smoothstep(0.0, 1.0, uFlatten);
    float galleryMix = 1.0 - flatten;
    float signedVelocity = clamp(uVelocity / 20.0, -1.55, 1.55);
    float speed = abs(signedVelocity);

    float nx = (uv.x - 0.5) * 2.0;
    float ny = (uv.y - 0.5) * 2.0;
    float halfW = max(uPlaneSize.x * 0.5, 1.0);
    float halfH = max(uPlaneSize.y * 0.5, 1.0);
    float flatX = nx * halfW;
    float flatY = ny * halfH;

    float viewportW = max(uViewportSize.x, 1.0);
    float viewportH = max(uViewportSize.y, 1.0);

    // Continuous world-space coordinate shared by all gallery cards.
    float globalX = uWorldCenterX + flatX;
    // The screenshots show roughly 1.3-1.4 large waves across the viewport,
    // with the first crest left of center. That is very different from one
    // centered cylinder. Velocity shifts this shared phase slightly, producing
    // the elastic travelling-wave feel while the gallery itself moves.
    float phase =
      (globalX / viewportW + 0.18) *
      PI *
      2.72 -
      signedVelocity * 0.16;

    // Broad continuous depth envelope keeps the far sides receded without
    // requiring per-card Z transforms. It is part of the same world-space field.
    float envelopeDistance =
      abs(globalX) /
      max(viewportW * 0.56, 1.0);
    float envelopeDepth =
      -pow(min(envelopeDistance, 1.65), 1.48) *
      min(viewportW * 0.115, 220.0);

    float depthAmplitude =
      min(viewportW * 0.055, 110.0) *
      (1.0 + speed * 0.14);
    float baseDepth = cos(phase) * depthAmplitude;

    // A restrained low harmonic shapes the shoulders without breaking the
    // continuity between neighboring cards.
    float harmonicDepth =
      sin(phase * 0.50 - 0.34) *
      depthAmplitude *
      0.075;

    // High-velocity motion adds a small second shared wave. It is intentionally
    // weaker than the static scene wave so it never becomes liquid/jelly.
    float motionDepth =
      sin(phase * 1.70 + signedVelocity * 0.24) *
      speed *
      depthAmplitude *
      0.18;

    // Small scene-wide vertical drift; perspective from Z supplies most of the
    // large visible top/bottom wave in the reference.
    float verticalAmplitude = min(viewportH * 0.012, 12.0);
    float globalY =
      sin(phase * 0.50 - 0.18) * verticalAmplitude +
      cos(phase * 1.05 + 0.25) *
      signedVelocity *
      verticalAmplitude *
      0.24;

    float waveDepth = envelopeDepth + baseDepth + harmonicDepth + motionDepth;

    // Cross-axis deformation is global-phase based as well, so adjacent cards
    // continue the same twist instead of restarting at their edges.
    float twistAmplitude = min(viewportW * 0.009, 17.0);
    float globalTwist =
      sin(phase * 0.88 + 0.18) *
      ny *
      twistAmplitude *
      (1.0 + speed * 0.42 + abs(uTwist) * 5.0);

    float membraneAmplitude = min(viewportW * 0.0055, 10.0);
    float membrane =
      sin(uv.y * PI) *
      cos(phase * 1.12) *
      speed *
      membraneAmplitude *
      (0.7 + uWave * 4.0);

    vec3 wavedPosition = vec3(
      flatX,
      flatY + globalY,
      waveDepth + globalTwist + membrane
    );

    // Hover pressure is local interaction layered over the shared scene wave.
    vec2 pd = vec2(uv.x - uPointer.x, uv.y - uPointer.y);
    float pressure = exp(-dot(pd, pd) * 18.0) * uHover * galleryMix;
    float radial = 1.0 - sat(length(pd) / 0.42);
    wavedPosition.z += pressure * uPlaneSize.x * uDent * 0.20;
    wavedPosition.x += pd.x * pressure * uPlaneSize.x * 0.016;
    wavedPosition.y += pd.y * pressure * uPlaneSize.y * 0.018;
    wavedPosition.z += radial * radial * uHover * uPlaneSize.x * 0.008 * galleryMix;

    vec3 flatPosition = vec3(flatX, flatY, 0.0);
    vec3 p = mix(wavedPosition, flatPosition, flatten);

    // Detail sheet: release the homepage wave almost completely.
    float sheetVelocity = clamp(uVelocity / 90.0, -1.0, 1.0) * flatten;
    p.x += sin(uv.y * PI) * sheetVelocity * uPlaneSize.x * 0.006;
    p.z += sin(uv.y * PI) * abs(sheetVelocity) * uPlaneSize.x * 0.006;
    p.y += (uv.x - 0.5) * sheetVelocity * uPlaneSize.y * 0.006;

    // Facing estimate derived from the same global wave, only for shading.
    float waveSlope =
      -sin(phase) * depthAmplitude * (PI * 2.72 / viewportW) +
      cos(phase * 0.50 - 0.34) *
      depthAmplitude *
      0.075 *
      0.50 *
      (PI * 2.72 / viewportW);
    vCurve = 1.0 / sqrt(1.0 + waveSlope * waveSlope);
    vEdge = abs(nx);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
export const galleryFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vRail;
  varying float vVelocity;
  varying float vHover;
  varying float vCurve;
  varying float vEdge;

  uniform sampler2D uMap;
  uniform sampler2D uTitleMap;
  uniform sampler2D uAffordanceMap;
  uniform vec2 uTextureSize;
  uniform vec2 uPlaneSize;
  uniform vec2 uPointer;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uSheet;
  uniform float uOpacity;
  uniform float uCorner;
  uniform float uDim;
  uniform float uTime;
  uniform float uTitleOpacity;
  uniform float uAffordanceOpacity;
  uniform float uLens;
  uniform float uReach;
  uniform float uOrbit;
  uniform float uAberr;

  vec2 coverUv(vec2 uv, vec2 planeSize, vec2 texSize) {
    float planeAspect = planeSize.x / max(planeSize.y, 1.0);
    float texAspect = texSize.x / max(texSize.y, 1.0);
    vec2 outUv = uv;
    if (planeAspect > texAspect) {
      float s = texAspect / planeAspect;
      outUv.y = (uv.y - 0.5) * s + 0.5;
    } else {
      float s = planeAspect / texAspect;
      outUv.x = (uv.x - 0.5) * s + 0.5;
    }
    return outUv;
  }

  float roundedMask(vec2 uv, vec2 size, float radius) {
    vec2 halfSize = size * 0.5;
    vec2 p = abs((uv - 0.5) * size) - (halfSize - vec2(radius));
    float d = length(max(p, 0.0)) + min(max(p.x, p.y), 0.0) - radius;
    return 1.0 - smoothstep(-1.1, 1.1, d);
  }

  void main() {
    float velocity = clamp(uVelocity / 42.0, -1.4, 1.4);

    // Lens the media locally around the pointer on hover. The live material
    // exposes lens/reach/orbit controls; this keeps that response restrained.
    vec2 hoverDelta = vUv - uPointer;
    float hoverDistance = length(hoverDelta);
    float reach = max(uReach, 0.001);
    float field = exp(-(hoverDistance * hoverDistance) / (reach * reach)) * uHover * (1.0 - uSheet);
    vec2 hoverUv = vUv - hoverDelta * field * (0.018 * uLens);
    float orbit = sin((hoverDistance * 22.0) - uTime * 2.0) * field * uOrbit * 0.0015;
    hoverUv += vec2(-hoverDelta.y, hoverDelta.x) * orbit;

    vec2 uv = coverUv(hoverUv, uPlaneSize, uTextureSize);

    // Directional chromatic split expands with rail velocity. uAberr mirrors
    // the approximately 0.004 aberration value exposed by the live material.
    vec2 aberration = vec2(velocity * uAberr * 1.15, abs(velocity) * uAberr * 0.18);
    vec3 media;
    if (abs(velocity) < 0.012) {
      media = texture2D(uMap, uv).rgb;
    } else {
      float r = texture2D(uMap, uv + aberration).r;
      float g = texture2D(uMap, uv).g;
      float b = texture2D(uMap, uv - aberration).b;
      media = vec3(r, g, b);
    }

    float side = min(abs(vRail), 1.7);
    float curveShade = mix(0.70, 1.0, clamp(vCurve, 0.0, 1.0));
    float surfaceEdge = 1.0 - vEdge * vEdge * 0.16 * (1.0 - uSheet);
    float edgeShade = (1.0 - side * 0.115) * curveShade * surfaceEdge;
    float movingSheen = sin((vUv.x * 0.7 + vUv.y) * 7.0 + uTime * 0.45) * 0.010 * abs(velocity) * (1.0 - uSheet);
    media = media * edgeShade + movingSheen;

    if (uTitleOpacity > 0.002 && uSheet < 0.998) {
      vec4 titleLayer = texture2D(uTitleMap, vUv);
      media = mix(media, titleLayer.rgb, titleLayer.a * uTitleOpacity * (1.0 - uSheet));
    }

    if (uAffordanceOpacity > 0.002 && uSheet < 0.998) {
      vec4 affordanceLayer = texture2D(uAffordanceMap, vUv);
      media = mix(media, affordanceLayer.rgb, affordanceLayer.a * uAffordanceOpacity * (1.0 - uSheet));
    }

    vec3 sheet = vec3(1.0);
    vec3 color = mix(media, sheet, uSheet);
    color *= mix(1.0, 0.14, uDim);

    float mask = roundedMask(vUv, uPlaneSize, uCorner);
    if (mask < 0.002) discard;
    gl_FragColor = vec4(color, mask * uOpacity);
  }
`;
