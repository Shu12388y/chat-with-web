# Web Q&A — Turborepo Monorepo


This repository is designed as a **Turborepo monorepo** with two main apps and shared packages:

* `apps/web` — Next.js (React) frontend using TanStack Query (React Query) to interact with API and display streaming status/results.
* `apps/api` — Express.js backend exposing REST endpoints, enqueueing jobs to BullMQ, providing SSE endpoints for status streaming, and interacting with PostgreSQL (Drizzle ORM).
* `packages/*` — shared utils: types, DB schema, worker code, and API clients.

---

## Architecture

A user submits a URL and a question from the Next.js frontend. The frontend calls the Express API which:

1. Validates input and creates a DB record (`webcontent` table) with `status = queued`.
2. Enqueues a job into BullMQ (Redis) with the task ID.
3. A separate worker process pulls jobs from the queue and:

   * Scrapes the URL (Cheerio)
   * Sends the scraped content + user question to an AI API (a free model or placeholder)
   * Stores the AI response in PostgreSQL via Drizzle and updates the task status.

---

## Tech stack

* Monorepo: Turborepo
* Frontend: Next.js (React), TanStack Query
* Backend: Express.js
* Worker queue: BullMQ (Redis)
* Scraping: Cheerio 
* DB: PostgreSQL + Drizzle ORM
* Worker runner: Node process (e.g., `node packages/worker`)

---

## Repo layout

```text
/
├─ apps/
│  ├─ api/          # Express backend
│  └─ web/          # Next.js frontend
│  └─ worker/       # worker
├─ packages/
│  ├─ db/           # Drizzle schema + migrations helpers
│  ├─ types/        # TypeScript types shared across apps
│  ├─ queue/       # Worker implementation (BullMQ job handlers)
├─ turbo.json
├─ package.json
└─ README.md
```

---

## Features

* Enqueue & process background scraping + AI job using BullMQ
* Persist tasks and results with PostgreSQL (Drizzle)
* Frontend displays a task timeline and final AI answer


---

## Prerequisites

Install locally:

* Node.js 18+ (recommended)
* pnpm (preferred) or npm

Optional global packages:

* `turbo` CLI (if you prefer global, otherwise use pnpm scripts)

---

## Environment variables

Create `.env` files in `apps/api` (and worker if separated). Example `.env`:

```env
# apps/api/.env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/webqa
REDIS_URL=redis://localhost:6379
API_KEY=Annifdnioi
```
---

Install dependencies and bootstrap the monorepo (pnpm example):

```bash
pnpm install
pnpm -w turbo run build
```

Run dev (API, worker, frontend):

```bash
# Start API
pnpm --filter @your-scope/api dev

# Start worker (in separate terminal)
pnpm --filter @your-scope/worker dev

# Start web (Next)
pnpm --filter @your-scope/web dev
```

You can also create a single `pnpm dev` script that runs multiple commands in parallel.

---

## How it works (flow)

1. **Client (Next.js)** POST `/api/tasks` with `{ url, question }`.
2. **API** inserts a `task` row (`status: queued`) and enqueues job to BullMQ (`queue.add("scrape", { taskId })`).
3. **Worker** receives job, updates `status: processing`, scrapes website, composes prompt, calls AI API, saves answer, updates `status: completed` (or `failed`).

---


## License

MIT

