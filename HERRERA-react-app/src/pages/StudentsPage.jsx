import { useEffect, useState } from "react";
import { getStudents } from "../services/enrollmentService";

export default function StudentsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getStudents().then(setRows);
  }, []);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Student Registry</h3>
        <p>wapani</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Program</th>
              <th>Year</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.program}</td>
                <td>{row.year}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
