import { Bell, CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMonthYear(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function toIsoDate(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function buildCalendarCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    cells.push({
      date: new Date(year, month - 1, day),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  let nextMonthDay = 1;
  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, nextMonthDay),
      inCurrentMonth: false,
    });
    nextMonthDay += 1;
  }

  return cells;
}

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

export default function Topbar({ title, subtitle }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const displayDate = formatDate(selectedDate);
  const selectedDateKey = toIsoDate(selectedDate);
  const monthLabel = formatMonthYear(viewDate);
  const calendarCells = useMemo(() => buildCalendarCells(viewDate), [viewDate]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (
        popoverRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setIsCalendarOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <header className="topbar glass-card">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="topbar-actions">
        <div className="topbar-date-anchor">
          <button
            ref={triggerRef}
            className="inline-pill topbar-date-trigger"
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            aria-label="Open date picker"
            title="Open calendar"
          >
            <CalendarClock size={14} />
            {displayDate}
          </button>
          {isCalendarOpen ? (
            <div className="topbar-calendar-popover glass-card" ref={popoverRef}>
              <div className="topbar-calendar-head">
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Previous month"
                  onClick={() =>
                    setViewDate(
                      (current) =>
                        new Date(current.getFullYear(), current.getMonth() - 1, 1)
                    )
                  }
                >
                  <ChevronLeft size={14} />
                </button>
                <strong>{monthLabel}</strong>
                <button
                  className="icon-btn"
                  type="button"
                  aria-label="Next month"
                  onClick={() =>
                    setViewDate(
                      (current) =>
                        new Date(current.getFullYear(), current.getMonth() + 1, 1)
                    )
                  }
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="topbar-calendar-weekdays">
                {weekdayLabels.map((label, index) => (
                  <span key={`${label}-${index}`}>{label}</span>
                ))}
              </div>
              <div className="topbar-calendar-grid">
                {calendarCells.map((cell) => {
                  const cellKey = toIsoDate(cell.date);
                  const className = [
                    "topbar-calendar-day",
                    cell.inCurrentMonth ? "" : "topbar-calendar-day-muted",
                    selectedDateKey === cellKey ? "topbar-calendar-day-selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      key={cellKey}
                      type="button"
                      className={className}
                      onClick={() => {
                        setSelectedDate(cell.date);
                        setViewDate(
                          new Date(cell.date.getFullYear(), cell.date.getMonth(), 1)
                        );
                        setIsCalendarOpen(false);
                      }}
                    >
                      {cell.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        <button className="icon-btn" type="button" aria-label="Notifications">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
