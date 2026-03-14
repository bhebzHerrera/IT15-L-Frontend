import { Outlet, useLocation } from "react-router-dom";
import ChatbotWidget from "../shared/ChatbotWidget";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const TITLES = {
  "/app/dashboard": {
    title: "PSU Enrollment System",
    subtitle: "Student enrollment and academic overview.",
  },
  "/app/programs": {
    title: "Program Offerings",
    subtitle: "Program listing, filters, and detailed curriculum view",
  },
  "/app/subjects": {
    title: "Subject Offerings",
    subtitle: "Subject listing, term indicators, and pre/co-requisites",
  },
  "/app/students": {
    title: "Students",
    subtitle: "Student list and enrolled course profiles",
  },
  "/app/courses": {
    title: "Courses",
    subtitle: "Course list, capacity, and enrolled students",
  },
  "/app/enrollment": {
    title: "Enrollment",
    subtitle: "Current cycle applications and approvals",
  },
  "/app/reports": {
    title: "Reports",
    subtitle: "Performance analytics and projections",
  },
  "/app/settings": {
    title: "Settings",
    subtitle: "Configuration, policy, and integrations",
  },
};

export default function AppLayout() {
  const location = useLocation();
  const pageMeta = TITLES[location.pathname] || TITLES["/app/dashboard"];

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar title={pageMeta.title} subtitle={pageMeta.subtitle} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <ChatbotWidget />
    </div>
  );
}
