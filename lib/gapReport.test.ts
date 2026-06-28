import { expect, test } from "vitest";
import { gapReport } from "./gapReport";
import { CHECKLIST_RULES, ZONES } from "./gpp";
import type { Answers, ZoneBox } from "./types";

const allTrue: Record<string, boolean> = Object.fromEntries(CHECKLIST_RULES.map(r => [r.id, true]));
const fullLayout: ZoneBox[] = ZONES.map(z => ({ zone: z.id, x: 0, y: 0, w: 1, h: 1 }));
const base: Answers = { widthM: 3, depthM: 4, doorSide: "bottom", checklist: allTrue };

test("all satisfied -> every item passes", () => {
  const r = gapReport(base, fullLayout);
  expect(r.every(i => i.status === "pass")).toBe(true);
});
test("area below 8 -> area item fails", () => {
  const r = gapReport({ ...base, widthM: 2, depthM: 3 }, fullLayout); // 6 sqm
  expect(r.find(i => i.id === "area")!.status).toBe("fail");
});
test("missing required checklist -> fail", () => {
  const r = gapReport({ ...base, checklist: { ...allTrue, temp: false } }, fullLayout);
  expect(r.find(i => i.id === "temp")!.status).toBe("fail");
});
test("missing recommended checklist -> warn", () => {
  const r = gapReport({ ...base, checklist: { ...allTrue, references: false } }, fullLayout);
  expect(r.find(i => i.id === "references")!.status).toBe("warn");
});
test("missing zone -> fail", () => {
  const r = gapReport(base, fullLayout.filter(b => b.zone !== "fridge"));
  expect(r.find(i => i.id === "zone:fridge")!.status).toBe("fail");
});
