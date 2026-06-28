"use client";
import { useRef, useState } from "react";
import { ZONES } from "@/lib/gpp";
import { ZONE_COLORS, ZONE_SHORT_LABEL } from "@/lib/zoneStyle";
import { checkLayout } from "@/lib/checkLayout";
import type { Answers, Boundary, ZoneBox, ZoneId } from "@/lib/types";

// 40 SVG units per meter — same as LayoutSvg.tsx
const PX = 40;

// ─── Drag state (lives in a ref to avoid re-render on every move) ──────────────
interface DragState {
  zone: ZoneId;
  mode: "move" | "resize";
  /** For "move": meter-offset of pointer from box's top-left corner */
  dx: number;
  dy: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function FloorEditor({
  answers,
  layout,
  onChange,
  onBack,
}: {
  answers: Answers;
  layout: ZoneBox[];
  onChange: (b: ZoneBox[]) => void;
  onBack: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<DragState | null>(null);
  const [boxes, setBoxes] = useState<ZoneBox[]>(layout);

  const boundary: Boundary = {
    w: answers.widthM,
    h: answers.depthM,
    doorSide: answers.doorSide,
  };

  // ── Coordinate helpers ──────────────────────────────────────────────────────
  /**
   * Convert a PointerEvent's client coordinates to store-meters.
   *
   * The SVG has viewBox="0 0 {widthM*PX} {depthM*PX}" and is rendered at an
   * arbitrary CSS size.  getBoundingClientRect() gives the rendered pixel size,
   * so the scale from CSS-px to viewBox-px is (viewBox_dim / rendered_dim).
   * Dividing by PX converts viewBox-px to meters.
   *
   *   mx = (clientX - rect.left) * (widthM * PX / rect.width) / PX
   *      = (clientX - rect.left) * widthM / rect.width          ← meters
   */
  const toMeters = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      mx: ((e.clientX - r.left) * answers.widthM) / r.width,
      my: ((e.clientY - r.top) * answers.depthM) / r.height,
    };
  };

  // ── State helpers ───────────────────────────────────────────────────────────
  const commit = (next: ZoneBox[]) => {
    setBoxes(next);
    onChange(next);
  };

