import React from "react";

// Subject summary row/card used inside subject list
export default function SubjectCard({ subject, onSelect }) {
  const hasPreReq = subject.preRequisites && subject.preRequisites.length > 0;

  // Small badge to show how the subject is offered (semester/term/both)
  const termColor =
    subject.term === "Semester"
      ? "#4F8EF7"
      : subject.term === "Term"
      ? "#10B981"
      : "#F59E0B";

  return (
    <tr onClick={() => onSelect(subject)} style={{ cursor: "pointer" }}>
      <td style={{ color: "var(--accent2)", fontWeight: 600 }}>
        {subject.code}
      </td>
      <td>{subject.title}</td>
      <td>{subject.units}</td>
      <td>
        <span
          className="badge"
          style={{ background: "rgba(0,0,0,0.2)", color: termColor }}
        >
          {subject.term}
        </span>
      </td>
      <td style={{ color: "var(--text2)" }}>{subject.program}</td>
      <td style={{ color: "var(--text2)", fontSize: 12 }}>
        {subject.description || "No description"}
      </td>
      <td>
        <span
          className="badge"
          style={{
            background: hasPreReq
              ? "rgba(245,158,11,0.1)"
              : "rgba(16,185,129,0.1)",
            color: hasPreReq ? "#F59E0B" : "#10B981",
          }}
        >
          {hasPreReq ? "With Pre‑req" : "No Pre‑req"}
        </span>
      </td>
    </tr>
  );
}

