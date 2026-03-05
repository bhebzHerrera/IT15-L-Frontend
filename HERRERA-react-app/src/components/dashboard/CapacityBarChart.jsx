import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CapacityBarChart({ data }) {
  return (
    <article className="chart-card glass-card">
      <div className="section-title-row">
        <h3>Course Capacity</h3>
        <p>Slot utilization per program</p>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="program" stroke="#d6d7f2" />
            <YAxis stroke="#d6d7f2" />
            <Tooltip
              contentStyle={{
                background: "rgba(13, 16, 45, 0.9)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <Legend />
            <Bar dataKey="capacity" fill="#74a7ff" radius={[8, 8, 0, 0]} />
            <Bar dataKey="enrolled" fill="#58f6c6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
