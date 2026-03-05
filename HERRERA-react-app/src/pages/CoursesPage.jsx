import { useEffect, useState } from "react";
import { getCourses } from "../services/enrollmentService";

export default function CoursesPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getCourses().then(setRows);
  }, []);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Course Offerings</h3>
        <p>partial sa ni</p>
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
            {rows.map((row) => (
              <tr key={row.code}>
                <td>{row.code}</td>
                <td>{row.title}</td>
                <td>{row.slots}</td>
                <td>{row.enrolled}</td>
                <td>{Math.round((row.enrolled / row.slots) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
