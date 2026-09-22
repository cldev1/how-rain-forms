# Dew — Product + Code Review & Improvement Plan

**Date:** 2026-09-22 IST  
**Live:** https://how-rain-forms.vercel.app  
**Repo:** cldev1/how-rain-forms (`main` @ `4048305` / phone-first lineage from `07e49ea`)  
**Scope:** Review + plan only — **no code shipped**

---

## Current state (honest)

Dew is no longer the earlier “junk” chip-grid experiment: the phone-first story path, hero card, pastel chrome, and per-stage mood colors are a real step up and match DESIGN.md / UX-RESEARCH.md intent. On ~390×844 the chrome works (Next walks all 7 stages; story-path jump works; Back/Next are thumb-sized). The 3D is an honest soft R3F toy — cute Dew, lumpy sphere-clouds, streak rain — **not** Arcade/Pixar polish. Remaining trust risks: the page **scrolls** on phone because canvas + bottom sheet exceed the viewport; drizzle barely reads; storm lightning zigzag stays on the whole stage; and there is **no WebGL failure UI** if the canvas dies. Stages 1→3 and 5→7 are glanceably different; mid rain stages still lean on density alone.

---

## What’s working

- **IA matches research:** tall scene + bottom sheet with hero (icon, label, kid line, caption) + story-path nodes + big Back/Next — not a 7-chip wrap.
- **Kids colorful UI:** soft pastels, yellow Next CTA, no dark chrome; stage accents on hero/path.
- **Pedagogy config is clean:** `stageConfig.ts` owns skies, rain grammar, props flags, Dew moods — easy to tune without hunting JSX.
- **Glanceable extremes:** Clouds (vapor orbs + sun cream sky), Tiny Drops (lavender + condensation), Storm Fun (purple/pink mood + heavy streaks) read apart in mobile screenshots (`screenshots/mobile-stage-0*.png`, `mobile-scene-0*.png`).
- **Client architecture:** `RainCanvas` dynamic `ssr: false` + loading “Dew is waking up…” avoids SSR/WebGL hydration crashes; gesture-gated click/thunder AudioContexts; optional SpeechSynthesis narrator.
- **Live chrome QA (2026-09-22):** Playwright @ 390×844 and 1280×800 — Next through 1→7, story-path jump to Storm Fun, nav targets ~56px tall, active path node 72×72. Prior WebGL screenshots (commit `4048305`) confirm scene content when GPU works.

---

## Gaps / issues found (with evidence)

### Product / UX

| Issue | Evidence |
|-------|----------|
| **Page scrolls on phone** | Live metrics: `bodyOverflowY` / `rootScroll` true @ 390×844. Canvas CSS ~374×439 + bottom sheet ~342px + header/footer > 844. Kids lose “locked” story feel; thumb can drag the whole page. |
| **Bottom sheet crowds the scene** | Sheet ~342px (~40% of viewport). Hero + path + nav all always visible → canvas height capped (~52dvh). Weather differences fight for screen real estate. |
| **Drizzle almost invisible** | `rainCount: 22` in `stageConfig`; `mobile-scene-04.png` reads as ~one thin streak. Kid line says “Soft drops fall” but scene often looks dry. |
| **Rain stages still similar** | Stages 4–6 mainly differ by streak density/sky darkness; few unique silhouettes (no puddle splash, umbrella, etc.). Sandesh’s old “stages too similar” feedback is only half-fixed for mid stages. |
| **Dew clipped** | Multiple scene crops (`mobile-scene-01/03/07`) cut Dew’s body at the canvas bottom edge. |
| **Warm & Cool under-delivers** | Design wants warm/cool split + thermometer. Scene crops show grey clouds + vapor; thermo is small/easy to miss; Dew “thinking” face can read sad (`mobile-stage-02` description). |
| **Tiny Drops mist looks square** | Stage 3 screenshot notes square Points particles mixed with circles — cheap/placeholder vs toy spheres. |
| **Storm lightning always on** | Code bug (below): zigzag bolt group stays visible for whole stage 7, not only the flash beat. Undercuts “friendly flash.” |
| **Surprise auto-loop** | `DewApp` `setTimeout(..., 50000)` on stage 7 → jumps to stage 1. No UI explanation; can interrupt parent/kid mid-storm. |
| **Back wraps 1↔7** | Wraparound Next/Back is convenient for adults, confusing for sequential story (“done?”). |
| **Story-path fat-finger risk** | Inactive nodes 58×58 with 7 across ~374px width — tight for ~3yo; active label truncates (“Tiny Drop…”). |
| **Caption size** | Live computed `.stage-hero-caption` ~14px on mobile — parent-readable but small in bright light. |
| **No viewport / safe-area meta** | `layout.tsx` has no `viewport` export / `viewport-fit=cover` / `safe-area-inset` padding — risk on notched iPhones. |

