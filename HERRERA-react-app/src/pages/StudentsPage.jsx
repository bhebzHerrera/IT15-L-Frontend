import { useEffect, useMemo, useState } from "react";
import { getStudentProfile, getStudents } from "../services/enrollmentService";

export default function StudentsPage() {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    let active = true;

    getStudents().then((data) => {
      if (!active) return;
      setRows(data);
      if (data.length > 0) {
        setSelectedId(data[0].id);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setProfile(null);
      return;
    }

    let active = true;
    setLoadingProfile(true);

    getStudentProfile(selectedId)
      .then((data) => {
        if (active) setProfile(data);
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedRow = useMemo(() => rows.find((row) => row.id === selectedId), [rows, selectedId]);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Student Registry</h3>
        <p>View student profile and enrolled courses</p>
      </div>

      <div className="program-layout courses-layout">
        <div className="program-list-pane table-wrap">
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
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={selectedId === row.id ? "table-row-selected" : ""}
                  style={{ cursor: "pointer" }}
                >
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

        <article className="glass-card" style={{ padding: 14 }}>
          <div className="section-title-row">
            <h3>{selectedRow?.name || "Student Profile"}</h3>
            <p>{profile?.student_number || "Select a student"}</p>
          </div>

          {loadingProfile ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <>
              <p style={{ marginBottom: 8, color: "var(--text-muted)" }}>{profile.email}</p>
              <h4 style={{ marginBottom: 8 }}>Enrolled Courses</h4>
              <ul className="settings-list">
                {(profile.courses || []).map((course) => (
                  <li key={course.id}>
                    <strong>{course.course_code}</strong>
                    <p>{course.course_name}</p>
                  </li>
                ))}
                {(profile.courses || []).length === 0 ? <li>No enrolled courses.</li> : null}
              </ul>
            </>
          ) : (
            <p>Select a student to view profile.</p>
          )}
        </article>
      </div>
    </section>
  );
}
