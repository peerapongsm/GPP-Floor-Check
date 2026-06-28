import type { Answers, ZoneBox } from "./types";

export interface SavedState { answers: Answers; layout: ZoneBox[]; }
const KEY = "gpp-fitout-v1";

export function save(s: SavedState): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* quota/private mode: ignore */ }
}
export function load(): SavedState | null {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "null"); } catch { return null; }
}
export function clearSaved(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
