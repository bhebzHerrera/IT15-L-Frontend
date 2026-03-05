export default function ProgramCard({ program, selected, onSelect }) {
  return (
    <article
      onClick={() => onSelect(program)}
      className="glass-card"
      style={{
        padding: 12,
        marginBottom: 10,
        cursor: "pointer",
        border: selected ? "1px solid rgba(88,246,198,0.55)" : undefined,
      }}
    >
      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{program.code}</p>
      <h4 style={{ fontSize: "0.97rem", marginTop: 3 }}>{program.name}</h4>
      <p style={{ color: "var(--text-muted)", marginTop: 5, fontSize: "0.84rem" }}>
        {program.type} | {program.durationYears} years | {program.totalUnits} units
      </p>
      <span
        className={`status-chip status-${
          program.status === "Active"
            ? "approved"
            : program.status === "Phased Out"
            ? "rejected"
            : "forreview"
        }`}
        style={{ marginTop: 8, display: "inline-block" }}
      >
        {program.status}
      </span>
    </article>
  );
}
