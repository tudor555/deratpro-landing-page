import { BufferGeometry, Group, Mesh, MeshBasicMaterial, Points, PointsMaterial } from "three";
import { describe, expect, it, vi } from "vitest";
import { disposeObject } from "./dispose";

describe("disposeObject", () => {
  it("frees every geometry and each shared material once", () => {
    const root = new Group();
    const shared = new MeshBasicMaterial();
    const meshGeometry = new BufferGeometry();
    const pointsGeometry = new BufferGeometry();
    const pointsMaterial = new PointsMaterial();
    const child = new Group();
    child.add(new Mesh(meshGeometry, [shared, shared]));
    root.add(child, new Points(pointsGeometry, pointsMaterial), new Mesh(new BufferGeometry(), shared));

    const spies = [meshGeometry, pointsGeometry, shared, pointsMaterial].map((item) => vi.spyOn(item, "dispose"));
    disposeObject(root);

    expect(spies[0]).toHaveBeenCalledTimes(1);
    expect(spies[1]).toHaveBeenCalledTimes(1);
    expect(spies[2]).toHaveBeenCalledTimes(1);
    expect(spies[3]).toHaveBeenCalledTimes(1);
  });
});
