# DeratPro — Landing Page Design Instructions

Design the marketing website for **DeratPro**, a Romanian professional pest-control company. It offers deratizare (rodent control), dezinsecție (insect control) and dezinfecție (disinfection) for homes and businesses. The page must earn trust and generate quote requests.

## Rules

- Use **DESIGN.md** for all styling: colours, typography, spacing, radii, elevation, components, and the do's and don'ts. This document defines structure and content.
- All visible text is **Romanian**. Use the copy in this document **exactly as written**, with correct diacritics (ă â î ș ț). Do not invent extra text or sections.
- Art direction, "Protective Clarity": a modern health clinic crossed with a premium Scandinavian home brand. Clean, airy, calm, confident. Show the positive outcome (clean, safe, bright), never the problem.
- **Never** show rats, insects, dirt, hazard signs, gas masks or stock photos of people.
- Every section starts with an **eyebrow pill**: a small uppercase label in a pale mint #F0FBF3 pill, #22577A text, and a 6px emerald #57CC99 dot before it.
- Icons are Lucide-style line icons (1.75px stroke). Where an icon tile is mentioned, it is a 56px rounded square (16px radius) filled #C7F9CC, with a #22577A icon.

## Screens to produce

1. **Desktop — Landing page** (1440px wide, full page)
2. **Mobile — Landing page** (390px wide, full page)
3. **Desktop — Contact form, error state**
4. **Desktop — Contact form, success state**

---

## Screen 1 — Desktop landing page

Content width is 1200px, centred. Sections run top to bottom in the order below. Section backgrounds alternate: Hero #F7FAF9 → Services #FFFFFF → Why us #F7FAF9 → How it works #FFFFFF → Contact #F7FAF9 → Footer #102A36. Every section except the hero has 128px of vertical padding.

### 1. Header

Sticky, 72px tall. White at 72% opacity with background blur and a 1px bottom border #D5E3E6.

