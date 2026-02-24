import React from "react";

// Modal overlay that shows complete information for a subject
export default function SubjectDetails({ subject, onClose }) {
  if (!subject) return null;

  const noneText = "None";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 250,
      }}
      onClick={onClose}
    >
      <div
        className="chart-card"
        style={{
          width: "520px",
          maxWidth: "90vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          <div>
            <div className="page-title" style={{ fontSize: 18 }}>
              {subject.code} – {subject.title}
            </div>
            <div className="page-sub">
              {subject.units} unit(s) • Offered: {subject.term}
            </div>
          </div>
          <button
            className="btn-sm"
            onClick={onClose}
            style={{ borderRadius: 999 }}
          >
            Close
          </button>
        </div>

        <div style={{ marginBottom: 10, fontSize: 13 }}>
          <strong>Program assignment: </strong>
          <span style={{ color: "var(--text2)" }}>{subject.program}</span>
        </div>

        <div style={{ marginBottom: 10, fontSize: 13 }}>
          <strong>Pre‑requisites: </strong>
          <span style={{ color: "var(--text2)" }}>
            {subject.preRequisites && subject.preRequisites.length
              ? subject.preRequisites.join(", ")
              : noneText}
          </span>
        </div>

        <div style={{ marginBottom: 10, fontSize: 13 }}>
          <strong>Co‑requisites: </strong>
          <span style={{ color: "var(--text2)" }}>
            {subject.coRequisites && subject.coRequisites.length
              ? subject.coRequisites.join(", ")
              : noneText}
          </span>
        </div>

        <div style={{ marginTop: 10, fontSize: 13 }}>
          <strong>Description</strong>
          <p style={{ color: "var(--text2)", marginTop: 4 }}>
            {subject.description || "No description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}

