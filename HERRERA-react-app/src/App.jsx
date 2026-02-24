import { useState, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";
import ProgramList from "./components/ProgramList";
import SubjectList from "./components/SubjectList";

// Simple mock user for the sidebar
const MOCK_USER = {
  name: "University of Mindanao Tagum College",
  role: "Academic Programs Office",
  avatar: "UM",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Base layout colors with a calm dark background */
    --bg: #121212;           /* Rich Black – main background */
    --surface: #262626;      /* Dark Grey – cards and panels */
    --surface2: #1a1a1a;     /* Slightly darker panel variation */
    --border: #333333;       /* Dark Grey – dividers and borders */

    /* Maroon accent for UM Tagum branding */
    --accent: #800000;       /* Deep maroon – main accent / CTA */
    --accent2: #A83232;      /* Softer maroon for hovers / subtle accents */

    /* Supporting accents for status badges */
    --accent3: #FF6B6B;
    --accent4: #FFB347;

    /* Text colors */
    --text: #FFFFFF;         /* Pure White – primary text */
    --text2: #B0B0B0;        /* Light Grey – secondary text */
    --text3: #888888;        /* Muted grey – helper text */

    --success: #10B981;
    --warning: #F59E0B;
    --danger: #EF4444;

    --font-display: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --sidebar-w: 260px;
    --radius: 14px;
    --shadow: 0 4px 16px rgba(0,0,0,0.45);
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
  .role-btn.active { background: rgba(128,0,0,0.15); border-color: var(--accent); color: var(--accent); }
  
  .btn-login {
    width: 100%; padding: 15px; border-radius: 10px; border: none;
    background: var(--accent);
    color: #121212; font-family: var(--font-display); font-size: 15px; font-weight: 700;
    cursor: pointer; transition: background 0.15s; letter-spacing: 0.5px;
  }
  .btn-login:hover { background: var(--accent2); box-shadow: none; transform: none; }
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
    background: var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    color: #121212;
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
    background: var(--accent);
  }
  .stat-card:hover { transform: translateY(-2px); border-color: rgba(128,0,0,0.4); }
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

// Simple nav setup for the three main pages in this class task
const NAV = [
  { id: "dashboard", label: "UMTC Dashboard", icon: "📊" },
  { id: "programs", label: "Program Offerings", icon: "🎓" },
  { id: "subjects", label: "Subject Offerings", icon: "📚" },
];

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Simple state to track which main page is currently active
  const [page, setPage] = useState("dashboard");

  // Map of page id to the corresponding React component
  const pageMap = {
    dashboard: <Dashboard />,
    programs: <ProgramList />,
    subjects: <SubjectList />,
  };

  const pageTitle = NAV.find((n) => n.id === page)?.label || "Dashboard";

  return (
    <>
      {/* Inject global styles used by all pages */}
      <style>{styles}</style>

      <div className="app-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🎓</div>
            <div className="sidebar-logo-text">
              UM<span>TAGUM PORTAL</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {NAV.map((n) => (
              <div
                key={n.id}
                className={`nav-item ${page === n.id ? "active" : ""}`}
                onClick={() => setPage(n.id)}
              >
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
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div className="topbar-title">{pageTitle}</div>
            <div className="topbar-right">
              <button className="topbar-btn">🔍</button>
            </div>
          </div>
          {pageMap[page]}
        </main>
      </div>
    </>
  );
}