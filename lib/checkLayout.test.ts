import { expect, test } from "vitest";
import { checkLayout } from "./checkLayout";
import { autoLayout } from "./autoLayout";
import type { Boundary, ZoneBox } from "./types";

const boundary: Boundary = { w: 3, h: 4, doorSide: "bottom" };
const good = autoLayout(3, 4, "bottom");

test("valid full layout -> no violations", () => {
  expect(checkLayout(good, boundary)).toEqual([]);
});
test("missing zone -> 'missing' violation", () => {
  const v = checkLayout(good.filter(b => b.zone !== "fridge"), boundary);
  expect(v.some(x => x.type === "missing")).toBe(true);
});
test("box outside boundary -> 'outside'", () => {
  const bad: ZoneBox[] = good.map(b => b.zone === "otc" ? { ...b, x: 2.9, w: 1 } : b);
  expect(checkLayout(bad, boundary).some(x => x.type === "outside")).toBe(true);
});
test("overlapping boxes -> 'overlap'", () => {
  const bad: ZoneBox[] = good.map(b => b.zone === "otc" ? { ...b, x: 0, y: 0, w: 1, h: 1 } : b);
  expect(checkLayout(bad, boundary).some(x => x.type === "overlap")).toBe(true);
});
test("boundary under 8 sqm -> 'tooSmall'", () => {
  const small: Boundary = { w: 2, h: 3, doorSide: "bottom" }; // 6 sqm
  expect(checkLayout(autoLayout(2, 3, "bottom"), small).some(x => x.type === "tooSmall")).toBe(true);
});
