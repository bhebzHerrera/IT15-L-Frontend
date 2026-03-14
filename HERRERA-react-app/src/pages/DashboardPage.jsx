import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { getDashboardBundle } from "../services/enrollmentService";

const initialDashboardData = {
  stats: [],
  enrollmentTrend: [],
  programDistribution: [],
  attendancePatterns: [],
  capacityData: [],
  recentEnrollments: [],
  activities: [],
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await getDashboardBundle();
      setDashboardData(response.dashboardData);
      setStudents(response.students);
      setCourses(response.courses);
    } catch {
      setError("Dashboard data failed to load. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    loadDashboard().catch(() => {
      if (isActive) {
        setError("Dashboard data failed to load. Please try again.");
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Dashboard
      dashboardData={dashboardData}
      students={students}
      courses={courses}
      isLoading={isLoading}
      error={error}
      onActivityCreated={loadDashboard}
    />
  );
}
