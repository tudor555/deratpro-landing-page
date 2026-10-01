import type { Material, Object3D } from "three";
import { Mesh, Points } from "three";

/** Frees GPU memory for objects handed to R3F via <primitive>, which R3F does not dispose itself. */
export function disposeObject(root: Object3D) {
  const materials = new Set<Material>();
  root.traverse((child) => {
    if (child instanceof Mesh || child instanceof Points) {
      child.geometry.dispose();
      (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => materials.add(m));
    }
  });
  materials.forEach((material) => material.dispose());
}
