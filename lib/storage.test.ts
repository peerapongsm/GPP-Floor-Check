import { expect, test, beforeEach } from "vitest";
import { save, load, clearSaved, type SavedState } from "./storage";
import type { Answers } from "./types";

const answers: Answers = { widthM: 3, depthM: 4, doorSide: "bottom", checklist: { temp: true } };
const state: SavedState = { answers, layout: [{ zone: "fridge", x: 0, y: 0, w: 1, h: 1 }] };

beforeEach(() => clearSaved());

test("load returns null when empty", () => { expect(load()).toBeNull(); });
test("save then load round-trips", () => {
  save(state);
  expect(load()).toEqual(state);
});
test("clearSaved removes state", () => {
  save(state); clearSaved();
  expect(load()).toBeNull();
});
