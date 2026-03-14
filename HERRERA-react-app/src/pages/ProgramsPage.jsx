import { useEffect, useMemo, useState } from "react";
import { getAllStudents } from "../services/enrollmentService";

export default function ProgramsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAllStudents().then(setRows).catch(() => setRows([]));
  }, []);

  const programSummary = useMemo(() => {
    const summaryMap = new Map();

    rows.forEach((row) => {
      const key = row.program || "Unassigned";
      const current = summaryMap.get(key) || {
        name: key,
        total: 0,
        enrolled: 0,
        onLeave: 0,
        graduated: 0,
      };

      current.total += 1;
      if (row.status === "enrolled") current.enrolled += 1;
      if (row.status === "on_leave") current.onLeave += 1;
      if (row.status === "graduated") current.graduated += 1;

      summaryMap.set(key, current);
    });

    return Array.from(summaryMap.values()).sort((a, b) => b.total - a.total);
  }, [rows]);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Program Offerings</h3>
        <p>Live backend summary grouped by department/program</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Program / Department</th>
              <th>Total Students</th>
              <th>Enrolled</th>
              <th>On Leave</th>
              <th>Graduated</th>
            </tr>
          </thead>
          <tbody>
            {programSummary.map((program) => (
              <tr key={program.name}>
                <td>{program.name}</td>
                <td>{program.total}</td>
                <td>{program.enrolled}</td>
                <td>{program.onLeave}</td>
                <td>{program.graduated}</td>
              </tr>
            ))}
            {programSummary.length === 0 ? (
              <tr>
                <td colSpan={5}>No program records found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
