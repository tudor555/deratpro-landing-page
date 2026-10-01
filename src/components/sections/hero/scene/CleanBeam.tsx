"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { sampleTimeline } from "../engine/timeline";
import { useSceneStore } from "./store";

/** The "clean moment": a soft band of fresh light gliding across the empty scene. */
export function CleanBeam() {
  const store = useSceneStore();

  const beam = useMemo(() => {
    const material = new ShaderMaterial({
      uniforms: { uIntensity: { value: 0 } },
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIntensity;
        varying vec2 vUv;
        void main() {
          float band = exp(-pow((vUv.x - 0.5) * 5.0, 2.0));
          float vertical = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.65, vUv.y);
          vec3 color = mix(vec3(0.78, 0.98, 0.8), vec3(1.0), 0.45);
          gl_FragColor = vec4(color, band * vertical * uIntensity * 0.55);
        }
      `,
    });
    const mesh = new Mesh(new PlaneGeometry(1, 1), material);
    mesh.position.z = 2;
    mesh.rotation.z = -0.18;
    return { mesh, material };
  }, []);

  useEffect(
    () => () => {
      beam.mesh.geometry.dispose();
      beam.material.dispose();
    },
    [beam],
  );

  useFrame(() => {
    const frame = sampleTimeline(store.elapsed);
    const { width, height } = store.viewport;
    beam.material.uniforms.uIntensity.value = frame.beam;
    beam.mesh.visible = frame.beam > 0;
    beam.mesh.scale.set(width * 0.55, height * 1.4, 1);
    beam.mesh.position.x = (frame.beamProgress - 0.5) * width * 1.1;
  });

  return <primitive object={beam.mesh} />;
}
