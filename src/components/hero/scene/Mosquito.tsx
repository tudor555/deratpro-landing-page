"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { mosquitoPath } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { usePest } from "./usePest";

function buildMosquito(uniforms: ReturnType<typeof createDissolveUniforms>) {
  const root = new Group();
  const body = withDissolve(new MeshStandardMaterial({ color: "#3a4750", roughness: 0.5 }), uniforms);
  const wingMat = withDissolve(
    new MeshStandardMaterial({
      color: "#c7f9cc",
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.3,
      side: DoubleSide,
      depthWrite: false,
    }),
    uniforms,
  );

  const abdomenGeo = new CylinderGeometry(0.12, 0.04, 0.9, 12);
  abdomenGeo.rotateX(Math.PI / 2);
  const abdomen = new Mesh(abdomenGeo, body);
  abdomen.position.set(0, -0.35, -0.15);
  root.add(abdomen, new Mesh(new SphereGeometry(0.22, 14, 14), body));

  const head = new Mesh(new SphereGeometry(0.14, 14, 14), body);
  head.position.set(0, 0.28, 0.05);
  root.add(head);

  const needleGeo = new CylinderGeometry(0.015, 0.01, 0.5, 8);
  needleGeo.rotateX(Math.PI / 3);
  const needle = new Mesh(needleGeo, body);
  needle.position.set(0, 0.48, 0.15);
  root.add(needle);

  const wingShape = new Shape();
  wingShape.absellipse(0, 0.55, 0.17, 0.55, 0, Math.PI * 2, false, 0);
  const wingGeo = new ShapeGeometry(wingShape, 24);
  const wingL = new Mesh(wingGeo, wingMat);
  wingL.position.set(-0.12, 0.1, 0.15);
  wingL.rotation.set(0, -0.3, -Math.PI / 3);
  const wingR = new Mesh(wingGeo.clone(), wingMat);
  wingR.position.set(0.12, 0.1, 0.15);
  wingR.rotation.set(0, 0.3, Math.PI / 3);
  root.add(wingL, wingR);

  for (const side of [-1, 1]) {
    for (const offset of [-0.1, 0.1]) {
      const curve = new CatmullRomCurve3([
        new Vector3(side * 0.15, offset, 0),
        new Vector3(side * 0.5, offset - 0.3, -0.4),
        new Vector3(side * 0.7, offset - 0.7, -0.6),
      ]);
      root.add(new Mesh(new TubeGeometry(curve, 10, 0.015, 6, false), body));
    }
  }

  return { root, wingL, wingR };
}

/** Dezinsecție: a mosquito flying a wobbly path near the top. */
export function Mosquito({ scale }: { scale: number }) {
  const store = useSceneStore();
  const uniforms = useMemo(() => createDissolveUniforms(4), []);
  const mosquito = useMemo(() => buildMosquito(uniforms), [uniforms]);
  const update = usePest(uniforms, 1.4 * scale + 0.4, 22);

  useEffect(() => () => disposeObject(mosquito.root), [mosquito]);

  useFrame(() => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const { x, y } = mosquitoPath(time, store);
    const position = { x, y, z: 0.5 };

    mosquito.root.position.set(x, y, position.z);
    mosquito.root.scale.setScalar(scale * 0.95);
    mosquito.root.rotation.z = Math.sin(time * 1.8) * 0.3;
    mosquito.wingL.rotation.x = Math.sin(time * 48) * 0.65;
    mosquito.wingR.rotation.x = -Math.sin(time * 48) * 0.65;
    update(frame, position, mosquito.root);
  });

  return <primitive object={mosquito.root} />;
}
