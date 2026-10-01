import { type Curve, TubeGeometry, Vector3 } from "three";

/** A tube along a curve whose radius shrinks linearly from `startRadius` to `endRadius`, for tails, legs and antennae. */
export function taperTube(curve: Curve<Vector3>, segments: number, startRadius: number, endRadius: number, radial = 8) {
  const geometry = new TubeGeometry(curve, segments, 1, radial, false);
  const pos = geometry.attributes.position;
  const centre = new Vector3();
  const vertex = new Vector3();
  // TubeGeometry lays out (segments + 1) rings of (radial + 1) vertices each.
  for (let ring = 0; ring <= segments; ring++) {
    const t = ring / segments;
    curve.getPointAt(t, centre);
    const radius = startRadius + (endRadius - startRadius) * t;
    for (let j = 0; j <= radial; j++) {
      const i = ring * (radial + 1) + j;
      vertex.fromBufferAttribute(pos, i).sub(centre).multiplyScalar(radius).add(centre);
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}
