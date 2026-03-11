# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BidBuild UAE** is a full-stack reverse auction platform for the UAE construction industry. Contractors and suppliers compete on construction projects by offering competitive pricing in real time.

- **Frontend:** Deployed to GitHub Pages at `https://camelcod.github.io/idbuild-uae-platform`
- **Backend:** Node.js/Express API + MySQL, intended for VPS deployment with PM2 + Nginx

## Commands

### Frontend (run from `frontend/`)

```bash
npm run dev          # Vite dev server on port 3000
npm run build        # TypeScript compile + Vite bundle
npm run lint         # ESLint (strict - treats warnings as errors)
npm run preview      # Preview production build locally
npm run test         # Vitest (watch mode)
npm run test:ui      # Vitest with browser UI dashboard
npm run test:coverage # Coverage report
```

### Backend (run from `backend/`)

```bash
npm run dev          # Nodemon watch mode
npm start            # Production start
npm run migrate      # Run database migrations
npm run seed         # Seed test data
npm test             # Jest tests
```

### Root-level shortcuts

```bash
npm run dev          # Delegates to frontend dev server
npm run build        # Full frontend build
npm run deploy       # Build + push to GitHub Pages
```

## Architecture

### Monorepo Structure

```
idbuild-uae-platform/
├── frontend/            # React 18 + TypeScript + Vite
│   └── src/
│       ├── App.tsx      # Router with ProtectedRoute/PublicRoute wrappers
│       ├── main.tsx     # Entry: wraps app in 4 context providers
│       ├── config/api.ts        # Endpoint definitions + environment detection
│       ├── contexts/            # Global state via React Context
│       │   ├── AuthContext.tsx  # JWT auth, login/logout, user role
│       │   ├── SocketContext.tsx # Socket.io real-time connection
│       │   ├── ThemeContext.tsx  # Light/dark theme
│       │   └── NotificationContext.tsx # Toast notifications
│       └── services/apiService.ts  # Axios client with interceptors
└── backend/             # Node.js + Express + MySQL
    └── src/
        ├── server.js             # Entry point
        ├── routes/projectRoutes.js  # Project/bid/contract/doc/progress routes
        └── middleware/
            ├── auth.js          # JWT validation + requireRole()
            └── validation.js   # express-validator integration
```

### Provider Nesting Order (main.tsx)

```
ThemeProvider > NotificationProvider > AuthProvider > SocketProvider > App
```

### Frontend Path Aliases (tsconfig.json)

All paths resolve relative to `frontend/src/`:
- `@/*` → `src/*`
- `@components/*`, `@pages/*`, `@hooks/*`, `@services/*`, `@utils/*`, `@contexts/*`, `@types/*`

### Authentication & Authorization

- **JWT Bearer tokens** stored in localStorage
- **Roles:** `homeowner` (creates projects), `contractor` (submits bids), `client`, `admin`
- Backend middleware: `authenticateToken` validates token; `requireRole('contractor')` restricts by role
- Frontend `AuthContext` handles token attach/refresh; `ProtectedRoute` redirects unauthenticated users

### API Service Pattern

`frontend/src/services/apiService.ts` is the single Axios instance used for all HTTP calls:
- Request interceptor: auto-attaches `Authorization: Bearer <token>`
- Response interceptor: handles 401 (token refresh), 403, 404, 5xx errors

### Backend Route Structure

`backend/src/routes/projectRoutes.js` covers:
- Project CRUD (`/projects`)
- Image/document management (`/projects/:id/images`, `/projects/:id/documents`)
- Bidding operations and stats (`/projects/:id/bids`, `/projects/:id/bidding-stats`)
- Status transitions (`/projects/:id/activate`, `/projects/:id/cancel`, `/projects/:id/extend-deadline`)
- Progress tracking (`/projects/:id/progress`)
- Contracts with digital signing (`/projects/:id/contract`)
- User-scoped routes (`/projects/me/projects`, `/projects/me/assigned-projects`)
- Admin analytics (`/projects/admin/analytics`)

### Environment Configuration

**Frontend** uses three `.env` files in `frontend/`:
| File | Purpose |
|------|---------|
| `.env.development` | Local dev — API at `localhost:3004`, debug mode on |
| `.env.production` | Production — API at `https://your-backend-domain.com` |
| `.env.github-pages` | Demo mode — mock data, no backend required |

All frontend env vars use the `VITE_` prefix. Key vars: `VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_ENABLE_MOCKS`, `VITE_BACKEND_AVAILABLE`.

### Real-time Features

Socket.io powers live auction bidding. `SocketContext` manages the connection lifecycle. The backend uses `socket.io` 4.7+ for broadcasting bid events.

### Mock Data System

When `VITE_ENABLE_MOCKS=true` (GitHub Pages), `frontend/src/config/api.ts` returns mock data instead of making real HTTP requests. This allows the full UI to function without a backend — useful for demos and frontend-only development.

### Build & Deployment

- Vite builds to `frontend/dist/` with base path `/idbuild-uae-platform/` for GitHub Pages
- Code is split into vendor, router, ui, forms, charts chunks
- CI/CD: `.github/workflows/deploy.yml` runs build + test on push to main, then deploys to GitHub Pages
- Backend intended for PM2 + Nginx on port 5000 (production) or 3004 (development)
