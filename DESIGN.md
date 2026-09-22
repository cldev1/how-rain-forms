# Dew — Design Plan (v3 · phone-first)

**Product:** Dew — interactive 3D rain-cycle lesson for toddlers (~3yo)  
**Live bar:** Apple Arcade / Khan Academy Kids polish — soft, rounded, delightful  
**Stack:** Next.js App Router + R3F/drei + React 19 · client-only · no env/API keys · Vercel  
**Research:** See [docs/UX-RESEARCH.md](./docs/UX-RESEARCH.md)

---

## Quality bar (non-negotiable)

| Do | Don't |
|----|--------|
| Soft pastel gradients, chunky rounded UI, micro-motion | Adult SaaS chrome, dark theme |
| **Unique sky mood + rain grammar per stage** (glanceable on phone) | Subtle blue-only lerps that look the same |
| Story-path + huge hero card (label, icon, kid caption) | Cramped 7-chip wrap grids |
| Dew as a character (face, bounce, stage reactions) | Lonely blue sphere |
| Phone-first: tall canvas + thumb-zone bottom sheet | Laptop-first, tiny chips |
| Magical crossfade between **distinct** stage targets | Hard cuts / jarring resets |

Prefer **fewer features with gorgeous polish** over more junk.  
Honest: not Pixar — but stages **must** be distinguishable at a glance.

---

## Visual direction

- **Palette:** each stage owns a mood (sunny cream, warm/cool split, lavender mist, overcast, slate rain, dark heavy, storm purple-pink) — not seven near-identical blues.
- **Rain grammar:** none → mist → sparse slow → steady → heavy → storm (counts/speed/size jump clearly).
- **Typography:** rounded system stack; huge stage label; short kid line + parent caption.
- **Motion:** idle Dew bounce; cloud bob; vapor rise; rain density/speed lerp; sky color lerp; friendly sparkle flash (stage 7).
- **Audio:** optional Web Speech narrator; soft UI click + thunder rumble on user gesture only.

---

## 7 stages (unchanged pedagogy)

1. Clouds · 2 Warm & Cool · 3 Tiny Drops · 4 Drizzle · 5 Rain · 6 Lots of Rain · 7 Storm Fun

Each stage: distinct sky, cloud mood, vapor/mist/rain, props (thermo / condensation / lightning), and Dew reaction.

---

## IA (phone-first)

```
Compact header (Dew logo + subtitle)
Tall 3D scene (badge with stage name)
Bottom sheet:
  Hero card (huge icon + label + kid line + caption + speak)
  Story-path nodes (selected oversized)
  Back / Next (thumb zone)
```

---

## Success

All 7 stages tappable & **visually distinct on ~390×844** · polished kids look · `npm run build` green · live on Vercel · no secrets · no GitHub Pages.

---

## Shipped slices (2026-09-22)

- **phone-trust:** viewport lock @390×844, lightning flash-gate, WebGL fallback, drizzle thickness, Dew framing.
- **improve2:** Warm/Cool thermo + sky split + curious Dew; mid-stage silhouettes (drizzle mist rings, rain puddle shine, lots umbrella + wet grass); story-path fat-finger scroll-snap; end-of-story “Rain again!”; SoftCloud color reuse + phone rain soft-cap; speak kidLine + aria-live; dead CaptionBar/drei removed.

