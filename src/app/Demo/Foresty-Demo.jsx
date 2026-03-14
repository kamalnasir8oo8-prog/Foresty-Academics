"use client";

import { useState, useEffect } from "react";

/* ─── STEP DATA ─── */
const STEPS = [
  {
    nav: "Attendance",
    label: "Step 01 · Attendance",
    title: "Fast Daily Marking",
    desc: "Mark a class in seconds and instantly see absentees.",
    action: <>You mark Class 10-A and save.</>,
    response: "Attendance saved. Absentees flagged.",
    tips: [{ icon: "📲", text: "Auto-alerts can notify parents." }],
    UI: AttendanceUI,
  },
  {
    nav: "Fees",
    label: "Step 02 · Fees",
    title: "Simple Fee Records",
    desc: "Record payments, generate receipts, and track balances.",
    action: <>You record a monthly fee payment for Class 11-A.</>,
    response: "Receipt generated and balance updated.",
    tips: [{ icon: "🧾", text: "Receipts are printable instantly." }],
    UI: FeesUI,
  },
  {
    nav: "Students",
    label: "Step 03 · Profiles",
    title: "Student Profiles",
    desc: "All student details and guardian contact in one screen.",
    action: <>You open Zara’s profile from the class list.</>,
    response: <>Profile loads with roll number and guardian info.</>,
    tips: [{ icon: "📎", text: "Documents stay attached to the student file." }],
    UI: StudentUI,
  },
  {
    nav: "Reports",
    label: "Step 04 · Reports",
    title: "Clear Exports",
    desc: "Attendance and fee reports ready for export.",
    action: <>You open the monthly report and tap Export PDF.</>,
    response: "Report exported with attendance and fees summary.",
    tips: [{ icon: "📤", text: "Share reports with management quickly." }],
    UI: ReportsUI,
  },
];

/* ─── SHARED PRIMITIVES ─── */
const Tag = ({ variant = "green", children }) => {
  const variants = {
    green: { background: "rgba(22,163,74,0.15)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.25)" },
    gold:  { background: "rgba(201,168,76,0.12)", color: "#D4B86A", border: "1px solid rgba(201,168,76,0.2)" },
    red:   { background: "rgba(239,68,68,0.10)",  color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" },
    blue:  { background: "rgba(59,130,246,0.10)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" },
    dim:   { background: "rgba(253,251,245,0.05)", color: "#7A7870", border: "1px solid rgba(253,251,245,0.1)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 6px", borderRadius: 4,
      ...variants[variant],
    }}>{children}</span>
  );
};

const GlassCard = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(13,36,16,0.45)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(22,163,74,0.18)",
    borderRadius: 14, padding: 18, position: "relative", overflow: "hidden",
    boxShadow: "0 0 0 1px rgba(22,163,74,0.05) inset, 0 16px 36px rgba(0,0,0,0.5), 0 0 60px rgba(22,163,74,0.04)",
    ...style,
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 1,
      background: "linear-gradient(90deg, transparent, rgba(22,163,74,0.4), rgba(201,168,76,0.2), transparent)",
    }} />
    {children}
  </div>
);

const CardHeader = ({ title, right }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 14, paddingBottom: 10,
    borderBottom: "1px solid rgba(22,163,74,0.1)",
  }}>
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C8C5BC" }}>{title}</span>
    {right}
  </div>
);

const StatusDot = () => (
  <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", boxShadow: "0 0 8px #16A34A", animation: "pulseDot 2.5s ease-in-out infinite" }} />
);

const StatBox = ({ number, label, color = "#FDFBF5" }) => (
  <div style={{ background: "rgba(253,251,245,0.02)", border: "1px solid rgba(22,163,74,0.1)", borderRadius: 9, padding: 10, textAlign: "center" }}>
    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.35rem", fontWeight: 500, color, lineHeight: 1 }}>{number}</div>
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A7870", marginTop: 3 }}>{label}</div>
  </div>
);

