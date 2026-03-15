import apiClient from "./apiClient";

export async function getDashboardData() {
  const response = await apiClient.get("/dashboard");
  return response.data;
}

export async function getDashboardBundle() {
  const [dashboardResponse, studentsResponse, coursesResponse] = await Promise.all([
    apiClient.get("/dashboard"),
    apiClient.get("/students", { params: { per_page: 100 } }),
    apiClient.get("/courses", { params: { per_page: 100 } }),
  ]);

  return {
    dashboardData: dashboardResponse.data,
    students: studentsResponse.data,
    courses: coursesResponse.data,
  };
}

export async function getStudents() {
  const response = await apiClient.get("/students", { params: { per_page: 100 } });
  return response.data;
}

export async function getAllStudents() {
  const allRows = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await apiClient.get("/students", {
      params: { per_page: 100, with_meta: true, page },
    });

    const payloadRows = response.data?.data || [];
    const meta = response.data?.meta || {};

    allRows.push(
      ...payloadRows.map((student) => ({
        id: student.id,
        name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
        program: student.department || "Unassigned",
        year: student.year_level,
        status: student.status,
      }))
    );

    page += 1;
    lastPage = Number(meta.last_page || 1);
  } while (page <= lastPage);

  return allRows;
}

export async function getCourses(studentId) {
  const params = { per_page: 100, with_meta: true };

  if (studentId) {
    params.student_id = studentId;
  }

  const response = await apiClient.get("/courses", { params });

  const rows = response.data?.data || [];

  return rows.map((course) => ({
    id: course.id,
    code: course.course_code || course.code,
    title: course.course_name || course.title,
    department: course.department || "",
    slots: course.capacity ?? 0,
    enrolled: course.students_count ?? 0,
  }));
}

export async function getEnrollmentPipeline() {
  const response = await apiClient.get("/enrollments/pipeline");
  return response.data;
}

export async function getReportCards() {
  const response = await apiClient.get("/reports/cards");
  return response.data;
}

export async function getStudentProfile(studentId) {
  const response = await apiClient.get(`/students/${studentId}`);
  return response.data?.data;
}

export async function getCourseDetail(courseId) {
  const response = await apiClient.get(`/courses/${courseId}`);
  return response.data?.data;
}

export async function createCourse(payload) {
  const response = await apiClient.post("/courses", payload);
  return response.data?.data;
}

export async function createActivity(payload) {
  const response = await apiClient.post("/school-days", payload);
  return response.data?.data;
}

export async function getEnrollments() {
  const response = await apiClient.get("/enrollments");
  return response.data?.data || [];
}

export async function createEnrollment(studentId, courseId) {
  const response = await apiClient.post("/enrollments", {
    student_id: studentId,
    course_id: courseId,
  });
  return response.data;
}

export async function removeEnrollment(studentId, courseId) {
  const response = await apiClient.delete("/enrollments", {
    data: {
      student_id: studentId,
      course_id: courseId,
    },
  });
  return response.data;
}

export async function getEnrollmentStatusSummary() {
  const response = await apiClient.get("/enrollments/status-summary");
  return response.data?.data || {};
}
