export type SceneQuality = {
  dpr: [number, number];
  mistParticles: number;
  trailParticles: number;
  sparkles: number;
  microbes: number;
  creatureScale: number;
};

const PHONE_MAX_WIDTH = 640;

export function sceneQuality(viewportWidthPx: number): SceneQuality {
  if (viewportWidthPx < PHONE_MAX_WIDTH) {
    return { dpr: [1, 1.5], mistParticles: 70, trailParticles: 40, sparkles: 90, microbes: 2, creatureScale: 0.55 };
  }
  return { dpr: [1, 1.5], mistParticles: 160, trailParticles: 90, sparkles: 180, microbes: 4, creatureScale: 0.9 };
}
