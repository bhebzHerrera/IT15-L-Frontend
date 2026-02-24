import React from "react";
import { programs, subjects } from "../data/mockData";

// Simple card used for high‑level summary values
function StatCard({ label, value, highlight }) {
  return (
    <div className="stat-card">
      <div className="stat-val">{value}</div>
      <div className="stat-lbl">{label}</div>
      {highlight && <div className="stat-change up">{highlight}</div>}
    </div>
  );
}

// Dashboard showing summarized information about programs and subjects
export default function Dashboard() {
  // Count programs and subjects from mock data
  const totalPrograms = programs.length;
  const totalSubjects = subjects.length;

  const activePrograms = programs.filter((p) => p.status === "Active").length;
  const inactivePrograms = programs.filter(
    (p) => p.status !== "Active"
  ).length;

  // Count subjects by term / semester indicator
  const perSemester = subjects.filter((s) => s.term === "Semester").length;
  const perTerm = subjects.filter((s) => s.term === "Term").length;
  const perBoth = subjects.filter((s) => s.term === "Both").length;

  // Subjects that have at least one prerequisite
  const withPrerequisites = subjects.filter(
    (s) => s.preRequisites && s.preRequisites.length > 0
  );

  // Recently added items (just using createdAt field from programs for demo)
  const recentPrograms = [...programs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Programs & Subjects Dashboard</div>
        <div className="page-sub">
          Quick overview of program offerings and subject loads.
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="stats-grid">
        <StatCard
          label="Total Programs"
          value={totalPrograms}
          highlight={`${activePrograms} active`}
        />
        <StatCard
          label="Total Subjects"
          value={totalSubjects}
          highlight={`${withPrerequisites.length} with prerequisites`}
        />
        <StatCard
          label="Active vs Inactive Programs"
          value={`${activePrograms} / ${inactivePrograms}`}
          highlight="Active / Inactive"
        />
        <StatCard
          label="Subjects per Semester / Term"
          value={`${perSemester} / ${perTerm}`}
          highlight={`${perBoth} offered in both`}
        />
      </div>

      {/* SUBJECTS BY TERM (SIMPLE BAR VIEW INSTEAD OF FULL CHART LIBRARY) */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Subjects by Offering Term</div>
          <div className="chart-sub">
            Simple bar visualization using counts from mock data.
          </div>
          <div className="bar-chart">
            {[
              { label: "Semester", value: perSemester, color: "#4F8EF7" },
              { label: "Term", value: perTerm, color: "#10B981" },
              { label: "Both", value: perBoth, color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} className="bar-col">
                <div className="bar-stack">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${item.value * 20}px`,
                      background: item.color,
                    }}
                  />
                </div>
                <div className="bar-lbl">
                  {item.label} ({item.value})
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Subjects with Pre‑requisites</div>
          <div className="chart-sub">
            Shows only subjects that require previous subjects.
          </div>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
            {withPrerequisites.map((s) => (
              <li
                key={s.code}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <strong>{s.code}</strong> – {s.title}
                <br />
                <span style={{ color: "var(--text2)" }}>
                  Pre‑requisites: {s.preRequisites.join(", ")}
                </span>
              </li>
            ))}
            {withPrerequisites.length === 0 && (
              <li style={{ fontSize: 13, color: "var(--text2)" }}>None</li>
            )}
          </ul>
        </div>
      </div>

      {/* RECENTLY ADDED PROGRAMS / SUBJECTS */}
      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-title">Recently Added Programs</div>
          <div className="chart-sub">
            Latest programs based on the mock createdAt field.
          </div>
          <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
            {recentPrograms.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {p.code} – {p.name}
                </div>
                <div style={{ color: "var(--text2)" }}>
                  {p.type} • {p.durationYears} years • {p.totalUnits} units
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: "var(--text3)",
                  }}
                >
                  Added: {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-card">
          <div className="chart-title">Summary Notes</div>
          <div className="chart-sub">
            Short textual insights to explain the numbers.
          </div>
          <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--text2)" }}>
            <li>
              Most programs are{" "}
              <span style={{ color: "var(--success)" }}>Active</span>, with a
              few under review or phased out.
            </li>
            <li>
              Subjects are spread across semester‑based, term‑based, and both
              schedules.
            </li>
            <li>
              Use the Program and Subject pages to see full details per record.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

