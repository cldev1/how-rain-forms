# Dew — Design Plan

**Product name:** **Dew** (title: “Dew”)  
**Lesson:** How rain forms / Rain Cycle  
**Product:** Interactive 3D lesson that teaches a ~3-year-old how rain forms  
**Audience:** Toddlers (~3 years) — delightful, never scary  
**Status:** Phase 1 (design) — must land before UI build

---

## 1. Goals & non-goals

### Goals
- All **7 stages** playable and visually distinct
- Huge tappable stage cards; minimal text; soft colorful world
- Client-only SPA feel (no backend, no API keys, no Clerk/Neon)
- Smooth transitions; mobile-friendly touch targets
- Ship a polished playable MVP fast

### Non-goals
- Photoreal weather simulation
- Scary thunder/lightning
- Dark "pro" theme
- Accounts, analytics SDKs, or server data
- GitHub Pages deploy (Next.js needs Node — **Vercel only**)

---

## 2. Tech stack choice & rationale

| Choice | Why |
|--------|-----|
| **Next.js (App Router)** | Cos/ship standard for Vercel Hobby; zero-config deploy; App Router keeps a single client page simple. |
| **React Three Fiber (R3F)** | Declarative 3D in React — stages map cleanly to components and props (`stage={n}`). Faster iteration than raw Three.js for this MVP. |
| **@react-three/drei** | Ready helpers: soft lighting, clouds, controls (clamped). Cuts boilerplate. |
| **three** | Underlying engine for particles, meshes, materials. |
| **Web Speech API** | Optional free client-side narrator (`speechSynthesis`) — no keys. |
| **Web Audio API** | Soft thunder rumble via oscillators — no audio assets required for MVP. |

**Why not Vite SPA / plain Three.js / GitHub Pages?**  
Cos supersedes: **Next.js App Router + Vercel**. R3F keeps interactivity in `"use client"` components — no server secrets. GitHub Pages is abandoned (static host cannot run the Next.js Node build path we ship).

**Client-only constraints**
- No `process.env` secrets, no API routes for app logic, no database
- 3D canvas and stage state live entirely in the browser
- Static assets only

---

## 3. Visual style (toddler-safe)

### Palette (soft, never dark-default)
| Role | Hex (approx) | Notes |
|------|----------------|-------|
| Sky top | `#A8D8FF` | Soft baby blue |
| Sky horizon | `#E8F4FF` | Near-white blue |
| Cloud fluff | `#FFFFFF` → `#F0F7FF` | Soft white with cool tint |
| Grass / ground | `#9ED99A` / `#7BC67E` | Gentle greens |
| Sun | `#FFE566` | Warm, friendly |
| Accent buttons | `#FFB4C8`, `#B8E0FF`, `#C5F0A8`, `#FFE0A0` | Pastel chips |
| Heavy rain sky | `#7BA3C9` | Slightly deeper blue — **not** black |
| Storm accent | `#6B8FB8` clouds + bright **yellow-white** friendly flash |

### Lighting & motion
- Soft hemisphere + directional light; no harsh shadows as default
- Gentle bobbing clouds; slow particle rise/fall
- Camera: fixed friendly angle; no sudden cuts
- Easing: ease-in-out; 0.6–1.2s stage transitions

### Mood rules
- Lightning = playful sparkle flash, not cinematic horror
- Thunder = soft low rumble — short, quiet, starts on user tap
- MVP uses nature props only (sun, vapor, cloud, drops, thermometer)


---

## 3b. Mascot — Dew the dewdrop

Cheerful **dewdrop character** who guides the child through each stage.

### Look
- Soft teardrop / water-drop body: glossy light blue `#B8E8FF` with white highlight
- Big friendly eyes, tiny smile — never scary
- Small arms/legs optional (simple blobs OK for MVP)
- Soft bounce idle animation

### Role
- Appears in UI and/or 3D scene as guide
- Reacts per stage (points up for vapor, huddles under cloud for rain, sparkles at lightning)
- Stage change: brief happy bounce + optional Web Speech line
- Does **not** block taps; never covers stage buttons

### MVP scope
- 2D/CSS or simple R3F mesh dewdrop in corner of canvas + react faces via emoji/scale
- Prefer one reusable `<DewMascot stage={n} />` driven by stage config

---

## 4. Information architecture & UX

```
┌─────────────────────────────────────────────┐
│  Title: Dew                      │
│  Caption (optional) + Speak toggle          │
├─────────────────────────────────────────────┤
│           [ Full-bleed 3D Canvas ]          │
├─────────────────────────────────────────────┤
│  [1][2][3][4][5][6][7]  ← chunky stage cards│
│  [ Back ]                    [ Next ]       │
└─────────────────────────────────────────────┘
```

