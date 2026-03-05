import { Bell, CalendarClock } from "lucide-react";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function Topbar({ title, subtitle }) {
  return (
    <header className="topbar glass-card">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <span className="inline-pill">
          <CalendarClock size={14} />
          {formatDate(new Date())}
        </span>
        <button className="icon-btn" type="button" aria-label="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