### Code / architecture / performance

| Issue | Evidence |
|-------|----------|
| **No WebGL error boundary / fallback** | Headless Chrome live run: repeated `THREE.WebGLRenderer: Error creating WebGL context` with empty default canvas (300×150). Real low-end / restricted GPUs get a broken hero with no kid-friendly fallback. |
| **Lightning zigzag not flash-gated** | `LightningFlash` in `RainScene.tsx`: light + one bolt mesh gated by `flashUntil`; **zigzag `<group>` always rendered at opacity 0.85** whenever `active`. |
| **Per-frame Color allocation** | `SoftCloud` `useFrame`: `lerp(new THREE.Color("#6B7A8A"), …)` allocates every frame × 4 clouds — GC jank risk on phone. |
| **Rain budget high for phones** | Stage 6–7: 240–320 instanced streaks + ~28 cloud spheres + terrain/flowers/Dew + vapor/mist. `dpr={[1,1.75]}` helps; no adaptive DPR / particle scale by `navigator.hardwareConcurrency` or pixel ratio. |
| **Background hard-cut vs lerped sky** | `<color attach="background" args={[stage.skyBottom]} />` snaps while `SkyBackdrop` lerps — possible flash between stages. |
| **Dead code / unused dep** | `CaptionBar.tsx` unused; `@react-three/drei` in `package.json` but no imports; no `lib/` folder (all logic in `components/`). |
| **Reduced motion incomplete** | CSS `prefers-reduced-motion` stops blobs/logo; R3F bounce/rain/vapor keep running. |
| **Audio UX gaps** | Click sound always on stage change (no mute); narrator speaks `caption` not `kidLine`; two separate `AudioContext`s (click + thunder). |
| **a11y** | Path uses `role="tablist"` / `tab` but no keyboard arrow roving; canvas has no accessible live region announcing stage change; speak button is good (`aria-pressed`). |
| **SSR/hydration** | Generally safe via dynamic canvas; DewApp is client-only root — fine. Main risk is uncaught WebGL throw bubbling. |

### Honest visual bar

Soft sphere clouds + box-streak rain + glossy Dew = **educational toy**, not Apple Arcade. That is OK if stages stay unmistakable and the phone layout doesn’t fight the parent. Current polish is “good preschool demo,” not “ship and forget.”

---

## Prioritized plan

