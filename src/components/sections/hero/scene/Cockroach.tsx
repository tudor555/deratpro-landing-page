"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { CatmullRomCurve3, Group, Mesh, MeshStandardMaterial, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { roachPath } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { usePest } from "./usePest";

const CRAWL_SECONDS = 6.8;

function buildCockroach(uniforms: ReturnType<typeof createDissolveUniforms>) {
  const root = new Group();
  const shell = withDissolve(new MeshStandardMaterial({ color: "#6b3a1f", roughness: 0.2, metalness: 0.3 }), uniforms);
  const legMat = withDissolve(new MeshStandardMaterial({ color: "#3a2012", roughness: 0.45 }), uniforms);

  const shellGeo = new SphereGeometry(0.55, 24, 18);
  shellGeo.scale(0.8, 1.4, 0.35);
  root.add(new Mesh(shellGeo, shell));

  const pronGeo = new SphereGeometry(0.35, 18, 14);
  pronGeo.scale(0.75, 0.7, 0.3);
  const pronotum = new Mesh(pronGeo, shell);
  pronotum.position.set(0, 0.85, 0.05);
  root.add(pronotum);

  for (const side of [-1, 1]) {
    const antenna = new CatmullRomCurve3([
      new Vector3(side * 0.1, 1.05, 0.05),
      new Vector3(side * 0.4, 1.5, 0.1),
      new Vector3(side * 0.65, 1.9, -0.05),
    ]);
    root.add(new Mesh(new TubeGeometry(antenna, 14, 0.015, 6, false), legMat));
  }

  const legs: Array<{ group: Group; side: number; index: number }> = [];
  for (const side of [-1, 1]) {
    [-0.35, 0.1, 0.5].forEach((y, index) => {
      const group = new Group();
      group.position.set(side * 0.35, y, -0.05);
      const curve = new CatmullRomCurve3([
        new Vector3(0, 0, 0),
        new Vector3(side * 0.45, 0.15, -0.08),
        new Vector3(side * 0.75, -0.2, -0.15),
      ]);
      group.add(new Mesh(new TubeGeometry(curve, 12, 0.025, 6, false), legMat));
      root.add(group);
      legs.push({ group, side, index });
    });
  }

  return { root, legs };
}

/** Dezinsecție: a cockroach crawling up the right edge (or along the top on narrow screens). */
export function Cockroach({ scale }: { scale: number }) {
  const store = useSceneStore();
  const uniforms = useMemo(() => createDissolveUniforms(3), []);
  const roach = useMemo(() => buildCockroach(uniforms), [uniforms]);
  const update = usePest(uniforms, 1.6 * scale + 0.4, 26);

  useEffect(() => () => disposeObject(roach.root), [roach]);

  useFrame(() => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const crawling = frame.t < CRAWL_SECONDS;
    const { x, y, heading } = roachPath(frame.t, store);
    const position = { x, y, z: 0.3 };

    roach.root.position.set(x, y, position.z);
    roach.root.scale.setScalar(scale * 0.9);
    roach.root.rotation.z = heading + (crawling ? Math.sin(time * 12) * 0.08 : 0);
    for (const leg of roach.legs) {
      leg.group.rotation.z = crawling ? Math.sin(time * 18 + leg.index * 1.5) * 0.4 * leg.side : 0;
    }
    update(frame, position, roach.root);
  });

  return <primitive object={roach.root} />;
}
