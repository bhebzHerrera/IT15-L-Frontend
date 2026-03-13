import { useEffect, useState } from "react";
import Dashboard from "../components/Dashboard";
import { getDashboardData } from "../services/enrollmentService";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getDashboardData();
        if (isActive) {
          setDashboardData(response);
        }
      } catch {
        if (isActive) {
          setError("Dashboard data failed to load. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Dashboard
      dashboardData={dashboardData}
      isLoading={isLoading}
      error={error}
    />
  );
}
