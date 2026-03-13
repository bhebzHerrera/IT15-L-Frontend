import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import WeatherWidget from "./dashboard/WeatherWidget";
import { programs, subjects } from "../data/mockData";

const pieColors = ["#58f6c6", "#74a7ff", "#ffbb6f", "#ff8294"];

function SummaryCard({ label, value, note }) {
  return (
    <article className="stat-widget glass-card">
      <p>{label}</p>
      <h3>{value}</h3>
      {note ? <span className="trend-up">{note}</span> : null}
    </article>
  );
}

function ChartShell({ title, subtitle, children }) {
  return (
    <article className="chart-card glass-card">
      <div className="section-title-row">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="chart-wrap">{children}</div>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <section className="dashboard-grid">
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="stat-widget glass-card skeleton-card placeholder-glow">
            <span className="placeholder col-6 skeleton-line" />
            <span className="placeholder col-4 skeleton-number" />
            <span className="placeholder col-7 skeleton-line" />
          </article>
        ))}
      </div>

      <div className="chart-grid">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={index} className="chart-card glass-card placeholder-glow">
            <span className="placeholder col-5 skeleton-line" />
            <span className="placeholder col-4 skeleton-line short" />
            <div className="skeleton-chart-block">
              <span className="placeholder col-12 h-100" />
            </div>
          </article>
        ))}
      </div>

      <div className="chart-grid">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={index} className="chart-card glass-card placeholder-glow">
            <span className="placeholder col-4 skeleton-line" />
            <span className="placeholder col-3 skeleton-line short" />
            <div className="skeleton-list-block">
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <span key={rowIndex} className="placeholder col-12 skeleton-row" />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard({ dashboardData, isLoading, error }) {
  const totalPrograms = programs.length;
  const totalSubjects = subjects.length;
  const activePrograms = programs.filter((program) => program.status === "Active").length;
  const inactivePrograms = totalPrograms - activePrograms;
  const semesterSubjects = subjects.filter((subject) => subject.term === "Semester").length;
  const termSubjects = subjects.filter((subject) => subject.term === "Term").length;
  const bothSubjects = subjects.filter((subject) => subject.term === "Both").length;
  const subjectsWithPreReq = subjects.filter((subject) => subject.preRequisites.length > 0);
  const subjectTermData = [
    { label: "Semester", subjects: semesterSubjects },
    { label: "Term", subjects: termSubjects },
    { label: "Both", subjects: bothSubjects },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <section className="dashboard-grid">
        <article className="dashboard-feedback glass-card">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
        </article>
      </section>
    );
  }

  return (
    <section className="dashboard-grid">
      <div className="stats-grid">
        <SummaryCard label="Total Programs" value={totalPrograms} note="Program offerings module" />
        <SummaryCard label="Total Subjects" value={totalSubjects} note="Subject offerings module" />
        <SummaryCard
          label="Active vs Inactive Programs"
          value={`${activePrograms} / ${inactivePrograms}`}
          note="Active / Inactive"
        />
        {dashboardData.stats.slice(0, 1).map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} note={item.trend} />
        ))}
      </div>

      <div className="chart-grid">
        <ChartShell
          title="Monthly Enrollment Trends"
          subtitle="Bar chart of enrolled students per month"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardData.enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="month" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" />
              <Tooltip
                contentStyle={{
                  background: "rgba(13, 16, 45, 0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <Legend />
              <Bar dataKey="enrollees" fill="#58f6c6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title="Student Distribution by Course"
          subtitle="Pie chart across course groups"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={dashboardData.programDistribution}
                dataKey="value"
                nameKey="name"
                outerRadius={92}
                innerRadius={54}
                paddingAngle={4}
              >
                {dashboardData.programDistribution.map((item, index) => (
                  <Cell key={item.name} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(13, 16, 45, 0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>

      <div className="chart-grid">
        <ChartShell
          title="Attendance Patterns"
          subtitle="Line chart across school days"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dashboardData.attendancePatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="day" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13, 16, 45, 0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#74a7ff"
                strokeWidth={3}
                dot={{ fill: "#74a7ff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>

        <article className="activity-card glass-card">
          <div className="section-title-row">
            <h3>Recent Activity</h3>
            <p>Latest frontend activity stream</p>
          </div>
          <ul>
            {dashboardData.activities.map((item) => (
              <li key={item.id}>
                <span className="activity-dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <time>{item.time}</time>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="chart-grid">
        <ChartShell
          title="Subjects Per Semester/Term"
          subtitle="Semester, term, and both offerings"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectTermData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="label" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" />
              <Tooltip
                contentStyle={{
                  background: "rgba(13, 16, 45, 0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
              <Legend />
              <Bar dataKey="subjects" fill="#ffbb6f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <article className="activity-card glass-card">
          <div className="section-title-row">
            <h3>Subjects With Pre-Requisites</h3>
            <p>Current subjects that require prior courses</p>
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

      <div className="chart-grid">
        <WeatherWidget />
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
                {programs
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 4)
                  .map((program) => (
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
      </div>
    </section>
  );
}
