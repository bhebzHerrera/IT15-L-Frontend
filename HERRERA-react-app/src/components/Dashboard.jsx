import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { programs, subjects } from "../data/mockData";

function SummaryCard({ label, value, note }) {
  return (
    <article className="stat-widget glass-card">
      <p>{label}</p>
      <h3>{value}</h3>
      {note ? <span className="trend-up">{note}</span> : null}
    </article>
  );
}

export default function Dashboard() {
  const totalPrograms = programs.length;
  const totalSubjects = subjects.length;
  const activePrograms = programs.filter((program) => program.status === "Active").length;
  const inactivePrograms = totalPrograms - activePrograms;
  const semesterSubjects = subjects.filter((subject) => subject.term === "Semester").length;
  const termSubjects = subjects.filter((subject) => subject.term === "Term").length;
  const bothSubjects = subjects.filter((subject) => subject.term === "Both").length;
  const subjectsWithPreReq = subjects.filter(
    (subject) => Array.isArray(subject.preRequisites) && subject.preRequisites.length > 0
  );

  const recentlyAddedPrograms = useMemo(
    () =>
      [...programs]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    []
  );

  const chartData = [
    { label: "Semester", subjects: semesterSubjects },
    { label: "Term", subjects: termSubjects },
    { label: "Both", subjects: bothSubjects },
  ];

  return (
    <section className="dashboard-grid">
      <div className="stats-grid">
        <SummaryCard label="Total Programs" value={totalPrograms} />
        <SummaryCard label="Total Subjects" value={totalSubjects} />
        <SummaryCard
          label="Active vs Inactive Programs"
          value={`${activePrograms} / ${inactivePrograms}`}
          note="Active / Inactive"
        />
        <SummaryCard
          label="Subjects With Pre-Requisites"
          value={subjectsWithPreReq.length}
          note="Subjects requiring prior courses"
        />
      </div>

      <div className="chart-grid">
        <article className="chart-card glass-card">
          <div className="section-title-row">
            <h3>Subjects Per Semester/Term</h3>
            <p>Semester, term, and both</p>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                <XAxis dataKey="label" stroke="#d6d7f2" />
                <YAxis stroke="#d6d7f2" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(13, 16, 45, 0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <Bar dataKey="subjects" fill="#58f6c6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="activity-card glass-card">
          <div className="section-title-row">
            <h3>Subjects With Pre-Requisites</h3>
            <p>Filtered from subject offerings</p>
          </div>
          <ul>
            {subjectsWithPreReq.map((subject) => (
              <li key={subject.code}>
                <span className="activity-dot" />
                <div>
                  <strong>
                    {subject.code} - {subject.title}
                  </strong>
                  <p>Pre-requisites: {subject.preRequisites.join(", ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="table-card glass-card">
        <div className="section-title-row">
          <h3>Recently Added Programs</h3>
          <p>Latest records from mock data</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Program Name</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Total Units</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentlyAddedPrograms.map((program) => (
                <tr key={program.id}>
                  <td>{program.code}</td>
                  <td>{program.name}</td>
                  <td>{program.type}</td>
                  <td>{program.durationYears} years</td>
                  <td>{program.totalUnits}</td>
                  <td>{program.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
