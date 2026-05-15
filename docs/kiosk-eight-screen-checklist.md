# Eight-screen kiosk — working checklist

Reference narrative: `docs/the-story-of-the-first-transcontinental-railroad.md`.  
Goal: **one clear idea per screen**, **2 short paragraphs** in the main column where possible; long detail in **Enlarge** modals.

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

---

## Structure (ship)

- [x] **8 screens** in `lib/kiosk-content.ts` — `TOTAL` derives from `KIOSK_SCREENS.length`
- [x] **Chronological rail order** — screen order matches timeline anchors left → right (Utah **1868** before **The Race** **Apr 1869**)
- [x] **Layout wiring** — `the-race` uses the same split as Vision/Decision (`visionDecisionLayout`)
- [x] **Intro copy** — `ExhibitIntro.tsx` mentions eight stops

---

## Screen-by-screen content pass

### 1 · The Vision (`vision`)

- [ ] **Doc tie-in:** early advocacy (Whitney) — optional **one sentence** in body if you want a deeper “before Judah” hook
- [ ] **Primary source** — alt text / transcript match the story
- [ ] **Enlarge** — reads well on its own

### 2 · The Decision (`decision`)

- [ ] **Doc tie-in:** 1862 Act + land/bonds (already strong); optional line on **1864** revision if not too dense
- [ ] **Lincoln figure** — caption still accurate
- [ ] **Enlarge** — statute transcript sufficient

### 3 · The Labor (`labor`)

- [ ] **Doc tie-in:** diverse labor — optional **one** extra line (UP freedmen *or* 1867 strike) in perspectives, not both
- [ ] **Gallery** — captions + modals feel complete
- [ ] **Payroll** — kiosk transcript + modal

### 4 · The Engineering (`engineering`)

- [ ] **Doc tie-in:** Bloomer Cut / Donner / 100th meridian / Sherman — pick **one** extra nod if a caption or body line fits
- [ ] **Dodge spotlight + blueprint** — still balanced after Race screen exists

### 5 · Utah & the line (`utah-labor`)

- [ ] **Doc tie-in:** 1868 contract / corridor (already central)
- [ ] **Optional:** single line on Native tension **or** defer to Consequences to avoid duplication
- [ ] **Stereographs** — enlarge flows

### 6 · The Race (`the-race`) — **new**

- [x] **In app** — mileage race, Promontory fixed, Ten-Mile Day, handcar photo
- [ ] **Review** — tighten wording after one museum read-through
- [ ] **Asset** — `chinese-and-the-iron-road-1869.jpg` displays well on kiosk resolution

### 7 · The Event (`event`)

- [ ] **Doc tie-in:** Golden Spike / telegraph — align body with NPS facts if you tighten copy
- [ ] **Russell photo** — modal transcript

### 8 · The Consequences (`consequences`)

- [ ] **Doc tie-in:** Crédit Mobilier, Chinese Exclusion, Stanford, Native dispossession, freight legacy — **two short paragraphs** max; use **modal** for “Done” depth
- [ ] **Balance** — growth vs. harm explicit

---

## Polish (later)

- [ ] **Header subtitle** — `IronRoadKiosk` still says “1861–1869”; OK unless you want “8 chapters” called out
- [ ] **Further reading** — add/trim links from the reference doc’s PBS/NPS/LOC URLs where helpful
- [ ] **Timeline ticks** — if two screens feel crowded in **May 1869**, adjust tick labels only (content is already separate)

---

## Done =

Visitor can answer: **What law enabled it? Who built it? What was the race? What happened at Promontory? What lasted after?** without feeling rushed or overloaded.
