# DeratPro — Design Decisions

Why the design looks the way it does. This is the reasoning behind [`DESIGN.md`](./DESIGN.md) (the executable design system) and [`landing-page-spec.md`](./landing-page-spec.md) (the page structure and copy). If this file and those two disagree, those two win.

## Decisions

| Topic            | Decision                                                                                                                                                                                                    | Why                                                                                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual direction | **Clean & clinical**: airy layout, lots of white space, soft shadows, rounded cards                                                                                                                         | Pest control is a trust purchase. A hygiene/clinic feel reads as safe and professional.                                                                                                                 |
| Colour palette   | **Ocean-teal (`#22577A` → `#C7F9CC`) + caramel accent (`#DDA15E`)**                                                                                                                                         | Blue-teal suggests hygiene and trust, the green-to-mint range suggests "clean/safe" and feeds the 3D glows, and caramel adds warmth so the page doesn't feel sterile. Chosen from 5 palettes (see 1.6). |
| Theme            | **One light theme** (`#F7FAF9` canvas, white surfaces). No dark mode. The "Deep ocean" dark variant (C below) was considered and dropped                                                                    | Matches the clean & clinical direction and keeps scope tight.                                                                                                                                           |
| Hero layout      | **Full-bleed 3D canvas with a centred text overlay**                                                                                                                                                        | Immersive first impression. The animation has to stay subtle behind the text.                                                                                                                           |
| Hero animation   | **"Clean Sweep"**: stylized-realistic mouse, cockroach, mosquito and microbes (one per service), dissolved by a sweeping teal-mint spray mist; the cursor is the spray nozzle. v1 exists, iteration ongoing | Shows exactly what the company does, and no competitor has an interactive hero. Spec and v1 status: [`hero-animation.md`](./hero-animation.md).                                                         |
| Language         | **Romanian by default, with a RO / EN toggle in the header**                                                                                                                                                | Real local client. EN helps international reviewers.                                                                                                                                                    |
| Typography       | **Plus Jakarta Sans** (headings) + **Inter** (body)                                                                                                                                                         | Modern geometric, friendly, full Romanian diacritics support (ă â î ș ț).                                                                                                                               |
| Icons            | **Line icons (Lucide) inside soft teal rounded-square tiles**                                                                                                                                               | Clean and consistent, and they map 1:1 to `lucide-react` in the build.                                                                                                                                  |
| Tone of voice    | **Reassuring expert**, addresses the reader as "tu"                                                                                                                                                         | Calm and competent, warm without being jokey.                                                                                                                                                           |
| Extras           | Sticky header + nav, stats strip under hero, floating call button (mobile), footer                                                                                                                          | Standard trust and conversion boosters for local services.                                                                                                                                              |
| Contact layout   | **Form + info card side by side** (stacks on mobile)                                                                                                                                                        | The form converts and the info card adds trust (phone, schedule, area).                                                                                                                                 |

### 1.1 Colour tokens

Built from the **"ocean-teal" palette** (`#22577a → #38a3a5 → #57cc99 → #80ed99 → #c7f9cc`) plus the **caramel/rust accent** from the earthy palette (`#dda15e`, `#bc6c25`). Contrast ratios below were measured against the `#F7FAF9` background, or against white where noted.

| Token           | Hex       | Use                                                                               | Contrast                             |
| --------------- | --------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| `primary-700`   | `#22577A` | Primary buttons, links, active states, headings accent                            | 7.4:1 on bg · white text on it 7.7:1 |
| `primary-800`   | `#1A4560` | Button hover / pressed                                                            | white text on it 10.2:1              |
| `secondary-500` | `#38A3A5` | Icons, the step connector line, outline-button borders. **Not for body text**     | 2.9:1 (icons/UI only)                |
| `emerald-400`   | `#57CC99` | 3D glows, small decorative accents, focus/active dots. **Never text on light bg** | decorative                           |
| `mint-300`      | `#80ED99` | 3D highlights and particles only                                                  | decorative                           |
| `mint-100`      | `#C7F9CC` | Icon tiles, chips, subtle highlights                                              | `primary-700` on it 6.6:1            |
| `accent-400`    | `#DDA15E` | Caramel: rating star, small badges, underline highlights. Dark text only on it    | `ink-900` on it 6.6:1                |
| `accent-600`    | `#BC6C25` | Rust: **large** stat numbers only (≥ 24px)                                        | 3.8:1 (large text only)              |
| `ink-900`       | `#102A36` | Headings and body text (blue-teal-tinted near-black)                              | 14.2:1                               |
| `ink-600`       | `#4B6470` | Secondary text                                                                    | 6.0:1                                |
| `line`          | `#D5E3E6` | Borders, dividers, input outlines                                                 | —                                    |
| `error`         | `#DC2626` | Form validation errors                                                            | 4.8:1 on white                       |
| `success`       | `#047857` | Form success message                                                              | 5.5:1 on white                       |

Rules: the page is **~80% neutral (bg, white cards, ink text)**, ~15% blue-teal, and ≤5% caramel. The light greens are for light and glow effects, not for text. White text only goes on `primary-700` / `primary-800`.

All text/background pairs must meet WCAG AA (4.5:1 for body text).

### 1.2 Background

**A is the base.** B and C were considered and dropped:

