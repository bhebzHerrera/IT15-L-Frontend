# IT15-L Enrollment System (Frontend)

React + Vite frontend for the Enrollment System dashboard and management pages.

## Project Overview

This frontend includes:

- Secure login flow with protected routes
- Dashboard charts and analytics cards
- Student, Course, and Enrollment pages
- Recent Activity management UI
- Weather widget integration
- Mobile-responsive layout and navigation

## Tech Stack

- React 19
- React Router
- Axios
- Recharts
- Bootstrap
- Vite

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm 9+
- Running Laravel backend API

## Frontend Setup

Run these commands from this folder (`HERRERA-react-app`):

```bash
npm install
cp .env.example .env
npm run dev
```

App runs at:

```text
http://localhost:5173
```

## Environment Configuration

Required `.env` values:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_REAL_AUTH=true
VITE_USE_MOCK_DATA=false
VITE_MOCK_LOGIN_EMAIL=admin@example.com
VITE_MOCK_LOGIN_PASSWORD=admin12345
```

Notes:

- `VITE_API_BASE_URL` must point to your backend API.
- Use `VITE_USE_REAL_AUTH=true` to authenticate against Laravel.

## Backend Setup Reference

From backend folder (`IT15-L-Backend`):

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Default Test Credentials

- Email: `admin@example.com`
- Password: `admin12345`

## Build for Production

```bash
npm run build
npm run preview
```
