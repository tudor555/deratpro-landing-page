"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  CapsuleGeometry,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { mousePath } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, type DissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { usePest } from "./usePest";
import { taperTube } from "./taperTube";

const BODY_LENGTH = 2.3;

const ellipse = (u: number, centre: number, half: number, radius: number) => {
  const d = (u - centre) / half;
  return d >= 1 || d <= -1 ? 0 : radius * Math.sqrt(1 - d * d);
};

/** Body and head as one profile, blended with a smooth max so the neck has no seam. */
function bodyRadius(u: number) {
  const body = ellipse(u, 0.33, 0.33, 0.6);
  const head = ellipse(u, 0.8, 0.2, 0.36);
  const k = 0.06;
  return k * Math.log(Math.exp(body / k) + Math.exp(head / k)) - k * Math.log(2) * (1 - Math.min(body, head) / 0.36);
}

/** Maps a direction around the long axis and a position along it (0 = rump, 1 = nose) onto the body surface. */
function bodyPoint(u: number, ny: number, nz: number) {
  const r = bodyRadius(u);
  const arch = 0.14 * Math.sin(Math.PI * Math.min(u / 0.7, 1));
  const snoutDrop = -0.1 * Math.max(0, (u - 0.72) / 0.28);
  const belly = ny < 0 ? 0.82 : 1;
  return new Vector3((u - 0.5) * BODY_LENGTH, r * ny * belly + arch + snoutDrop, r * nz);
}

function buildBodyGeometry() {
  const geometry = new SphereGeometry(1, 64, 40);
  geometry.rotateZ(Math.PI / 2); // poles along x: rump at -x, nose at +x
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const back = new Color("#7f6a58");
  const belly = new Color("#e2d4c4");
  const snout = new Color("#d9a0a0");
  const tmp = new Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const ny = pos.getY(i);
    const nz = pos.getZ(i);
    const rho = Math.hypot(ny, nz) || 1;
    const u = (x + 1) / 2;
    const p = bodyPoint(u, ny / rho, nz / rho);
    pos.setXYZ(i, p.x, p.y, p.z);

    tmp.copy(belly).lerp(back, Math.min(1, Math.max(0, (ny / rho) * 0.8 + 0.55)));
    if (u > 0.95) tmp.lerp(snout, (u - 0.95) / 0.05);
    tmp.toArray(colors, i * 3);
  }
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function buildEar(fur: MeshPhysicalMaterial, inner: MeshStandardMaterial, side: number) {
  const ear = new Group();
  const cup = new SphereGeometry(0.27, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
  cup.scale(1, 0.42, 1.12);
  const lining = cup.clone().scale(0.84, 0.84, 0.84);
  lining.translate(0, -0.02, 0);
  ear.add(new Mesh(cup, fur), new Mesh(lining, inner));
  // The cup opens downward by default; turn it to face forward and outward.
  const opening = new Vector3(0.55, 0.15, side * 0.82).normalize();
  ear.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), opening));
  ear.position.copy(bodyPoint(0.74, 0.78, side * 0.55)).add(new Vector3(-0.02, 0.1, 0));
  return ear;
}

