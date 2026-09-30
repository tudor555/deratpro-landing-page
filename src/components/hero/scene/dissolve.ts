import { Color, type Material } from "three";

export type DissolveUniforms = {
  uDissolve: { value: number };
  uEdgeColor: { value: Color };
  uEdgeWidth: { value: number };
  uNoiseScale: { value: number };
};

export function createDissolveUniforms(noiseScale = 2.4): DissolveUniforms {
  return {
    uDissolve: { value: 0 },
    uEdgeColor: { value: new Color("#80ed99") },
    uEdgeWidth: { value: 0.14 },
    uNoiseScale: { value: noiseScale },
  };
}

const NOISE_GLSL = /* glsl */ `
float dissolveHash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float dissolveValueNoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(dissolveHash(i), dissolveHash(i + vec3(1,0,0)), f.x),
        mix(dissolveHash(i + vec3(0,1,0)), dissolveHash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(dissolveHash(i + vec3(0,0,1)), dissolveHash(i + vec3(1,0,1)), f.x),
        mix(dissolveHash(i + vec3(0,1,1)), dissolveHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float dissolveNoise(vec3 p) {
  return 0.65 * dissolveValueNoise(p) + 0.35 * dissolveValueNoise(p * 2.7 + 11.0);
}
`;

/**
 * Adds a noise-driven dissolve with a glowing mint edge to a built-in material.
 * All materials of one creature share the same uniforms so they dissolve together.
 */
export function withDissolve<T extends Material>(material: T, uniforms: DissolveUniforms): T {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vDissolvePos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvDissolvePos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vDissolvePos;
uniform float uDissolve;
uniform vec3 uEdgeColor;
uniform float uEdgeWidth;
uniform float uNoiseScale;
${NOISE_GLSL}`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
if (uDissolve > 0.001) {
  float n = dissolveNoise(vDissolvePos * uNoiseScale);
  float threshold = uDissolve * (1.0 + uEdgeWidth) - uEdgeWidth;
  if (n < threshold) discard;
  float edge = 1.0 - smoothstep(threshold, threshold + uEdgeWidth, n);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uEdgeColor * 1.4, edge);
  gl_FragColor.a = max(gl_FragColor.a, edge);
}`,
      );
  };
  material.customProgramCacheKey = () => "dissolve";
  return material;
}
