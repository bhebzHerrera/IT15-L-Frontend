# IT15-L Enrollment System Frontend

Frontend dashboard and management interface built with React and Vite.

## Features

- Authentication flow (login, session restore, logout)
- Dashboard analytics and chart widgets
- Student, course, subject, program, and enrollment pages
- Reports and settings screens
- Responsive layout with reusable UI components

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Recharts
- Bootstrap

## Prerequisites

- Node.js 18 or newer (Node.js 20+ recommended)
- npm 9 or newer



## Frontend Setup (This Repository)

In this repository, the frontend folder is named `HERRERA-react-app` and uses Vite:

```bash
cd HERRERA-react-app
npm install
copy .env.example .env
npm run dev
```

Open the app at:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file from `.env.example` and set values that match your API environment.

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Yes | Base URL of your backend API | `http://127.0.0.1:8000/api` |
| `VITE_USE_REAL_AUTH` | Yes | Use real backend authentication when `true` | `true` |
| `VITE_USE_MOCK_DATA` | Yes | Use mocked frontend data when `true` | `false` |
| `VITE_MOCK_LOGIN_EMAIL` | No | Mock login email when mock mode is enabled | `admin@example.com` |
| `VITE_MOCK_LOGIN_PASSWORD` | No | Mock login password when mock mode is enabled | `admin12345` |

## Available Scripts

- `npm run dev`: Start local development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## Troubleshooting

- If the app cannot connect to the API, verify `VITE_API_BASE_URL` in `.env`.
- If port `5173` is busy, Vite will use another port shown in terminal output.
- If dependencies fail to install, remove `node_modules` and run `npm install` again.

## Production Build

```bash
npm run build
npm run preview
```