const ListRow = ({ left, right, style = {} }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "8px 10px", borderRadius: 7,
    background: "rgba(253,251,245,0.02)", border: "1px solid rgba(22,163,74,0.08)",
    marginBottom: 5, ...style,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{left}</div>
    {right}
  </div>
);

const Avatar = ({ initials, color = "#D4B86A" }) => (
  <div style={{
    width: 26, height: 26, borderRadius: 7,
    background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Cormorant Garamond',serif", fontSize: 12, fontWeight: 500, color,
  }}>{initials}</div>
);

const ProgressBar = ({ value, style = {} }) => (
  <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden", ...style }}>
    <div style={{ height: "100%", width: `${value}%`, borderRadius: 2, background: "linear-gradient(90deg, #16A34A, #C9A84C)" }} />
  </div>
);

const Btn = ({ children, variant = "primary", style = {}, onClick }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg,#16A34A,#15803D)", color: "#fff", boxShadow: "0 0 20px rgba(22,163,74,0.25)", border: "none" },
    ghost:   { background: "rgba(22,163,74,0.08)", color: "#C8C5BC", border: "1px solid rgba(22,163,74,0.2)" },
    gold:    { background: "linear-gradient(135deg,#C9A84C,#8B7234)", color: "#0A1A0C", fontWeight: 600, border: "none", boxShadow: "0 0 20px rgba(201,168,76,0.2)" },
  };
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      cursor: "pointer", borderRadius: 7, padding: "5px 10px",
      fontSize: "0.7rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 500,
      transition: "all 0.25s ease", ...variants[variant], ...style,
    }}>{children}</button>
  );
};

