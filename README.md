# TrueTrace Bank Web Client

[![Git Clones](https://badgen.net/https/cdn.jsdelivr.net/gh/Little-Boy-s-TrueTrace/truetrace-deployment@main/truetrace-bank-web-client-clone-badge.json)](https://github.com/Little-Boy-s-TrueTrace/truetrace-deployment)
[![Unique Cloners](https://badgen.net/https/cdn.jsdelivr.net/gh/Little-Boy-s-TrueTrace/truetrace-deployment@main/truetrace-bank-web-client-uniques-badge.json)](https://github.com/Little-Boy-s-TrueTrace/truetrace-deployment)
[![Release Downloads](https://badgen.net/https/cdn.jsdelivr.net/gh/Little-Boy-s-TrueTrace/truetrace-deployment@main/downloads-badge.json)](https://github.com/Little-Boy-s-TrueTrace/truetrace-deployment/releases)
[![Stars](https://badgen.net/github/stars/Little-Boy-s-TrueTrace/truetrace-bank-web-client?color=f59e0b)](https://github.com/Little-Boy-s-TrueTrace/truetrace-bank-web-client/stargazers)

Customer and administrator web portal for the Little Boy's TrueTrace banking
demonstration. It is a Next.js 16 App Router application that talks to the
Spring Boot banking API and links the banking experience to the Compliance dashboard.

> This repository is designed for a controlled attack-and-defense demo. The
> security toggles and simulated vulnerable states are not production banking
> features.

## Features

- Customer registration and JWT-based login
- Account overview and recent activity
- Funds transfer with client-side validation
- Searchable transaction history
- Administrator attack/defense control panel
- Global banned-IP handling and forced session cleanup
- Responsive dark banking interface
- Reverse-proxy integration for the bank API and Compliance dashboard
- Security headers and standalone production output

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Redirect to login or dashboard based on session state |
| `/login` | Customer/admin authentication |
| `/register` | Demo account registration |
| `/dashboard` | Account summary and recent transactions |
| `/transfer` | Submit a bank transfer |
| `/transactions` | View and search transaction history |
| `/admin/security` | Inspect and toggle demo security controls |
| `/banned` | Terminal page for clients blocked by the TrueTrace controls |
| `/soc/*` | Proxy to the separate Compliance dashboard frontend |

## Architecture and Request Flow

```text
browser
  |
  +--> Next.js pages/components
  |       `--> typed API modules --> Axios client
  |                                  |-- adds Bearer token
  |                                  `-- handles 401 / banned 403
  |
  +--> /api-bank/* --> Spring Boot bank API
  +--> /api/*      --> Go Compliance API
  `--> /soc/*      --> React Compliance dashboard
```

The application always calls same-origin paths. `next.config.ts` rewrites those
paths to the appropriate services, avoiding browser CORS configuration during
local development and container deployment.

## Prerequisites

- Node.js 20 or newer
- npm
- `truetrace-backend` on port `8080` for banking operations
- Optional `dashboard` backend/frontend on ports `8082` and `3001`

## Run Locally

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The default development targets are:

| Variable | Default | Used by |
|---|---|---|
| `BE_BACKEND_URL` | `http://localhost:8080` | `/api-bank/*` rewrite |
| `DASHBOARD_BACKEND_URL` | `http://localhost:8082` | `/api/*` rewrite |
| `DASHBOARD_FRONTEND_URL` | `http://localhost:3001` | `/soc/*` rewrite |

Override them when the services are elsewhere:

```bash
BE_BACKEND_URL=http://127.0.0.1:8080 \
DASHBOARD_BACKEND_URL=http://127.0.0.1:8082 \
DASHBOARD_FRONTEND_URL=http://127.0.0.1:3001 \
npm run dev
```

## Available Commands

```bash
npm run dev       # Next.js development server
npm run lint      # ESLint
npm test          # Jest test runner
npm run build     # Optimized standalone build
npm run start     # Run the production build
```

Run `npm run build` after route, rewrite, or server-component changes; it is the
most complete type and production-configuration check in this repository.

## Docker

Backend targets are build arguments because rewrites are compiled into the
standalone artifact:

```bash
docker build \
  --build-arg BE_BACKEND_URL=http://truetrace-be-backend:8080 \
  --build-arg DASHBOARD_BACKEND_URL=http://truetrace-dashboard-backend:8082 \
  --build-arg DASHBOARD_FRONTEND_URL=http://truetrace-dashboard-frontend:3001 \
  -t truetrace-bank-web-client .

docker run --rm -p 3000:3000 truetrace-bank-web-client
```

The image uses Next.js standalone output and removes package managers from the
runtime stage. For the complete network and gateway configuration, use
`truetrace-deployment`.

## Bank API Usage

| Module | Endpoint(s) |
|---|---|
| `src/api/auth.ts` | login and registration |
| `src/api/accounts.ts` | account details |
| `src/api/transactions.ts` | transfer and transaction history |
| `src/api/security.ts` | security status, toggles, logs, and log cleanup |
| `src/api/tokenStorage.ts` | cookie/session storage lifecycle |

All banking calls are sent through `/api-bank`. The Axios interceptor attaches
the token, clears authentication state on `401`, and redirects a blocked client
to `/banned` when the gateway or API returns the TrueTrace ban signal.

## Repository Layout

```text
src/
├── api/                 # Typed API clients and token storage
├── app/                 # App Router pages, layout, CSS, and error boundary
└── components/          # Shared navigation and sidebar
public/                  # Static assets
next.config.ts           # Headers, rewrites, and standalone output
Dockerfile               # Multi-stage production image
jest.config.js           # Jest configuration
```

## Security Model

- `X-Powered-By` is disabled and the application emits CSP, frame, content-type,
  referrer, HSTS, and permissions headers.
- Authentication data is cleared from `localStorage`; the current client uses a
  Secure/SameSite cookie plus `sessionStorage` fallback.
- A JavaScript-readable token is still vulnerable to successful XSS. A
  production design should prefer server-issued `HttpOnly` cookies and CSRF
  protections.
- HSTS and `Secure` cookies require HTTPS outside local development.
- Authorization, transaction validation, and IP blocking must be enforced by
  the backend/gateway; UI checks are not security boundaries.

## Related Repositories

- [`truetrace-backend`](https://github.com/Little-Boy-s-TrueTrace/truetrace-backend) — bank API
- [`dashboard`](https://github.com/Little-Boy-s-TrueTrace/dashboard) — Compliance application
- [`truetrace-deployment`](https://github.com/Little-Boy-s-TrueTrace/truetrace-deployment) — full local stack
