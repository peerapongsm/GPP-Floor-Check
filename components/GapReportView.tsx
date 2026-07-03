import type { GapItem, Status } from "@/lib/types";

const TONE: Record<Status, string> = {
  pass: "var(--pass)",
  warn: "var(--warn)",
  fail: "var(--fail)",
};
const ICON: Record<Status, string> = { pass: "✓", warn: "!", fail: "✕" };
const BG: Record<Status, string>   = { pass: "#EFF8F3", warn: "#FDF6EB", fail: "#FEF4F3" };
const BORDER: Record<Status, string> = { pass: "#9FDBC0", warn: "#EDCB7E", fail: "#EDAAA8" };

const GROUP_LABEL: Record<Status, string> = {
  fail: "ต้องแก้ไข",
  warn: "ควรปรับปรุง",
  pass: "ผ่านเกณฑ์",
};

function StatCard({ count, status }: { count: number; status: Status }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "14px 10px",
        borderRadius: 12,
        background: BG[status],
        border: `1px solid ${BORDER[status]}`,
        textAlign: "center",
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: TONE[status],
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {count}
      </div>
      <div style={{ fontSize: 11, color: TONE[status], marginTop: 5, fontWeight: 600 }}>
        {GROUP_LABEL[status]}
      </div>
    </div>
  );
}

function ItemRow({ item }: { item: GapItem }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        borderLeft: `4px solid ${TONE[item.status]}`,
        padding: "9px 12px",
        margin: "5px 0",
        background: BG[item.status],
        borderRadius: "0 8px 8px 0",
      }}
    >
      <span
        style={{
          color: TONE[item.status],
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0,
          lineHeight: 1.5,
        }}
      >
        {ICON[item.status]}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--ink)", textWrap: "pretty" }}>{item.label}</div>
        {item.status !== "pass" && (
          <div
            style={{
              fontSize: 12,
              color: "#6B7C84",
              marginTop: 3,
              lineHeight: 1.4,
              textWrap: "pretty",
            }}
          >
            → {item.fix}
          </div>
        )}
      </div>
    </li>
  );
}

export default function GapReportView({ items }: { items: GapItem[] }) {
  const fails  = items.filter(i => i.status === "fail");
  const warns  = items.filter(i => i.status === "warn");
  const passes = items.filter(i => i.status === "pass");

  const allPass = fails.length === 0 && warns.length === 0;

  return (
    <div>
      <h2
        style={{
          margin: "0 0 4px",
          fontSize: 18,
          fontWeight: 700,
          color: "var(--ink)",
        }}
      >
        ผลประเมินความพร้อม GPP
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#6B7C84" }}>
        {allPass
          ? "ยินดีด้วย! ร้านของคุณผ่านทุกเกณฑ์"
          : "รายการที่ต้องดำเนินการก่อนยื่นขออนุญาต"}
      </p>

      {/* Scoreboard */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {fails.length > 0 && <StatCard count={fails.length} status="fail" />}
        {warns.length > 0 && <StatCard count={warns.length} status="warn" />}
        <StatCard count={passes.length} status="pass" />
      </div>

      {/* Grouped items */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {fails.length > 0 && (
          <>
            <li
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: TONE.fail,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 0 4px",
              }}
            >
              {GROUP_LABEL.fail} ({fails.length} ข้อ)
            </li>
            {fails.map(i => <ItemRow key={i.id} item={i} />)}
          </>
        )}
        {warns.length > 0 && (
          <>
            <li
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: TONE.warn,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 0 4px",
              }}
            >
              {GROUP_LABEL.warn} ({warns.length} ข้อ)
            </li>
            {warns.map(i => <ItemRow key={i.id} item={i} />)}
          </>
        )}
        {passes.length > 0 && (
          <>
            <li
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: TONE.pass,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "10px 0 4px",
              }}
            >
              {GROUP_LABEL.pass} ({passes.length} ข้อ)
            </li>
            {passes.map(i => <ItemRow key={i.id} item={i} />)}
          </>
        )}
      </ul>
    </div>
  );
}