### UX principles for a 3-year-old
- **Huge tap targets** — stage cards ≥ 64×64px (aim 72–88px)
- **One idea per stage** — short label (1–3 words) + optional one-line caption
- **Immediate feedback** — tap → scene animates that stage within ~200ms
- **Free explore** — any stage card anytime; order not forced
- **Next affordance** — advances to next stage (wraps after 7)
- **Soft auto-reset** — after idle on stage 7, gently return to stage 1 (optional)
- **Touch-first** — no hover-required interactions

### Labels (kid-facing)
| # | Short label | Caption (optional narrator) |
|---|-------------|------------------------------|
| 1 | Clouds | Warm water goes up and makes a soft cloud. |
| 2 | Warm & Cool | Warm wet air goes up. Up high it gets cooler. |
| 3 | Tiny Drops | Water sticks to tiny dust and makes little drops. |
| 4 | Drizzle | Soft little drops start to fall. |
| 5 | Rain | Steady rain falls down to the ground. |
| 6 | Lots of Rain | Big rain! Lots of drops. |
| 7 | Storm Fun | Darker soft clouds, a friendly flash, and rain! |

---

## 5. Stage-by-stage interaction & animation

Shared scene: ground plane (gentle grass), sun, sky color driven by stage, cloud cluster, particle systems for vapor & rain.

### Stage 1 — Cloud formation
- Vapor wisps rise; cool into fluffy white cloud (scale-up + opacity)
- Tap: restart vapor→cloud grow cycle

### Stage 2 — Humidity & temperature
- Warm moist air rising; simple thermometer (warm near ground → cool up high)
- Tap: replay rise + cool cue

### Stage 3 — Condensation
- Dust motes in cloud; droplets nucleate and grow
- Tap: burst of new droplets forming

### Stage 4 — Drizzle
- Sparse, slow, small rain
- Tap: extra drizzle burst

### Stage 5 — Rain
- Moderate density and speed; steady loop
- Tap: intensify briefly then settle

### Stage 6 — Heavy rain
- Thick downpour; puddle sheen on ground
- Tap: downpour pulse

### Stage 7 — Thunderstorm (friendly)
- Soft gray-blue clouds (not black); heavy rain; bright yellow-white flash
- Web Audio soft rumble after flash (on tap only)
- Tap: one friendly flash + soft rumble

### Transitions
- Crossfade sky colors, lerp rain intensity; no hard camera cuts

---

## 6. App structure (Next.js App Router)

```
how-rain-forms/
├── DESIGN.md
├── README.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── components/
    ├── RainScene.tsx       # R3F Canvas ("use client")
    ├── stageConfig.ts      # labels, colors, particle params
    ├── StageButtons.tsx
    ├── CaptionBar.tsx
    └── useThunder.ts       # Web Audio soft rumble
```

- Mark 3D tree `"use client"`; dynamic import Canvas with `ssr: false` if needed
- One Canvas; swap intensity via state rather than remounting

---

## 7. Build phases

### Phase 1 — Design (this document)
- Commit `DESIGN.md` to `cldev1/how-rain-forms` **before** UI code

### Phase 2 — Build MVP
1. Scaffold Next.js + R3F + drei
2. Soft sky scene + ground + sun + cloud
3. Wire 7 stage buttons → distinct visuals
4. Rain particle system parameterized by stage
5. Stage 2 thermometer; stage 3 condensation
6. Stage 7 friendly lightning + Web Audio rumble
7. Captions + optional Web Speech
8. `npm run build` green

### Phase 3 — Deploy (Vercel only — NO GitHub Pages)
- Push to **`cldev1/how-rain-forms`** (public OK)
- Deploy on **Vercel** Hobby team `team_LJWw3VSzeOfmii0jIu0CXY7F` via `create_git_project`
- Framework preset: **Next.js**; **no env vars**
- README: `npm i && npm run dev`, Vercel notes, link to this plan
- Report: live URL, repo URL, commit SHA, stack

---

## 8. Success criteria

- [ ] All 7 stages distinct and tappable
- [ ] Soft colorful toddler look (not dark theme)
- [ ] Client-only; no secrets
- [ ] `npm run build` succeeds
- [ ] Live on Vercel from GitHub repo
- [ ] README covers local run + Vercel + link to DESIGN.md
- [ ] No GitHub Pages / gh-pages branch

---

## 9. Risks & MVP shortcuts

| Risk | Mitigation |
|------|------------|
| Particle perf on phones | Cap counts; lower DPR on mobile |
| Audio autoplay policies | Start audio/speech on user tap |
| R3F SSR issues | `"use client"` + dynamic import `ssr: false` |
| Over-polish trap | Ship all 7 stages first |

---

*Prefer complete stages over endless polish. Deploy: Vercel only.*