| Pri | Item | Problem (observed) | Proposed fix | Effort | Impact |
|-----|------|--------------------|--------------|--------|--------|
| **P0** | Lock phone viewport (no page scroll) | Canvas+sheet exceed 844px; `rootScroll: true` | Reflow: compress hero (hide parent caption behind “more” or smaller type), shrink path row, or make sheet sticky with scene `flex:1` and `overflow:hidden` on `.dew-root`; target **one screen, no scroll** @ 390×844 | M | High — trust + toddler usability |
| **P0** | WebGL fail soft-landing | Blank/broken canvas if context fails | Error boundary around Canvas; show 2D gradient sky + stage icon + Dew SVG + kid line; retry button | M | High — never show a dead hole |
| **P0** | Gate storm lightning to flash only | Zigzag bolt always visible on stage 7 | Bind zigzag group visibility/opacity to same `flashUntil` as light; optional 1–2 repeat flashes on enter | S | High — “Flash! Boom!” must mean flash |
| **P1** | Make drizzle readable | `rainCount: 22` ≈ empty scene | Raise drizzle to ~45–70 slower, thicker streaks; maybe 2–3 ground splash dots | S | High — stage 4 must look wet |
| **P1** | Mid-stage silhouettes | 4–6 differ mainly by density | Add one unique prop each: drizzle = soft mist rings; rain = clear puddle ripples; lots = bigger puddle + darker wet grass jump | M | High — kills remaining sameness |
| **P1** | Reframe Dew fully in view | Character clipped at canvas bottom | Raise Dew Y / pull camera slightly / shorter ground crop; verify @ 390×844 | S | Med-High — mascot is the brand |
| **P1** | Phone particle budget | 320 streaks + heavy meshes | Cap rain ~180 on `dpr`/width heuristic; memoize dark cloud Color; drop unused cloud puff or flower density on small screens | M | Med-High — jank on mid phones |
| **P1** | Tiny Drops particles | Square Points mist | Replace mist with small transparent spheres (instanced) or hide Squares; lean on Condensation beads | S | Med — polish + clarity |
| **P1** | Warm & Cool clarity | Thermo/split sky weak | Bigger thermo nearer camera; clearer warm-left / cool-right sky; happier/curious Dew (not sad) | S–M | Med — pedagogy |
| **P1** | Kill surprise auto-reset | 50s timeout → stage 1 | Remove or replace with explicit “Again!” on stage 7 only after user idle + toast | S | Med — parent trust |
| **P1** | Story-path taps | 58px nodes, 7-across cramped | Prefer Back/Next as primary; path as parent scrub with larger hitSlop / fewer labels; or scroll-snap carousel of 3 visible nodes | M | Med — Noah fat-finger |
| **P2** | Viewport + safe-area | Notch/home indicator risk | Next `viewport` export; padding `env(safe-area-inset-*)` on root/sheet | S | Med |
| **P2** | Reduced-motion for 3D | CSS only | Gate Dew bounce / vapor / rain speed when `matchMedia('(prefers-reduced-motion: reduce)')` | S | Med — a11y |
| **P2** | Dead code cleanup | CaptionBar, unused drei | Delete unused component; drop or start using drei (`Html` badges, `SoftShadows` sparingly) | S | Low-Med — maintainability |
| **P2** | Audio / narrator UX | Always-click; robotic TTS | Mute toggle for SFX; speak `kidLine` first; optional parent caption; single shared AudioContext | S–M | Med delight |
| **P2** | a11y live region | Stage change silent to AT | `aria-live="polite"` announcing `{label}. {kidLine}` | S | Med |
| **P2** | Lerp scene background | Hard cut on `<color attach>` | Drive background from lerped `visual.skyBottom` | S | Low-Med polish |
| **P2** | End-of-story beat | Next on 7 wraps silently | Stage 7 Next → celebration “Rain again!” card then restart | M | Delight |
| **P3** | Parent tip sheet | No coaching | Collapse “For grown-ups” with cycle diagram | M | Nice |
| **P3** | Offline / install | Reload needs net | Light PWA cache of shell | L | Later |
| **P3** | Analytics | Unknown drop-off | Privacy-light funnel (stage reached) | M | Later |
| **P3** | Art pass | Sphere clouds still lumpy | Custom cloud meshes / normals — only after distinguishability done | L | Polish only |

---

## Recommended next ship (≤1–2 weeks)

Ship a **tight “phone trust + glanceability”** slice — 4 items, roughly in order:

1. **P0 viewport lock** — one-screen layout @ 390×844 (no scroll); keep Next/Back thumb-zone.  
2. **P0 lightning flash-only** — zigzag gated to flash window.  
3. **P0 WebGL fallback** — never blank.  
4. **P1 drizzle + Dew framing + Tiny Drops mist** — stage 4 readable; mascot fully on-screen; no square mist.  
5. *(If time)* **P1 remove 50s auto-loop** + bump mid-stage silhouette (puddle on 5/6).

**Out of scope for this ship:** Pixar art redo, PWA, analytics, full path redesign, desktop-first layout.

**Exit criteria:** Parent on a phone can tell stages 1, 3, 4, 5, 7 apart from a screenshot of the **scene alone**; page does not scroll; storm flashes then settles; WebGL-off still shows a friendly card; `npm run build` green.

---

## Open questions for Sandesh

1. **Auto-loop:** Keep any auto-restart after Storm Fun, or only manual “Again!” / Next?  
2. **Story-path for Noah:** Should path nodes stay tappable for kids, or parent-only scrub with Back/Next as the sole kid path?  
3. **Storm mood:** Is darker purple storm OK for a ~3yo, or should Storm Fun stay brighter/pinker while still distinct?

---

## Review method notes

- Read: `DESIGN.md`, `docs/UX-RESEARCH.md`, `package.json`, `app/*`, `components/*` (no `lib/`).  
- Visual: existing `screenshots/mobile-stage-*.png`, `mobile-scene-*.png`, `verify-live-*.png` (WebGL-capable capture @ `4048305`).  
- Live UI (2026-09-22 IST): Playwright Chrome @ **390×844** and **1280×800** — navigation/metrics in `screenshots/live-qa/report.json` (WebGL unavailable in this headless box; not treated as a production crash).  
- No code changes pushed or deployed.
