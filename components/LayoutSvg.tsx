import { ZONES } from "@/lib/gpp";
import type { ZoneBox, ZoneId } from "@/lib/types";

const PX = 40;

const COLORS: Record<ZoneId, string> = {
  dispensing: "#BFE3E8",
  counseling: "#CDE7D5",
  dangerous:  "#F3D2CE",
  otc:        "#E7EDF0",
  fridge:     "#CFE0F2",
  storage:    "#EDE6D6",
  waiting:    "#E6E0EC",
};

// Short display labels for SVG boxes (full labels are in ZONES and used in <title>)
const SVG_LABEL: Record<ZoneId, string[]> = {
  dispensing: ["ส่งมอบยา"],
  counseling: ["ให้คำ", "ปรึกษา"],
  dangerous:  ["ยาอันตราย"],
  otc:        ["ยา OTC"],
  fridge:     ["ตู้เย็นยา"],
  storage:    ["คลัง"],
  waiting:    ["รอรับ", "บริการ"],
};

const labelOf = (id: ZoneId) => ZONES.find(z => z.id === id)!.label;

export default function LayoutSvg({
  boxes,
  widthM,
  depthM,
}: {
  boxes: ZoneBox[];
  widthM: number;
  depthM: number;
}) {
  const vw = widthM * PX;
  const vh = depthM * PX;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      width="100%"
      role="img"
      aria-label={`ผังพื้นที่ร้าน ${widthM}×${depthM} เมตร`}
      style={{
        maxWidth: 480,
        border: "1px solid #C8D8DE",
        background: "#fff",
        display: "block",
        borderRadius: 8,
      }}
    >
      {boxes.map(b => {
        const rx = b.x * PX;
        const ry = b.y * PX;
        const rw = b.w * PX;
        const rh = b.h * PX;
        const cx = rx + rw / 2;
        const cy = ry + rh / 2;
        const lines = SVG_LABEL[b.zone];
        const fontSize = rw < 55 ? 7.5 : 9;
        const lineH = fontSize + 2;
        const totalH = lines.length * lineH;
        const startY = cy - totalH / 2 + lineH / 2;

        return (
          <g key={b.zone}>
            <title>{labelOf(b.zone)}</title>
            <rect
              x={rx}
              y={ry}
              width={rw}
              height={rh}
              fill={COLORS[b.zone]}
              stroke="#7A9BA4"
              strokeWidth={0.75}
            />
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
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}
