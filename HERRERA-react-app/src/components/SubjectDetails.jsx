export default function SubjectDetails({ subject, onClose }) {
  if (!subject) return null;

  const preRequisites = subject.preRequisites.length > 0 ? subject.preRequisites.join(", ") : "none";
  const coRequisites = subject.coRequisites.length > 0 ? subject.coRequisites.join(", ") : "none";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 320,
      }}
    >
      <article
        className="glass-card"
        onClick={(event) => event.stopPropagation()}
        style={{ width: "min(620px, 92vw)", padding: 16, maxHeight: "88vh", overflowY: "auto" }}
      >
        <div className="section-title-row">
          <h3>
            {subject.code} - {subject.title}
          </h3>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div style={{ display: "grid", gap: 8, fontSize: "0.92rem" }}>
          <p>
            <strong>Units:</strong> {subject.units}
          </p>
          <p>
            <strong>Semester/Term Offered:</strong> {subject.term}
          </p>
          <p>
            <strong>Pre-Requisites:</strong> {preRequisites}
          </p>
          <p>
            <strong>Co-Requisites:</strong> {coRequisites}
          </p>
          <p>
            <strong>Description:</strong> {subject.description || "none"}
          </p>
          <p>
            <strong>Program Assignment:</strong> {subject.program}
          </p>
        </div>
      </article>
    </div>
  );
}
