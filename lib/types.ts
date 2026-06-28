export type DoorSide = "top" | "bottom" | "left" | "right";
export type ZoneId =
  | "dispensing" | "counseling" | "dangerous" | "otc" | "fridge" | "storage" | "waiting";

export interface Answers {
  widthM: number;            // store width (meters)
  depthM: number;            // store depth (meters)
  doorSide: DoorSide;
  checklist: Record<string, boolean>; // ruleId -> true (มี/ทำแล้ว) | false
}

export interface ZoneBox { zone: ZoneId; x: number; y: number; w: number; h: number; } // meters
export interface Boundary { w: number; h: number; doorSide: DoorSide; } // meters

export type Status = "pass" | "fail" | "warn";
export interface GapItem { id: string; label: string; status: Status; หมวด: 1 | 2; fix: string; }

export type ViolationType = "missing" | "outside" | "overlap" | "tooSmall";
export interface Violation { type: ViolationType; detail: string; }
