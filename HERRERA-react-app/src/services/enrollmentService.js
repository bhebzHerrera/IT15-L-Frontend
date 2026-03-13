import {
  activities,
  attendancePatterns,
  capacityData,
  courses,
  dashboardStats,
  enrollmentPipeline,
  enrollmentTrend,
  programDistribution,
  recentEnrollments,
  reportCards,
  students,
} from "../data/mockData";
import apiClient from "./apiClient";

const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA !== "false" || !import.meta.env.VITE_API_BASE_URL;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardData() {
  if (!USE_MOCK_DATA) {
    const response = await apiClient.get("/dashboard");
    return response.data;
  }

  await wait(300);
  return {
    stats: dashboardStats,
    enrollmentTrend,
    programDistribution,
    attendancePatterns,
    capacityData,
    recentEnrollments,
    activities,
  };
}

export async function getStudents() {
  if (!USE_MOCK_DATA) {
    const response = await apiClient.get("/students");
    return response.data;
  }
  await wait(200);
  return students;
}

export async function getCourses() {
  if (!USE_MOCK_DATA) {
    const response = await apiClient.get("/courses");
    return response.data;
  }
  await wait(200);
  return courses;
}

export async function getEnrollmentPipeline() {
  if (!USE_MOCK_DATA) {
    const response = await apiClient.get("/enrollments/pipeline");
    return response.data;
  }
  await wait(200);
  return enrollmentPipeline;
}

export async function getReportCards() {
  if (!USE_MOCK_DATA) {
    const response = await apiClient.get("/reports/cards");
    return response.data;
  }
  await wait(200);
  return reportCards;
}
