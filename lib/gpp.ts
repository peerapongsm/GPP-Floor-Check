import type { ZoneId } from "./types";

export const MIN_AREA_SQM = 8;

export interface ChecklistRule {
  id: string;
  question: string;   // shown in wizard
  หมวด: 1 | 2;
  fix: string;        // shown when not satisfied
  required: boolean;  // true -> fail when missing; false -> warn
}

export const CHECKLIST_RULES: ChecklistRule[] = [
  { id: "temp", question: "ควบคุมอุณหภูมิร้านไม่เกิน 30°C (มีเครื่องปรับอากาศ)?", หมวด: 1, required: true,
    fix: "ติดตั้งเครื่องปรับอากาศให้คุมอุณหภูมิร้านไม่เกิน 30°C" },
  { id: "thermometer", question: "มีเทอร์โมมิเตอร์และไฮโกรมิเตอร์วัดอุณหภูมิ/ความชื้นในร้าน?", หมวด: 1, required: true,
    fix: "ติดเทอร์โมมิเตอร์และไฮโกรมิเตอร์ในบริเวณเก็บยา" },
  { id: "lighting", question: "มีแสงสว่างเพียงพอต่อการอ่านฉลากยา?", หมวด: 1, required: true,
    fix: "เพิ่มแสงสว่างให้อ่านฉลากยาได้ชัดเจน" },
  { id: "cleanPest", question: "ร้านสะอาด และมีระบบกันสัตว์/แมลง?", หมวด: 1, required: true,
    fix: "จัดร้านให้สะอาดและป้องกันสัตว์/แมลงเข้าถึงยา" },
  { id: "signage", question: "มีป้ายร้านขายยา ป้ายแสดงตัวเภสัชกร และแสดงใบอนุญาตให้เห็นชัด?", หมวด: 1, required: true,
    fix: "ติดป้ายร้านขายยา ป้ายเภสัชกร และแสดงใบอนุญาตในจุดที่ลูกค้าเห็นชัด" },
  { id: "shelving", question: "ชั้น/ตู้วางยาจัดเป็นระเบียบ แยกประเภท (ยาภายใน/ภายนอก, แยกยาหมดอายุ/ยาคืน)?", หมวด: 1, required: true,
    fix: "จัดชั้นวางแยกยาภายใน/ภายนอก และแยกยาหมดอายุ/ยาคืนออกจากยาขาย" },
  { id: "handwash", question: "มีอ่างล้างมือหรือแหล่งน้ำสะอาด?", หมวด: 1, required: true,
    fix: "จัดให้มีอ่างล้างมือหรือแหล่งน้ำสะอาดในร้าน" },
  { id: "fridgePresent", question: "มีตู้เย็นสำหรับเก็บยาโดยเฉพาะ (แยกจากตู้เย็นอาหาร)?", หมวด: 2, required: true,
    fix: "จัดหาตู้เย็นเก็บยาโดยเฉพาะ ไม่ใช้ปนกับอาหาร" },
  { id: "fridgeThermo", question: "มีเทอร์โมมิเตอร์ในตู้เย็นเก็บยา?", หมวด: 2, required: true,
    fix: "ติดเทอร์โมมิเตอร์ในตู้เย็นเก็บยาและบันทึกอุณหภูมิ" },
  { id: "equipment", question: "มีอุปกรณ์จ่ายยา (ถาดนับเม็ดยา, อุปกรณ์แบ่งบรรจุ, ซอง/ฉลากยา)?", หมวด: 2, required: true,
    fix: "จัดหาถาดนับเม็ดยา อุปกรณ์แบ่งบรรจุ และซอง/ฉลากยา" },
  { id: "references", question: "มีตำราหรือเอกสารอ้างอิงทางยา?", หมวด: 2, required: false,
    fix: "เตรียมตำราอ้างอิงทางยา (แนะนำ)" },
  { id: "tempLog", question: "มีสมุด/ระบบบันทึกอุณหภูมิประจำวัน?", หมวด: 2, required: false,
    fix: "ทำสมุดบันทึกอุณหภูมิร้านและตู้เย็นประจำวัน (แนะนำ)" },
];

export interface ZoneDef { id: ZoneId; label: string; rule: string; }

export const ZONES: ZoneDef[] = [
  { id: "dispensing", label: "จุดส่งมอบยา / เคาน์เตอร์จ่ายยา", rule: "จุดที่เภสัชกรส่งมอบยาและให้คำแนะนำ" },
  { id: "counseling", label: "บริเวณให้คำปรึกษา", rule: "พื้นที่ปรึกษาที่เป็นส่วนตัวพอสมควร" },
  { id: "dangerous", label: "โซนยาอันตราย / ควบคุมพิเศษ", rule: "อยู่หลังเคาน์เตอร์ ผู้ซื้อหยิบเองไม่ได้" },
  { id: "otc", label: "โซนยาทั่วไป / OTC", rule: "วางหน้าร้าน ลูกค้าเลือกเองได้" },
  { id: "fridge", label: "ตู้เย็นเก็บยา", rule: "ตู้เย็นเฉพาะยา พร้อมเทอร์โมมิเตอร์" },
  { id: "storage", label: "คลัง / ที่เก็บสำรอง", rule: "เก็บยาสำรองแยกจากพื้นที่ขาย" },
  { id: "waiting", label: "บริเวณรอรับบริการ", rule: "ที่นั่ง/ยืนรอใกล้ทางเข้า" },
];
