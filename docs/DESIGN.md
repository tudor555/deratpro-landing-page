---
version: alpha
name: DeratPro — Protective Clarity
description: Design system for the DeratPro landing page, a Romanian pest-control company (deratizare, dezinsecție, dezinfecție). Clinical, airy, confident. Built to earn trust and turn visitors into quote requests.
colors:
  primary: "#22577A"
  primary-strong: "#1A4560"
  secondary: "#38A3A5"
  emerald: "#57CC99"
  mint: "#80ED99"
  mint-soft: "#C7F9CC"
  mint-haze: "#F0FBF3"
  accent: "#DDA15E"
  accent-strong: "#BC6C25"
  ink: "#102A36"
  ink-muted: "#4B6470"
  line: "#D5E3E6"
  background: "#F7FAF9"
  surface: "#FFFFFF"
  surface-inverse: "#102A36"
  error: "#DC2626"
  success: "#047857"
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 72px
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: -0.035em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.03em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.025em
  h2-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.03em
  numeral:
    fontFamily: Plus Jakarta Sans
    fontSize: 96px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: -0.04em
  eyebrow:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.12em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
  button:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 28px
  button-primary-hover:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 56px
    padding: 0 24px
  button-secondary-hover:
    backgroundColor: "{colors.mint-haze}"
    textColor: "{colors.primary-strong}"
  button-header:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 0 20px
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: 32px
  card-feature:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: 40px
  icon-tile:
    backgroundColor: "{colors.mint-soft}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    size: 56px
  eyebrow-pill:
    backgroundColor: "{colors.mint-haze}"
    textColor: "{colors.primary}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.full}"
    padding: 8px 14px
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: 40px
    padding: 0 16px
  badge:
    backgroundColor: transparent
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    height: 32px
    padding: 0 12px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 52px
    padding: 0 16px
  input-error:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  stat-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: 40px 48px
  header:
    backgroundColor: "rgba(255,255,255,0.72)"
    height: 72px
  footer:
    backgroundColor: "{colors.surface-inverse}"
    textColor: "{colors.surface}"
    padding: 80px 0 32px
  floating-call:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    size: 60px
---

## Overview

**Protective Clarity.** Picture a modern health clinic crossed with a premium Scandinavian home brand. The interface feels clean, calm and in control, the way a space feels after a professional has been through it. It is airy and confident, with generous white space, crisp typography and colour used sparingly.

The design shows the **result** (a clean, safe home or business), not the problem. There are no photos or illustrations of rats, cockroaches or insects anywhere, with **one exception**: the hero's 3D "Clean Sweep" scene, where stylized-realistic pests appear only so they can be removed (see `hero-animation.md`). Trust comes from clarity, visible proof (stats, certifications, a written guarantee) and a calm tone.

Signature elements that make it recognisable:

