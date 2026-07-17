# DeskFlow

An internal IT service request portal built as a 5-day sprint project for CAPACITI. Employees submit IT tickets and track their status; Admins triage the full queue and update ticket status in real time.

## Live Demo

- **App:** https://deskflow-frontend-s14c.onrender.com
- **API:** https://deskflow-backend-0xbz.onrender.com

**Test accounts** (or use the "Quick test access" buttons on the login screen):

| Role | Email | Password |
|---|---|---|
| Employee | emp1@deskflow.com | emp1234 |
| Admin | admin@deskflow.com | admin1234 |

> Note: the backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30–60 seconds to respond while the server wakes up.

## Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL (hosted on Supabase)
- Prisma ORM, connected via the `@prisma/adapter-pg` driver adapter
- bcryptjs for password hashing
- CORS configured per-environment via `FRONTEND_URL`

**Frontend**
- React (Vite)
- React Router for client-side routing
- Axios for API calls, centralized through a single configurable client
- lucide-react for icons
- Custom design system (DM Sans / DM Mono, warm light theme) — no CSS framework

**Deployment**
- Backend: Render Web Service
- Frontend: Render Static Site

**API Testing**
- Postman collection included: `deskflow.postman_collection.json`

## Features

- **Role-based authentication** — Employee and Admin accounts, passwords hashed with bcrypt, mock token issued on login
- **Ticket creation** — title, description, and priority (Low/Medium/High), validated on both ends
- **Role-based ticket visibility** — Employees see only their own tickets; Admins see every ticket in the system
- **Status updates** — Admins move tickets through Open → In Progress → Resolved via one-click status controls (no dropdown)
- **Live tracking** — both dashboards poll the API every 5 seconds, so changes made in one session (e.g. an Admin updating a status) appear in another (e.g. the Employee's view) without a manual refresh; tickets also show live "time ago" timestamps
- **Centralized error handling** — consistent JSON error responses, a 404 handler for unknown routes, and a top-level error handler as a safety net behind each controller's own validation

## Project Structure

```
TIQ/
├── backend/
│   ├── src/
│   │   ├── config/       # Prisma client setup
│   │   ├── controllers/  # Route handler logic
│   │   ├── routes/       # Express route definitions
│   │   └── server.js
│   └── prisma/
│       ├── schema.prisma # User & Ticket models
│       └── seed.js       # Seeds the two test accounts
├── frontend/
│   └── src/
│       ├── pages/        # Login, EmployeeDashboard, AdminDashboard
│       ├── components/   # Navbar, Badge (shared across pages)
│       └── lib/          # Shared API client, formatting helpers
└── deskflow.postman_collection.json
```

## Running Locally

**Backend**
```bash
cd backend
npm install
npx prisma generate
npx nodemon src/server.js
```
Requires a `.env` file with `DATABASE_URL`, `PORT`, and `JWT_SECRET` (see `.env.example` conventions — not committed, since it holds secrets).

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Requires a `.env` file with `VITE_API_URL` pointing at the backend (defaults to `http://localhost:5000`).

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Authenticates a user, returns role and mock token |
| POST | `/api/tickets` | Employee | Creates a new ticket |
| GET | `/api/tickets` | Employee / Admin | Lists tickets — own only for Employees, all for Admins |
| PUT | `/api/tickets/:id` | Admin | Updates a ticket's status |

Full request/response examples are in `deskflow.postman_collection.json`.

## Build Process

Built over a 5-day sprint:

1. **Day 1 — Architecture:** Backend scaffolded, database schema designed, connected to PostgreSQL via Prisma.
2. **Day 2 — Business Logic:** Auth, ticket CRUD, and role-based filtering implemented and tested via Postman.
3. **Day 3 — Frontend Core:** React app bootstrapped, routing and page layout established.
4. **Day 4 — Integration:** Frontend connected to the live API; dashboards built out with real data and live polling.
5. **Day 5 — Polish & Deployment:** Centralized error handling added, API config made environment-aware, both services deployed to Render.
