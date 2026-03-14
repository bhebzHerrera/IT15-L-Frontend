import { useEffect, useMemo, useState } from "react";
import {
  createEnrollment,
  getCourses,
  getEnrollments,
  getStudents,
  removeEnrollment,
} from "../services/enrollmentService";

export default function EnrollmentPage() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([getStudents(), getEnrollments()]).then(
      async ([studentsRows, enrollmentRows]) => {
        if (!active) return;

        const firstStudentId = studentsRows[0]?.id;
        const courseRows = firstStudentId ? await getCourses(firstStudentId) : [];
        if (!active) return;

        setStudents(studentsRows);
        setCourses(courseRows);
        setEnrollments(enrollmentRows);
        if (firstStudentId) setStudentId(String(firstStudentId));
        if (courseRows[0]) setCourseId(String(courseRows[0].id));
      }
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const refreshCourses = async () => {
      if (!studentId) {
        setCourses([]);
        setCourseId("");
        return;
      }

      const courseRows = await getCourses(Number(studentId));
      if (!active) return;

      setCourses(courseRows);
      setCourseId((previous) => {
        const exists = courseRows.some((course) => String(course.id) === previous);
        if (exists) return previous;
        return courseRows[0] ? String(courseRows[0].id) : "";
      });
    };

    refreshCourses();

    return () => {
      active = false;
    };
  }, [studentId]);

  const enrollmentRows = useMemo(() => {
    return enrollments.flatMap((student) =>
      (student.courses || []).map((course) => ({
        studentId: student.id,
        studentName: `${student.first_name} ${student.last_name}`,
        studentNumber: student.student_number,
        courseId: course.id,
        courseCode: course.course_code,
        courseName: course.course_name,
      }))
    );
  }, [enrollments]);

  const selectedStudent = useMemo(
    () => students.find((student) => String(student.id) === String(studentId)),
    [students, studentId]
  );

  const refreshEnrollments = async () => {
    const rows = await getEnrollments();
    setEnrollments(rows);
  };

  const onEnroll = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await createEnrollment(Number(studentId), Number(courseId));
      setMessage("Enrollment created successfully.");
      await refreshEnrollments();
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || "Unable to create enrollment.");
    }
  };

  const onUnenroll = async (selectedStudentId, selectedCourseId) => {
    setMessage("");
    try {
      await removeEnrollment(selectedStudentId, selectedCourseId);
      setMessage("Enrollment removed successfully.");
      await refreshEnrollments();
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || "Unable to remove enrollment.");
    }
  };

  return (
    <section className="single-pane glass-card">
      <div className="section-title-row">
        <h3>Enrollment</h3>
        <p>Manage student-course enrollment records</p>
      </div>

      <form className="glass-card create-enrollment-form" onSubmit={onEnroll}>
        <div className="section-title-row">
          <h3>Create Enrollment</h3>
          <p>Prevents duplicate and full-course enrollment</p>
        </div>
        <div className="modal-field-row create-enrollment-row">
          <select
            className="create-enrollment-control"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
          >
            {students.map((student) => (
              <option key={student.id} value={String(student.id)}>
                {student.name}
              </option>
            ))}
          </select>
          <div className="enrollment-department-chip" aria-live="polite">
            <span>Department</span>
            <strong>{selectedStudent?.program || "N/A"}</strong>
          </div>
          <select
            className="create-enrollment-control"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
          >
            {courses.map((course) => (
              <option key={course.id} value={String(course.id)}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
          <button type="submit" className="ghost-btn create-enrollment-submit">Enroll</button>
        </div>
        {message ? <p className="weather-message">{message}</p> : null}
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Student #</th>
              <th>Student Name</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {enrollmentRows.map((row) => (
              <tr key={`${row.studentId}-${row.courseId}`}>
                <td>{row.studentNumber}</td>
                <td>{row.studentName}</td>
                <td>{row.courseCode}</td>
                <td>{row.courseName}</td>
                <td>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => onUnenroll(row.studentId, row.courseId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {enrollmentRows.length === 0 ? (
              <tr>
                <td colSpan={5}>No enrollment records yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