  // ── Pointer handlers ────────────────────────────────────────────────────────
  const startMove = (e: React.PointerEvent, b: ZoneBox) => {
    e.stopPropagation();
    const { mx, my } = toMeters(e);
    // dx/dy = offset of the pointer from the box's top-left, in meters.
    // Stored so that on every subsequent pointermove we can recover:
    //   newX = mx_current - dx
    drag.current = {
      zone: b.zone,
      mode: "move",
      dx: mx - b.x,
      dy: my - b.y,
    };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const startResize = (e: React.PointerEvent, b: ZoneBox) => {
    // Must stop propagation so the parent rect's startMove doesn't also fire.
    e.stopPropagation();
    drag.current = { zone: b.zone, mode: "resize", dx: 0, dy: 0 };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { mx, my } = toMeters(e);
    const d = drag.current;

    commit(
      boxes.map((b) => {
        if (b.zone !== d.zone) return b;

        if (d.mode === "move") {
          // New top-left = pointer_pos - offset_from_top_left
          // Clamped so box stays inside the boundary on all four sides.
          const newX = Math.max(0, Math.min(mx - d.dx, boundary.w - b.w));
          const newY = Math.max(0, Math.min(my - d.dy, boundary.h - b.h));
          return { ...b, x: newX, y: newY };
        }

        // resize: the pointer represents the bottom-right corner of the box.
        // Clamp minimum size to 0.5 m; clamp maximum so box stays inside boundary.
        const newW = Math.max(0.5, Math.min(mx - b.x, boundary.w - b.x));
        const newH = Math.max(0.5, Math.min(my - b.y, boundary.h - b.y));
        return { ...b, w: newW, h: newH };
      })
    );
  };

  const onPointerUp = () => {
    drag.current = null;
  };

  // ── Missing-zone helpers ────────────────────────────────────────────────────
  const present = new Set(boxes.map((b) => b.zone));
  const missing = ZONES.filter((z) => !present.has(z.id));

  const addZone = (id: ZoneId) => {
    commit([...boxes, { zone: id, x: 0, y: 0, w: 1.5, h: 1 }]);
  };

  // ── Live violation check ────────────────────────────────────────────────────
  const violations = checkLayout(boxes, boundary);

  // ── Door indicator helper ───────────────────────────────────────────────────
  // Renders a coloured strip on the boundary edge where the door is, so the
  // user can orient themselves while editing.
  const vw = answers.widthM * PX;
  const vh = answers.depthM * PX;
  const DOOR_W = Math.min(vw * 0.25, 40); // door width in SVG units
  const DOOR_T = 4; // door strip thickness in SVG units
  const doorRect = (() => {
    switch (answers.doorSide) {
      case "top":
        return { x: vw / 2 - DOOR_W / 2, y: 0, w: DOOR_W, h: DOOR_T };
      case "bottom":
        return { x: vw / 2 - DOOR_W / 2, y: vh - DOOR_T, w: DOOR_W, h: DOOR_T };
      case "left":
        return { x: 0, y: vh / 2 - DOOR_W / 2, w: DOOR_T, h: DOOR_W };
      case "right":
        return { x: vw - DOOR_T, y: vh / 2 - DOOR_W / 2, w: DOOR_T, h: DOOR_W };
    }
  })();

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <section style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={onBack}
          className="secondary"
          style={{ flexShrink: 0, fontSize: 13, padding: "7px 14px" }}
        >
          ← กลับ
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>
            แก้ไขผังร้านยา
          </h2>
          <p style={{ margin: 0, fontSize: 12, color: "#6B7C84" }}>
            ลากย้ายโซน · ลากมุม ▪ เพื่อปรับขนาด
          </p>
        </div>
      </div>

      {/* ── Canvas card ────────────────────────────────────── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: "14px 14px 12px",
          border: "1px solid #E4EDF1",
          boxShadow: "0 1px 4px rgba(34,52,60,0.07)",
          marginBottom: 14,
        }}
      >
        {/* Dimension badge */}
        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6B7C84" }}>
          {answers.widthM} × {answers.depthM} ม. ·{" "}
          ทางเข้า
          {answers.doorSide === "bottom" && "ด้านหน้า"}
          {answers.doorSide === "top" && "ด้านหลัง"}
          {answers.doorSide === "left" && "ด้านซ้าย"}
          {answers.doorSide === "right" && "ด้านขวา"}
        </p>

        {/* SVG canvas */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vw} ${vh}`}
          width="100%"
          style={{
            maxWidth: 480,
            border: "2px solid #C8D8DE",
            background: "#FAFCFD",
            display: "block",
            borderRadius: 8,
            // CRITICAL for touch: prevents the page from scrolling while dragging
            touchAction: "none",
            cursor: "default",
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          // Also release on pointer-leave so drag doesn't get stuck when cursor
          // leaves the SVG without a pointerup (e.g. drag off-screen)
          onPointerLeave={onPointerUp}
        >
          {/* Subtle dot-grid background for spatial reference */}
          <defs>
            <pattern id="ed-grid" x="0" y="0" width={PX} height={PX} patternUnits="userSpaceOnUse">
              <circle cx={PX / 2} cy={PX / 2} r={0.9} fill="#C8D8DE" />
            </pattern>
          </defs>
          <rect x={0} y={0} width={vw} height={vh} fill="url(#ed-grid)" />

          {/* Outer boundary stroke */}
          <rect
            x={0}
            y={0}
            width={vw}
            height={vh}
            fill="none"
            stroke="#7A9BA4"
            strokeWidth={1.5}
          />

          {/* Door indicator strip */}
          <rect
            x={doorRect.x}
            y={doorRect.y}
            width={doorRect.w}
            height={doorRect.h}
            fill="#2E7D8A"
            rx={2}
          />
          {/* "ทางเข้า" label near door */}
          {answers.doorSide === "bottom" && (
            <text
              x={vw / 2}
              y={vh - DOOR_T - 3}
              fontSize={6}
              textAnchor="middle"
              dominantBaseline="auto"
              fill="#2E7D8A"
              fontFamily="system-ui, sans-serif"
            >
              ทางเข้า
            </text>
          )}
          {answers.doorSide === "top" && (
            <text
              x={vw / 2}
              y={DOOR_T + 8}
              fontSize={6}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#2E7D8A"
              fontFamily="system-ui, sans-serif"
            >
              ทางเข้า
            </text>
          )}
          {answers.doorSide === "left" && (
            <text
              x={DOOR_T + 4}
              y={vh / 2}
              fontSize={6}
              textAnchor="start"
              dominantBaseline="middle"
              fill="#2E7D8A"
              fontFamily="system-ui, sans-serif"
            >
              ทางเข้า
            </text>
          )}
          {answers.doorSide === "right" && (
            <text
              x={vw - DOOR_T - 4}
              y={vh / 2}
              fontSize={6}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#2E7D8A"
              fontFamily="system-ui, sans-serif"
            >
              ทางเข้า
            </text>
          )}

          {/* Zone boxes */}
          {boxes.map((b) => {
            const rx = b.x * PX;
            const ry = b.y * PX;
            const rw = b.w * PX;
            const rh = b.h * PX;
            const cx = rx + rw / 2;
            const cy = ry + rh / 2;
            const lines = ZONE_SHORT_LABEL[b.zone];
            const fontSize = rw < 55 ? 7.5 : 9;
            const lineH = fontSize + 2;
            const totalH = lines.length * lineH;
            const startY = cy - totalH / 2 + lineH / 2;

            return (
              <g key={b.zone}>
                {/* Zone body — drag to move */}
                <rect
                  x={rx}
                  y={ry}
                  width={rw}
                  height={rh}
                  fill={ZONE_COLORS[b.zone]}
                  stroke="#7A9BA4"
                  strokeWidth={1}
                  rx={3}
                  style={{ cursor: "grab" }}
                  onPointerDown={(e) => startMove(e, b)}
                />

                {/* Zone label — pointer-events:none so they don't interfere */}
                {lines.map((line, i) => (
                  <text
                    key={i}
                    x={cx}
                    y={startY + i * lineH}
                    fontSize={fontSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#22343C"
                    fontFamily="system-ui, sans-serif"
                    fontWeight={600}
                    pointerEvents="none"
                  >
                    {line}
                  </text>
                ))}

                {/* Resize handle — bottom-right corner triangle */}
                {/* We use a small rect as the hit-target + a visible triangle polygon */}
                <rect
                  x={rx + rw - 12}
                  y={ry + rh - 12}
                  width={12}
                  height={12}
                  fill="transparent"
                  style={{ cursor: "nwse-resize" }}
                  onPointerDown={(e) => startResize(e, b)}
                />
                <polygon
                  points={`${rx + rw},${ry + rh - 10} ${rx + rw},${ry + rh} ${rx + rw - 10},${ry + rh}`}
                  fill="#2E7D8A"
                  opacity={0.7}
                  pointerEvents="none"
                />
              </g>
            );
          })}
        </svg>

        {/* Legend chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {ZONES.map((z) => (
            <div
              key={z.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 10,
                color: "#22343C",
                opacity: present.has(z.id) ? 1 : 0.35,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: ZONE_COLORS[z.id],
                  border: "1px solid #7A9BA4",
                  flexShrink: 0,
                }}
              />
              {ZONE_SHORT_LABEL[z.id][0]}
            </div>
          ))}
        </div>
      </div>

      {/* ── Missing zones ──────────────────────────────────── */}
      {missing.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: "14px 16px",
            border: "1px solid #E4EDF1",
            boxShadow: "0 1px 4px rgba(34,52,60,0.07)",
            marginBottom: 14,
          }}
        >
          <p
            style={{
              margin: "0 0 10px",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            เพิ่มโซนที่ขาด
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {missing.map((z) => (
              <button
                key={z.id}
                className="secondary"
                style={{ fontSize: 12, padding: "6px 12px" }}
                onClick={() => addZone(z.id)}
              >
                + {ZONE_SHORT_LABEL[z.id][0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Live violation check ───────────────────────────── */}
      <div
        style={{
          background: violations.length === 0 ? "#EFF8F3" : "#FEF4F3",
          borderRadius: 14,
          padding: "14px 16px",
          border: `1px solid ${violations.length === 0 ? "#9FDBC0" : "#EDAAA8"}`,
          boxShadow: "0 1px 4px rgba(34,52,60,0.07)",
          marginBottom: 14,
        }}
      >
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 13,
            fontWeight: 600,
            color: violations.length === 0 ? "var(--pass)" : "var(--fail)",
          }}
        >
          {violations.length === 0
            ? "✓ ผังผ่านเกณฑ์พื้นฐาน"
            : `✕ พบปัญหา ${violations.length} รายการ`}
        </p>
        {violations.length === 0 ? (
          <p style={{ margin: 0, fontSize: 12, color: "#2E9E6B" }}>
            ครบโซน · อยู่ในกรอบ · ไม่ทับกัน
          </p>
        ) : (
          <ul style={{ margin: 0, padding: "0 0 0 16px" }}>
            {violations.map((v, i) => (
              <li key={i} style={{ fontSize: 12, color: "var(--fail)", lineHeight: 1.6 }}>
                {v.detail}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
