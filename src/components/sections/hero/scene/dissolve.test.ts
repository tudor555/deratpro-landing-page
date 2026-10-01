import { MeshPhysicalMaterial, MeshStandardMaterial, ShaderLib, type WebGLProgramParametersWithUniforms } from "three";
import { describe, expect, it } from "vitest";
import { createDissolveUniforms, withDissolve } from "./dissolve";

function compile(material: MeshStandardMaterial, shader: { vertex: string; fragment: string }) {
  const program = { uniforms: {}, vertexShader: shader.vertex, fragmentShader: shader.fragment };
  material.onBeforeCompile(program as unknown as WebGLProgramParametersWithUniforms, undefined as never);
  return program as { uniforms: Record<string, unknown>; vertexShader: string; fragmentShader: string };
}

describe("withDissolve", () => {
  it("starts fully visible with a mint edge", () => {
    const uniforms = createDissolveUniforms(3);
    expect(uniforms.uDissolve.value).toBe(0);
    expect(uniforms.uNoiseScale.value).toBe(3);
    expect(uniforms.uEdgeColor.value.getHexString()).toBe("80ed99");
  });

  it("injects the shared uniforms and the dissolve step into the built-in shaders", () => {
    const uniforms = createDissolveUniforms();
    const material = withDissolve(new MeshStandardMaterial(), uniforms);
    const program = compile(material, {
      vertex: ShaderLib.standard.vertexShader,
      fragment: ShaderLib.standard.fragmentShader,
    });

    expect(program.uniforms.uDissolve).toBe(uniforms.uDissolve);
    expect(program.vertexShader).toContain("vDissolvePos = position;");
    expect(program.fragmentShader).toContain("uniform float uDissolve;");
    expect(program.fragmentShader).toContain("discard;");
    expect(material.customProgramCacheKey()).toBe("dissolve");
  });

  // If a three.js upgrade renamed these chunks, the patch would silently do nothing.
  it.each([
    ["standard", ShaderLib.standard],
    ["physical", ShaderLib.physical],
  ])("still finds the chunks it patches in three's %s shader", (_, shader) => {
    expect(shader.vertexShader).toContain("#include <common>");
    expect(shader.vertexShader).toContain("#include <begin_vertex>");
    expect(shader.fragmentShader).toContain("#include <common>");
    expect(shader.fragmentShader).toContain("#include <dithering_fragment>");
  });

  it("works on the physical material used for fur and wings", () => {
    const uniforms = createDissolveUniforms();
    const material = withDissolve(new MeshPhysicalMaterial(), uniforms);
    const program = compile(material, {
      vertex: ShaderLib.physical.vertexShader,
      fragment: ShaderLib.physical.fragmentShader,
    });
    expect(program.fragmentShader).toContain("dissolveNoise");
  });
});
