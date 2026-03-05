import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#58f6c6", "#74a7ff", "#ffbb6f", "#f67ab3"];

export default function ProgramDistributionChart({ data }) {
  return (
    <article className="chart-card glass-card">
      <div className="section-title-row">
        <h3>Program Distribution</h3>
        <p>Current active enrollment by college</p>
      </div>
      <div className="chart-wrap pie">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(13, 16, 45, 0.9)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="pie-legend">
        {data.map((item, index) => (
          <span key={item.name}>
            <i style={{ background: colors[index % colors.length] }} />
            {item.name}
          </span>
        ))}
      </div>
    </article>
  );
}
