import { expect, test } from "vitest";
import { autoLayout } from "./autoLayout";
import type { DoorSide, ZoneBox } from "./types";

const SIDES: DoorSide[] = ["top", "bottom", "left", "right"];

const EPS = 1e-9;
function overlaps(a: ZoneBox, b: ZoneBox) {
  return a.x < b.x + b.w - EPS && b.x < a.x + a.w - EPS &&
         a.y < b.y + b.h - EPS && b.y < a.y + a.h - EPS;
}

for (const side of SIDES) {
  test(`${side}: produces all 7 unique zones`, () => {
    const boxes = autoLayout(3, 4, side);
    expect(new Set(boxes.map(b => b.zone)).size).toBe(7);
  });
  test(`${side}: every box inside boundary`, () => {
    const W = 3, D = 4;
    for (const b of autoLayout(W, D, side)) {
      expect(b.x).toBeGreaterThanOrEqual(-1e-9);
      expect(b.y).toBeGreaterThanOrEqual(-1e-9);
      expect(b.x + b.w).toBeLessThanOrEqual(W + 1e-9);
      expect(b.y + b.h).toBeLessThanOrEqual(D + 1e-9);
    }
  });
  test(`${side}: no two boxes overlap`, () => {
    const boxes = autoLayout(3, 4, side);
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        expect(overlaps(boxes[i], boxes[j])).toBe(false);
  });
}
