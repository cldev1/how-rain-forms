# Dew — UX Research (toddler / phone-first)

**Audience:** ~3yo (range 2–4) with a parent nearby  
**Primary device:** phone, portrait (~390×844)  
**Date:** 2026-09-22 IST  
**Goal:** every rain stage must be **obviously different at a glance** on a small screen.

---

## 1. Toddler (2–4) educational UX

- **One primary action per moment.** Screens that offer many equal choices raise cognitive load; kids do better with a clear “what to do next” (Aufait UX kids-app principles; preschool toy → progressive mastery patterns).
- **Tap only.** Ages 2–4 reliably tap; drag/pinch/rotate are unreliable (TIDRC framework; Aziz et al. on gesture acquisition). Dew navigation is tap + big Back/Next.
- **Huge, forgiving targets.** Enlarge hit areas beyond the visible icon; leave palm-friendly spacing (TIDRC TS52; touch studies ages 3–6). Aim ≥48–56px; hero controls larger.
- **Visual > text.** Short parent-read captions are fine; kids navigate by color, icon silhouette, and character reaction — not chip labels.
- **Immediate feedback.** Stage change should change sky, rain, and Dew mood together so the tap “did something.”

Sources: [Aufait — Kids App Design](https://www.aufaitux.com/blog/kids-app-design/); [TIDRC (ACM IDC)](https://doi.org/10.1145/3311927.3323149); [CEP gesture study](https://doi.org/10.3345/cep.2019.00997).

---

## 2. Teaching rain / water cycle to preschoolers

Curricula simplify to a **story sequence**, not a scientific flowchart:

1. Water goes up (evaporation / vapor)  
2. Air cools up high  
3. Tiny drops form in the cloud (condensation)  
4. Soft drops fall → steadier rain → lots of rain (precipitation intensity)  
5. Collection / “again!” (cycle)

Classroom materials use **picture cards, wheels, and songs** with one visual per step — kids sequence cards, they do not compare seven near-identical blue tiles (NCAL water-cycle lesson; preschool water-cycle card/song sets; Crafting Jeannie diagrams).

**Implication for Dew:** keep 7 stages, but present them as a **story path** (one big “now” card + progress nodes), not a 7-chip wrap grid.

Sources: [NCAL — Water Cycle in a Jar](https://www.agliteracy.org/matrix/lessons/1019/); preschool water-cycle visual cards / sequence worksheets (common ECE pattern).

---

## 3. Making sequential stages visually DISTINCT

Subtle color lerps fail on phones and for toddlers. Distinction needs **category jumps**, not 10% hue shifts:

| Channel | Technique |
|--------|-----------|
| **Sky / mood** | Unique palette per stage (sunny cream, warm/cool split, lavender mist, overcast, slate rain, dark heavy, storm purple) — Apple HIG: background color establishes place |
| **Silhouette** | Different on-screen props (sun, thermometer, condensation beads, lightning bolt) so a screenshot is identifiable without reading |
| **Rain grammar** | Discrete steps: none → mist → sparse slow → steady → heavy → storm (count / speed / size jump clearly) |
| **UI chrome** | Stage accent color on hero card + path node; selected node much larger |
| **Character** | Dew mood/motion unique per stage (curious → sparkly) |

Avoid relying on seven similar blue-gray skies. Reinforce color with shape and motion (TIDRC: differentiate clickable/state with more than hue alone).

Sources: Apple HIG Color (background as place); TIDRC clickable/state differentiation; TinyTap-style visual learning maps for progression without dense menus.

---

## 4. Mobile-first kids apps (phone portrait)

- **Portrait-first layout:** scene takes most of the upper viewport; controls live in a **thumb-zone bottom sheet**.
- **No tiny chip grids.** Seven equal mini-buttons wrap into an indistinguishable mosaic on ~390px widths (Sandesh feedback; BYJU’S mobile thumb-zone lessons).
- **Prefer:** one large selected stage card + prev/next, or a story-path of oversized nodes with one hero selection.
- **Canvas:** taller / nearer full-bleed above controls so weather differences are readable; avoid squeezing the 3D view under a dense control stack.
- **Thumb zone:** Back / Next and speak control in the lower third; stage pick via large nodes or carousel, not a 3×3 chip wrap.

Sources: BYJU’S / Disney kids mobile adaptation notes (portrait + thumb zones); TinyTap learning-map progression; general kids-app mobile patterns (large targets, visual nav for non-readers).

---

## 5. Product decisions for Dew (from this research)

1. Replace 7-chip wrap with **story-path + hero stage card** (huge label, unique icon, short caption always visible).  
2. Give each stage a **unique sky mood** (not subtle blue lerps only).  
3. Make rain levels **step functions** (none / mist / sparse / steady / heavy / storm).  
4. Phone layout: **tall canvas + bottom controls**; keep Dew mood reactions per stage.  
5. Parent can still jump stages via path nodes, but the default story is Back/Next.

---

## Honest quality note

This raises **distinguishability and phone usability**. It does not claim Pixar-level art direction — R3F soft geometry remains stylized-educational. Success metric: a parent on a phone can tell which of the 7 stages is showing from a glance at sky + rain + hero card.
