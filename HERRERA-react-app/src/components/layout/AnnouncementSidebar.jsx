import { CalendarDays, ChevronLeft, ChevronRight, Megaphone, PlusCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createAnnouncement,
  getAnnouncements,
  removeAnnouncement,
  updateAnnouncement,
} from "../../services/announcementService";

function getTodayIso() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
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
    cells.push({ date: new Date(year, month - 1, day), inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), inCurrentMonth: true });
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

export default function AnnouncementSidebar({ embedded = false, pageMode = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    date: getTodayIso(),
    priority: "normal",
  });
  const [feedback, setFeedback] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const calendarRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadAnnouncements = async () => {
      try {
        const rows = await getAnnouncements();
        if (active) {
          setAnnouncements(rows);
        }
      } catch {
        if (active) {
          setFeedback("Unable to load announcements from backend.");
        }
      }
    };

    loadAnnouncements();

    return () => {
      active = false;
    };
  }, []);

  const sortedAnnouncements = useMemo(() => {
    return [...announcements].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }, [announcements]);
  const monthLabel = formatMonthYear(viewDate);
  const calendarCells = useMemo(() => buildCalendarCells(viewDate), [viewDate]);

  useEffect(() => {
    const targetDate = new Date(form.date);
    if (!Number.isNaN(targetDate.getTime())) {
      setViewDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1));
    }
  }, [form.date]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (calendarRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      setIsCalendarOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      date: getTodayIso(),
      priority: "normal",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      setFeedback("Title and message are required.");
      return;
    }

    const payload = {
      title,
      message,
      date: form.date,
      priority: form.priority,
    };

    setIsSubmitting(true);

    try {
      if (editingId) {
        const updatedRow = await updateAnnouncement(editingId, payload);
        setAnnouncements((previous) =>
          previous.map((announcement) =>
            announcement.id === editingId ? updatedRow : announcement
          )
        );
        setEditingId(null);
        setFeedback("Announcement updated.");
      } else {
        const createdRow = await createAnnouncement(payload);
        setAnnouncements((previous) => [createdRow, ...previous]);
        setFeedback("Announcement created.");
      }

      resetForm();
    } catch {
      setFeedback("Unable to save announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      message: announcement.message,
      date: announcement.date,
      priority: announcement.priority,
    });
    setFeedback("Editing announcement. Update when ready.");
    setIsCalendarOpen(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
    setFeedback("Edit canceled.");
  };

  const handleRemoveConfirmed = async () => {
    if (!pendingRemoveId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await removeAnnouncement(pendingRemoveId);
      setAnnouncements((previous) =>
        previous.filter((announcement) => announcement.id !== pendingRemoveId)
      );
      setPendingRemoveId(null);
      setFeedback("Announcement removed.");
    } catch {
      setFeedback("Unable to remove announcement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      className={`announcement-sidebar${embedded ? " announcement-sidebar--embedded" : " glass-card"}${
        pageMode ? " announcement-sidebar--page" : ""
      }`}
    >
      <div className="announcement-head">
        <h3>
          <Megaphone size={16} />
          Announcements
        </h3>
        <p>Create and post quick campus updates</p>
      </div>

      <form className="announcement-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.title}
          placeholder="Announcement title"
          className="announcement-input"
          onChange={(event) =>
            setForm((previous) => ({ ...previous, title: event.target.value }))
          }
          required
        />

        <textarea
          value={form.message}
          placeholder="Write announcement details"
          className="announcement-textarea"
          onChange={(event) =>
            setForm((previous) => ({ ...previous, message: event.target.value }))
          }
          rows={3}
          required
        />

        <div className="announcement-row">
          <div className="announcement-date-anchor">
            <button
              ref={triggerRef}
              type="button"
              className="announcement-input announcement-date-trigger"
              onClick={() => setIsCalendarOpen((previous) => !previous)}
            >
              <CalendarDays size={14} />
              {formatDate(form.date)}
            </button>

            {isCalendarOpen ? (
              <div
                className="announcement-calendar-popover announcement-calendar-popover-inline"
                ref={calendarRef}
              >
                <div className="announcement-calendar-head">
                  <button
                    className="announcement-calendar-nav"
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
                    className="announcement-calendar-nav"
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

                <div className="announcement-calendar-weekdays">
                  {weekdayLabels.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>

                <div className="announcement-calendar-grid">
                  {calendarCells.map((cell) => {
                    const cellKey = toIsoDate(cell.date);
                    const isSelected = cellKey === form.date;
                    const className = [
                      "announcement-calendar-day",
                      cell.inCurrentMonth ? "" : "announcement-calendar-day-muted",
                      isSelected ? "announcement-calendar-day-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <button
                        key={cellKey}
                        type="button"
                        className={className}
                        onClick={() => {
                          setForm((previous) => ({ ...previous, date: cellKey }));
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

          <select
            value={form.priority}
            className="announcement-input"
            onChange={(event) =>
              setForm((previous) => ({ ...previous, priority: event.target.value }))
            }
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="announcement-submit-row">
          <button type="submit" className="ghost-btn announcement-submit" disabled={isSubmitting}>
            <PlusCircle size={14} />
            {isSubmitting ? "Saving..." : editingId ? "Update Announcement" : "Create Announcement"}
          </button>
          {editingId ? (
            <button
              type="button"
              className="ghost-btn announcement-cancel-edit-btn"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>

        {feedback ? <p className="announcement-feedback">{feedback}</p> : null}
      </form>

      <div className="announcement-list">
        {sortedAnnouncements.map((item) => (
          <article key={item.id} className="announcement-item">
            <div className="announcement-meta-row">
              <span className={`announcement-priority announcement-${item.priority}`}>
                {item.priority}
              </span>
              <div className="announcement-actions">
                <time>{formatDate(item.date)}</time>
                <button
                  type="button"
                  className="announcement-edit-btn"
                  onClick={() => handleEdit(item)}
                  disabled={isSubmitting}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="announcement-remove-btn"
                  onClick={() => setPendingRemoveId(item.id)}
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              </div>
            </div>
            <h4>{item.title}</h4>
            <p>{item.message}</p>
          </article>
        ))}
      </div>

      {pendingRemoveId ? (
        <div className="announcement-confirm-backdrop" role="dialog" aria-modal="true" aria-labelledby="announcement-remove-title">
          <article className="announcement-confirm-card glass-card">
            <h4 id="announcement-remove-title">Remove Announcement?</h4>
            <p>This action cannot be undone. Do you want to continue?</p>
            <div className="announcement-confirm-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={() => setPendingRemoveId(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ghost-btn announcement-remove-confirm-btn"
                onClick={() => void handleRemoveConfirmed()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Removing..." : "Yes, Remove"}
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </aside>
  );
}
