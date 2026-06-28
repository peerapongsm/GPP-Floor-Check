"use client";
import { useState, useEffect } from "react";
import Disclaimer from "@/components/Disclaimer";
import Wizard from "@/components/Wizard";
import ResultView from "@/components/ResultView";
import FloorEditor from "@/components/FloorEditor";
import { autoLayout } from "@/lib/autoLayout";
import { save, load } from "@/lib/storage";
import type { Answers, ZoneBox } from "@/lib/types";

type View = "landing" | "wizard" | "result" | "editor";

export default function Home() {
  const [view, setView] = useState<View>("landing");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [layout, setLayout] = useState<ZoneBox[]>([]);
  const [wizardSeed, setWizardSeed] = useState<Answers | undefined>(undefined);

  // Restore saved state on mount
  useEffect(() => {
    const s = load();
    if (s) {
      setAnswers(s.answers);
      setLayout(s.layout);
    }
  }, []);

  // Autosave whenever answers or layout change
  useEffect(() => {
    if (answers) save({ answers, layout });
  }, [answers, layout]);

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: view === "wizard" ? 0 : 20,
      }}
    >
      {view === "landing" && (
        <section>
          <h1>วางผังร้านยาให้ผ่าน GPP</h1>
          <p>
            ตอบคำถามไม่กี่ข้อ แล้วรับรายงานความพร้อม + ผังโซนที่แนะนำสำหรับร้านของคุณ
          </p>
          {answers ? (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => setView("result")}>ดูผลล่าสุด</button>
              <button className="secondary" onClick={() => { setWizardSeed(undefined); setView("wizard"); }}>ประเมินใหม่</button>
            </div>
          ) : (
            <button onClick={() => { setWizardSeed(undefined); setView("wizard"); }}>เริ่มประเมิน</button>
          )}
          <Disclaimer />
        </section>
      )}
      {view === "wizard" && (
        <Wizard
          initial={wizardSeed}
          onComplete={a => {
            setAnswers(a);
            setLayout(autoLayout(a.widthM, a.depthM, a.doorSide));
            setView("result");
          }}
        />
      )}
      {view === "result" && answers && (
        <>
          <ResultView answers={answers} layout={layout} onEdit={() => setView("editor")} />
          <button className="secondary" onClick={() => { setWizardSeed(answers); setView("wizard"); }}>แก้คำตอบ</button>
        </>
      )}
      {view === "editor" && answers && (
        <FloorEditor
          answers={answers}
          layout={layout}
          onChange={setLayout}
          onBack={() => setView("result")}
        />
      )}
    </main>
  );
}
