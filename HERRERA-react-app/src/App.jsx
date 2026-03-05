import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import { useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import EnrollmentPage from "./pages/EnrollmentPage";
import LoginPage from "./pages/LoginPage";
import ProgramsPage from "./pages/ProgramsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import SubjectsPage from "./pages/SubjectsPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to={isAuthenticated ? "/app/dashboard" : "/login"}
            replace
          />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="programs" element={<ProgramsPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="students" element={<Navigate to="/app/programs" replace />} />
        <Route path="courses" element={<Navigate to="/app/subjects" replace />} />
        <Route path="enrollment" element={<EnrollmentPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
