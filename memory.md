# project-6-gpp-fitout-planner — Memory Log
**Last updated:** 2026-06-28

---

## 1. Project Overview
Thai pharmacy GPP fit-out planner. Next.js 15, TypeScript, static export (`out/`). Mobile-first, pharmacists use phones. All copy in Thai. No Tailwind — uses CSS variables in `globals.css`.

## 2. Architecture
- `lib/types.ts` — core types: `Answers`, `ZoneBox`, `DoorSide`, `GapItem`, `Violation`, `Status`
- `lib/gpp.ts` — `CHECKLIST_RULES` (12 items, หมวด 1+2), `ZONES` (7 zones), `MIN_AREA_SQM = 8`
- `lib/autoLayout.ts` — `autoLayout(widthM, depthM, doorSide): ZoneBox[]`
- `lib/storage.ts` — `save/load/clearSaved` via localStorage key `gpp-fitout-v1`
- `lib/gapReport.ts` — gap analysis from answers + zones
- `lib/checkLayout.ts` — layout violation checker
- `lib/zoneStyle.ts` — shared `ZONE_COLORS` + `ZONE_SHORT_LABEL` (single source for all 3 SVG components)
- `app/page.tsx` — view-state machine: landing | wizard | result | editor; lifts `answers` + `layout` + `wizardSeed` state; autosave on change, restore on mount
- `components/Wizard.tsx` — 4-step wizard; props: `onComplete(a: Answers)`, optional `initial?: Answers` (seeds state for resume/edit)
- `components/Disclaimer.tsx` — static legal notice

## 3. Tasks Completed
- Tasks 1–6: scaffold, types, gpp rules, autoLayout, gapReport, checkLayout, storage (all with tests)
- Task 7: Wizard component + page.tsx wiring + autosave/restore

## 4. Key Decisions
- Wizard is 4 steps (split checklist by หมวด 1 / หมวด 2) not 2, for better mobile UX
- +/- steppers for dimensions (48px touch targets) instead of plain number input
- Checklist cards color-code: green card = มี, red card = ยังไม่มี (inline style overrides className)
- Required items shown with red dot; optional with amber "(แนะนำ)" label
- Wizard accepts `initial?: Answers`; landing shows "ดูผลล่าสุด" + "ประเมินใหม่" when prior answers exist; "แก้คำตอบ" seeds wizard with current answers; "ประเมินใหม่" seeds with undefined (defaults)
- `main` padding set to 0 for wizard view (edge-to-edge); 20px for other views
- `isolatedModules: true` in tsconfig → all type imports use `import type`
- Zone colors/labels are single-sourced in `lib/zoneStyle.ts`
- ResultView on-screen header div (dimensions + print button) has `no-print` so it does not duplicate the `.print-header` block when printing

## 5. Tests
29 tests in 6 files. Run: `npm test`. All lib functions covered; no component tests yet.

## 6. Build
`npm run build` → static export to `out/`. Page bundle ~4.97 kB. Requires `out/` to exist after build.
