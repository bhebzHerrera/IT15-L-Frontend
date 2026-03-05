import { subjects } from "../data/mockData";

export default function ProgramDetails({ program }) {
  if (!program) {
    return (
      <article className="glass-card" style={{ padding: 14 }}>
        <h3>Program Details</h3>
        <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
          Select a program to view complete details.
        </p>
      </article>
    );
  }

  const getSubjectLabel = (subjectCode) => {
    const subject = subjects.find((item) => item.code === subjectCode);
    return subject ? `${subject.code} - ${subject.title}` : subjectCode;
  };

  return (
    <article className="glass-card" style={{ padding: 14 }}>
      <div className="section-title-row">
        <h3>
          {program.code} - {program.name}
        </h3>
        <p>{program.status}</p>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 10, fontSize: "0.9rem" }}>
        <p>
          <strong>Program Code:</strong> {program.code}
        </p>
        <p>
          <strong>Program Name:</strong> {program.name}
        </p>
        <p>
          <strong>Description:</strong> {program.description}
        </p>
        <p>
          <strong>Duration:</strong> {program.durationYears} years
        </p>
        <p>
          <strong>Total Units:</strong> {program.totalUnits}
        </p>
      </div>

      <h4 style={{ marginBottom: 8 }}>Year Levels (1st Year - 4th Year)</h4>
      <div style={{ display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {program.yearLevels.map((yearLevel) => (
          <div key={yearLevel.year} className="glass-card" style={{ padding: 10 }}>
            <strong style={{ display: "block", marginBottom: 6 }}>{yearLevel.label}</strong>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {yearLevel.subjects.map((subjectCode) => (
                <li key={subjectCode} style={{ marginBottom: 4, fontSize: "0.85rem" }}>
                  {getSubjectLabel(subjectCode)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}
