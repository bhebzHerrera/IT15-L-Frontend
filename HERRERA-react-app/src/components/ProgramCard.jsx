import React from "react";

// Program summary card shown in the program list
export default function ProgramCard({ program, onSelect }) {
  return (
    <div
      className="stat-card"
      style={{
        cursor: "pointer",
        marginBottom: 12,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      onClick={() => onSelect(program)}
    >
      <div style={{ fontSize: 12, color: "var(--text2)" }}>{program.code}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{program.name}</div>
      <div style={{ fontSize: 12, color: "var(--text2)" }}>
        {program.type} • {program.durationYears} years • {program.totalUnits}{" "}
        units
      </div>
      <div style={{ marginTop: 4 }}>
        <span
          className="badge"
          style={{
            background:
              program.status === "Active"
                ? "rgba(16,185,129,0.1)"
                : program.status === "Phased Out"
                ? "rgba(239,68,68,0.1)"
                : "rgba(245,158,11,0.1)",
            color:
              program.status === "Active"
                ? "#10B981"
                : program.status === "Phased Out"
                ? "#EF4444"
                : "#F59E0B",
          }}
        >
          {program.status}
        </span>
      </div>
    </div>
  );
}

