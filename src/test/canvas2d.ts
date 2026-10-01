import { vi } from "vitest";

/**
 * jsdom has no 2D canvas. Scene code only draws simple textures, so a recording stub
 * (every method is a spy, gradients included) is enough to exercise it.
 */
export function stubCanvas2d() {
  const gradient = { addColorStop: vi.fn() };
  const context = new Proxy({} as Record<string | symbol, unknown>, {
    get(target, key) {
      if (!(key in target)) {
        target[key] = key === "createRadialGradient" ? vi.fn(() => gradient) : vi.fn();
      }
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      return true;
    },
  });
  return vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(((type: string) => (type === "2d" ? context : null)) as HTMLCanvasElement["getContext"]);
}
