import { ZONES } from "@/lib/gpp";
import { autoLayout } from "@/lib/autoLayout";
import { ZONE_COLORS } from "@/lib/zoneStyle";
import LayoutSvg from "./LayoutSvg";

const REF_W = 3;
const REF_D = 4;

export default function ReferenceLayout() {
  const boxes = autoLayout(REF_W, REF_D, "bottom");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "var(--ink)",
          }}
        >
          ผังมาตรฐาน GPP อ้างอิง
        </h3>
        <span
          style={{
            fontSize: 12,
            color: "#6B7C84",
            fontWeight: 400,
          }}
        >
          {REF_W}×{REF_D} ม. ทางเข้าด้านหน้า
        </span>
      </div>

      <LayoutSvg boxes={boxes} widthM={REF_W} depthM={REF_D} />

      {/* Zone rule legend */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px 16px",
        }}
      >
        {ZONES.map(z => (
          <div
            key={z.id}
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                background: ZONE_COLORS[z.id],
                border: "1px solid #7A9BA4",
                flexShrink: 0,
                marginTop: 1,
              }}
            />
            <div>
              <span style={{ fontWeight: 600, color: "var(--ink)" }}>{z.label}</span>
              <br />
              <span style={{ color: "#6B7C84" }}>{z.rule}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
