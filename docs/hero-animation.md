# Hero Animation — "Clean Sweep"

The Three.js scene behind the hero text. It tells the company's story in one loop: the pests each service targets appear, a spray mist sweeps through, and the space is left clean.

- **Current version:** [`design-output/hero-animation/v1-clean-sweep.html`](./design-output/hero-animation/v1-clean-sweep.html). Open it in a browser. It is a strong starting point and sets the direction, but it will be iterated on.
- **Colours and tone:** [`DESIGN.md`](./DESIGN.md). **Hero layout:** [`design-output/screens/desktop.png`](./design-output/screens/desktop.png).

---

## Concept

| Service     | Element              | Behaviour                                                                             |
| ----------- | -------------------- | ------------------------------------------------------------------------------------- |
| Deratizare  | Mouse                | Scurries along the bottom edge, stops to sniff, runs                                  |
| Dezinsecție | Cockroach + mosquito | The cockroach crawls up the right edge; the mosquito flies a wobbly path near the top |
| Dezinfecție | Microbes / viruses   | Translucent, jelly-like, glowing emerald/mint, wobbling in the corners                |

**Loop (~12s):**

| Time      | Phase                                                                                                                    |
| --------- | ------------------------------------------------------------------------------------------------------------------------ |
| 0–5.5s    | Pests enter and wander around the edges. The centre stays calm behind the headline.                                      |
| 5.5–8.8s  | A teal-mint mist sweeps from left to right. Every pest it touches dissolves into mint sparkles; microbes shrink and pop. |
| 8.8–10.5s | "Clean moment": a soft light passes over the empty, clean scene.                                                         |
| 10.5–12s  | Pests slowly re-emerge and the loop restarts.                                                                            |

**Interaction:** the cursor is the spray nozzle. Moving it leaves a mist trail, and pests near it dissolve. On touch devices, a tap sprays a burst. The whole scene tilts slightly with the pointer (parallax).

**Tone:** stylized-realistic (Pixar-like), clean and premium, never gross. The pests are there only to be removed; the story always ends clean.

---

## v1 — status

**Built with:** Three.js r125 from a CDN, in one self-contained HTML file. All creatures are procedural (made from primitive geometry), so there are **no external 3D assets yet**.

**Works:**

- the full 12-second timeline with all 4 phases;
- a character for each of the 3 services;
- the mist sweep, the cursor spray and tap burst, dissolve sparkles and the clean light sweep;
- palette-matched lighting (warm key light, emerald rim light, caramel fill);
- DPR capped at 1.5;
- resize handling.

**To iterate on (in rough priority order):**

1. **Realism of the creatures.** Primitive-built bodies read as toys. Replace the mouse, cockroach and mosquito with proper GLB models (see Prompt A) and use real walk and fly animations.
2. **Dissolve effect.** Right now a pest only scales down while it emits sparkles. Replace this with a noise-based dissolve shader that has a glowing mint edge.
3. **Mist quality.** The mist is made of `PointsMaterial` points. Move to soft billboard smoke sprites with additive blending, so it reads as spray rather than dots.
4. **Composition.** Check on the real hero that the centre (about 60% × 50%) stays calm behind the headline and buttons, on both desktop and mobile.
5. **Production concerns:**
   - no `prefers-reduced-motion` handling;
   - no pausing when the hero is off-screen or the tab is hidden;
   - no dispose or cleanup;
   - listeners are attached to `window`;
   - the container ID lookup is inconsistent (`ANIMATION_27` vs `ANIMATION_28`), so the scene falls back to `document.body`.
6. **Port** to React Three Fiber, using `three` from npm and not the CDN r125 build.

---

## Prompt A — 3D models (AI 3D generator, e.g. Meshy / Tripo)

Run this once per creature, changing the subject line each time.

```
Stylized-realistic 3D model of a [SUBJECT].
Style: premium, Pixar-like realism, soft clean materials, not scary or dirty; a friendly but believable look.
Topology: game-ready, low-poly (under 15k triangles), clean quad topology, suitable for rigging and animation.
Textures: PBR (base colour, roughness, normal), 1024px, neutral lighting baked out, no background, no ground plane.
Export: GLB, centred at origin, facing +Z, real-world scale.
```

| Subject                                                  | Notes                              |
| -------------------------------------------------------- | ---------------------------------- |
| small house mouse, sitting on all fours, looking curious | grey-brown fur, pink ears and tail |
| cockroach, top-down walking pose, legs spread            | glossy dark-amber shell            |
| mosquito, wings spread, hovering pose                    | slightly translucent wings         |

- **Microbes stay procedural.** They look better in code and match the palette.
- **Fallback:** rigged and animated `mouse` / `rat` / `cockroach` models from Sketchfab under a CC0 or CC-BY licence. CC-BY requires credit in the README.
- **Store models** in `public/models/` and Draco-compress them.

## Prompt B — the production scene (coding agent)

```
Build the Hero background as a React Three Fiber scene ("Clean Sweep") for the DeratPro landing page.
Use docs/design-output/hero-animation/v1-clean-sweep.html as the behavioural reference (timeline, phases, interaction) and docs/hero-animation.md "To iterate on" as the list of improvements.
Read docs/DESIGN.md for colours and docs/design-output/screens/desktop.png for the hero layout: the scene is full-bleed behind centred text, so all action must stay near the edges and corners; the centre (about 60% width × 50% height) stays calm.

Scene (loop ~12s):
1. Pests enter from the edges: mouse.glb scurries along the bottom edge (walk animation or procedural body bob + path), cockroach.glb crawls up the right side, mosquito.glb flies in a wobbly path near the top. Procedural microbes (icosphere with noise-displaced vertices, small spikes, emerald #57CC99 / mint #80ED99 translucent material with a fresnel glow) float and wobble in the corners.
2. A spray wave sweeps from left to right: a soft teal-mint mist (#38A3A5 → #C7F9CC) made of billboard smoke sprites with additive blending. Every pest the mist touches dissolves (a noise-based dissolve shader with a glowing mint edge) into mint particles that drift up and fade; microbes scale down and pop.
3. A short "clean" moment: a soft light passes over the scene, then pests slowly return and the loop restarts.

Interaction: the cursor is a spray nozzle. Moving it emits a short mist trail, and pests within a radius flee from the cursor or dissolve. On touch devices, a tap sprays a burst.

Look: stylized-realistic, soft studio lighting (warm key, cool teal rim), light background #F7FAF9 with a soft mint radial glow, subtle depth of field. It should feel premium and clean, never gross.

Performance: lazy-load the canvas, Draco-compressed GLBs, DPR capped at 1.5, fewer pests and particles on mobile, pause when the hero is off-screen or the tab is hidden. With prefers-reduced-motion, render one static "clean" frame. If WebGL fails, fall back to the mint gradient.
Structure: components/hero/HeroScene.tsx plus one component per element (Mouse, Cockroach, Mosquito, Microbes, SprayMist), and a single timeline hook driving the loop.
```