- **A. Clinical off-white** `#F7FAF9`: safest, most "clinic".
- **B. Mint-tinted** `#F0FBF3` (a very light version of `#C7F9CC`): fresher, sections alternate with white cards.
- **C. Deep ocean** `#0D2B3C` with white text (14.7:1): the creative option, where the emerald/mint 3D glows stand out most (`#57CC99` on it is 7.4:1). Cards become slightly lighter `#16384D` surfaces, and caramel reads well on it (6.5:1).

The site stays **single-theme**.

### 1.3 Layout system

- Container max width **1200px**, 16px side gutter on mobile, 24–32px on desktop.
- 8pt spacing grid. Section vertical padding **96px desktop / 64px mobile**.
- Radius: **16px** cards, **12px** buttons & inputs, **full** pills/badges.
- Shadows: soft and low-contrast (e.g. `0 8px 24px rgba(15,42,46,0.06)`).
- Breakpoints: mobile < 640, tablet 640–1024, desktop > 1024.
- Visible focus rings (2px `primary-700`, 2px offset) on all interactive elements.

### 1.4 Hero animation

**Chosen concept: "Clean Sweep"** (full spec, v1 status and prompts: [`hero-animation.md`](./hero-animation.md)). Other candidates considered: protective shield + particles, cursor-repelled particle swarm, molecular "clean wave", and a scanning grid over a house. They were dropped because abstract particles and lines don't show what the company actually does.

`DESIGN.md` forbids pest imagery, but this scene is the one exception: the pests are stylized-realistic and are only shown being removed.

Constraints the scene must keep:

- fill the hero edge to edge behind the text and stay **calm in the centre** so the headline stays legible;
- use the palette (`#38A3A5` → `#57CC99` → `#80ED99` mist and glows, `#DDA15E` warm fill light);
- run smoothly on mid-range phones (fewer elements on mobile, DPR capped at 1.5, paused off-screen);
- respect `prefers-reduced-motion` with a static "clean" frame.

### 1.5 Reference sites (Romanian DDD market)

Reviewed: [partizanecoserv.ro](https://www.partizanecoserv.ro/), [atum.com.ro](https://atum.com.ro/), [stopinsecte.ro](https://www.stopinsecte.ro/), [expertderatizare.ro](https://expertderatizare.ro/), [deratizescu.ro](https://deratizescu.ro/), [ecoprest.ro](https://www.ecoprest.ro/servicii/dezinsectie-deratizare-dezinfectie/comercial), [salesianer.ro](https://www.salesianer.ro/) (textile/hygiene, not pest control, but a good example of a polished corporate layout).

**Patterns the market has settled on (we keep them):**

- **"Cere ofertă" + "Sună acum" as the paired CTAs**, repeated through the page (Partizan, Deratizescu).
- **Stats counters** for years, interventions and clients (Partizan, ATUM: "21.000+ intervenții").
- **Authority signals**: DSP / Ministry of Health approved biocides, ISO, HACCP (Expert Deratizare, EcoPrest, Deratizescu).
- **An explicit guarantee**, ideally concrete: Expert Deratizare offers a "free reinspection within 14 days".
- **Residential vs. commercial split**: most sites address homes, offices, HoReCa and industry separately.
- **A persistent floating call/contact button**.

**Where they are weak (our chance to stand out):**

- Dated visuals: stock photos of bugs and rats, dense text, busy layouts. → We go clean and clinical with no pest imagery.
- Trust signals are scattered or missing (StopInsecte has none). → We put them where you see them first: a rating line in the hero and badges under the stats.
- No clear process explanation (only ATUM has one, and it has 6 steps). → Our 3 steps are simple.
- Every hero is a static photo or carousel. → An interactive 3D hero sets us apart right away.

**Adopted from this review:**

- A rating + authorization micro-line under the hero CTAs.
- A certification badge row under the stats strip.
- Audience chips in Services (Case & apartamente · Birouri · HoReCa · Depozite & industrie).
- A concrete guarantee: written 6-month guarantee + free reinspection within 14 days.
- Hero headline reworded so it doesn't echo Expert Deratizare's "Scapă definitiv de dăunători / Rapid, sigur, profesionist".

**Deliberately not adopted** (out of scope for a 5-section landing page): testimonials carousel, client logo wall, price calculator/pricing table, blog, WhatsApp widget, per-sector subpages.

### 1.6 Palette selection

Five candidate palettes were compared, taken from the green/earth range most competitor sites use:

| #   | Palette                                                          | Verdict                                                                                                                                                              |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `#606c38 #283618 #fefae0 #dda15e #bc6c25`: olive, cream, caramel | Warm and "eco", but rustic rather than clinical. **Its caramel/rust accent was kept.**                                                                               |
| 2   | `#f0ead2 #dde5b6 #adc178 #a98467 #6c584c`: khaki, sage, brown    | Rejected. Low contrast, and browns suggest dirt and pests.                                                                                                           |
| 3   | `#dad7cd #a3b18a #588157 #3a5a40 #344e41`: sage → forest         | Refined but monochrome, with no warm accent for highlights.                                                                                                          |
| 4   | `#8cb369 #f4e285 #f4a259 #5b8e7d #bc4b51`: multi-hue             | Rejected. Too playful, and red reads as danger/error.                                                                                                                |
| 5   | `#22577a #38a3a5 #57cc99 #80ed99 #c7f9cc`: ocean → mint          | **Chosen as the base.** It is the closest to the clinical teal direction, `#22577a` reaches 7.7:1 with white, and the blue-to-mint gradient suits the 3D glows well. |
