import {
  BookOpenCheck,
  BookText,
  GraduationCap,
  LayoutDashboard,
  UserCog,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/programs", label: "Program Offerings", icon: BookOpenCheck },
  { to: "/app/subjects", label: "Subject Offerings", icon: BookText },
  { to: "/app/students", label: "Students", icon: BookOpenCheck },
  { to: "/app/courses", label: "Courses", icon: BookText },
  { to: "/app/enrollment", label: "Enrollment", icon: UserCog },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand-block glass-card">
        <div className="brand-mark" aria-label="PSU logo">
          <GraduationCap size={20} />
        </div>
        <div>
          <h1>PSU Portal</h1>
          <p>Assignments due... eventually.</p>
        </div>
      </div>

      <nav className="nav-menu glass-card">
        <p className="navigation-caption">Main Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item${isActive ? " nav-item-active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="profile-card glass-card">
        <div>
          <strong>{user?.name}</strong>
          <p>{user?.role}</p>
        </div>
        <button className="ghost-btn" onClick={() => void logout()} type="button">
          Sign out
        </button>
      </div>
    </aside>
  );
}
