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
import { useState } from "react";
import WeatherWidget from "./dashboard/WeatherWidget";
import { createActivity } from "../services/enrollmentService";

const pieColors = ["#58f6c6", "#74a7ff", "#ffbb6f", "#ff8294"];
const chartTooltipStyle = {
  background: "rgba(7, 12, 36, 0.94)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "12px",
  boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
};

function SummaryCard({ label, value, note }) {
  return (
    <article className="stat-widget glass-card">
      <p>{label}</p>
      <h3>{value}</h3>
      {note ? <span className="trend-up">{note}</span> : null}
    </article>
  );
}

function ChartShell({ title, subtitle, children, className = "" }) {
  return (
    <article className={`chart-card glass-card ${className}`.trim()}>
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

export default function Dashboard({
  dashboardData,
  students = [],
  courses = [],
  isLoading,
  error,
  onActivityCreated,
}) {
  const [activityForm, setActivityForm] = useState({
    date: "",
    title: "",
    notes: "",
  });
  const [activityMessage, setActivityMessage] = useState("");
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  const totalPrograms = dashboardData.programDistribution.length;
  const totalSubjects =
    dashboardData.stats.find((item) => item.label === "Courses Offered")?.value ?? courses.length;
  const activePrograms = dashboardData.programDistribution.filter((item) => (item.value ?? 0) > 0).length;
  const inactivePrograms = totalPrograms - Math.min(totalPrograms, activePrograms);

  const studentsByYear = students.reduce(
    (acc, student) => {
      const year = Number(student.year) || 1;
      if (year === 1) acc.first += 1;
      if (year === 2) acc.second += 1;
      if (year === 3) acc.third += 1;
      if (year >= 4) acc.fourthPlus += 1;
      return acc;
    },
    { first: 0, second: 0, third: 0, fourthPlus: 0 }
  );

  const subjectTermData = [
    { label: "1st Year", subjects: studentsByYear.first },
    { label: "2nd Year", subjects: studentsByYear.second },
    { label: "3rd Year", subjects: studentsByYear.third },
    { label: "4th+", subjects: studentsByYear.fourthPlus },
  ];

  const highUtilizationCourses = courses
    .filter((course) => Number(course.slots) > 0)
    .map((course) => ({
      ...course,
      utilization: Math.round(((course.enrolled ?? 0) / course.slots) * 100),
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 6);

  const recentCourses = courses.slice(0, 4);

  const handleCreateActivity = async (event) => {
    event.preventDefault();
    setActivityMessage("");
    setIsCreatingActivity(true);

    try {
      await createActivity({
        date: activityForm.date,
        day_type: "event",
        event_name: activityForm.title,
        notes: activityForm.notes,
      });

      setActivityForm({ date: "", title: "", notes: "" });
      setActivityMessage("Activity created successfully.");
      if (onActivityCreated) {
        await onActivityCreated();
      }
    } catch (requestError) {
      const apiMessage = requestError?.response?.data?.message;
      setActivityMessage(apiMessage || "Unable to create activity.");
    } finally {
      setIsCreatingActivity(false);
    }
  };

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
        <SummaryCard label="Total Programs" value={totalPrograms} note="Live departments" />
        <SummaryCard label="Total Subjects" value={totalSubjects} note="Live course offerings" />
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
          subtitle="Enrollment growth by month"
          className="chart-card--legacy-size"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dashboardData.enrollmentTrend}>
              <defs>
                <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#58f6c6" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#2ba9d3" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="month" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Bar dataKey="enrollees" fill="url(#enrollmentGradient)" radius={[10, 10, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <ChartShell
          title="Student Distribution by Course"
          subtitle="Population share per program"
          className="chart-card--legacy-size"
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
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartShell>
      </div>

      <div className="chart-grid">
        <ChartShell
          title="Attendance Patterns"
          subtitle="Daily attendance trend with highlight curve"
          className="chart-card--hero chart-card--wide"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dashboardData.attendancePatterns}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#74a7ff" />
                  <stop offset="55%" stopColor="#58f6c6" />
                  <stop offset="100%" stopColor="#8ab4ff" />
                </linearGradient>
                <filter id="attendanceGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="2.8" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="day" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" domain={[75, 100]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance %"
                stroke="url(#attendanceGradient)"
                strokeWidth={4}
                filter="url(#attendanceGlow)"
                dot={{ fill: "#7db5ff", stroke: "#ffffff", strokeWidth: 1.4, r: 4.8 }}
                activeDot={{ r: 7, fill: "#58f6c6", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartShell>

        <article className="activity-card glass-card activity-card--wide">
          <div className="section-title-row">
            <h3>Recent Activity</h3>
            <p>Latest frontend activity stream</p>
          </div>
          <form className="create-activity-form" onSubmit={handleCreateActivity}>
            <div className="create-activity-row">
              <input
                className="create-activity-control"
                type="date"
                value={activityForm.date}
                onChange={(event) =>
                  setActivityForm((previous) => ({ ...previous, date: event.target.value }))
                }
                required
              />
              <input
                className="create-activity-control"
                type="text"
                value={activityForm.title}
                placeholder="Activity title"
                onChange={(event) =>
                  setActivityForm((previous) => ({ ...previous, title: event.target.value }))
                }
                required
              />
            </div>
            <div className="create-activity-row">
              <input
                className="create-activity-control"
                type="text"
                value={activityForm.notes}
                placeholder="Short description"
                onChange={(event) =>
                  setActivityForm((previous) => ({ ...previous, notes: event.target.value }))
                }
              />
              <button type="submit" className="ghost-btn create-activity-submit" disabled={isCreatingActivity}>
                {isCreatingActivity ? "Saving..." : "Create Activity"}
              </button>
            </div>
            {activityMessage ? <p className="weather-message">{activityMessage}</p> : null}
          </form>
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
          title="Students By Year Level"
          subtitle="Distribution by year cohort"
          className="chart-card--match-height"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectTermData}>
              <defs>
                <linearGradient id="yearGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffcf7f" />
                  <stop offset="100%" stopColor="#ff9f52" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
              <XAxis dataKey="label" stroke="#d6d7f2" />
              <YAxis stroke="#d6d7f2" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Bar dataKey="subjects" fill="url(#yearGradient)" radius={[10, 10, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </ChartShell>

        <article className="activity-card glass-card">
          <div className="section-title-row">
            <h3>High Utilization Courses</h3>
            <p>Live top courses by slot utilization</p>
          </div>
          <ul>
            {highUtilizationCourses.map((course) => (
              <li key={course.code}>
                <span className="activity-dot" />
                <div>
                  <strong>
                    {course.code} - {course.title}
                  </strong>
                  <p>
                    Enrolled {course.enrolled}/{course.slots} ({course.utilization}%)
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="chart-grid chart-grid--weather">
        <WeatherWidget />
        <article className="table-card glass-card table-card--weather-match">
          <div className="section-title-row">
            <h3>Course Offerings Snapshot</h3>
            <p>Latest records from backend data</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Slots</th>
                  <th>Enrolled</th>
                  <th>Utilization</th>
                </tr>
              </thead>
              <tbody>
                {recentCourses.map((course) => (
                    <tr key={course.code}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.slots}</td>
                      <td>{course.enrolled}</td>
                      <td>{Math.round(((course.enrolled ?? 0) / Math.max(course.slots ?? 1, 1)) * 100)}%</td>
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
