import { BufferAttribute, BufferGeometry, Color } from "three";

export type SpriteBuffers = {
  geometry: BufferGeometry;
  position: Float32Array;
  size: Float32Array;
  alpha: Float32Array;
  angle: Float32Array;
  color: Float32Array;
  markDirty: () => void;
};

/** Geometry with the attributes the sprite material reads, parked off-screen until used. */
export function createSpriteBuffers(count: number, palette: string[]): SpriteBuffers {
  const geometry = new BufferGeometry();
  const position = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const alpha = new Float32Array(count);
  const angle = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const colors = palette.map((hex) => new Color(hex));

  for (let i = 0; i < count; i++) {
    position[i * 3 + 1] = -100;
    angle[i] = Math.random() * Math.PI * 2;
    colors[i % colors.length].toArray(color, i * 3);
  }

  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aSize", new BufferAttribute(size, 1));
  geometry.setAttribute("aAlpha", new BufferAttribute(alpha, 1));
  geometry.setAttribute("aAngle", new BufferAttribute(angle, 1));
  geometry.setAttribute("aColor", new BufferAttribute(color, 3));
  // Particles roam the whole hero; skip per-frame bounds work and never cull them.
  geometry.boundingSphere = null;

  const markDirty = () => {
    for (const name of ["position", "aSize", "aAlpha", "aAngle"]) geometry.getAttribute(name).needsUpdate = true;
  };

  return { geometry, position, size, alpha, angle, color, markDirty };
}