const InfoBlock = ({ type, label, text }) => {
  const isAction = type === "action";
  return (
    <div style={{
      background: isAction ? "rgba(22,163,74,0.06)" : "rgba(201,168,76,0.12)",
      border: isAction ? "1px solid rgba(22,163,74,0.18)" : "1px solid rgba(201,168,76,0.2)",
      borderLeft: isAction ? "3px solid #16A34A" : "3px solid #C9A84C",
      borderRadius: 7, padding: "12px 16px", marginBottom: 10,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: isAction ? "#16A34A" : "#C9A84C", marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: "0.82rem", color: "#C8C5BC", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
};

/* ─── STEP UIs ─── */
function DashboardUI() {
  return (
    <GlassCard>
      <CardHeader title="Foresty Institute of Sciences · Peshawar" right={<StatusDot />} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
        <StatBox number="847" label="Students" />
        <StatBox number={<>94.2<span style={{ fontSize: "0.92rem" }}>%</span></>} label="Attendance" />
        <StatBox number="PKR 2.4M" label="Fees This Month" color="#D4B86A" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#7A7870", marginBottom: 4 }}>
          <span>Fee Collection Progress · March 2025</span>
          <span style={{ color: "#D4B86A" }}>78%</span>
        </div>
        <ProgressBar value={78} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#7A7870", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Today's Activity</div>
      <ListRow
        left={<><span style={{ fontSize: 18 }}>📋</span><div><div style={{ fontSize: "0.82rem", color: "#FDFBF5" }}>Class 10-A attendance taken</div><div style={{ fontSize: "0.72rem", color: "#7A7870", marginTop: 1 }}>2 students absent · marked at 08:14 AM</div></div></>}
        right={<Tag variant="green">Done</Tag>}
      />
      <ListRow
        left={<><span style={{ fontSize: 18 }}>💳</span><div><div style={{ fontSize: "0.82rem", color: "#FDFBF5" }}>Fee received · Hamza Tariq</div><div style={{ fontSize: "0.72rem", color: "#7A7870", marginTop: 1 }}>PKR 8,500 · Q2 Instalment 1</div></div></>}
        right={<Tag variant="gold">Received</Tag>}
      />
      <ListRow
        left={<><span style={{ fontSize: 18 }}>⚠️</span><div><div style={{ fontSize: "0.82rem", color: "#FDFBF5" }}>3 fee reminders due today</div><div style={{ fontSize: "0.72rem", color: "#7A7870", marginTop: 1 }}>Class 9-B, 11-A, 12-C</div></div></>}
        right={<Tag variant="red">Pending</Tag>}
      />
    </GlassCard>
  );
}

function StudentUI() {
  return (
    <GlassCard>
      <CardHeader title="Student Profile" right={<Tag variant="green">Active</Tag>} />
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "linear-gradient(135deg,rgba(22,163,74,0.25),rgba(201,168,76,0.15))",
          border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", color: "#D4B86A",
        }}>ZI</div>
        <div>
          <div style={{ fontSize: "0.92rem", color: "#FDFBF5", fontWeight: 500 }}>Zara Imtiaz</div>
          <div style={{ fontSize: "0.7rem", color: "#7A7870", marginTop: 2 }}>Roll No · 2025-9B-041 · Class 9-B</div>
          <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
            <Tag variant="gold">Female</Tag>
            <Tag variant="dim">Morning Shift</Tag>
            <Tag variant="blue">Merit Seat</Tag>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { label: "Guardian", name: "Mr. Imtiaz Ahmed", sub: "+92 321 xxxxxxx" },
          { label: "Enrolment", name: "01 Mar 2025", sub: "Academic Year 2025–26" },
        ].map(({ label, name, sub }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(22,163,74,0.1)", borderRadius: 7, padding: 10 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#7A7870", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: "0.8rem", color: "#FDFBF5" }}>{name}</div>
            <div style={{ fontSize: "0.72rem", color: "#7A7870" }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#7A7870", textTransform: "uppercase", marginBottom: 8 }}>Attached Documents</div>
      {[
        { name: "CNIC Copy (Guardian)", tag: <Tag variant="green">Verified</Tag> },
        { name: "Class 8 Result Card",  tag: <Tag variant="green">Uploaded</Tag> },
      ].map(({ name, tag }) => (
        <ListRow key={name}
          style={{ marginBottom: 5 }}
          left={<><span>📄</span><div style={{ fontSize: "0.72rem", color: "#FDFBF5" }}>{name}</div></>}
          right={tag}
        />
      ))}
      <ListRow
        style={{ marginBottom: 14 }}
        left={<><span>📝</span><div><div style={{ fontSize: "0.72rem", color: "#FDFBF5" }}>Internal Note</div><div style={{ fontSize: "0.72rem", color: "#7A7870" }}>Fee concession — 15% — Board topper</div></div></>}
        right={<Tag variant="dim">Admin Only</Tag>}
      />
      <Btn variant="primary">+ Add Document</Btn>
    </GlassCard>
  );
}

function AttendanceUI() {
  const absent = [7, 19];
  const late = [24];
  return (
    <GlassCard>
      <CardHeader
        title="Class 10-A · Mon 17 Mar 2025"
        right={<Tag variant="gold">Marking</Tag>}
      />
      <div style={{ fontSize: "0.7rem", color: "#7A7870", marginTop: -14, marginBottom: 14 }}>32 Students · Period 1 · 08:00 AM</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
        <StatBox number="30" label="Present" color="#4ade80" />
        <StatBox number="2"  label="Absent"  color="#f87171" />
        <StatBox number="1"  label="Late"    color="#D4B86A" />
      </div>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 14 }}>
        {Array.from({ length: 32 }, (_, i) => {
          const n = i + 1;
          const isAbsent = absent.includes(n);
          const isLate   = late.includes(n);
          const bg   = isAbsent ? "rgba(239,68,68,0.15)" : isLate ? "rgba(201,168,76,0.12)" : "rgba(22,163,74,0.2)";
          const col  = isAbsent ? "#f87171" : isLate ? "#D4B86A" : "#16A34A";
          const brd  = isAbsent ? "1px solid rgba(239,68,68,0.25)" : isLate ? "1px solid rgba(201,168,76,0.25)" : "1px solid rgba(22,163,74,0.3)";
          const lbl  = isAbsent ? "AB" : isLate ? "LT" : "P";
          return (
            <div key={n} style={{
              width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, fontWeight: 500,
              background: bg, color: col, border: brd,
            }}>{lbl}</div>
          );
        })}
      </div>
      <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#f87171", textTransform: "uppercase", marginBottom: 5 }}>Absent Students — SMS Queued</div>
        <div style={{ fontSize: "0.72rem", color: "#C8C5BC", lineHeight: 1.8 }}>Ahmed Raza · Seat 07 · Guardian notified<br />Sara Malik · Seat 19 · Guardian notified</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="primary">Save Attendance</Btn>
        <Btn variant="ghost">Export PDF</Btn>
      </div>
    </GlassCard>
  );
}

