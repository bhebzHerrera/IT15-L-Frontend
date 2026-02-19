import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MOCK_USER = { name: "Genivieve Herrera", role: "Student", avatar: "ER" };

const MOCK_STATS = [
  { label: "Total Students", value: 3847, change: +12.4, icon: "👥" },
  { label: "Active Courses", value: 142, change: +3.1, icon: "📚" },
  { label: "Enrollments", value: 9214, change: +8.7, icon: "📋" },
  { label: "Completion Rate", value: "87%", change: +2.3, icon: "🎓" },
];

const ENROLLMENT_TREND = [
  { month: "Aug", enrolled: 620, dropped: 42 },
  { month: "Sep", enrolled: 890, dropped: 55 },
  { month: "Oct", enrolled: 740, dropped: 38 },
  { month: "Nov", enrolled: 810, dropped: 61 },
  { month: "Dec", enrolled: 530, dropped: 29 },
  { month: "Jan", enrolled: 980, dropped: 47 },
  { month: "Feb", enrolled: 1140, dropped: 53 },
];

const DEPT_DATA = [
  { dept: "Computer Science", students: 1240, color: "#6EE7B7" },
  { dept: "Engineering", students: 980, color: "#93C5FD" },
  { dept: "Business", students: 870, color: "#FCA5A5" },
  { dept: "Arts & Design", students: 430, color: "#FCD34D" },
  { dept: "Sciences", students: 327, color: "#C4B5FD" },
];

const MOCK_STUDENTS = [
  { id: "S-2401", name: "Marco Dela Cruz", course: "BS Computer Science", year: 3, status: "Active", gpa: 3.8 },
  { id: "S-2402", name: "Sofia Reyes", course: "BS Information Technology", year: 2, status: "Active", gpa: 3.5 },
  { id: "S-2403", name: "James Tan", course: "BS Engineering", year: 4, status: "Graduating", gpa: 3.9 },
  { id: "S-2404", name: "Alyssa Santos", course: "BA Business Admin", year: 1, status: "Active", gpa: 3.2 },
  { id: "S-2405", name: "Kevin Lim", course: "BS Computer Science", year: 3, status: "Probation", gpa: 2.1 },
  { id: "S-2406", name: "Maria Garcia", course: "BA Fine Arts", year: 2, status: "Active", gpa: 3.7 },
];

const MOCK_COURSES = [
  { code: "CS401", title: "Advanced Algorithms", dept: "Computer Science", credits: 3, slots: 40, enrolled: 38, instructor: "Dr. Reyes" },
  { code: "CS301", title: "Database Systems", dept: "Computer Science", credits: 3, slots: 45, enrolled: 45, instructor: "Prof. Santos" },
  { code: "IT201", title: "Web Development", dept: "IT", credits: 3, slots: 50, enrolled: 32, instructor: "Prof. Tan" },
  { code: "ENG301", title: "Structural Analysis", dept: "Engineering", credits: 4, slots: 35, enrolled: 30, instructor: "Dr. Cruz" },
  { code: "BA201", title: "Marketing Principles", dept: "Business", credits: 3, slots: 55, enrolled: 50, instructor: "Prof. Lim" },
];

const MOCK_ENROLLMENTS = [
  { id: "ENR-0981", student: "Marco Dela Cruz", course: "CS401", date: "2026-01-15", status: "Confirmed" },
  { id: "ENR-0982", student: "Sofia Reyes", course: "IT201", date: "2026-01-16", status: "Confirmed" },
  { id: "ENR-0983", student: "James Tan", course: "ENG301", date: "2026-01-17", status: "Pending" },
  { id: "ENR-0984", student: "Alyssa Santos", course: "BA201", date: "2026-01-18", status: "Confirmed" },
  { id: "ENR-0985", student: "Kevin Lim", course: "CS301", date: "2026-01-19", status: "Waitlisted" },
];

