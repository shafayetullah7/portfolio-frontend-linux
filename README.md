# portfolio-lite-linux

Backend-First public portfolio frontend. Shares [`portfolio-api`](../portfolio-api) with the terminal site; admin CMS stays on [`portfolio-frontend`](../portfolio-frontend).

## Dev

```bash
cp .env.example .env
pnpm install
pnpm dev
```

- App: http://localhost:4012  
- API: http://localhost:4010 (`VITE_API_BASE_URL`)

Ensure the API allows this origin (`localhost:4012` in non-prod, or `CORS_EXTRA_ORIGINS`).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Vite dev server (port 4012) |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |

## Content & screenshots

Edit profile, skills, projects, and contact in **terminal admin** (`portfolio-frontend` → `/admin`).

Project screenshots:

1. Admin → Media → upload image (Cloudinary)
2. Admin → Projects → edit → set screenshot from library
3. Publish the project

Fresh DB demo data: `cd portfolio-api && pnpm db:setup` (seed skips if profile already exists — use `docker compose down -v` then setup to re-seed).

## Design

Tokens: [`../docs/DESIGN_SYSTEM_V2.md`](../docs/DESIGN_SYSTEM_V2.md).  
Visual QA mock: [`docs/reference/backend-first-mock.png`](docs/reference/backend-first-mock.png).