1. **Mint haze.** Large, soft radial glows of `mint-soft` (#C7F9CC) fading to transparent bloom behind key moments: the hero, the feature card and the contact block. They read like fresh air.
2. **"Clean Sweep" hero scene.** An interactive Three.js loop behind the hero text. A mouse, a cockroach, a mosquito and glowing microbes (one for each service) move around the edges, then a teal-mint spray mist sweeps through and dissolves them into mint sparkles, leaving the scene clean. The cursor acts as the spray nozzle. The centre always stays calm for the headline. Full spec: `hero-animation.md`.
3. **Hexagon motif.** The logo is a rounded-hexagon shield. A very faint hexagon grid pattern (4–6% opacity) textures the dark feature surfaces. It suggests structure, protection and molecules.
4. **Caramel brush stroke.** One word in the hero headline, "Garantat.", gets a hand-drawn caramel (#DDA15E) underline stroke. It is the only playful gesture on the page.
5. **Eyebrow pills.** Every section starts with a small uppercase label in a mint-haze pill, with a 6px emerald dot before the text, like a "live" indicator.

Language: all visible copy is **Romanian**, with correct diacritics (ă â î ș ț). The tone is reassuring and expert, and addresses the reader as "tu".

## Colors

The palette runs from deep ocean blue-teal to fresh mint. Blue-teal carries trust and action, the mint greens carry cleanliness and light, and one warm caramel accent keeps the page human rather than sterile. Split: **~80% neutrals, ~15% blue-teal, ≤5% caramel.**

- **Primary (#22577A):** deep ocean blue-teal. The single colour for action: primary buttons, links, active states, the feature card background. White text on it passes AA (7.7:1).
- **Primary Strong (#1A4560):** hover and pressed state of primary.
- **Secondary (#38A3A5):** calm teal for icons, connector lines, outline details and decorative strokes. Never used for body text.
- **Emerald (#57CC99):** glows, the eyebrow dot, check icons, particle highlights. Decorative only.
- **Mint (#80ED99):** brightest particles and glow cores in the hero. Decorative only.
- **Mint Soft (#C7F9CC):** icon tile backgrounds and the mint-haze glows.
- **Mint Haze (#F0FBF3):** eyebrow pill fill, secondary-button hover, subtle tinted panels.
- **Accent (#DDA15E):** warm caramel. Rating stars, the headline brush stroke, the "+" in stats. Never a background for large areas.
- **Accent Strong (#BC6C25):** rust. Only for large (≥24px) numerals or suffixes that need the warm accent.
- **Ink (#102A36):** blue-black for headlines and body text (14:1 on background). Also the footer background.
- **Ink Muted (#4B6470):** secondary text, descriptions, captions (6:1).
- **Line (#D5E3E6):** hairline borders, dividers, input borders.
- **Background (#F7FAF9):** the page canvas, a barely-cool off-white.
- **Surface (#FFFFFF):** cards, the form, the stats card, alternating section bands.
- **Error (#DC2626) / Success (#047857):** form validation only.

## Typography

**Plus Jakarta Sans** for everything that speaks loudly (headlines, stats, numerals). **Inter** for everything that informs (body, labels, buttons). Both fully support Romanian diacritics.

- **Display (72px / 800 / -0.035em):** hero headline only, max 2 lines, centred. Mobile 44px.
- **H2 (48px / 700 / -0.025em):** section titles. Mobile 34px. Max ~16 words.
- **H3 (24px / 700):** card and step titles.
- **Stat (48px / 800):** numbers in the stats card.
- **Numeral (96px / 800):** the oversized "01 02 03" step numbers, rendered as **outlined text** (1.5px secondary stroke, transparent fill).
- **Eyebrow (13px / 600 / uppercase / +0.12em):** section labels inside pills.
- **Body LG (20px):** hero subline and section intros. **Body MD (16px):** card text. **Body SM (14px):** captions, badges, legal.
- Headlines use `ink`. Descriptions use `ink-muted`. Line length stays under 68 characters for body text.

## Layout

- **Container:** max 1200px, centred. Side gutter 16px mobile, 24px tablet, 32px desktop.
- **Grid:** 12 columns, 24px gutters on desktop. 4 columns, 16px gutters on mobile.
- **Section rhythm:** 128px vertical padding on desktop, 72px on mobile. Section headers sit 64px above their content.
- **Section backgrounds alternate** so sections separate without dividers: Hero (background plus haze) → Services (surface) → Why us (background) → How it works (surface) → Contact (background plus haze) → Footer (inverse ink).
- **Section header pattern:** eyebrow pill → 16px → H2 → 16px → optional Body LG intro. Services uses a split header (title left, intro right). All other sections are centred.
- **Breakpoints:** mobile < 640px, tablet 640–1024px, desktop > 1024px. Desktop frames are designed at 1440px wide and mobile frames at 390px.
- **Page order:** Header (sticky) → Hero → Stats card (overlaps the hero's bottom edge) → Servicii → De ce DeratPro → Cum funcționează → Contact → Footer.

## Elevation & Depth

Depth is soft and quiet: layered white surfaces on a cool off-white canvas, plus light itself through the mint haze and glows. No hard or dark drop shadows.

- **Level 0, flat:** 1px `line` border, no shadow. Used for chips, badges and inputs.
- **Level 1, raised:** `0 1px 2px rgba(16,42,54,0.04), 0 8px 24px rgba(16,42,54,0.06)`. Used for cards at rest.
- **Level 2, floating:** `0 24px 64px -12px rgba(16,42,54,0.16)`. Used for the stats card, the contact card and cards on hover.
- **Glass:** the sticky header uses white at 72% opacity, a 16px backdrop blur and a 1px bottom border in `line`.
- **Glow:** focus rings and the floating call button use a 6px halo of emerald at 20% opacity. The feature card and contact info panel carry an inner emerald/mint radial glow in one corner.

## Shapes

- Corner radii are **consistently soft**: 12px for buttons and inputs, 16px for icon tiles, 24px for cards, 32px for the large contact card, and fully rounded for pills, chips, badges and the floating button.
- Never mix sharp and rounded corners.
- The **hexagon** is the only geometric motif: the logo mark and the faint pattern on dark surfaces. Icon tiles stay rounded squares.
- Icons are **Lucide-style line icons** with a 1.75px stroke, 24–28px inside tiles and 20px inline. They are always outline, never filled or mixed styles.

## Components

- **Header (sticky, glass, 72px):** logo left (rounded-hexagon shield mark in primary with a small white check, plus the wordmark "Derat" in ink and "Pro" in primary, 22px/800). Centre nav: Servicii, De ce noi, Cum funcționează, Contact (15px/500, ink-muted, hover ink, active item with a 4px emerald dot below). Right: RO | EN segmented pill toggle (32px tall, active segment white on a line-tinted track), phone link "0722 000 000" with phone icon (primary, 600), then the "Cere ofertă" header button.
- **Primary button:** primary fill, white text, 56px tall, 12px radius, optional trailing arrow-right icon. Hover goes to primary-strong and lifts 1px. Focus shows a 3px emerald halo.
- **Secondary button:** transparent, 1.5px primary border, primary text, leading phone icon. Hover fills with mint-haze.
- **Eyebrow pill:** mint-haze fill, primary uppercase text, 6px emerald dot on the left.
- **Service card:** white, 24px radius, level 1, 32px padding, 1px line border. Contents: icon tile (56px, mint-soft, primary icon) → 24px → H3 → 12px → description (ink-muted) → 20px → three check-list lines (emerald circle-check icon + body-sm ink) → 24px → text link "Solicită ofertă →" in primary 600. Hover: level 2, lift 4px, border turns secondary.
- **Stats card:** one white level-2 card, 24px radius, four equal columns divided by 1px vertical `line` hairlines. Each column shows the number (stat, primary; suffixes like "+" and "h" in accent-strong) with a label under it (body-sm, ink-muted).
- **Badge:** 32px pill, 1px line border, a small badge-check icon in secondary, body-sm ink-muted text.
- **Audience chip:** 40px white pill, 1px line border, leading icon in secondary, label text in ink.
- **Feature card (Garanție):** primary background, white text, 24px radius, faint hexagon pattern, emerald/mint radial glow in the top-right corner, a large "6 luni" in display-sized white numerals, and a mint-soft shield-check icon.
- **Step:** outlined numeral "01" (96px, secondary stroke) → icon node (56px white circle, 1.5px secondary border, primary icon) → H3 → description. Steps are linked by a 2px dashed secondary connector line running through the icon nodes.
- **Input:** 52px, white, 1px line border, 12px radius, label above (label style, ink), placeholder in ink-muted at 70%. Focus: 1.5px primary border plus a 4px mint-soft ring. Error: 1.5px error border, with a message under it (13px, error colour, leading alert-circle icon). The textarea is 140px tall.
- **Form success state:** the form content is replaced by a centred 64px emerald circle with a white check, H3 "Mulțumim!", and body text in ink-muted.
- **Contact info panel:** primary background with white text, faint hexagon pattern and a mint glow. Rows have a mint-soft icon on the left, a small uppercase label, and the value (the phone number is large, 28px/700).
- **Footer:** ink background. The wordmark and tagline are white and white/72%. Link columns are white/72% and turn white on hover. The bottom bar has a hairline divider (white/12%), with the copyright and legal line in body-sm white/60%.
- **Floating call button (mobile only):** a 60px primary circle with a white phone icon, fixed 20px from the bottom-right corner. It has a level-2 shadow and a soft emerald pulse halo.

## Do's and Don'ts

**Do**

- Keep the page mostly neutral and use primary only for things you can act on or must notice.
- Show the positive outcome: clean, calm, safe, bright.
- Use the exact Romanian copy provided, with correct diacritics.
- Keep generous white space and align everything to the 12-column grid.
- Keep the hero centre clear so the headline sits on calm space, with the particles denser toward the edges.
- Give every interactive element visible hover and focus states.
- Meet WCAG AA contrast for all text.

**Don't**

- Never show photos or illustrations of rats, insects, dirt, gas masks, hazard stripes, skulls or spray-wielding exterminators. **Only exception:** the stylized-realistic 3D pests in the hero "Clean Sweep" scene, which are always shown being removed and never look gross.
- Never use stock photography of people.
- Never use red except for form errors, and never use yellow warning styling.
- Never use gradients on buttons or on text.
- Never put body text in secondary, emerald, mint or caramel.
- Never use more than one caramel element per viewport.
- Never use filled or multi-colour icons, emoji or clip-art.
- Never use pure black (#000) or harsh drop shadows.
- Never centre-align body text longer than 3 lines.