const BOT_RESPONSES = {
  "enrollment": "Current enrollment stands at 9,214 students across 142 active courses. The enrollment period runs until March 15, 2026.",
  "student": "There are 3,847 registered students. 87% are actively enrolled this semester.",
  "course": "142 courses are active this semester. CS301 Database Systems is currently full. CS401 has 2 slots remaining.",
  "schedule": "Enrollment period: Jan 15 – Mar 15, 2026. Add/Drop deadline: Feb 28, 2026.",
  "help": "I can help with: enrollment status, course availability, student queries, schedules, and reports. What do you need?",
  "default": "I can assist with enrollment queries, course information, and student records. Try asking about enrollments, courses, or schedules.",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0E1A;
    --surface: #111827;
    --surface2: #1A2236;
    --border: #1E2D45;
    --accent: #00D4AA;
    --accent2: #4F8EF7;
    --accent3: #FF6B6B;
    --accent4: #FFB347;
    --text: #E8EDF5;
    --text2: #8899B4;
    --text3: #4A5568;
    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;
    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --sidebar-w: 260px;
    --radius: 14px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-body); }

  /* ── LOGIN ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  .login-left {
    flex: 1;
    background: linear-gradient(135deg, #0D1B2A 0%, #1A2B4A 50%, #0D2436 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
    position: relative;
    overflow: hidden;
  }
  .login-left::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%);
    top: -150px; left: -150px;
    animation: pulse 6s ease-in-out infinite;
  }
  .login-left::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%);
    bottom: -100px; right: -100px;
    animation: pulse 8s ease-in-out infinite reverse;
  }
  @keyframes pulse { 0%,100% { transform: scale(1); opacity:0.6; } 50% { transform: scale(1.1); opacity:1; } }
  .login-logo-area { text-align: center; z-index: 1; }
  .login-logo-icon {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px;
    margin: 0 auto 24px;
    box-shadow: 0 0 40px rgba(0,212,170,0.3);
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .login-brand { font-family: var(--font-display); font-size: 36px; font-weight: 800; letter-spacing: -1px; color: #fff; }
  .login-brand span { color: var(--accent); }
  .login-tagline { color: var(--text2); font-size: 15px; margin-top: 10px; letter-spacing: 0.5px; }
  .login-stats {
    display: flex; gap: 40px; margin-top: 60px; z-index: 1;
  }
  .login-stat { text-align: center; }
  .login-stat-val { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--accent); }
  .login-stat-lbl { font-size: 12px; color: var(--text2); margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
  
  .login-right {
    width: 480px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px 50px;
    border-left: 1px solid var(--border);
  }
  .login-title { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .login-sub { color: var(--text2); font-size: 14px; margin-bottom: 36px; }
  
  .form-group { margin-bottom: 20px; }
  .form-label { font-size: 12px; font-weight: 500; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; }
  .form-input {
    width: 100%; padding: 14px 16px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    transition: all 0.2s; outline: none;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,170,0.1); }
  .form-input::placeholder { color: var(--text3); }
  
  .role-select {
    display: flex; gap: 10px; margin-bottom: 28px;
  }
  .role-btn {
    flex: 1; padding: 10px 8px; border-radius: 8px; border: 1px solid var(--border);
    background: transparent; color: var(--text2); font-family: var(--font-body); font-size: 13px;
    cursor: pointer; transition: all 0.2s; text-align: center;
  }
  .role-btn.active { background: rgba(0,212,170,0.1); border-color: var(--accent); color: var(--accent); }
  
  .btn-login {
    width: 100%; padding: 15px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, var(--accent), #00A888);
    color: #0A0E1A; font-family: var(--font-display); font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; letter-spacing: 0.5px;
  }
  .btn-login:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,212,170,0.3); }
  .btn-login:active { transform: translateY(0); }
  
  .login-hint { font-size: 12px; color: var(--text3); text-align: center; margin-top: 20px; }
  .login-hint b { color: var(--text2); }

  /* ── APP SHELL ── */
  .app-shell { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); height: 100vh;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0;
    flex-shrink: 0;
    position: relative;
    z-index: 100;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .sidebar-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .sidebar-logo-text { font-family: var(--font-display); font-size: 16px; font-weight: 700; }
  .sidebar-logo-text span { color: var(--accent); }
  
  .sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
  .nav-section-label {
    font-size: 10px; font-weight: 600; color: var(--text3);
    text-transform: uppercase; letter-spacing: 1.5px;
    padding: 8px 10px 6px; margin-top: 8px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 10px;
    cursor: pointer; transition: all 0.15s;
    font-size: 14px; color: var(--text2);
    margin-bottom: 2px;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active {
    background: rgba(0,212,170,0.1);
    color: var(--accent); border-color: rgba(0,212,170,0.2);
  }
  .nav-icon { font-size: 17px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--accent3);
    color: #fff; font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 20px;
  }
  
  .sidebar-bottom {
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    background: var(--surface2);
  }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 12px; font-weight: 700;
    color: #fff; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: var(--text2); }
  .logout-btn { background: none; border: none; cursor: pointer; color: var(--text3); font-size: 16px; transition: color 0.2s; padding: 4px; }
  .logout-btn:hover { color: var(--accent3); }

  /* ── MAIN CONTENT ── */
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; background: var(--bg); }
  
  .topbar {
    height: 64px; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
    background: rgba(10,14,26,0.8);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 50;
  }
  .topbar-title { font-family: var(--font-display); font-size: 18px; font-weight: 700; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .topbar-btn {
    width: 36px; height: 36px; border-radius: 9px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.15s; color: var(--text2);
  }
  .topbar-btn:hover { background: var(--surface2); color: var(--text); }
  .notif-dot { position: relative; }
  .notif-dot::after {
    content: ''; position: absolute; top: 4px; right: 4px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent3); border: 1.5px solid var(--bg);
  }

  .page { padding: 28px; flex: 1; }
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; }
  .page-sub { color: var(--text2); font-size: 14px; margin-top: 4px; }

  /* ── STAT CARDS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px;
    transition: all 0.2s; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }
  .stat-card:hover { transform: translateY(-2px); border-color: rgba(0,212,170,0.2); }
  .stat-icon { font-size: 28px; margin-bottom: 12px; }
  .stat-val { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 4px; }
  .stat-lbl { font-size: 13px; color: var(--text2); }
  .stat-change { font-size: 12px; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
  .stat-change.up { color: var(--success); }
  .stat-change.down { color: var(--danger); }

  /* ── CHARTS ── */
  .charts-row { display: grid; grid-template-columns: 1fr 380px; gap: 16px; margin-bottom: 24px; }
  .chart-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px;
  }
  .chart-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .chart-sub { font-size: 12px; color: var(--text2); margin-bottom: 20px; }
  
  /* BAR CHART */
  .bar-chart { display: flex; align-items: flex-end; gap: 10px; height: 160px; }
  .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
  .bar-stack { flex: 1; width: 100%; display: flex; flex-direction: column; justify-content: flex-end; gap: 2px; position: relative; }
  .bar-fill {
    width: 100%; border-radius: 4px 4px 0 0;
    transition: all 0.6s ease;
    cursor: pointer; position: relative;
  }
  .bar-fill:hover { filter: brightness(1.2); }
  .bar-lbl { font-size: 11px; color: var(--text3); white-space: nowrap; }
  .chart-legend { display: flex; gap: 20px; margin-top: 14px; }
  .legend-item { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text2); }
  .legend-dot { width: 10px; height: 10px; border-radius: 3px; }

  /* DONUT */
  .donut-wrap { display: flex; align-items: center; gap: 24px; }
  .donut-svg { flex-shrink: 0; }
  .donut-legend { flex: 1; }
  .donut-item { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; cursor: pointer; }
  .donut-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .donut-text { flex: 1; }
  .donut-name { font-size: 12px; color: var(--text); }
  .donut-val { font-size: 11px; color: var(--text2); }
  .donut-pct { font-size: 12px; font-weight: 600; margin-left: auto; }

  /* ── BOTTOM ROW ── */
  .bottom-row { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }

  /* ── WEATHER ── */
  .weather-card {
    background: linear-gradient(135deg, #0D1B3E 0%, #1A2B4A 100%);
    border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px;
  }
  .weather-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
  .weather-loc { font-family: var(--font-display); font-size: 14px; font-weight: 600; }
  .weather-date { font-size: 11px; color: var(--text2); margin-top: 2px; }
  .weather-badge { background: rgba(0,212,170,0.15); color: var(--accent); font-size: 10px; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(0,212,170,0.2); }
  .weather-main { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .weather-icon { font-size: 48px; }
  .weather-temp { font-family: var(--font-display); font-size: 44px; font-weight: 800; }
  .weather-desc { font-size: 13px; color: var(--text2); margin-top: 2px; text-transform: capitalize; }
  .weather-forecast { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
  .forecast-item {
    flex-shrink: 0; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 10px 12px; text-align: center; min-width: 70px;
  }
  .forecast-day { font-size: 10px; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; }
  .forecast-icon { font-size: 20px; margin: 4px 0; }
  .forecast-hi { font-size: 13px; font-weight: 600; }
  .forecast-rain { font-size: 10px; color: var(--accent2); margin-top: 2px; }

  /* ── RECENT ACTIVITY ── */
  .activity-list { }
  .activity-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid var(--border);
  }
  .activity-item:last-child { border-bottom: none; }
  .activity-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
  }
  .activity-text { flex: 1; font-size: 13px; color: var(--text2); line-height: 1.5; }
  .activity-text b { color: var(--text); font-weight: 500; }
  .activity-time { font-size: 11px; color: var(--text3); flex-shrink: 0; }

  /* ── TABLE ── */
  .table-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .table-header {
    padding: 18px 22px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border);
  }
  .table-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; }
  .table-actions { display: flex; gap: 10px; }
  .btn-sm {
    padding: 8px 16px; border-radius: 8px; border: 1px solid var(--border);
    background: transparent; color: var(--text2); font-family: var(--font-body); font-size: 13px;
    cursor: pointer; transition: all 0.15s;
  }
  .btn-sm:hover { background: var(--surface2); color: var(--text); }
  .btn-sm.primary { background: var(--accent); color: #0A0E1A; border-color: var(--accent); font-weight: 600; }
  .btn-sm.primary:hover { background: #00B891; }
  .search-input {
    padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 13px;
    outline: none; width: 220px; transition: all 0.2s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--text3); }
  
  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 12px 22px; text-align: left;
    font-size: 11px; font-weight: 600; color: var(--text3);
    text-transform: uppercase; letter-spacing: 1px;
    border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2);
  }
  tbody tr { transition: background 0.15s; cursor: pointer; }
  tbody tr:hover { background: var(--surface2); }
  tbody td { padding: 14px 22px; font-size: 13px; color: var(--text); border-bottom: 1px solid rgba(30,45,69,0.5); }
  tbody tr:last-child td { border-bottom: none; }
  
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-success { background: rgba(16,185,129,0.1); color: #10B981; }
  .badge-warning { background: rgba(245,158,11,0.1); color: #F59E0B; }
  .badge-danger { background: rgba(239,68,68,0.1); color: #EF4444; }
  .badge-info { background: rgba(79,142,247,0.1); color: #4F8EF7; }

  /* ── CHATBOT ── */
  .chat-fab {
    position: fixed; bottom: 28px; right: 28px;
    width: 54px; height: 54px; border-radius: 16px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none; cursor: pointer; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 32px rgba(0,212,170,0.4);
    transition: all 0.2s; z-index: 200;
  }
  .chat-fab:hover { transform: scale(1.08); }
  .chat-window {
    position: fixed; bottom: 94px; right: 28px;
    width: 360px; height: 480px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; display: flex; flex-direction: column;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    z-index: 200; overflow: hidden;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
  .chat-head {
    padding: 16px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
    background: linear-gradient(135deg, rgba(0,212,170,0.05), rgba(79,142,247,0.05));
  }
  .chat-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .chat-name { font-family: var(--font-display); font-size: 14px; font-weight: 600; }
  .chat-status { font-size: 11px; color: var(--success); display: flex; align-items: center; gap: 5px; }
  .chat-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--success); }
  .chat-close { margin-left: auto; background: none; border: none; cursor: pointer; color: var(--text2); font-size: 18px; transition: color 0.15s; }
  .chat-close:hover { color: var(--text); }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .chat-msg { max-width: 82%; }
  .chat-msg.bot { align-self: flex-start; }
  .chat-msg.user { align-self: flex-end; }
  .chat-bubble {
    padding: 11px 14px; border-radius: 14px; font-size: 13px; line-height: 1.5;
  }
  .chat-msg.bot .chat-bubble {
    background: var(--surface2); color: var(--text);
    border-radius: 4px 14px 14px 14px;
  }
  .chat-msg.user .chat-bubble {
    background: linear-gradient(135deg, var(--accent), #00B891); color: #0A0E1A; font-weight: 500;
    border-radius: 14px 14px 4px 14px;
  }
  .chat-time { font-size: 10px; color: var(--text3); margin-top: 4px; text-align: right; }
  .chat-suggestions { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
  .chat-suggest {
    padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border);
    background: transparent; color: var(--text2); font-size: 12px; cursor: pointer; transition: all 0.15s;
    font-family: var(--font-body);
  }
  .chat-suggest:hover { background: var(--surface2); color: var(--text); border-color: var(--accent); }
  .chat-input-area {
    padding: 12px 16px; border-top: 1px solid var(--border);
    display: flex; gap: 10px;
  }
  .chat-input {
    flex: 1; padding: 10px 14px; border-radius: 10px;
    background: var(--bg); border: 1px solid var(--border);
    color: var(--text); font-family: var(--font-body); font-size: 13px; outline: none;
    transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: var(--accent); }
  .chat-send {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--accent); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 16px;
    transition: all 0.15s; color: #0A0E1A;
  }
  .chat-send:hover { background: #00B891; transform: scale(1.05); }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

  /* RESPONSIVE */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-row { grid-template-columns: 1fr; }
    .bottom-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .login-left { display: none; }
    .login-right { width: 100%; }
    :root { --sidebar-w: 60px; }
    .sidebar-logo-text, .nav-item span:not(.nav-icon), .nav-badge, .nav-section-label, .user-info { display: none; }
    .sidebar-logo { justify-content: center; }
    .nav-item { justify-content: center; padding: 10px; }
    .user-card { justify-content: center; }
    .chat-window { right: 10px; bottom: 80px; width: calc(100vw - 20px); }
  }
`;

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

// Bar Chart
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.enrolled));
  return (
    <div>
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bar-col">
            <div className="bar-stack">
              <div className="bar-fill" style={{ height: `${(d.enrolled / max) * 130}px`, background: 'linear-gradient(180deg, #4F8EF7, #2563EB)', animationDelay: `${i * 0.08}s` }} title={`Enrolled: ${d.enrolled}`} />
              <div className="bar-fill" style={{ height: `${(d.dropped / max) * 130}px`, background: 'linear-gradient(180deg, #FF6B6B, #DC2626)' }} title={`Dropped: ${d.dropped}`} />
            </div>
            <div className="bar-lbl">{d.month}</div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: '#4F8EF7' }} /><span>Enrolled</span></div>
        <div className="legend-item"><div className="legend-dot" style={{ background: '#FF6B6B' }} /><span>Dropped</span></div>
      </div>
    </div>
  );
}

// Donut Chart
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.students, 0);
  let offset = 0;
  const r = 60, cx = 70, cy = 70, circ = 2 * Math.PI * r;
  const segments = data.map(d => {
    const pct = d.students / total;
    const dash = pct * circ;
    const seg = { ...d, dash, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <div className="donut-wrap">
      <svg width="140" height="140" className="donut-svg">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1E2D45" strokeWidth="20" />
        {segments.map((s, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="20"
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={-s.offset + circ / 4}
            style={{ transition: 'all 0.5s ease', cursor: 'pointer' }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#E8EDF5" fontSize="18" fontFamily="Syne" fontWeight="800">{(total / 1000).toFixed(1)}k</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#8899B4" fontSize="10">Students</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="donut-item">
            <div className="donut-dot" style={{ background: d.color }} />
            <div className="donut-text">
              <div className="donut-name">{d.dept}</div>
              <div className="donut-val">{d.students.toLocaleString()}</div>
            </div>
            <div className="donut-pct" style={{ color: d.color }}>{Math.round(d.students / total * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Weather Card
function WeatherCard() {
  const weatherData = {
    location: "Davao City, PH",
    temp: 78,
    condition: "Light Rain",
    icon: "🌧️",
    forecast: [
      { day: "Thu", icon: "🌧️", hi: 78, rain: 57 },
      { day: "Fri", icon: "🌧️", hi: 79, rain: 65 },
      { day: "Sat", icon: "⛈️", hi: 84, rain: 85 },
      { day: "Sun", icon: "🌧️", hi: 82, rain: 95 },
      { day: "Mon", icon: "🌦️", hi: 81, rain: 45 },
    ]
  };
  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <div className="weather-loc">📍 {weatherData.location}</div>
          <div className="weather-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
        <div className="weather-badge">LIVE</div>
      </div>
      <div className="weather-main">
        <div className="weather-icon">{weatherData.icon}</div>
        <div>
          <div className="weather-temp">{weatherData.temp}°F</div>
          <div className="weather-desc">{weatherData.condition}</div>
        </div>
      </div>
      <div className="weather-forecast">
        {weatherData.forecast.map((f, i) => (
          <div key={i} className="forecast-item">
            <div className="forecast-day">{f.day}</div>
            <div className="forecast-icon">{f.icon}</div>
            <div className="forecast-hi">{f.hi}°</div>
            <div className="forecast-rain">💧{f.rain}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chatbot
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I\'m Enrol-AI, your enrollment assistant. How can I help you today?', time: 'just now' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const suggestions = ['enrollment status', 'available courses', 'schedule', 'help'];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text, time: 'just now' };
    const lower = text.toLowerCase();
    const key = Object.keys(BOT_RESPONSES).find(k => lower.includes(k)) || 'default';
    const botMsg = { role: 'bot', text: BOT_RESPONSES[key], time: 'just now' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '🤖'}
      </button>
      {open && (
        <div className="chat-window">
          <div className="chat-head">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-name">Enrol-AI</div>
              <div className="chat-status">Online</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-bubble">{m.text}</div>
                <div className="chat-time">{m.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="chat-suggest" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
          <div className="chat-input-area">
            <input className="chat-input" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about enrollments..." />
            <button className="chat-send" onClick={() => sendMessage(input)}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

// Badge
function Badge({ status }) {
  const map = {
    'Active': 'badge-success', 'Confirmed': 'badge-success', 'Graduating': 'badge-info',
    'Pending': 'badge-warning', 'Waitlisted': 'badge-warning',
    'Probation': 'badge-danger', 'Dropped': 'badge-danger', 'Full': 'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-info'}`}>{status}</span>;
}

// ─── PAGES ──────────────────────────────────────────────────────────────────

function Dashboard() {
  const activities = [
    { text: <><b>Marco Dela Cruz</b> enrolled in CS401 Advanced Algorithms</>, time: '2m ago', color: '#6EE7B7' },
    { text: <><b>Sofia Reyes</b> dropped IT304 Mobile Development</>, time: '15m ago', color: '#FCA5A5' },
    { text: <><b>CS301 Database Systems</b> reached maximum capacity</>, time: '1h ago', color: '#FCD34D' },
    { text: <><b>5 new students</b> completed registration</>, time: '2h ago', color: '#93C5FD' },
    { text: <><b>Grade submissions</b> deadline reminder sent</>, time: '4h ago', color: '#C4B5FD' },
  ];
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Dashboard Overview</div>
        <div className="page-sub">Academic Year 2025–2026 · Second Semester</div>
      </div>
      <div className="stats-grid">
        {MOCK_STATS.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className={`stat-change ${s.change > 0 ? 'up' : 'down'}`}>
              {s.change > 0 ? '▲' : '▼'} {Math.abs(s.change)}% from last semester
            </div>
          </div>
        ))}
      </div>
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Enrollment Trend</div>
          <div className="chart-sub">Monthly enrollment vs. drop rates — 2025/2026</div>
          <BarChart data={ENROLLMENT_TREND} />
        </div>
        <div className="chart-card">
          <div className="chart-title">Students by Department</div>
          <div className="chart-sub">Distribution across colleges</div>
          <DonutChart data={DEPT_DATA} />
        </div>
      </div>
      <div className="bottom-row">
        <div className="chart-card">
          <div className="chart-title">Recent Activity</div>
          <div className="chart-sub">Live feed of enrollment events</div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: a.color }} />
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
        <WeatherCard />
      </div>
    </div>
  );
}

function StudentsPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Students</div>
        <div className="page-sub">Manage student records and enrollment status</div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">All Students <span style={{ color: 'var(--text2)', fontWeight: 400, fontSize: 13 }}>({filtered.length})</span></div>
          <div className="table-actions">
            <input className="search-input" placeholder="🔍 Search students..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn-sm primary">+ Add Student</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th>Status</th><th>GPA</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.id}</td>
                <td>{s.name}</td>
                <td style={{ color: 'var(--text2)' }}>{s.course}</td>
                <td>Year {s.year}</td>
                <td><Badge status={s.status} /></td>
                <td style={{ color: s.gpa >= 3.5 ? 'var(--success)' : s.gpa >= 2.5 ? 'var(--text)' : 'var(--danger)', fontWeight: 600 }}>{s.gpa}</td>
                <td><button className="btn-sm">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CoursesPage() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Courses</div>
        <div className="page-sub">Course catalog and capacity management</div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Course Catalog</div>
          <div className="table-actions">
            <input className="search-input" placeholder="🔍 Search courses..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn-sm primary">+ Add Course</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Code</th><th>Title</th><th>Department</th><th>Credits</th><th>Capacity</th><th>Instructor</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const pct = Math.round(c.enrolled / c.slots * 100);
              const status = c.enrolled >= c.slots ? 'Full' : c.enrolled >= c.slots * 0.9 ? 'Closing' : 'Open';
              return (
                <tr key={i}>
                  <td style={{ color: 'var(--accent2)', fontWeight: 600 }}>{c.code}</td>
                  <td>{c.title}</td>
                  <td style={{ color: 'var(--text2)' }}>{c.dept}</td>
                  <td>{c.credits} units</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? 'var(--danger)' : pct >= 90 ? 'var(--warning)' : 'var(--accent)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{c.enrolled}/{c.slots}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)' }}>{c.instructor}</td>
                  <td><Badge status={status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EnrollmentsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Enrollments</div>
        <div className="page-sub">Track and manage all enrollment transactions</div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Enrollment Records</div>
          <div className="table-actions">
            <button className="btn-sm">Export CSV</button>
            <button className="btn-sm primary">+ New Enrollment</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Enrollment ID</th><th>Student</th><th>Course</th><th>Date Filed</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {MOCK_ENROLLMENTS.map((e, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--accent)', fontWeight: 600 }}>{e.id}</td>
                <td>{e.student}</td>
                <td style={{ color: 'var(--accent2)' }}>{e.course}</td>
                <td style={{ color: 'var(--text2)' }}>{e.date}</td>
                <td><Badge status={e.status} /></td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-sm">View</button>
                  <button className="btn-sm" style={{ color: 'var(--danger)' }}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportsPage() {
  const reports = [
    { title: "Semester Enrollment Summary", desc: "Complete breakdown of enrollments per department", icon: "📊", date: "Feb 15, 2026" },
    { title: "Grade Distribution Report", desc: "GPA analysis and academic performance metrics", icon: "📈", date: "Feb 10, 2026" },
    { title: "Course Load Analysis", desc: "Course capacity utilization and demand forecast", icon: "📉", date: "Feb 5, 2026" },
    { title: "Student Retention Report", desc: "Drop rate analysis and at-risk student flags", icon: "🎯", date: "Jan 30, 2026" },
  ];
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Reports</div>
        <div className="page-sub">Analytics and institutional reporting</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {reports.map((r, i) => (
          <div key={i} className="chart-card" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,170,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 32 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{r.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 14 }}>{r.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--text3)' }}>Last updated: {r.date}</span>
                  <button className="btn-sm primary">Generate</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-sub">System configuration and preferences</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        <div className="chart-card" style={{ height: 'fit-content' }}>
          {['General', 'Academic Calendar', 'User Management', 'API Configuration', 'Notifications', 'Security'].map((s, i) => (
            <div key={i} className={`nav-item ${i === 0 ? 'active' : ''}`} style={{ marginBottom: 0 }}>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="chart-card">
          <div className="chart-title" style={{ marginBottom: 20 }}>General Settings</div>
          {[
            { label: 'Institution Name', value: 'Integrative University' },
            { label: 'Current Semester', value: '2nd Semester 2025–2026' },
            { label: 'Enrollment Period', value: 'Jan 15 – Mar 15, 2026' },
            { label: 'API Base URL', value: 'https://api.enrollsys.edu.ph/v1' },
          ].map((f, i) => (
            <div key={i} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="form-input" defaultValue={f.value} />
            </div>
          ))}
          <button className="btn-sm primary" style={{ marginTop: 8 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR NAV ────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⬛' },
  { id: 'students', label: 'Students', icon: '👥', badge: '3847' },
  { id: 'courses', label: 'Courses', icon: '📚' },
  { id: 'enrollments', label: 'Enrollments', icon: '📋', badge: '3' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('login');
  const [page, setPage] = useState('dashboard');
  const [loginData, setLoginData] = useState({ email: '', password: '', role: 'admin' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      setLoginError('Please enter your credentials.');
      return;
    }
    setLoginError('');
    setView('app');
  };

  const pageMap = {
    dashboard: <Dashboard />,
    students: <StudentsPage />,
    courses: <CoursesPage />,
    enrollments: <EnrollmentsPage />,
    reports: <ReportsPage />,
    settings: <SettingsPage />,
  };

  const pageTitle = NAV.find(n => n.id === page)?.label || 'Dashboard';

  return (
    <>
      <style>{styles}</style>

      {view === 'login' && (
        <div className="login-wrap">
          <div className="login-left">
            <div className="login-logo-area">
              <div className="login-logo-icon">🎓</div>
              <div className="login-brand">Enrol<span>Sys</span></div>
              <div className="login-tagline"> Enrollment System</div>
            </div>
            <div className="login-stats">
              {MOCK_STATS.map((s, i) => (
                <div key={i} className="login-stat">
                  <div className="login-stat-val">{typeof s.value === 'number' ? (s.value > 999 ? (s.value/1000).toFixed(1)+'k' : s.value) : s.value}</div>
                  <div className="login-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="login-right">
            <div className="login-title">Welcome back</div>
            <div className="login-sub">Sign in to your  account</div>
            <div className="role-select">
              {['admin', 'registrar', 'faculty', 'student'].map(r => (
                <button key={r} className={`role-btn ${loginData.role === r ? 'active' : ''}`}
                  onClick={() => setLoginData(d => ({ ...d, role: r }))}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="admin@enrollsys.edu.ph"
                value={loginData.email} onChange={e => setLoginData(d => ({ ...d, email: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={loginData.password} onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            {loginError && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 14 }}>{loginError}</div>}
            <button className="btn-login" onClick={handleLogin}>Sign In to Dashboard →</button>
            <div className="login-hint">Demo: use <b>any email</b> and <b>any password</b> to proceed</div>
          </div>
        </div>
      )}

      {view === 'app' && (
        <div className="app-shell">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">🎓</div>
              <div className="sidebar-logo-text">ENROLLMENT<span>KUNO</span></div>
            </div>
            <nav className="sidebar-nav">
              <div className="nav-section-label">Main Menu</div>
              {NAV.slice(0, 4).map(n => (
                <div key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
                  <span className="nav-icon">{n.icon}</span>
                  <span>{n.label}</span>
                  {n.badge && page !== n.id && <span className="nav-badge">{n.badge}</span>}
                </div>
              ))}
              <div className="nav-section-label">Analytics</div>
              {NAV.slice(4).map(n => (
                <div key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
                  <span className="nav-icon">{n.icon}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="user-card">
                <div className="user-avatar">{MOCK_USER.avatar}</div>
                <div className="user-info">
                  <div className="user-name">{MOCK_USER.name}</div>
                  <div className="user-role">{MOCK_USER.role}</div>
                </div>
                <button className="logout-btn" onClick={() => setView('login')}>⏻</button>
              </div>
            </div>
          </aside>

          <main className="main">
            <div className="topbar">
              <div className="topbar-title">{pageTitle}</div>
              <div className="topbar-right">
                <button className="topbar-btn notif-dot">🔔</button>
                <button className="topbar-btn">🔍</button>
                <div className="user-avatar" style={{ width: 34, height: 34, borderRadius: 10, cursor: 'pointer' }}>
                  {MOCK_USER.avatar}
                </div>
              </div>
            </div>
            {pageMap[page]}
          </main>

          <Chatbot />
        </div>
      )}
    </>
  );
}