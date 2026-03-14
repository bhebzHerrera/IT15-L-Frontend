import { useEffect, useMemo, useState } from "react";
import { getCourses } from "../services/enrollmentService";

export default function SubjectsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getCourses().then(setRows).catch(() => setRows([]));
  }, []);

  const subjects = useMemo(() => {
    return rows.map((row) => ({
      code: row.code,
      title: row.title,
      slots: row.slots,
      enrolled: row.enrolled,
      utilization: Math.round(((row.enrolled ?? 0) / Math.max(row.slots ?? 1, 1)) * 100),
    }));
  }, [rows]);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Subject Offerings</h3>
        <p>Live backend course list</p>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Slots</th>
              <th>Enrolled</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.code}>
                <td>{subject.code}</td>
                <td>{subject.title}</td>
                <td>{subject.slots}</td>
                <td>{subject.enrolled}</td>
                <td>{subject.utilization}%</td>
              </tr>
            ))}
            {subjects.length === 0 ? (
              <tr>
                <td colSpan={5}>No subject records found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
