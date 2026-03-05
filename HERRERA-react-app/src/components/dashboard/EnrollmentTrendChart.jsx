import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function EnrollmentTrendChart({ data }) {
  return (
    <article className="chart-card glass-card">
      <div className="section-title-row">
        <h3>Enrollment Trend</h3>
        <p>Monthly confirmed enrollees</p>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#58f6c6" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#58f6c6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="month" stroke="#d6d7f2" />
            <YAxis stroke="#d6d7f2" />
            <Tooltip
              contentStyle={{
                background: "rgba(13, 16, 45, 0.9)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <Area
              type="monotone"
              dataKey="enrollees"
              stroke="#58f6c6"
              fill="url(#enrollmentGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
