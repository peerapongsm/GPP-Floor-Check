import { expect, test } from "vitest";
import { CHECKLIST_RULES, ZONES, MIN_AREA_SQM } from "./gpp";

test("rule ids are unique", () => {
  const ids = CHECKLIST_RULES.map(r => r.id);
  expect(new Set(ids).size).toBe(ids.length);
});
test("all 7 zones defined", () => {
  expect(ZONES.map(z => z.id).sort()).toEqual(
    ["counseling","dangerous","dispensing","fridge","otc","storage","waiting"]);
});
test("min area is 8", () => { expect(MIN_AREA_SQM).toBe(8); });
