import {
  BookOpenCheck,
  BookText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/programs", label: "Program Offerings", icon: BookOpenCheck },
  { to: "/app/subjects", label: "Subject Offerings", icon: BookText },
  { to: "/app/students", label: "Students", icon: BookOpenCheck },
  { to: "/app/courses", label: "Courses", icon: BookText },
  { to: "/app/enrollment", label: "Enrollment", icon: UserCog },
  { to: "/app/announcements", label: "Announcements", icon: Megaphone },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  };

  return (
    <>
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
          <button
            className="ghost-btn"
            onClick={() => setIsLogoutDialogOpen(true)}
            type="button"
          >
            Sign out
          </button>
        </div>
      </aside>

      {isLogoutDialogOpen ? (
        <div className="logout-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <article className="logout-confirm-card glass-card">
            <h3 id="logout-title">Confirm Sign Out</h3>
            <p>You are about to sign out of PSU Portal. Do you want to continue?</p>
            <div className="logout-confirm-actions">
              <button
                type="button"
                className="ghost-btn logout-cancel-btn"
                onClick={() => setIsLogoutDialogOpen(false)}
                disabled={isLoggingOut}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ghost-btn logout-proceed-btn"
                onClick={() => void handleLogoutConfirm()}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Signing out..." : "Yes, sign out"}
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
