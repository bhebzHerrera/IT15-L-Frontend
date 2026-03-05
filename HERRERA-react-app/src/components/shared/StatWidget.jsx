export default function StatWidget({ label, value, trend, positive = true }) {
  return (
    <article className="stat-widget glass-card">
      <p>{label}</p>
      <h3>{value}</h3>
      <span className={positive ? "trend-up" : "trend-down"}>{trend}</span>
    </article>
  );
}
