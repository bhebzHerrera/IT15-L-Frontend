import { useEffect, useMemo, useState } from "react";
import { createCourse, getCourseDetail, getCourses } from "../services/enrollmentService";

export default function CoursesPage() {
  const [rows, setRows] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [createMessage, setCreateMessage] = useState("");
  const [createForm, setCreateForm] = useState({
    course_code: "",
    course_name: "",
    department: "",
    capacity: "40",
    units: "3",
    semester: "1st",
  });

  const departmentOptions = useMemo(() => {
    return Array.from(new Set(rows.map((row) => row.department).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [rows]);

  const loadCourses = async (selectedCourseCode = "") => {
    const data = await getCourses();
    setRows(data);

    if (data.length === 0) {
      setSelectedCode("");
      return;
    }

    if (selectedCourseCode && data.some((row) => row.code === selectedCourseCode)) {
      setSelectedCode(selectedCourseCode);
      return;
    }

    setSelectedCode(data[0].code);
  };

  useEffect(() => {
    let active = true;

    loadCourses().then(() => {
      if (!active) return;
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (departmentOptions.length === 0) {
      setCreateForm((previous) => ({ ...previous, department: "" }));
      return;
    }

    setCreateForm((previous) => {
      if (departmentOptions.includes(previous.department)) {
        return previous;
      }

      return { ...previous, department: departmentOptions[0] };
    });
  }, [departmentOptions]);

  const onCreateCourse = async (event) => {
    event.preventDefault();
    setCreateMessage("");

    const payload = {
      course_code: createForm.course_code.trim(),
      course_name: createForm.course_name.trim(),
      department: createForm.department.trim(),
      capacity: Number(createForm.capacity),
      units: Number(createForm.units),
      semester: createForm.semester,
      is_active: true,
    };

    try {
      await createCourse(payload);
      setCreateMessage("Course created successfully.");
      setCreateForm((previous) => ({
        ...previous,
        course_code: "",
        course_name: "",
      }));
      await loadCourses(payload.course_code);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setCreateMessage(apiMessage || "Unable to create course.");
    }
  };

  const selectedRow = useMemo(
    () => rows.find((row) => row.code === selectedCode),
    [rows, selectedCode]
  );

  useEffect(() => {
    if (!selectedRow?.id) {
      setDetail(null);
      return;
    }

    let active = true;
    setLoadingDetail(true);

    getCourseDetail(selectedRow.id)
      .then((data) => {
        if (active) setDetail(data);
      })
      .finally(() => {
        if (active) setLoadingDetail(false);
      });

    return () => {
      active = false;
    };
  }, [selectedRow]);

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Course Offerings</h3>
        <p>View course detail and enrolled students</p>
      </div>

      <form className="glass-card create-course-form" onSubmit={onCreateCourse}>
        <div className="section-title-row">
          <h3>Create Course</h3>
          <p>Add a new course offering</p>
        </div>
        <div className="modal-field-row create-course-row">
          <input
            className="create-course-control"
            type="text"
            placeholder="Course Code (e.g. CS250)"
            value={createForm.course_code}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, course_code: event.target.value }))
            }
            required
          />
          <input
            className="create-course-control"
            type="text"
            placeholder="Course Name"
            value={createForm.course_name}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, course_name: event.target.value }))
            }
            required
          />
          <select
            className="create-course-control"
            value={createForm.department}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, department: event.target.value }))
            }
            required
            disabled={departmentOptions.length === 0}
          >
            {departmentOptions.length === 0 ? (
              <option value="">No existing department</option>
            ) : (
              departmentOptions.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="modal-field-row create-course-row">
          <input
            className="create-course-control"
            type="number"
            min="1"
            placeholder="Capacity"
            value={createForm.capacity}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, capacity: event.target.value }))
            }
            required
          />
          <input
            className="create-course-control"
            type="number"
            min="1"
            max="8"
            placeholder="Units"
            value={createForm.units}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, units: event.target.value }))
            }
            required
          />
          <select
            className="create-course-control"
            value={createForm.semester}
            onChange={(event) =>
              setCreateForm((previous) => ({ ...previous, semester: event.target.value }))
            }
          >
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="summer">summer</option>
          </select>
          <button type="submit" className="ghost-btn create-course-submit">Create Course</button>
        </div>
        {createMessage ? <p className="weather-message">{createMessage}</p> : null}
      </form>

      <div className="program-layout courses-layout">
        <div className="program-list-pane table-wrap">
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
                <tr
                  key={row.code}
                  onClick={() => setSelectedCode(row.code)}
                  className={selectedCode === row.code ? "table-row-selected" : ""}
                  style={{ cursor: "pointer" }}
                >
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

        <article className="glass-card" style={{ padding: 14 }}>
          <div className="section-title-row">
            <h3>{detail?.course_name || detail?.title || "Course Detail"}</h3>
            <p>{detail?.course_code || detail?.code || "Select a course"}</p>
          </div>

          {loadingDetail ? (
            <p>Loading course detail...</p>
          ) : detail ? (
            <>
              <p style={{ marginBottom: 8, color: "var(--text-muted)" }}>
                Capacity: {detail.capacity ?? detail.slots}
              </p>
              <h4 style={{ marginBottom: 8 }}>Enrolled Students</h4>
              <ul className="settings-list">
                {(detail.students || []).map((student) => (
                  <li key={student.id}>
                    <strong>{student.student_number}</strong>
                    <p>{student.first_name} {student.last_name}</p>
                  </li>
                ))}
                {(detail.students || []).length === 0 ? <li>No enrolled students.</li> : null}
              </ul>
            </>
          ) : (
            <p>Select a course to view details.</p>
          )}
        </article>
      </div>
    </section>
  );
}
