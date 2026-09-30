import { AdditiveBlending, CanvasTexture, NormalBlending, ShaderMaterial, type Texture } from "three";

/** Soft round puff with a slightly uneven edge, so overlapping sprites read as mist rather than dots. */
export function createPuffTexture(): Texture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const cx = size / 2 + Math.cos(angle) * size * 0.1;
    const cy = size / 2 + Math.sin(angle) * size * 0.1;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.38);
    gradient.addColorStop(0, "rgba(255,255,255,0.28)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const vertexShader = /* glsl */ `
attribute float aSize;
attribute float aAlpha;
attribute float aAngle;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying float vAngle;
varying vec3 vColor;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = aSize * uScale / -mvPosition.z;
  vAlpha = aAlpha;
  vAngle = aAngle;
  vColor = aColor;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D uMap;
varying float vAlpha;
varying float vAngle;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float c = cos(vAngle);
  float s = sin(vAngle);
  uv = mat2(c, -s, s, c) * uv + 0.5;
  float alpha = texture2D(uMap, uv).a * vAlpha;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(vColor, alpha);
}
`;

/**
 * Billboard sprite material with per-particle size, alpha, rotation and colour.
 * Normal blending by default: additive light washes out to white on the light hero background.
 */
export function createSpriteMaterial(map: Texture, additive = false): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uMap: { value: map }, uScale: { value: 1 } },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: additive ? AdditiveBlending : NormalBlending,
  });
}

/** Pixels per world unit at distance 1 for a perspective camera — what gl_PointSize needs. */
export function pointScale(canvasHeightPx: number, dpr: number, fovDegrees: number): number {
  return (canvasHeightPx * dpr) / (2 * Math.tan((fovDegrees * Math.PI) / 360));
}
