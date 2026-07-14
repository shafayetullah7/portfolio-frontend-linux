# portfolio-lite-linux

Backend-First portfolio frontend: **public site and admin CMS** on one origin. Shares [`portfolio-api`](../portfolio-api) with the optional terminal skin ([`portfolio-frontend`](../portfolio-frontend)).

## Dev

```bash
cp .env.example .env
pnpm install
pnpm dev
```

- App (public + admin): http://localhost:4012  
- Admin: http://localhost:4012/login → `/admin`  
- API: http://localhost:4010 (`VITE_API_BASE_URL`)

Ensure the API allows this origin (`localhost:4012` in non-prod, or set `FRONTEND_URL` / `CORS_EXTRA_ORIGINS` — see [`../DEPLOY.md`](../DEPLOY.md)).

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Vite dev server (port 4012) |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |

## Content & screenshots

Edit content in **lite admin** (`/admin`):

| Area | Path |
|------|------|
| Profile / system info | `/admin/profile` |
| Site (brand, metrics, philosophy, architecture) | `/admin/site` |
| Projects | `/admin/projects` |
| Skills | `/admin/skills` |
| Experience | `/admin/experience` |
| Contact | `/admin/contact` |
| Inbox | `/admin/inbox` |
| Media | `/admin/media` |

Marketing site content (brand, footer version, metrics, philosophy, architecture principles, diagram node labels) is loaded from `GET /api/v1/public/site-content`. Fallbacks and fixed SVG node ids live in [`src/content/site.config.ts`](src/content/site.config.ts) when the API is unreachable or returns empty lists. Metrics are **marketing samples** (labeled on the home strip), not live telemetry.

Public home also shows **identity** (name, avatar, skills chips from profile/skills APIs) and **Experience_Log** from `/admin/experience` when entries exist (`/#experience`).

Project screenshots:

1. Admin → Media → upload image (Cloudinary)
2. Admin → Projects → edit → set screenshot from library
3. Publish the project

Fresh DB demo data: `cd portfolio-api && pnpm db:setup` (portfolio seed skips if a profile exists; site content still seeds if `site_settings` is empty). Use `docker compose down -v` then setup to fully re-seed.

## Design

Tokens: [`../docs/DESIGN_SYSTEM_V2.md`](../docs/DESIGN_SYSTEM_V2.md).  
Visual QA mock: [`docs/reference/backend-first-mock.png`](docs/reference/backend-first-mock.png).  
Site Content CMS: [`../docs/SITE_CONTENT_CMS_PLAN.md`](../docs/SITE_CONTENT_CMS_PLAN.md).
