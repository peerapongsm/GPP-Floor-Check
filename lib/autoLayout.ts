import type { DoorSide, ZoneBox, ZoneId } from "./types";

// Normalized template on unit square, door at bottom (v = 1).
// (u, v) = top-left as fractions; (uw, vh) = size fractions.
const TEMPLATE: Array<{ zone: ZoneId; u: number; v: number; uw: number; vh: number }> = [
  { zone: "dangerous",  u: 0.0, v: 0.0,  uw: 0.4, vh: 0.33 },
  { zone: "fridge",     u: 0.4, v: 0.0,  uw: 0.2, vh: 0.33 },
  { zone: "storage",    u: 0.6, v: 0.0,  uw: 0.4, vh: 0.33 },
  { zone: "dispensing", u: 0.0, v: 0.33, uw: 0.6, vh: 0.33 },
  { zone: "counseling", u: 0.6, v: 0.33, uw: 0.4, vh: 0.33 },
  { zone: "waiting",    u: 0.0, v: 0.66, uw: 0.5, vh: 0.34 },
  { zone: "otc",        u: 0.5, v: 0.66, uw: 0.5, vh: 0.34 },
];

// Map a unit-square box to meters for the given door side.
// `front` axis (v) runs perpendicular to the door wall, front edge touching the door.
function place(side: DoorSide, u: number, v: number, uw: number, vh: number, W: number, D: number) {
  switch (side) {
    case "bottom": return { x: u * W, y: v * D, w: uw * W, h: vh * D };
    case "top":    return { x: u * W, y: (1 - v - vh) * D, w: uw * W, h: vh * D };
    case "left":   return { x: (1 - v - vh) * W, y: u * D, w: vh * W, h: uw * D };
    case "right":  return { x: v * W, y: u * D, w: vh * W, h: uw * D };
  }
}

export function autoLayout(widthM: number, depthM: number, doorSide: DoorSide): ZoneBox[] {
  return TEMPLATE.map(t => {
    const { x, y, w, h } = place(doorSide, t.u, t.v, t.uw, t.vh, widthM, depthM);
    return { zone: t.zone, x, y, w, h };
  });
}
