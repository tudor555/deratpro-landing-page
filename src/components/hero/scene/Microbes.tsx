"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, SphereGeometry } from "three";
import { microbeAnchors } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, type DissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { usePest } from "./usePest";

const SPIKES = 10;

function buildMicrobe(color: string, size: number, seed: number, uniforms: DissolveUniforms) {
  const root = new Group();
  const coreGeo = new IcosahedronGeometry(size, 3);
  // Lumpy, jelly-like surface instead of a perfect sphere.
  const pos = coreGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const bump = 1 + 0.07 * Math.sin(x * 7 + seed) * Math.sin(y * 6 - seed) * Math.sin(z * 5 + seed * 2);
    pos.setXYZ(i, x * bump, y * bump, z * bump);
  }
  coreGeo.computeVertexNormals();

  const core = withDissolve(
    new MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    }),
    uniforms,
  );
  const spikeMat = withDissolve(new MeshStandardMaterial({ color: "#c7f9cc", roughness: 0.3 }), uniforms);
  root.add(new Mesh(coreGeo, core));

  const spikeGeo = new CylinderGeometry(0.03, 0.06, size * 0.6, 8);
  spikeGeo.translate(0, size * 0.8, 0);
  const capGeo = new SphereGeometry(size * 0.16, 12, 12);
  capGeo.translate(0, size * 1.1, 0);
  for (let s = 0; s < SPIKES; s++) {
    // Even spread on a sphere (golden-angle spiral) so spikes never clump.
    const t = (s + 0.5) / SPIKES;
    const holder = new Group();
    holder.rotation.set(Math.acos(1 - 2 * t), s * 2.39996 + seed, 0, "YXZ");
    holder.add(new Mesh(spikeGeo, spikeMat), new Mesh(capGeo, spikeMat));
    root.add(holder);
  }
  return root;
}

function Microbe({ index, count, scale }: { index: number; count: number; scale: number }) {
  const store = useSceneStore();
  const uniforms = useMemo(() => createDissolveUniforms(3.5), []);
  const anchor = microbeAnchors(store, count)[index];
  const microbe = useMemo(
    () => buildMicrobe(anchor.color, anchor.scale, index * 1.7, uniforms),
    // The anchor's look depends only on its slot, not on the viewport.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, uniforms],
  );
  const update = usePest(uniforms, anchor.scale * 2.4 * scale + 0.3, 18);

  useEffect(() => () => disposeObject(microbe), [microbe]);

  useFrame(() => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const { x, y, z, speed } = microbeAnchors(store, count)[index];
    const drift = { x: x + Math.sin(time * 0.6 * speed + index) * 0.15, y: y + Math.cos(time * 0.5 * speed) * 0.15, z };

    microbe.position.set(drift.x, drift.y, drift.z);
    microbe.rotation.set(time * 0.5 * speed + index, time * 0.4 * speed + index, 0);
    const amount = update(frame, drift, microbe);
    const wobble = 1 + Math.sin(time * 3.5 + index * 2) * 0.08;
    // Microbes shrink as they dissolve, so they read as popping.
    microbe.scale.setScalar(scale * wobble * (1 - amount * 0.6));
  });

  return <primitive object={microbe} />;
}

/** Dezinfecție: translucent, jelly-like microbes wobbling in the corners. */
export function Microbes({ count, scale }: { count: number; scale: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <Microbe key={index} index={index} count={count} scale={scale} />
      ))}
    </>
  );
}
