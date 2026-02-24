<div align="center">

# 🔐 NestAuth

**Production-ready full-stack authentication — NestJS · Next.js 15 · MongoDB**

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## What is NestAuth?

NestAuth is a plug-and-play authentication starter built with **NestJS** (backend) and **Next.js 15 App Router** (frontend), backed by **MongoDB** via Prisma ORM. It uses **npm workspaces** so both apps share a single `node_modules` at the root.

> Clone it. Configure it. Ship it.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔑 JWT Auth | Access token (15 min) + Refresh token (7 days) |
| 🔁 Token Rotation | Silent refresh with reuse detection |
| 👥 RBAC | `USER`, `MODERATOR`, `ADMIN` roles with route guards |
| 📧 Email Verification | Nodemailer with Gmail App Passwords or any SMTP |
| 🔐 Password Hashing | bcrypt with constant-time comparison |
| 🛡️ Security | Helmet, CORS, rate limiting, input whitelisting |
| 🎨 Responsive UI | Tailwind CSS 4 + React Hook Form + Zod validation |
| 📦 Monorepo | npm workspaces — one `node_modules` for both apps |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 10, Prisma 5, Passport.js, JWT, bcrypt, Nodemailer |
| Frontend | Next.js 15 (App Router + Turbopack), React 19, Zustand, Tailwind CSS 4 |
| Database | MongoDB (Atlas or local) |
| Language | TypeScript 5 |
| Monorepo | npm workspaces |

---

## 📁 Project Structure

```
nestauth/
├── package.json                  # Root workspace config
├── node_modules/                 # Shared across both apps
│
├── backend/                      # NestJS API (port 4000)
│   ├── prisma/schema.prisma      # MongoDB User model + Role enum
│   └── src/
│       ├── auth/                 # Register, Login, Refresh, Logout, Verify
│       ├── users/                # Protected user routes
│       ├── mail/                 # Email verification service
│       ├── prisma/               # Prisma client module
│       ├── config/               # Typed app configuration
│       └── common/               # Exception filter, logger middleware
│
└── frontend/                     # Next.js 15 App Router (port 3000)
    └── src/
        ├── app/                  # Route pages
        ├── components/           # UI, layout, auth guards
        ├── hooks/                # useAuth, useCurrentUser
        ├── lib/                  # Axios instance, API client
        ├── store/                # Zustand auth store (persisted)
        └── types/                # TypeScript interfaces
```

---

## 🚀 Getting Started

### Requirements
- Node.js ≥ 18
- npm ≥ 9
- MongoDB — Atlas cluster or local instance

---

### 1. Clone & Install

```bash
git clone <repo-url> authmongo
cd authmongo
npm install        # installs deps for both backend & frontend
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 3. Push Database Schema

```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Start Dev Servers

```bash
# Terminal 1 — Backend
npm run dev:backend       # → http://localhost:4000

# Terminal 2 — Frontend
npm run dev:frontend      # → http://localhost:3000
```

---

## 🔧 Environment Variables

### `backend/.env`

```env
DATABASE_URL="mongodb+srv://<user>:<pass>@cluster.mongodb.net/nestauth"

JWT_ACCESS_SECRET="min-32-char-secret"
JWT_REFRESH_SECRET="min-32-char-secret"

MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="you@gmail.com"
MAIL_PASS="your-gmail-app-password"
MAIL_FROM="you@gmail.com"

CLIENT_URL="http://localhost:3000"
PORT=4000
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## 📡 API Endpoints

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login, get tokens |
| `POST` | `/api/v1/auth/refresh` | Refresh Token | Rotate token pair |
| `POST` | `/api/v1/auth/logout` | JWT | Invalidate refresh token |
| `GET` | `/api/v1/auth/verify-email?token=` | Public | Verify email |
| `POST` | `/api/v1/auth/resend-verification` | Public | Resend verify email |

### Users
| Method | Route | Role | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/me` | Any | Current user profile |
| `GET` | `/api/v1/users` | ADMIN | List all users |
| `GET` | `/api/v1/users/dashboard` | MODERATOR+ | Mod dashboard |

---

## 📜 Available Scripts

Run all commands from the **root** of the project:

| Script | Description |
|---|---|
| `npm install` | Install all deps for both workspaces |
| `npm run dev:backend` | Start backend in watch mode (port 4000) |
| `npm run dev:frontend` | Start frontend with Turbopack (port 3000) |
| `npm run build:backend` | Build backend |
| `npm run build:frontend` | Build frontend |
| `npm run start:backend` | Start backend in production |
| `npm run start:frontend` | Start frontend in production |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to MongoDB |

---

## 👥 Roles

```
ADMIN       →  Full access to all routes
MODERATOR   →  /dashboard + /users/dashboard
USER        →  /dashboard + /users/me only
```

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** — never stored plain
- Refresh tokens **hashed in DB** — raw token never persisted
- **Constant-time comparison** — prevents timing-based user enumeration
- **Token reuse detection** — invalidates all sessions on suspicious activity
- **Generic error messages** — never reveals if an email is registered
- Rate limiting + Helmet headers on all endpoints

---

## 🗺️ Roadmap

- [x] JWT Auth + Token Rotation
- [x] Role-Based Access Control
- [x] Email Verification
- [x] Next.js 15 App Router Frontend
- [x] npm Workspaces Monorepo
- [ ] Password Reset Flow
- [ ] Google OAuth
- [ ] Two-Factor Authentication (2FA)
- [ ] Docker Setup

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: your feature"`
4. Push & open a Pull Request

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
  <sub>Built with ❤️ · NestJS · Next.js 15 · MongoDB · TypeScript</sub>
</div>
