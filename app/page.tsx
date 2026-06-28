"use client";
import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";

type View = "landing" | "wizard" | "result" | "editor";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 20 }}>
      {view === "landing" && (
        <section>
          <h1>วางผังร้านยาให้ผ่าน GPP</h1>
          <p>ตอบคำถามไม่กี่ข้อ แล้วรับรายงานความพร้อม + ผังโซนที่แนะนำสำหรับร้านของคุณ</p>
          <button onClick={() => setView("wizard")}>เริ่มประเมิน</button>
          <Disclaimer />
        </section>
      )}
      {view !== "landing" && <p>{view} (อยู่ระหว่างพัฒนา)</p>}
    </main>
  );
}