- **Left:** logo mark (a 32px rounded hexagon in #22577A with a small white check inside) + wordmark "Derat" in #102A36 and "Pro" in #22577A (Plus Jakarta Sans 22px ExtraBold).
- **Centre nav** (Inter 15px medium, #4B6470): Servicii · De ce noi · Cum funcționează · Contact
- **Right:** segmented pill toggle "RO | EN" (RO active: white segment on a light grey track) → phone icon + "0722 000 000" (#22577A semibold) → 44px button "Cere ofertă" (#22577A fill, white text, 12px radius).

### 2. Hero

Full viewport height (min 760px), background #F7FAF9.

**Background visual.** This is a placeholder for an interactive 3D animation: an abstract, luminous particle field of hundreds of tiny glowing dots in #38A3A5, #57CC99 and #80ED99, with 3–4 large soft translucent orbs and a wide soft radial mint glow (#C7F9CC) behind the text. Particles are dense near the edges and corners and fade to almost nothing in the centre, so the text sits on calm space. The bottom of the hero fades smoothly into the page background.

**Centred content**, max width 880px:

1. Eyebrow pill: "Deratizare · Dezinsecție · Dezinfecție"
2. Headline (Plus Jakarta Sans 72px ExtraBold, #102A36, letter-spacing -0.035em, 2 lines): **"Casa sau afacerea ta, fără dăunători. Garantat."** The word "Garantat." has a hand-drawn caramel (#DDA15E) brush-stroke underline.
3. Subline (Inter 20px, #4B6470, max 640px): "Intervenții profesionale pentru case, birouri și spații comerciale, cu substanțe avizate și garanție scrisă."
4. Two 56px buttons, 16px apart:
   - primary "Cere ofertă gratuită" with a right-arrow icon (#22577A fill, white text);
   - secondary "Sună acum" with a phone icon (transparent, 1.5px #22577A border, #22577A text).
5. Trust line (Inter 14px, #4B6470): five small caramel #DDA15E stars + "4.9/5 din 300+ recenzii" · a teal shield-check icon + "Operator DDD autorizat"

**Bottom centre:** a thin chevron-down in #38A3A5 with the caption "Descoperă serviciile".

### 3. Stats card

One white card, 24px radius, large soft shadow, full content width. It overlaps the bottom edge of the hero by 64px. It has four equal columns separated by thin vertical #D5E3E6 dividers, with centred content. Each column shows a number (Plus Jakarta Sans 48px ExtraBold, #22577A, with the suffix in #BC6C25) and a label under it (Inter 14px, #4B6470):

| Number | Label                 |
| ------ | --------------------- |
| 10+    | ani de experiență     |
| 2.500+ | intervenții realizate |
| 24h    | timp de răspuns       |
| 6 luni | garanție scrisă       |

24px under the card, centred: the label "Certificări și avize" (13px uppercase, #4B6470), then 4 pill badges. Each badge is 32px tall, with a 1px #D5E3E6 border, a small teal badge-check icon and 14px #4B6470 text: **Avizat DSP · Biocide avizate MS · ISO 9001 · HACCP**

### 4. Servicii

**Split header.** Left: eyebrow pill "Servicii", then a 48px headline "Tot ce ai nevoie pentru un spațiu curat și sigur". Right, aligned to the bottom: Inter 18px #4B6470 text "Tratamente profesionale, adaptate fiecărui spațiu — de la apartamente la depozite și restaurante."

**Three equal cards**, 24px gap. Each card is white, with a 24px radius, 1px #D5E3E6 border, soft shadow and 32px padding. Card contents, top to bottom:

- icon tile;
- title (24px bold);
- description (16px, #4B6470);
- 3 checklist lines (small emerald circle-check icon + 14px #102A36 text);
- text link "Solicită ofertă →" (#22577A semibold).

The middle card is shown in its hover state: lifted, with a #38A3A5 border.

| Icon      | Title       | Description                                                                                           | Checklist                                                                                                 |
| --------- | ----------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| rat       | Deratizare  | Eliminăm șoarecii și șobolanii din casă, depozit sau restaurant, cu soluții sigure și discrete.       | Stații de momire securizate · Monitorizare periodică · Sigur pentru copii și animale                      |
| bug       | Dezinsecție | Tratamente eficiente împotriva insectelor târâtoare și zburătoare, în interior și exterior.           | Gândaci, ploșnițe, furnici · Țânțari, muște, viespi · Fără miros persistent                               |
| spray-can | Dezinfecție | Dezinfecție profesională prin nebulizare, pentru spații curate și sigure din punct de vedere sanitar. | Elimină viruși, bacterii și fungi · Ideal pentru HoReCa și clinici · Produse avizate Ministerul Sănătății |

**Under the cards**, centred: "Lucrăm pentru:" (14px, #4B6470), then 4 white pill chips. Each chip is 40px tall, with a 1px #D5E3E6 border and a teal line icon: home "Case & apartamente" · building "Birouri" · utensils "HoReCa" · warehouse "Depozite & industrie"

### 5. De ce DeratPro

**Centred header:** eyebrow pill "De ce noi", 48px headline "De ce aleg clienții DeratPro", and Inter 18px #4B6470 intro "Lucrăm curat, rapid și documentat — iar rezultatul este garantat în scris."

**Bento grid**, 24px gaps, 2 rows:

- **Left** (5 of 12 columns, spanning both rows): feature card "Garanție".
  - Style: #22577A background, white text, 24px radius, 40px padding. A very faint hexagon grid pattern covers the card, with a soft emerald/mint radial glow in the top-right corner.
  - Top: a 56px tile in white at 12% with a #C7F9CC shield-check icon.
  - Middle: a huge "6 luni" (Plus Jakarta Sans 88px ExtraBold, white).
  - Then the title "Garanție scrisă" (24px bold) and the text (white at 80%): "Dacă dăunătorii revin în perioada de garanție, revenim și refacem tratamentul fără niciun cost. Plus reinspecție gratuită în 14 zile."
  - Bottom: a small pill in white at 12%: "Inclus în fiecare intervenție".
- **Right top** (7 columns): a wide white card with the icon tile (zap) on the left and the text on the right.
  - Title: "Intervenție rapidă".
  - Text: "Ajungem la tine în maximum 24 de ore, iar pentru urgențe chiar în aceeași zi — inclusiv în weekend."
  - Top-right corner: a small pill "Urgențe 24/7" with an emerald dot.
- **Right bottom:** two equal white cards.
  - flask-conical, "Substanțe avizate": "Folosim doar biocide avizate, sigure pentru familie și animalele de companie."
  - badge-check, "Personal autorizat": "Tehnicieni instruiți și certificați pentru servicii DDD, cu echipament profesional."

White cards have a 24px radius, 1px #D5E3E6 border, soft shadow and 32px padding, with 24px bold titles and 16px #4B6470 text.

### 6. Cum funcționează

**Centred header:** eyebrow pill "Proces", 48px headline "Simplu, în 3 pași", and Inter 18px #4B6470 intro "De la primul telefon până la un spațiu fără dăunători, știi mereu ce urmează."

**Three equal columns** with centred text. A 2px dashed #38A3A5 line runs horizontally through the three icon nodes. Each step, top to bottom:

- an oversized outlined numeral (Plus Jakarta Sans 96px ExtraBold, transparent fill, 1.5px #38A3A5 outline);
- an icon node (56px white circle, 1.5px #38A3A5 border, soft shadow, #22577A icon) sitting on the dashed line;
- the title (24px bold, #102A36);
- the description (16px, #4B6470, max 300px wide).

| Numeral | Icon            | Title       | Description                                                                                     |
| ------- | --------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| 01      | phone           | Ne suni     | Ne suni sau completezi formularul. Un specialist te contactează în cel mai scurt timp.          |
| 02      | clipboard-check | Evaluare    | Venim la fața locului, identificăm problema și îți oferim o ofertă clară, fără costuri ascunse. |
| 03      | sparkles        | Intervenție | Aplicăm tratamentul potrivit și îți lăsăm recomandări, documentele necesare și garanția scrisă. |

**Under the steps**, centred: a pale mint #F0FBF3 pill with a teal clock icon and 14px #102A36 text: "Timp mediu de la apel la intervenție: sub 24 de ore"

### 7. Contact

A large soft radial mint glow (#C7F9CC) sits behind the card.

**Centred header:** eyebrow pill "Contact", 48px headline "Cere o ofertă gratuită", and 18px #4B6470 intro "Lasă-ne datele tale și te sunăm în cel mai scurt timp."

**One large white card**, full content width, 32px radius, large soft shadow, split into 7 : 5 columns.

**Left: the form** (48px padding).

- Title: "Trimite-ne o cerere" (24px bold).
- Labels sit above the fields (14px semibold, #102A36).
- Inputs are 52px tall, with a 12px radius, a 1px #D5E3E6 border and #4B6470 placeholders.

| Label   | Field                | Placeholder                                   |
| ------- | -------------------- | --------------------------------------------- |
| Nume    | input                | Ion Popescu                                   |
| Telefon | input                | 07xx xxx xxx                                  |
| Mesaj   | textarea, 140px tall | Descrie pe scurt problema și tipul spațiului… |

Then a full-width 56px button "Trimite cererea" (#22577A, white text, send icon). Under it, a lock icon and 13px #4B6470 text: "Datele tale sunt folosite doar pentru a te contacta."

**Right: the info panel.**

- Style: #22577A background, white text, 48px padding, a faint hexagon pattern and a soft emerald glow in the bottom-right corner.
- Title: "Preferi să vorbim direct?" (24px bold, white).
- Four rows. Each has a #C7F9CC line icon, a small uppercase label in white at 70%, and a white value:

| Icon    | Label          | Value                                                                |
| ------- | -------------- | -------------------------------------------------------------------- |
| phone   | TELEFON        | 0722 000 000 (28px bold)                                             |
| mail    | EMAIL          | contact@deratpro.ro                                                  |
| clock   | PROGRAM        | L–V 08:00–20:00 · S 09:00–14:00, and on a second line "Urgențe 24/7" |
| map-pin | ZONĂ DESERVITĂ | București și Ilfov                                                   |

### 8. Footer

Background #102A36, 80px top padding. Column titles are 14px semibold white. Links are 15px, white at 72%. Four columns:

1. The logo in white, the tagline "Servicii profesionale de deratizare, dezinsecție și dezinfecție." (white at 72%), and 3 small outlined badges (border in white at 20%): Avizat DSP · ISO 9001 · HACCP
2. **Servicii:** Deratizare, Dezinsecție, Dezinfecție
3. **Companie:** De ce noi, Cum funcționează, Contact
4. **Contact:** 0722 000 000, contact@deratpro.ro, București și Ilfov

**Bottom bar**, above a hairline divider (white at 12%), 14px text in white at 60%:

- left: "© 2026 DeratPro. Proiect demonstrativ — firmă fictivă."
- right: "Operator DDD autorizat · Biocide avizate"

---

## Screen 2 — Mobile landing page

The same page, design system, copy and section order at 390px wide. Sections have 72px of vertical padding and 16px side gutters. Every tap target is at least 44px.

- **Header** (64px): logo on the left; the RO|EN toggle and a hamburger menu icon on the right. The nav links and phone number are hidden.
- **Hero** (min 720px):
  - the same particle field, with fewer and smaller particles;
  - a 44px headline over 3–4 centred lines, and a 17px subline;
  - full-width stacked buttons, primary on top;
  - the trust line wraps onto 2 centred lines.
- **Stats card:** a 2 × 2 grid with hairline dividers, overlapping the hero by 40px. The badges wrap onto 2 centred rows.
- **Servicii:** the header stacks (title, then intro). Cards are in one column. The chips scroll horizontally in one row.
- **De ce DeratPro:** the "Garanție" feature card comes first at full width, then the other three cards stacked.
- **Cum funcționează:** a vertical timeline. The dashed teal line runs down the left, with the icon nodes on it. The numeral, title and text sit to the right of each node, left-aligned.
- **Contact:** the card stacks, with the form first and then the blue-teal info panel. 24px padding.
- **Footer:** the columns stack and the bottom bar is centred.
- **Floating call button:** fixed 20px from the bottom-right corner. It is a 60px #22577A circle with a white phone icon, a soft shadow and a faint emerald halo.

---

## Screen 3 — Contact form, error state

The desktop Contact section, identical to Screen 1 except for the form:

- **"Nume":** filled with "Ion Popescu". Valid, normal style.
- **"Telefon":** contains "0722". It has a 1.5px #DC2626 border and, under it, a small alert-circle icon with 13px #DC2626 text: "Introdu un număr de telefon valid."
- **"Mesaj":** empty, with the same error style and the message "Mesajul trebuie să aibă cel puțin 10 caractere."
- The "Trimite cererea" button and the info panel are unchanged.

## Screen 4 — Contact form, success state

The desktop Contact section, identical to Screen 1 except for the left column. The form is replaced by this content, centred vertically:

- a 64px emerald #57CC99 circle with a white check icon;
- the heading "Mulțumim!" (24px bold, #102A36);
- the text "Am primit cererea ta. Te contactăm în cel mai scurt timp." (16px, #4B6470);
- a secondary outline button "Trimite o altă cerere".

The blue-teal info panel on the right is unchanged.
