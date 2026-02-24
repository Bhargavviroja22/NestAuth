# Frontend — Next.js 15 Authentication UI

## Quick Start

```bash
npm install
cp .env.example .env.local   # Configure API URL
npm run dev                   # Start dev server on :3000
```

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Dev server with Turbopack           |
| `npm run build`  | Production build                    |
| `npm run start`  | Serve production build              |
| `npm run lint`   | Run ESLint                          |

## Directory Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── login/        # Login page (GuestGuard)
│   ├── register/     # Register page (GuestGuard)
│   ├── verify-email/ # Email verification (public)
│   ├── dashboard/    # User dashboard (AuthGuard)
│   ├── admin/        # Admin panel (AuthGuard + ADMIN)
│   ├── moderator/    # Mod panel (AuthGuard + ADMIN/MOD)
│   └── unauthorized/ # Access denied page
├── components/
│   ├── auth/         # AuthGuard, GuestGuard
│   ├── forms/        # LoginForm, RegisterForm
│   ├── layout/       # AuthLayout, Navbar
│   └── ui/           # Alert, Button, Input, Spinner
├── hooks/            # useAuth, useCurrentUser
├── lib/              # Axios, API client, utils, validation
├── store/            # Zustand auth store
└── types/            # TypeScript interfaces
```
