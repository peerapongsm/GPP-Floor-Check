import type { ZoneId } from "./types";

export const ZONE_COLORS: Record<ZoneId, string> = {
  dispensing: "#BFE3E8",
  counseling: "#CDE7D5",
  dangerous:  "#F3D2CE",
  otc:        "#E7EDF0",
  fridge:     "#CFE0F2",
  storage:    "#EDE6D6",
  waiting:    "#E6E0EC",
};

export const ZONE_SHORT_LABEL: Record<ZoneId, string[]> = {
  dispensing: ["ส่งมอบยา"],
  counseling: ["ให้คำ", "ปรึกษา"],
  dangerous:  ["ยาอันตราย"],
  otc:        ["ยา OTC"],
  fridge:     ["ตู้เย็นยา"],
  storage:    ["คลัง"],
  waiting:    ["รอรับ", "บริการ"],
};