function FeesUI() {
  return (
    <GlassCard>
      <CardHeader title="Fee Record · Hamza Tariq · 11-A" right={<Tag variant="green">Paid</Tag>} />
      <div style={{ background: "rgba(253,251,245,0.02)", border: "1px dashed rgba(201,168,76,0.25)", borderRadius: 10, padding: 16, marginBottom: 14 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.92rem", color: "#D4B86A" }}>Al-Noor Institute of Sciences</div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#7A7870", marginTop: 2, letterSpacing: "0.08em" }}>OFFICIAL FEE RECEIPT</div>
        </div>
        {[
          { k: "Receipt No.", v: "RC-2025-0471", mono: true },
          { k: "Date",        v: "17 Mar 2025" },
          { k: "Student",     v: "Hamza Tariq · Roll 2025-11A-018" },
          { k: "Fee Head",    v: "Q2 Instalment 1 of 2" },
          { k: "Mode",        v: "Cash" },
        ].map(({ k, v, mono }) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.72rem" }}>
            <span style={{ color: "#7A7870" }}>{k}</span>
            <span style={{ color: "#FDFBF5", fontWeight: 500, fontFamily: mono ? "'JetBrains Mono',monospace" : undefined }}>{v}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0 0", fontSize: "0.82rem" }}>
          <span style={{ color: "#D4B86A", fontWeight: 600 }}>Amount Received</span>
          <span style={{ color: "#D4B86A", fontWeight: 600 }}>PKR 12,000</span>
        </div>
      </div>
      <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 7, padding: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#D4B86A", textTransform: "uppercase", marginBottom: 5 }}>Instalment Plan</div>
        <div style={{ fontSize: "0.72rem", display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#4ade80" }}>✓ Instalment 1</span><span style={{ color: "#C8C5BC" }}>PKR 12,000 · Paid</span></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#7A7870" }}>○ Instalment 2</span><span style={{ color: "#D4B86A" }}>PKR 8,000 · Due 01 Apr</span></div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="primary">Print Receipt</Btn>
        <Btn variant="ghost">Send Reminder</Btn>
      </div>
    </GlassCard>
  );
}

function ReportsUI() {
  const attBars  = [72,78,84,68,88,92,85,90,94,82,96,88,74,92,95,90,86,94,88,96,90,93,88,95,92,94,96,90,94,96];
  const feeBars  = [95,88,72,100,65,84,90,78,55,92,88,70];
  const feeLabels = ["8-A","9-A","9-B","10-A","10-B","11-A","11-B","12-A","12-B","12-C","12-D","12-E"];
  return (
    <GlassCard>
      <CardHeader title="March 2025 · Summary Report" right={<div style={{ display: "flex", gap: 6 }}><Btn variant="ghost" style={{ fontSize: "0.72rem", padding: "5px 10px" }}>PDF</Btn><Btn variant="ghost" style={{ fontSize: "0.72rem", padding: "5px 10px" }}>Excel</Btn></div>} />
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#7A7870", textTransform: "uppercase" }}>Attendance Trend · Mar 2025</span>
          <Tag variant="green">93.8% avg</Tag>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
          {attBars.map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${h}%`, background: "linear-gradient(180deg,#16A34A,#276B2F)", opacity: 0.7 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, color: "#7A7870", marginTop: 3 }}>
          <span>Mar 1</span><span>Mar 15</span><span>Mar 31</span>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#7A7870", textTransform: "uppercase" }}>Fee Collection · By Class</span>
          <Tag variant="gold">78% overall</Tag>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 60 }}>
          {feeBars.map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${h}%`, background: "linear-gradient(180deg,#C9A84C,#8B7234)", opacity: h < 70 ? 0.45 : 0.75 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, color: "#7A7870", marginTop: 3 }}>
          {feeLabels.map(l => <span key={l}>{l}</span>)}
        </div>
      </div>
      <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 7, padding: 10, fontSize: "0.72rem", color: "#C8C5BC" }}>
        <strong style={{ color: "#FDFBF5" }}>Exported:</strong> March Attendance Report (PDF) · 847 KB · 17 Mar 2025, 10:22 AM
      </div>
    </GlassCard>
  );
}

function TimetableUI() {
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const slots = [
    { time: "P1 8:00", cells: [
      { label: "Maths",   sub: "11-A", type: "normal" },
      { label: "Urdu",    sub: "11-A", type: "normal" },
      { label: "Maths",   sub: "11-A", type: "normal" },
      { label: "Urdu",    sub: "11-A", type: "normal" },
      { label: "Maths",   sub: "11-A", type: "normal" },
    ]},
    { time: "P2 9:00", cells: [
      { label: "Physics", sub: "T. Tariq", type: "gold" },
      { label: "English", sub: "11-A",     type: "normal" },
      { label: "⚠ CLASH", sub: "T. Tariq · 12-C", type: "clash" },
      { label: "Chem",    sub: "11-A",     type: "normal" },
      { label: "Physics", sub: "T. Tariq", type: "gold" },
    ]},
    { time: "P3 10:00", cells: [
      { label: "Bio",     sub: "11-A", type: "normal" },
      { label: "Chem",    sub: "11-A", type: "normal" },
      { label: "English", sub: "11-A", type: "normal" },
      { label: "Maths",   sub: "11-A", type: "normal" },
      { label: "Bio",     sub: "11-A", type: "normal" },
    ]},
  ];
  const cellStyle = (type) => {
    if (type === "gold")   return { background: "rgba(201,168,76,0.1)",  border: "1px solid rgba(201,168,76,0.2)", color: "#D4B86A" };
    if (type === "clash")  return { background: "rgba(239,68,68,0.1)",  border: "1px solid rgba(239,68,68,0.3)",  color: "#f87171" };
    return                        { background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.2)",  color: "#C8C5BC" };
  };
  return (
    <GlassCard>
      <CardHeader title="Timetable · Week View · Mar 2025" right={<Tag variant="blue">Auto Clash-Check</Tag>} />
      <div style={{ display: "grid", gridTemplateColumns: "56px repeat(5,1fr)", gap: 3, marginBottom: 12 }}>
        <div />
        {days.map(d => <div key={d} style={{ textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#C8C5BC", padding: 4 }}>{d}</div>)}
        {slots.map(({ time, cells }) => (
          <div key={time} style={{ display: "contents" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7.5, color: "#7A7870", display: "flex", alignItems: "center" }}>{time}</div>
            {cells.map((c, ci) => (
              <div key={ci} style={{ padding: "6px 5px", borderRadius: 5, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 8, ...cellStyle(c.type) }}>
                {c.label}<br /><span style={{ fontSize: 7, opacity: 0.8 }}>{c.sub}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: 10, fontSize: "0.72rem", color: "#f87171" }}>
        <strong>⚠ Clash Detected:</strong> <span style={{ color: "#C8C5BC" }}>Sir Tariq Anwar is already assigned to Class 12-C on Wednesday · Period 2. Reassign one to proceed.</span>
      </div>
    </GlassCard>
  );
}

function AccessUI() {
  const staff = [
    { initials: "MA", name: "Muhammad Arif",  sub: "Institute Admin · Full Access",          tag: <Tag variant="gold">Admin</Tag>,           indicatorColor: "#C9A84C" },
    { initials: "NA", name: "Ms. Nadia Aziz", sub: "Class Teacher · 9-B · Updated just now", tag: <Tag variant="green">Class Teacher</Tag>,   indicatorColor: "#16A34A" },
    { initials: "HI", name: "Hamid Iqbal",    sub: "Subject Teacher · Class 10-A only",      tag: <Tag variant="green">Subject Teacher</Tag>, indicatorColor: "#16A34A" },
    { initials: "SB", name: "Sana Bashir",    sub: "Viewer — Read only · No billing",        tag: <Tag variant="blue">Viewer</Tag>,           indicatorColor: "#93c5fd" },
  ];
  return (
    <GlassCard>
      <CardHeader title="Staff · Access Control" right={<Tag variant="gold">Admin Panel</Tag>} />
      {staff.map(({ initials, name, sub, tag, indicatorColor }) => (
        <div key={name} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 10px", borderRadius: 7,
          background: "rgba(253,251,245,0.02)", border: "1px solid rgba(22,163,74,0.08)", marginBottom: 5,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: indicatorColor, boxShadow: `0 0 6px ${indicatorColor}` }} />
            <Avatar initials={initials} color={indicatorColor} />
            <div>
              <div style={{ fontSize: "0.82rem", color: "#FDFBF5" }}>{name}</div>
              <div style={{ fontSize: "0.72rem", color: "#7A7870", marginTop: 1 }}>{sub}</div>
            </div>
          </div>
          {tag}
        </div>
      ))}
      <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.15)", borderRadius: 7, padding: 10, marginTop: 12, fontSize: "0.72rem", color: "#C8C5BC" }}>
        <span style={{ color: "#16A34A" }}>✓ Role updated:</span> Ms. Nadia Aziz · Class Teacher (9-B) · by Admin · 17 Mar 2025, 10:34 AM
      </div>
    </GlassCard>
  );
}

function CTAUI() {
  const features = ["Student Management", "Attendance Tracking", "Fee & Billing", "Analytics Reports", "Timetable Builder", "Role-Based Access"];
  return (
    <GlassCard>
      <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🌿</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.1rem", fontWeight: 300, color: "#FDFBF5", marginBottom: 10, lineHeight: 1.2 }}>
          Start <em style={{ fontStyle: "italic", color: "#D4B86A" }}>free</em> today.<br />No credit card.
        </div>
        <div style={{ fontSize: "0.88rem", color: "#7A7870", marginBottom: 24, fontWeight: 300 }}>
          Everything you need to run your institute — students, fees, attendance, reports — in one calm, focused system.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {features.map(f => (
            <div key={f} style={{
              background: "rgba(13,36,16,0.45)", border: "1px solid rgba(22,163,74,0.18)",
              borderRadius: 7, padding: "7px 14px", fontSize: "0.72rem", color: "#C8C5BC",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ color: "#16A34A" }}>✦</span> {f}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <Btn variant="primary" style={{ padding: "12px 28px", fontSize: "0.92rem" }}>Start Free — No Card Needed</Btn>
          <Btn variant="gold"    style={{ padding: "12px 28px", fontSize: "0.92rem" }}>Request a Live Demo</Btn>
        </div>
        <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "#7A7870", letterSpacing: "0.05em" }}>
          Free · 100 students · 3 staff seats · All features · Cancel anytime
        </div>
      </div>
    </GlassCard>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function ForestryDemo() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const total = STEPS.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goTo(current + 1);
      if (e.key === "ArrowLeft")  goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const step = STEPS[current];
  const StepUI = step.UI;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.6; transform:scale(.8); }
        }
        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes badgePulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.6; transform:scale(.8); }
        }

        .foresty-root {
          background: #060F08;
          color: #FDFBF5;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(22,163,74,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22,163,74,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .bg-glow-1 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 600px; height: 600px; top: -200px; left: -200px;
          border-radius: 50%; filter: blur(120px);
          background: radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%);
        }
        .bg-glow-2 {
          position: fixed; pointer-events: none; z-index: 0;
          width: 500px; height: 500px; bottom: -150px; right: -150px;
          border-radius: 50%; filter: blur(120px);
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
        }
        .step-nav-pill {
          background: none; border: 1px solid rgba(22,163,74,0.2);
          border-radius: 6px; padding: 6px 14px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.08em;
          color: #7A7870; cursor: pointer;
          transition: all 0.25s ease; white-space: nowrap;
        }
        .step-nav-pill:hover { color: #C8C5BC; border-color: rgba(22,163,74,0.45); }
        .step-nav-pill.active {
          background: rgba(22,163,74,0.15);
          border-color: #16A34A; color: #FDFBF5;
          box-shadow: 0 0 16px rgba(22,163,74,0.2);
        }
        .panel-anim { animation: fadeSlide 0.45s cubic-bezier(0.22,1,0.36,1); }
        .panel-grid {
          display: grid; grid-template-columns: 280px 1fr;
          gap: 22px; align-items: start;
        }
        @media (max-width: 760px) {
          .panel-grid { grid-template-columns: 1fr; }
        }
        .nav-btn {
          background: rgba(13,36,16,0.45);
          border: 1px solid rgba(22,163,74,0.18);
          color: #C8C5BC; border-radius: 10px;
          padding: 8px 16px; font-size: 0.75rem;
          cursor: pointer; transition: all 0.25s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-btn:hover { border-color: #16A34A; color: #FDFBF5; }
        .nav-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; }
        .badge-dot {
          display: block; width: 6px; height: 6px; border-radius: 50%;
          background: #C9A84C; box-shadow: 0 0 8px #C9A84C;
          animation: badgePulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="foresty-root">
        <div className="bg-grid" />
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", padding: "48px 20px 64px" }}>

          {/* ── HEADER ── */}
          <header style={{ textAlign: "center", marginBottom: 54 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)",
              borderRadius: 40, padding: "5px 14px", marginBottom: 20,
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
              letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4B86A",
            }}>
              <span className="badge-dot" />
              Live Product Demo · Foresty Academics
            </div>
        
          </header>

          {/* ── PROGRESS TRACK ── */}
          <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 2, borderRadius: 1,
                background: i < current ? "#16A34A" : i === current ? "#C9A84C" : "rgba(22,163,74,0.15)",
                transition: "background 0.4s",
              }} />
            ))}
          </div>

          {/* ── STEP NAV ── */}
          <nav style={{ display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
            {STEPS.map((s, i) => (
              <button key={i} className={`step-nav-pill${i === current ? " active" : ""}`} onClick={() => goTo(i)}>
                {String(i + 1).padStart(2, "0")} · {s.nav}
              </button>
            ))}
          </nav>

          {/* ── PANEL ── */}
          <div key={animKey} className="panel-anim panel-grid" style={{ minHeight: 480 }}>
            {/* Script col */}
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.15em", color: "#C9A84C", textTransform: "uppercase", marginBottom: 10 }}>{step.label}</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.55rem", fontWeight: 400, lineHeight: 1.2, marginBottom: 14, color: "#FDFBF5" }}>{step.title}</h2>
              <p style={{ fontSize: "0.82rem", color: "#C8C5BC", lineHeight: 1.75, marginBottom: 18, fontWeight: 300 }}>{step.desc}</p>
              <InfoBlock type="action"   label="User Action"    text={step.action} />
              <InfoBlock type="response" label="System Response" text={step.response} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {step.tips.map((t, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    background: "rgba(253,251,245,0.03)", border: "1px solid rgba(253,251,245,0.08)",
                    borderRadius: 7, padding: "8px 10px",
                    fontSize: "0.72rem", color: "#7A7870", lineHeight: 1.55,
                  }}>
                    <span style={{ flexShrink: 0, marginTop: 1, fontSize: 13 }}>{t.icon}</span>
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* UI col */}
            <div><StepUI /></div>
          </div>

          {/* ── NAVIGATION ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 32 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="nav-btn" onClick={() => goTo(current - 1)} disabled={current === 0}>← Previous</button>
              <button className="nav-btn" onClick={() => goTo(current + 1)} disabled={current === total - 1}>Next →</button>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#7A7870", letterSpacing: "0.1em" }}>
              Step <span style={{ color: "#D4B86A" }}>{current + 1}</span> of <span style={{ color: "#D4B86A" }}>{total}</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}



