# Dew — Design Plan (v2)

**Product:** Dew — interactive 3D rain-cycle lesson for toddlers (~3yo)  
**Live bar:** Apple Arcade / Khan Academy Kids / Duolingo ABC polish — soft, rounded, delightful  
**Stack:** Next.js App Router + R3F/drei + React 19 · client-only · no env/API keys · Vercel

---

## Quality bar (non-negotiable)

| Do | Don't |
|----|--------|
| Soft pastel gradients, chunky rounded UI, micro-motion | Adult SaaS chrome, dark theme |
| Illustrated SVG stage cards with clear selected/press states | Emoji-as-UI |
| Dew as a character (face, bounce, stage reactions) | Lonely blue sphere |
| Richer terrain, layered soft clouds, mist, streak rain | Naked three.js demo spheres as the whole look |
| Magical crossfade/lerp between stages | Hard cuts / jarring resets |
| Mobile-first ≥48px targets; parent-readable captions | Tiny text, hover-only |

Prefer **fewer features with gorgeous polish** over more junk.

---

## Visual direction

- **Palette:** baby-sky blues, cream, soft mint grass, warm sun yellow, pastel stage chips (rose / peach / mint / sky). Storm = soft slate-blue, never black.
- **Typography:** rounded system stack; bold titles; short kid captions parents can read aloud.
- **Motion:** idle Dew bounce; cloud bob; vapor rise; rain density/speed lerp (~0.8s); sky color lerp; friendly sparkle flash (stage 7).
- **Audio:** optional Web Speech narrator; soft UI click + thunder rumble on user gesture only.

---

## 7 stages (unchanged pedagogy)

1. Clouds · 2 Warm & Cool · 3 Tiny Drops · 4 Drizzle · 5 Rain · 6 Lots of Rain · 7 Storm Fun

Each stage: distinct sky, cloud mood, vapor/rain, and Dew reaction. Stage cards use custom SVG icons (not emoji).

---

## IA

```
Header (logo Dew + subtitle)
Full-bleed 3D scene (Dew in-world)
Caption card + speak toggle
7 huge stage buttons + Back / Next
```

---

## Success

All 7 stages tappable & visually distinct · polished kids look · `npm run build` green · live on Vercel · no secrets · no GitHub Pages.
