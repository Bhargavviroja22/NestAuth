# AuthMongo — Full-Stack Authentication System

> Production-ready authentication system built with **NestJS** (backend) and **Next.js 15** (frontend), backed by **MongoDB** via Prisma ORM. Uses **npm workspaces** for a single shared `node_modules`.

---

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Backend    | NestJS 10, Prisma 5, Passport.js, JWT, bcrypt, Nodemailer        |
| Frontend   | Next.js 15 (App Router + Turbopack), React 19, Zustand, Tailwind CSS 4 |
| Database   | MongoDB (Atlas or local)                                          |
| Language   | TypeScript 5                                                      |
| Monorepo   | npm workspaces                                                    |

## Features

- **JWT Authentication** — Access token (15 min) + Refresh token (7 days) rotation
- **Role-Based Access Control** — `USER`, `ADMIN`, `MODERATOR` roles with route guards
- **Email Verification** — Nodemailer with Gmail App Passwords (or any SMTP)
- **Security Hardened** — Helmet, CORS, rate-limiting, bcrypt password hashing, constant-time comparison
- **Explicit Password Hashing** — bcrypt hashing in the auth service on register
- **Token Refresh** — Silent token rotation with reuse detection
- **Responsive UI** — Tailwind CSS with form validation (react-hook-form + Zod)
- **npm Workspaces** — Single `node_modules` at root, shared across backend & frontend

---

## Project Structure

```
authmongo/
├── package.json               # Root workspace config
├── node_modules/              # Single shared node_modules
├── backend/                   # NestJS API server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   │   ├── decorators/    # @CurrentUser, @Roles
│   │   │   ├── dto/           # Request validation DTOs
│   │   │   ├── guards/        # JWT & role guards
│   │   │   └── strategies/    # Passport JWT strategies
│   │   ├── common/            # Shared filters & middleware
│   │   ├── config/            # Typed app configuration (registerAs)
│   │   ├── mail/              # Nodemailer email service
│   │   ├── prisma/            # Prisma client module
│   │   └── users/             # User CRUD module
│   └── .env.example
│
├── frontend/                  # Next.js 15 App Router
│   ├── src/
│   │   ├── app/               # Route pages (App Router)
│   │   ├── components/        # Reusable UI + layout + auth guards
│   │   ├── hooks/             # Custom React hooks (useAuth, useCurrentUser)
│   │   ├── lib/               # Axios instance, API client, cn() utility
│   │   ├── store/             # Zustand auth store (persisted)
│   │   └── types/             # TypeScript interfaces
│   └── .env.example
│
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB** — Atlas cluster or local instance

### 1. Clone & Install

```bash
git clone <repo-url> authmongo
cd authmongo
npm install          # installs all deps for both backend & frontend
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# → Fill in DATABASE_URL, JWT secrets, SMTP credentials

# Frontend
cp frontend/.env.example frontend/.env.local
# → Adjust API URL if needed (default: http://localhost:4000/api/v1)
```

### 3. Push Database Schema

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (http://localhost:4000)
npm run dev:backend

# Terminal 2 — Frontend (http://localhost:3000)
npm run dev:frontend
```

Or from inside each directory:

```bash
# Backend
cd backend && npm run start:dev

# Frontend
cd frontend && npm run dev
```

---

## Available Scripts (from root)

| Script               | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm install`        | Install all deps for both workspaces             |
| `npm run dev:backend`| Start backend in watch mode (port 4000)          |
| `npm run dev:frontend`| Start frontend dev server with Turbopack (port 3000) |
| `npm run build:backend`| Build backend                                  |
| `npm run build:frontend`| Build frontend                                |
| `npm run start:backend`| Start backend in production mode               |
| `npm run start:frontend`| Start frontend in production mode              |
| `npm run prisma:generate`| Generate Prisma client                        |
| `npm run prisma:push`| Push Prisma schema to MongoDB                    |

---

## API Endpoints

| Method | Endpoint                          | Auth     | Description                |
| ------ | --------------------------------- | -------- | -------------------------- |
| POST   | `/api/v1/auth/register`           | Public   | Register new user          |
| POST   | `/api/v1/auth/login`              | Public   | Login & receive tokens     |
| POST   | `/api/v1/auth/refresh`            | Refresh  | Rotate token pair          |
| POST   | `/api/v1/auth/logout`             | JWT      | Invalidate refresh token   |
| GET    | `/api/v1/auth/verify-email`       | Public   | Verify email with token    |
| POST   | `/api/v1/auth/resend-verification`| Public   | Resend verification email  |
| GET    | `/api/v1/users/me`                | JWT      | Get current user profile   |
| GET    | `/api/v1/users`                   | Admin    | List all users             |
| GET    | `/api/v1/users/dashboard`         | Mod+     | Moderator dashboard        |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable             | Description                      | Example                          |
| -------------------- | -------------------------------- | -------------------------------- |
| `DATABASE_URL`       | MongoDB connection string        | `mongodb+srv://...`              |
| `JWT_ACCESS_SECRET`  | Access token signing secret      | (min 32 chars)                   |
| `JWT_REFRESH_SECRET` | Refresh token signing secret     | (min 32 chars)                   |
| `MAIL_HOST`          | SMTP host                        | `smtp.gmail.com`                 |
| `MAIL_PORT`          | SMTP port                        | `587`                            |
| `MAIL_USER`          | SMTP username / email            | `you@gmail.com`                  |
| `MAIL_PASS`          | SMTP password / app password     | (Gmail App Password)             |
| `MAIL_FROM`          | Default sender address           | `you@gmail.com`                  |
| `CLIENT_URL`         | Frontend origin (CORS + emails)  | `http://localhost:3000`          |
| `PORT`               | Server listen port               | `4000`                           |

### Frontend (`frontend/.env.local`)

| Variable              | Description          | Default                             |
| --------------------- | -------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000/api/v1`      |

---

## License

MIT
