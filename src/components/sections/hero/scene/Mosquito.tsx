"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
} from "three";
import { mosquitoPath } from "../engine/layout";
import { sampleTimeline } from "../engine/timeline";
import { createDissolveUniforms, type DissolveUniforms, withDissolve } from "./dissolve";
import { disposeObject } from "./dispose";
import { useSceneStore } from "./store";
import { taperTube } from "./taperTube";
import { usePest } from "./usePest";

const WING_LENGTH = 0.78;
const WING_WIDTH = 0.17;
/** Ghost strokes spread across the wing arc; together they read as motion blur. */
const BLUR_ANGLES = [-0.75, -0.25, 0.25, 0.75];

/** Narrow translucent wing with dark veins and a fringed edge, drawn once to a canvas. */
function createWingTexture() {
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const cx = w / 2;

  ctx.beginPath();
  ctx.ellipse(cx, h / 2, w * 0.44, h * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(214, 232, 230, 0.5)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(60, 72, 76, 0.75)";
  ctx.stroke();

  ctx.strokeStyle = "rgba(55, 66, 70, 0.65)";
  ctx.lineWidth = 1.2;
  for (const offset of [-0.22, -0.08, 0.06, 0.2]) {
    ctx.beginPath();
    ctx.moveTo(cx + offset * w * 0.3, h * 0.04);
    ctx.quadraticCurveTo(cx + offset * w * 1.4, h * 0.5, cx + offset * w * 1.6, h * 0.94);
    ctx.stroke();
  }
  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Slender, tapering abdomen with the white bands of an Aedes ("tiger") mosquito, as vertex colours. */
function buildAbdomenGeometry() {
  const points: Vector2[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const radius = 0.075 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.6 * (1 - t * 0.55) + 0.004;
    points.push(new Vector2(radius, -t * 0.82));
  }
  const geometry = new LatheGeometry(points, 18);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const dark = new Color("#26292c");
  const band = new Color("#dfe4e4");
  for (let i = 0; i < pos.count; i++) {
    const t = -pos.getY(i) / 0.82;
    const segment = (t * 7) % 1;
    (segment < 0.16 && t > 0.08 ? band : dark).toArray(colors, i * 3);
  }
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  // Lathe runs along -y; lay it along -x, behind the thorax.
  geometry.rotateZ(-Math.PI / 2);
  return geometry;
}

type Leg = { pivot: Group; sway: number };

function buildLeg(material: MeshStandardMaterial, side: number, kind: "front" | "mid" | "hind"): Leg {
  const pivot = new Group();
  const z = side * 0.05;
  const shapes = {
    front: [
      new Vector3(0, 0, z),
      new Vector3(0.22, -0.12, z * 3),
      new Vector3(0.38, -0.42, z * 4.5),
      new Vector3(0.46, -0.8, z * 5),
    ],
    mid: [
      new Vector3(0, 0, z),
      new Vector3(0.02, -0.16, z * 4.5),
      new Vector3(-0.06, -0.5, z * 6.5),
      new Vector3(-0.1, -0.92, z * 7),
    ],
    // Aedes lift their hind legs up and back while flying.
    hind: [
      new Vector3(0, 0, z),
      new Vector3(-0.22, -0.1, z * 3.5),
      new Vector3(-0.55, 0.05, z * 4.5),
      new Vector3(-0.9, 0.3, z * 4),
    ],
  };
  const curve = new CatmullRomCurve3(shapes[kind]);
  pivot.add(new Mesh(taperTube(curve, 24, 0.011, 0.004, 5), material));
  return { pivot, sway: kind === "mid" ? 1.3 : 0.9 };
}

function buildMosquito(uniforms: DissolveUniforms) {
  const root = new Group();
  const body = new Group();
  root.add(body);

  const cuticle = withDissolve(
    new MeshPhysicalMaterial({ color: "#2b2f33", roughness: 0.45, sheen: 0.6, sheenColor: new Color("#9aa7b0") }),
    uniforms,
  );
  const banded = withDissolve(
    new MeshPhysicalMaterial({ color: "#ffffff", vertexColors: true, roughness: 0.4, sheen: 0.4 }),
    uniforms,
  );
  const eyes = withDissolve(
    new MeshPhysicalMaterial({ color: "#2a0f12", roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1 }),
    uniforms,
  );
  const legMat = withDissolve(new MeshStandardMaterial({ color: "#33373b", roughness: 0.5 }), uniforms);
  const wingTexture = createWingTexture();
  const wingMat = withDissolve(
    new MeshStandardMaterial({
      map: wingTexture,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      roughness: 0.2,
    }),
    uniforms,
  );
  const blurMat = withDissolve(
    new MeshStandardMaterial({
      map: wingTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      side: DoubleSide,
      roughness: 0.2,
    }),
    uniforms,
  );

  // Humped thorax, small head with large compound eyes.
  const thoraxGeo = new SphereGeometry(0.15, 24, 18);
  thoraxGeo.scale(1.25, 1.05, 0.9);
  const thorax = new Mesh(thoraxGeo, cuticle);
  thorax.position.set(0, 0.03, 0);
  body.add(thorax);

  const head = new Mesh(new SphereGeometry(0.085, 18, 14), cuticle);
  head.position.set(0.24, -0.02, 0);
  body.add(head);
  for (const side of [1, -1]) {
    const eye = new Mesh(new SphereGeometry(0.06, 16, 12), eyes);
    eye.position.set(0.26, 0.0, side * 0.045);
    body.add(eye);
  }

  const proboscis = new CatmullRomCurve3([
    new Vector3(0.3, -0.05, 0),
    new Vector3(0.5, -0.17, 0),
    new Vector3(0.72, -0.34, 0),
  ]);
  body.add(new Mesh(taperTube(proboscis, 16, 0.016, 0.004, 6), legMat));
  for (const side of [1, -1]) {
    const antenna = new CatmullRomCurve3([
      new Vector3(0.3, 0.02, side * 0.02),
      new Vector3(0.43, 0.06, side * 0.06),
      new Vector3(0.56, 0.05, side * 0.09),
    ]);
    body.add(new Mesh(taperTube(antenna, 12, 0.008, 0.003, 5), legMat));
  }

  const abdomen = new Mesh(buildAbdomenGeometry(), banded);
  abdomen.position.set(-0.17, 0.01, 0);
  abdomen.rotation.z = 0.12;
  body.add(abdomen);

  const legs: Leg[] = [];
  for (const side of [1, -1]) {
    (["front", "mid", "hind"] as const).forEach((kind, i) => {
      const leg = buildLeg(legMat, side, kind);
      leg.pivot.position.set(0.06 - i * 0.07, -0.1, side * 0.04);
      body.add(leg.pivot);
      legs.push(leg);
    });
  }

  // Wings hinge on top of the thorax and lie back over the abdomen in a shallow V.
  const wingGeo = new PlaneGeometry(WING_WIDTH, WING_LENGTH);
  wingGeo.rotateZ(Math.PI / 2);
  wingGeo.rotateX(-Math.PI / 2);
  wingGeo.translate(-WING_LENGTH / 2, 0, 0);
  const wings: Array<{ stroke: Group; side: number }> = [];
  for (const side of [1, -1]) {
    const hinge = new Group();
    hinge.position.set(0.02, 0.17, side * 0.05);
    hinge.rotation.y = side * -0.32;
    hinge.rotation.z = 0.18;
    const stroke = new Group();
    stroke.add(new Mesh(wingGeo, wingMat));
    hinge.add(stroke);
    for (const angle of BLUR_ANGLES) {
      const ghost = new Mesh(wingGeo, blurMat);
      ghost.rotation.x = side * angle;
      hinge.add(ghost);
    }
    body.add(hinge);
    wings.push({ stroke, side });
  }

  return { root, body, legs, wings, wingTexture };
}

/** Dezinsecție: a mosquito hovering on a wobbly path near the top. */
export function Mosquito({ scale }: { scale: number }) {
  const store = useSceneStore();
  const uniforms = useMemo(() => createDissolveUniforms(5), []);
  const mosquito = useMemo(() => buildMosquito(uniforms), [uniforms]);
  const update = usePest(uniforms, 1.4 * scale + 0.4, 22);

  useEffect(
    () => () => {
      disposeObject(mosquito.root);
      mosquito.wingTexture.dispose();
    },
    [mosquito],
  );

  useFrame((_, delta) => {
    const frame = sampleTimeline(store.elapsed);
    const time = store.elapsed;
    const { x, y } = mosquitoPath(time, store);
    const ahead = mosquitoPath(time + 0.08, store);
    const position = { x, y: y + Math.sin(time * 5.3) * 0.05, z: 0.5 };

    mosquito.root.position.set(position.x, position.y, position.z);
    mosquito.root.scale.setScalar(scale * 1.25);

    // Face the direction of travel, seen in three quarters; bank slightly into turns.
    const heading = ahead.x >= x ? -0.45 : Math.PI + 0.45;
    mosquito.root.rotation.y = MathUtils.damp(mosquito.root.rotation.y, heading, 4, delta);
    mosquito.body.rotation.z = 0.22 + (ahead.y - y) * 1.5;
    mosquito.body.rotation.x = 0.3 + Math.sin(time * 2.1) * 0.06;

    const beat = Math.sin(time * 75);
    for (const wing of mosquito.wings) wing.stroke.rotation.x = wing.side * beat * 0.8;
    mosquito.legs.forEach((leg, i) => {
      leg.pivot.rotation.z = Math.sin(time * 2.4 + i) * 0.05 * leg.sway;
    });
    update(frame, position, mosquito.root);
  });

  return <primitive object={mosquito.root} />;
}
