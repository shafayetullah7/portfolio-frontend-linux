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

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Vite dev server (port 4012) |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |

## Design

Tokens and layout language: [`../docs/DESIGN_SYSTEM_V2.md`](../docs/DESIGN_SYSTEM_V2.md).  
Visual QA mock: [`docs/reference/backend-first-mock.png`](docs/reference/backend-first-mock.png).
