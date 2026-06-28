import type { Answers, GapItem, ZoneBox } from "./types";
import { CHECKLIST_RULES, ZONES, MIN_AREA_SQM } from "./gpp";

export function gapReport(answers: Answers, layout: ZoneBox[]): GapItem[] {
  const items: GapItem[] = [];
  const area = answers.widthM * answers.depthM;
  items.push({
    id: "area",
    label: `พื้นที่ขาย/ให้บริการ ≥ ${MIN_AREA_SQM} ตร.ม. (ปัจจุบัน ${area.toFixed(1)} ตร.ม.)`,
    status: area >= MIN_AREA_SQM ? "pass" : "fail",
    หมวด: 1,
    fix: `ขยายพื้นที่ให้บริการให้ถึง ${MIN_AREA_SQM} ตร.ม. ขึ้นไป`,
  });
  for (const r of CHECKLIST_RULES) {
    const ok = answers.checklist[r.id] === true;
    items.push({
      id: r.id, label: r.question, หมวด: r.หมวด,
      status: ok ? "pass" : r.required ? "fail" : "warn", fix: r.fix,
    });
  }
  const present = new Set(layout.map(b => b.zone));
  for (const z of ZONES) {
    items.push({
      id: `zone:${z.id}`, label: `โซน: ${z.label}`, หมวด: 1,
      status: present.has(z.id) ? "pass" : "fail",
      fix: `เพิ่มโซน "${z.label}" ในผัง — ${z.rule}`,
    });
  }
  return items;
}