function buildMouse(uniforms: DissolveUniforms) {
  const root = new Group();
  const figure = new Group();
  root.add(figure);

  const fur = withDissolve(
    new MeshPhysicalMaterial({
      color: "#ffffff",
      vertexColors: true,
      roughness: 0.85,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: new Color("#f3e6d8"),
    }),
    uniforms,
  );
  const earFur = withDissolve(
    new MeshPhysicalMaterial({ color: "#8f7a67", roughness: 0.85, sheen: 1, sheenColor: new Color("#f3e6d8"), side: DoubleSide }),
    uniforms,
  );
  const pink = withDissolve(new MeshStandardMaterial({ color: "#eaa5a8", roughness: 0.55, side: DoubleSide }), uniforms);
  const skin = withDissolve(new MeshStandardMaterial({ color: "#e7b3ac", roughness: 0.6 }), uniforms);
  const eyeMat = withDissolve(
    new MeshPhysicalMaterial({ color: "#0b0d10", roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.05 }),
    uniforms,
  );
  const glint = withDissolve(new MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.8 }), uniforms);
  const whiskerMat = withDissolve(new MeshStandardMaterial({ color: "#f4efe8", roughness: 0.4, transparent: true, opacity: 0.8 }), uniforms);

  figure.add(new Mesh(buildBodyGeometry(), fur));
  figure.add(buildEar(earFur, pink, 1), buildEar(earFur, pink, -1));

  for (const side of [1, -1]) {
    const eyeAt = bodyPoint(0.865, 0.42, side * 0.86);
    const eye = new Mesh(new SphereGeometry(0.072, 20, 16), eyeMat);
    eye.position.copy(eyeAt);
    const spark = new Mesh(new SphereGeometry(0.018, 8, 8), glint);
    spark.position.copy(eyeAt).add(new Vector3(0.03, 0.035, side * 0.05));
    figure.add(eye, spark);
  }

  const nose = new Mesh(new SphereGeometry(0.06, 16, 12), pink);
  nose.position.copy(bodyPoint(1, 0, 0)).add(new Vector3(0.02, 0, 0));
  figure.add(nose);

  const whiskers = new Group();
  whiskers.position.copy(bodyPoint(0.975, 0, 0));
  for (const side of [1, -1]) {
    [-0.12, 0.02, 0.16].forEach((lift, i) => {
      const curve = new CatmullRomCurve3([
        new Vector3(0, 0, side * 0.04),
        new Vector3(-0.05, lift * 0.6, side * 0.28),
        new Vector3(-0.14 - i * 0.03, lift, side * 0.5),
      ]);
      whiskers.add(new Mesh(new TubeGeometry(curve, 8, 0.005, 4, false), whiskerMat));
    });
  }
  figure.add(whiskers);

  const tailBase = new Group();
  tailBase.position.copy(bodyPoint(0.02, -0.2, 0));
  const tailCurve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-0.5, -0.12, 0.08),
    new Vector3(-1.05, -0.08, 0.2),
    new Vector3(-1.6, 0.12, 0.12),
    new Vector3(-2.0, 0.34, -0.04),
  ]);
  tailBase.add(new Mesh(taperTube(tailCurve, 48, 0.055, 0.012), skin));
  figure.add(tailBase);

  const legs: Array<{ pivot: Group; phase: number }> = [];
  const legGeo = new CapsuleGeometry(0.055, 0.2, 4, 10);
  legGeo.translate(0, -0.13, 0);
  const pawGeo = new SphereGeometry(0.07, 14, 10);
  pawGeo.scale(1.6, 0.55, 1.1);
  pawGeo.translate(0.05, -0.28, 0);
  for (const [u, side, phase] of [
    [0.72, 1, 0],
    [0.72, -1, Math.PI],
    [0.22, 1, Math.PI],
    [0.22, -1, 0],
  ] as const) {
    const pivot = new Group();
    const hip = bodyPoint(u, -0.75, side * 0.55);
    pivot.position.set(hip.x, hip.y + 0.12, hip.z);
    pivot.add(new Mesh(legGeo, skin), new Mesh(pawGeo, skin));
    figure.add(pivot);
    legs.push({ pivot, phase });
  }

  // Lift the model so the paws rest on y = 0.
  figure.position.y = 0.42;
  return { root, figure, nose, whiskers, tail: tailBase, legs };
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
    const stride = time * 22;
    const position = { x: path.x, y: path.y, z: 0.4 };

    mouse.root.position.set(position.x, position.y - 0.35 * scale, position.z);
    mouse.root.scale.setScalar(scale * 0.8);
    // Turned a little toward the camera so it reads in three quarters rather than flat profile.
    mouse.root.rotation.y = -0.38;

    if (path.moving) {
      mouse.figure.position.y = 0.42 + Math.abs(Math.sin(stride)) * 0.045;
      mouse.figure.rotation.z = Math.sin(stride * 2) * 0.025;
      for (const leg of mouse.legs) leg.pivot.rotation.z = Math.sin(stride + leg.phase) * 0.55;
      mouse.tail.rotation.set(0, Math.sin(time * 9) * 0.12, Math.sin(time * 7) * 0.06);
      mouse.nose.scale.setScalar(1);
    } else {
      // Sniffing: nose and whiskers twitch, the head bobs and turns a touch.
      const sniff = Math.max(0, Math.sin(time * 18)) * (Math.sin(time * 1.3) > -0.3 ? 1 : 0);
      mouse.figure.position.y = 0.42 + Math.sin(time * 2.2) * 0.01;
      mouse.figure.rotation.z = 0.04 + Math.sin(time * 1.6) * 0.03;
      mouse.figure.rotation.y = Math.sin(time * 0.9) * 0.12;
      for (const leg of mouse.legs) leg.pivot.rotation.z *= 0.85;
      mouse.nose.scale.setScalar(1 + sniff * 0.18);
      mouse.whiskers.rotation.y = sniff * 0.08;
      mouse.tail.rotation.set(0, Math.sin(time * 2.4) * 0.22, Math.sin(time * 1.7) * 0.08);
    }
    update(frame, position, mouse.root);
  });

  return <primitive object={mouse.root} />;
}
