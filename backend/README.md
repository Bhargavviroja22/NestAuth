# Backend — NestJS Authentication API

## Quick Start

```bash
npm install
cp .env.example .env   # Configure your env vars
npx prisma db push     # Sync schema to MongoDB
npx prisma generate    # Generate Prisma client
npm run start:dev      # Start dev server on :4000
```

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run start:dev`  | Dev server with hot-reload     |
| `npm run build`      | Compile to `dist/`             |
| `npm run start:prod` | Run compiled production build  |
| `npm run start:debug`| Dev server with debugger       |

## Module Architecture

```
src/
├── config/       # Typed configuration (registerAs)
├── auth/         # Authentication (JWT, Passport, guards, strategies)
├── users/        # User CRUD & role-based queries
├── mail/         # Transactional email service
├── prisma/       # Prisma client singleton
├── common/       # Exception filters, middleware
├── app.module.ts # Root module
└── main.ts       # Bootstrap entry point
```
