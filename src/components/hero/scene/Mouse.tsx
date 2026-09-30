"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { mousePath } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { usePest } from "./usePest";

function buildMouse(uniforms: ReturnType<typeof createDissolveUniforms>) {
  const root = new Group();
  const fur = withDissolve(new MeshStandardMaterial({ color: "#8c7a6b", roughness: 0.8, metalness: 0.05 }), uniforms);
  const pink = withDissolve(new MeshStandardMaterial({ color: "#f4a5ae", roughness: 0.45 }), uniforms);
  const eyeMat = withDissolve(new MeshStandardMaterial({ color: "#101518", roughness: 0.1, metalness: 0.6 }), uniforms);

  const bodyGeo = new SphereGeometry(0.75, 24, 20);
  bodyGeo.scale(1.2, 0.85, 0.85);
  root.add(new Mesh(bodyGeo, fur));

  const headGeo = new ConeGeometry(0.55, 0.95, 20);
  headGeo.rotateZ(-Math.PI / 2);
  headGeo.scale(0.85, 1, 0.85);
  const head = new Group();
  head.position.set(0.85, 0.1, 0);
  head.add(new Mesh(headGeo, fur));
  const nose = new Mesh(new SphereGeometry(0.1, 16, 16), pink);
  nose.position.set(0.57, 0, 0);
  head.add(nose);
  for (const z of [0.28, -0.28]) {
    const eye = new Mesh(new SphereGeometry(0.09, 16, 16), eyeMat);
    eye.position.set(0.2, 0.25, z);
    head.add(eye);
  }
  root.add(head);

  for (const side of [1, -1]) {
    const outer = new CylinderGeometry(0.32, 0.32, 0.05, 20);
    const inner = new CylinderGeometry(0.24, 0.24, 0.06, 20);
    outer.rotateX(Math.PI / 2);
    inner.rotateX(Math.PI / 2);
    const ear = new Group();
    ear.position.set(0.65, 0.62, 0.38 * side);
    ear.rotation.set(0, 0.25 * side, -0.2);
    ear.add(new Mesh(outer, fur), new Mesh(inner, pink));
    root.add(ear);
  }

  const tailCurve = new CatmullRomCurve3([
    new Vector3(-0.9, -0.1, 0),
    new Vector3(-1.4, 0.2, 0.15),
    new Vector3(-1.8, 0.45, -0.1),
    new Vector3(-2.2, 0.7, 0.1),
  ]);
  const tail = new Mesh(new TubeGeometry(tailCurve, 20, 0.045, 10, false), pink);
  root.add(tail);

  const pawGeo = new SphereGeometry(0.12, 12, 12);
  pawGeo.scale(1.4, 0.7, 1);
  for (const [x, z] of [
    [0.6, 0.4],
    [0.6, -0.4],
    [-0.4, 0.45],
    [-0.4, -0.45],
  ]) {
    const paw = new Mesh(pawGeo.clone(), pink);
    paw.position.set(x, -0.4, z);
    root.add(paw);
  }
  pawGeo.dispose();

  return { root, head, tail };
}

/** Deratizare: a mouse that scurries along the bottom edge, sniffs, then bolts. */
export function Mouse({ scale }: { scale: number }) {
  const store = useSceneStore();
  const uniforms = useMemo(() => createDissolveUniforms(2.2), []);
  const mouse = useMemo(() => buildMouse(uniforms), [uniforms]);
  const update = usePest(uniforms, 1.8 * scale + 0.4, 28);

  useEffect(() => () => disposeObject(mouse.root), [mouse]);

  useFrame(() => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const path = mousePath(frame.t, store);
    const bob = path.moving ? Math.abs(Math.sin(time * 16)) * 0.12 * scale : 0;
    const position = { x: path.x, y: path.y + bob, z: 0.4 };

    mouse.root.position.set(position.x, position.y, position.z);
    mouse.root.scale.setScalar(scale * 0.85);
    mouse.head.rotation.y = path.moving ? 0 : Math.sin(time * 10) * 0.18;
    mouse.tail.rotation.z = Math.sin(time * (path.moving ? 14 : 5)) * 0.25;
    update(frame, position, mouse.root);
  });

  return <primitive object={mouse.root} />;
}
