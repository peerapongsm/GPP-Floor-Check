"use client";
import { useState } from "react";
import { CHECKLIST_RULES, type ChecklistRule } from "@/lib/gpp";
import type { Answers, DoorSide } from "@/lib/types";

// ── Module-level constants ────────────────────────────────────────────────────
const RULES_CAT1 = CHECKLIST_RULES.filter(r => r.หมวด === 1);
const RULES_CAT2 = CHECKLIST_RULES.filter(r => r.หมวด === 2);

const DOOR_OPTIONS: { v: DoorSide; label: string }[] = [
  { v: "bottom", label: "ด้านหน้า (ล่าง)" },
  { v: "top",    label: "ด้านหลัง (บน)"   },
  { v: "left",   label: "ด้านซ้าย"         },
  { v: "right",  label: "ด้านขวา"          },
];

const STEP_LABELS = ["ขนาดร้าน", "ทางเข้า", "สถานที่", "อุปกรณ์"];
const STEP_COUNT = STEP_LABELS.length;

// ── StepBar ───────────────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  return (
    <div
      role="navigation"
      aria-label="ขั้นตอนการกรอกข้อมูล"
      style={{ display: "flex", alignItems: "flex-start", padding: "20px 20px 4px" }}
    >
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div
            key={n}
            style={{
              display: "flex",
              alignItems: "flex-start",
              flex: n < STEP_COUNT ? "1 1 0" : "0 0 auto",
            }}
          >
            {/* Step dot + label */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: done || active ? "var(--primary)" : "#D5E4EA",
                  color: done || active ? "#fff" : "#8AA4AE",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  outline: active ? "3px solid rgba(46,125,138,0.2)" : "none",
                  outlineOffset: 2,
                  transition: "background 0.25s, outline 0.25s",
                }}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : n}
              </div>
              <span
                style={{
                  fontSize: 10,
                  whiteSpace: "nowrap",
                  color: active ? "var(--primary)" : done ? "#5E7A84" : "#9AAFB5",
                  fontWeight: active ? 700 : 400,
                }}
              >
                {label}
              </span>
            </div>
            {/* Connector line */}
            {n < STEP_COUNT && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginTop: 15,
                  background: done ? "var(--primary)" : "#D5E4EA",
                  transition: "background 0.25s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── NumStepper — touch-friendly +/- input ─────────────────────────────────────
function NumStepper({
  label,
  value,
  onChange,
  min = 1,
  max = 30,
  step = 0.5,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const dec = () => onChange(+(Math.max(min, value - step)).toFixed(1));
  const inc = () => onChange(+(Math.min(max, value + step)).toFixed(1));
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 11,
          color: "#6B7C84",
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="secondary"
          onClick={dec}
          aria-label={`ลด${label}`}
          style={{ width: 48, height: 48, padding: 0, fontSize: 22, flexShrink: 0, lineHeight: 1 }}
        >
          −
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span
            style={{ fontSize: 32, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.02em" }}
          >
            {value}
          </span>
          <span style={{ fontSize: 15, color: "#6B7C84", marginLeft: 6 }}>ม.</span>
        </div>
        <button
          onClick={inc}
          aria-label={`เพิ่ม${label}`}
          style={{ width: 48, height: 48, padding: 0, fontSize: 22, flexShrink: 0, lineHeight: 1 }}
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── StoreSchematic — CSS store diagram with highlighted door wall ──────────────
function StoreSchematic({
  widthM,
  depthM,
  doorSide,
}: {
  widthM: number;
  depthM: number;
  doorSide: DoorSide;
}) {
  const maxD = Math.max(widthM, depthM, 1);
  const W = (widthM / maxD) * 110;
  const H = (depthM / maxD) * 110;
  const wall = (side: DoorSide) =>
    `3px solid ${doorSide === side ? "var(--primary)" : "#C5D4DA"}`;

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "16px 52px 28px" }}>
      <div style={{ position: "relative", width: W, height: H }}>
        {/* Store rectangle */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            background: "rgba(46,125,138,0.07)",
            borderRadius: 4,
            borderTop: wall("top"),
            borderBottom: wall("bottom"),
            borderLeft: wall("left"),
            borderRight: wall("right"),
            transition: "border-color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#8AA4AE" }}>
            {widthM}×{depthM} ม.
          </span>
        </div>
        {/* Door arrow markers */}
        {doorSide === "top" && (
          <span
            style={{
              position: "absolute",
              top: -22,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            ↑&nbsp;ประตู
          </span>
        )}
        {doorSide === "bottom" && (
          <span
            style={{
              position: "absolute",
              bottom: -22,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            ↓&nbsp;ประตู
          </span>
        )}
        {doorSide === "left" && (
          <span
            style={{
              position: "absolute",
              left: -46,
              top: "50%",
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            ←&nbsp;ประตู
          </span>
        )}
        {doorSide === "right" && (
          <span
            style={{
              position: "absolute",
              right: -46,
              top: "50%",
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            ประตู&nbsp;→
          </span>
        )}
      </div>
    </div>
  );
}

// ── Step 1: Store dimensions ──────────────────────────────────────────────────
function DimensionsStep({
  widthM,
  setWidth,
  depthM,
  setDepth,
}: {
  widthM: number;
  setWidth: (v: number) => void;
  depthM: number;
  setDepth: (v: number) => void;
}) {
  const area = (widthM * depthM).toFixed(1);
  const ok = widthM * depthM >= 8;
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--ink)" }}>ขนาดร้าน</h2>
      <p style={{ margin: "0 0 28px", fontSize: 13, color: "#6B7C84", lineHeight: 1.6 }}>
        กรอกขนาดพื้นที่ใช้สอย (ไม่รวมคลังหลัง)
      </p>
      <NumStepper label="ความกว้าง" value={widthM} onChange={setWidth} />
      <NumStepper label="ความลึก" value={depthM} onChange={setDepth} />
      <div
        style={{
          marginTop: 12,
          padding: "12px 16px",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 600,
          background: ok ? "#EDF7F2" : "#FDF0EF",
          color: ok ? "#1B7045" : "#B03028",
          border: `1px solid ${ok ? "#B5E0CB" : "#EFC5C2"}`,
        }}
      >
        พื้นที่รวม {area} ตร.ม. —{" "}
        {ok ? "✓ ผ่านเกณฑ์ขั้นต่ำ GPP" : "✕ ต่ำกว่าเกณฑ์ขั้นต่ำ 8 ตร.ม."}
      </div>
    </div>
  );
}

// ── Step 2: Door side ─────────────────────────────────────────────────────────
function DoorStep({
  doorSide,
  setDoor,
  widthM,
  depthM,
}: {
  doorSide: DoorSide;
  setDoor: (d: DoorSide) => void;
  widthM: number;
  depthM: number;
}) {
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--ink)" }}>
        ทางเข้า / ประตูร้าน
      </h2>
      <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B7C84", lineHeight: 1.6 }}>
        ทางเข้าหลักของร้านอยู่ด้านใด?
      </p>
      <StoreSchematic widthM={widthM} depthM={depthM} doorSide={doorSide} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {DOOR_OPTIONS.map(d => (
          <button
            key={d.v}
            className={doorSide === d.v ? "" : "secondary"}
            onClick={() => setDoor(d.v)}
            style={{ padding: "12px 8px", fontSize: 13 }}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Checklist card (single item) ──────────────────────────────────────────────
function CheckItem({
  rule,
  val,
  set,
}: {
  rule: ChecklistRule;
  val: boolean | undefined;
  set: (id: string, v: boolean) => void;
}) {
  return (
    <div
      style={{
        marginBottom: 12,
        borderRadius: 12,
        padding: "14px 14px",
        border: `1px solid ${val === true ? "#9FDBC0" : val === false ? "#F3BFBC" : "#DDE8EC"}`,
        background:
          val === true ? "#F0FAF5" : val === false ? "#FEF4F3" : "#FFFFFF",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      <p style={{ margin: "0 0 11px", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink)" }}>
        {rule.required && (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--fail)",
              verticalAlign: "middle",
              marginRight: 7,
              marginBottom: 2,
            }}
          />
        )}
        {rule.question}
        {!rule.required && (
          <span style={{ fontSize: 11, color: "var(--warn)", marginLeft: 6 }}>
            (แนะนำ)
          </span>
        )}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className={val === true ? "" : "secondary"}
          onClick={() => set(rule.id, true)}
          style={{
            flex: 1,
            padding: "10px 6px",
            fontSize: 12.5,
            ...(val === true
              ? { background: "var(--pass)", borderColor: "var(--pass)" }
              : {}),
          }}
        >
          ✓&nbsp;มี / ทำแล้ว
        </button>
        <button
          className={val === false ? "" : "secondary"}
          onClick={() => set(rule.id, false)}
          style={{
            flex: 1,
            padding: "10px 6px",
            fontSize: 12.5,
            ...(val === false
              ? { background: "var(--fail)", borderColor: "var(--fail)" }
              : {}),
          }}
        >
          ✕&nbsp;ยังไม่มี
        </button>
      </div>
    </div>
  );
}

// ── Steps 3 & 4: GPP checklist ────────────────────────────────────────────────
function ChecklistStep({
  title,
  rules,
  checklist,
  set,
}: {
  title: string;
  rules: ChecklistRule[];
  checklist: Record<string, boolean>;
  set: (id: string, v: boolean) => void;
}) {
  const answered = rules.filter(r => checklist[r.id] !== undefined).length;
  const pct = rules.length > 0 ? answered / rules.length : 0;
  return (
    <div>
      <h2 style={{ margin: "0 0 10px", fontSize: 17, color: "var(--ink)" }}>{title}</h2>
      {/* Progress bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div
          style={{
            flex: 1,
            height: 5,
            borderRadius: 3,
            background: "#DDE8EC",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct * 100}%`,
              height: "100%",
              borderRadius: 3,
              background: pct === 1 ? "var(--pass)" : "var(--primary)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: "#6B7C84", whiteSpace: "nowrap" }}>
          {answered}/{rules.length} ข้อ
        </span>
      </div>
      {rules.map(r => (
        <CheckItem key={r.id} rule={r} val={checklist[r.id]} set={set} />
      ))}
    </div>
  );
}

// ── Main Wizard export ────────────────────────────────────────────────────────
export default function Wizard({ onComplete, initial }: { onComplete: (a: Answers) => void; initial?: Answers }) {
  const [step, setStep] = useState(1);
  const [widthM, setWidth] = useState(initial?.widthM ?? 5);
  const [depthM, setDepth] = useState(initial?.depthM ?? 8);
  const [doorSide, setDoor] = useState<DoorSide>(initial?.doorSide ?? "bottom");
  const [checklist, setChecklist] = useState<Record<string, boolean>>(initial?.checklist ?? {});

  const setCheck = (id: string, v: boolean) =>
    setChecklist(c => ({ ...c, [id]: v }));

  const answered1 = RULES_CAT1.filter(r => checklist[r.id] !== undefined).length;
  const answered2 = RULES_CAT2.filter(r => checklist[r.id] !== undefined).length;
  const canFinish =
    answered1 === RULES_CAT1.length && answered2 === RULES_CAT2.length;
  const isLast = step === STEP_COUNT;

  return (
    <div>
      <StepBar step={step} />
      <div style={{ height: 1, background: "#E8EEF1" }} />

      {/* Step content */}
      <div style={{ padding: "24px 20px 20px" }}>
        {step === 1 && (
          <DimensionsStep
            widthM={widthM}
            setWidth={setWidth}
            depthM={depthM}
            setDepth={setDepth}
          />
        )}
        {step === 2 && (
          <DoorStep
            doorSide={doorSide}
            setDoor={setDoor}
            widthM={widthM}
            depthM={depthM}
          />
        )}
        {step === 3 && (
          <ChecklistStep
            title="หมวดที่ 1 — สถานที่และสภาพแวดล้อม"
            rules={RULES_CAT1}
            checklist={checklist}
            set={setCheck}
          />
        )}
        {step === 4 && (
          <ChecklistStep
            title="หมวดที่ 2 — อุปกรณ์และการจัดการยา"
            rules={RULES_CAT2}
            checklist={checklist}
            set={setCheck}
          />
        )}
      </div>

      {/* Navigation bar — sticky to bottom when content is long */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          gap: 10,
          padding: "14px 20px",
          background: "var(--bg)",
          borderTop: "1px solid #E8EEF1",
        }}
      >
        {step > 1 && (
          <button
            className="secondary"
            onClick={() => setStep(s => s - 1)}
            style={{ flexShrink: 0 }}
          >
            ← ย้อนกลับ
          </button>
        )}
        {isLast ? (
          <button
            onClick={() => onComplete({ widthM, depthM, doorSide, checklist })}
            disabled={!canFinish}
            style={{
              flex: 1,
              opacity: canFinish ? 1 : 0.45,
              cursor: canFinish ? "pointer" : "not-allowed",
            }}
          >
            {canFinish
              ? "ดูผลประเมิน →"
              : `ตอบยังไม่ครบ (${answered1 + answered2}/${RULES_CAT1.length + RULES_CAT2.length})`}
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 1 }}>
            ถัดไป →
          </button>
        )}
      </div>
    </div>
  );
}
