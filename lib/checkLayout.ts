import type { Boundary, Violation, ZoneBox } from "./types";
import { ZONES, MIN_AREA_SQM } from "./gpp";

const EPS = 1e-9;
function overlaps(a: ZoneBox, b: ZoneBox) {
  return a.x < b.x + b.w - EPS && b.x < a.x + a.w - EPS &&
         a.y < b.y + b.h - EPS && b.y < a.y + a.h - EPS;
}

export function checkLayout(boxes: ZoneBox[], boundary: Boundary): Violation[] {
  const v: Violation[] = [];

  if (boundary.w * boundary.h < MIN_AREA_SQM - EPS) {
    v.push({ type: "tooSmall", detail: `พื้นที่ร้าน ${(boundary.w * boundary.h).toFixed(1)} ตร.ม. ต่ำกว่า ${MIN_AREA_SQM} ตร.ม.` });
  }

  const present = new Set(boxes.map(b => b.zone));
  for (const z of ZONES) {
    if (!present.has(z.id)) v.push({ type: "missing", detail: `ขาดโซน: ${z.label}` });
  }

  for (const b of boxes) {
    if (b.x < -EPS || b.y < -EPS || b.x + b.w > boundary.w + EPS || b.y + b.h > boundary.h + EPS) {
      v.push({ type: "outside", detail: `โซนเกินขอบร้าน: ${b.zone}` });
    }
  }

  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      if (overlaps(boxes[i], boxes[j]))
        v.push({ type: "overlap", detail: `โซนทับกัน: ${boxes[i].zone} / ${boxes[j].zone}` });

  return v;
}
