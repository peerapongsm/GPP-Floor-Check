import { gapReport } from "@/lib/gapReport";
import type { Answers, ZoneBox } from "@/lib/types";
import GapReportView from "./GapReportView";
import LayoutSvg from "./LayoutSvg";
import ReferenceLayout from "./ReferenceLayout";
import Disclaimer from "./Disclaimer";

const SECTION_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  padding: "20px 18px",
  marginBottom: 16,
  boxShadow: "0 1px 4px rgba(34,52,60,0.07)",
  border: "1px solid #E4EDF1",
};

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: "#E4EDF1",
  margin: "20px 0",
};

export default function ResultView({
  answers,
  layout,
  onEdit,
}: {
  answers: Answers;
  layout: ZoneBox[];
  onEdit: () => void;
}) {
  const items = gapReport(answers, layout);
  const area = (answers.widthM * answers.depthM).toFixed(1);

  return (
    <section>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7C84" }}>
          ร้านขนาด {answers.widthM}×{answers.depthM} ม. · พื้นที่ {area} ตร.ม. ·{" "}
          ทางเข้า
          {answers.doorSide === "bottom" && "ด้านหน้า"}
          {answers.doorSide === "top"    && "ด้านหลัง"}
          {answers.doorSide === "left"   && "ด้านซ้าย"}
          {answers.doorSide === "right"  && "ด้านขวา"}
        </p>
      </div>

      {/* Gap report section */}
      <div style={SECTION_STYLE}>
        <GapReportView items={items} />
      </div>

      {/* Suggested layout section */}
      <div style={SECTION_STYLE}>
        <div style={{ marginBottom: 12 }}>
          <h3
            style={{
              margin: "0 0 2px",
              fontSize: 16,
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            ผังที่แนะนำสำหรับร้านของคุณ
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: "#6B7C84" }}>
            {answers.widthM}×{answers.depthM} ม. ·{" "}
            สร้างจากมาตรฐาน GPP โดยอัตโนมัติ
          </p>
        </div>

        <LayoutSvg
          boxes={layout}
          widthM={answers.widthM}
          depthM={answers.depthM}
        />

        <p
          style={{
            margin: "10px 0 16px",
            fontSize: 12,
            color: "#6B7C84",
            lineHeight: 1.5,
          }}
        >
          ผังนี้เป็นคำแนะนำเบื้องต้น — ปรับตามหน้างานจริง (เสา ท่อ หน้าต่าง สิ่งติดตั้งเดิม)
        </p>

        <button onClick={onEdit}>ปรับผังเอง →</button>
      </div>

      {/* Reference layout section */}
      <div style={SECTION_STYLE}>
        <ReferenceLayout />
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </section>
  );
}
