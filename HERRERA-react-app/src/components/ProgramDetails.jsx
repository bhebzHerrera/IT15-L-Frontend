import React from "react";
import { subjects } from "../data/mockData";

// Shows full details for a selected program including year levels and subjects
export default function ProgramDetails({ program }) {
  if (!program) {
    // Friendly placeholder if nothing is selected
    return (
      <div className="chart-card">
        <div className="chart-title">Program details</div>
        <div className="chart-sub">
          Click a program on the left to see its full information.
        </div>
      </div>
    );
  }

  // Helper to look up subject titles from subject code
  const getSubjectTitle = (code) => {
    const sub = subjects.find((s) => s.code === code);
    return sub ? `${code} – ${sub.title}` : code;
  };

  return (
    <div className="chart-card">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-title">
          {program.code} – {program.name}
        </div>
        <div className="page-sub">
          {program.type} • {program.durationYears} years • {program.totalUnits}{" "}
          units
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 16 }}>
        {program.description}
      </p>

      <div style={{ marginBottom: 16 }}>
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
          Status: {program.status}
        </span>
      </div>

      <div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            marginTop: 8,
          }}
        >
          Year Level Structure
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {program.yearLevels.map((yl) => (
            <div
              key={yl.year}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                {yl.label}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: 12,
                  color: "var(--text2)",
                }}
              >
                {yl.subjects.map((code) => (
                  <li key={code} style={{ marginBottom: 4 }}>
                    {getSubjectTitle(code)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

