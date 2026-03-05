export default function SubjectCard({ subject, onSelect }) {
  const hasPreReq = subject.preRequisites.length > 0;
  const termClass =
    subject.term === "Semester" ? "status-approved" : subject.term === "Term" ? "status-forreview" : "status-pending";

  return (
    <tr onClick={() => onSelect(subject)} style={{ cursor: "pointer" }}>
      <td>{subject.code}</td>
      <td>{subject.title}</td>
      <td>{subject.units}</td>
      <td>
        <span className={`status-chip ${termClass}`}>{subject.term}</span>
      </td>
      <td>{subject.program}</td>
      <td>{subject.description || "none"}</td>
      <td>{hasPreReq ? subject.preRequisites.join(", ") : "none"}</td>
    </tr>
  );
}
