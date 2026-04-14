# Yeled.ai MVP

A Next.js MVP implementation of the PRD in `project.md`.

## Included MVP capabilities

- Multi-tenant data model (`Nursery`, settings, users, generation history)
- Role model (`manager`, `staff`) with manager-only settings and user invite API
- Planning generation module + persistence
- Parent insight generation module + persistence
- Dashboard summary + recent history endpoints
- Editable settings and outputs in a responsive single-page UI
- OpenAI integration with deterministic local fallback when no API key is configured

## Tech

- Next.js App Router + TypeScript
- Prisma ORM
- SQLite for local MVP data persistence (can be swapped to PostgreSQL)
- OpenAI Responses API (`gpt-4.1-mini`)

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client and database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## Demo users

- `manager@demo.local`
- `staff@demo.local`

The UI includes a selector that toggles between users by setting the `x-demo-user` header.

## Roadmap

See the full implementation roadmap in `ROADMAP.md`.

## Deploying to Cloudflare Workers

This repo is not deployable to Workers yet with only:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

because the project currently has:

- no `wrangler.toml` (Worker name/account/main/compatibility settings),
- no Cloudflare Next.js adapter package/scripts,
- local Prisma + SQLite setup (which does not run on Workers runtime).

### Required settings and changes

1. **Add a Workers config file (`wrangler.toml`)**
   - `name = "yeled"`
   - `main = ".open-next/worker.js"` (or the adapter output path you use)
   - `compatibility_date = "YYYY-MM-DD"`
   - set routes/custom domain only after first successful deploy

2. **Use the Next.js Cloudflare adapter**
   - install adapter tooling (for example `@opennextjs/cloudflare` + `wrangler`)
   - add scripts to build the Worker artifact before deploy
   - update CI build command to that adapter build script (not plain `next build`)

3. **Move database away from local SQLite**
   - replace SQLite with Cloudflare-compatible storage (for example D1 via Prisma adapter/driver, or an external DB like Neon/Supabase)
   - run migrations against that target DB

4. **Set required env vars/secrets in Cloudflare**
   - `OPENAI_API_KEY`
   - any runtime DB connection/binding values
   - if using D1, add a `d1_databases` binding in `wrangler.toml`

5. **Cloudflare dashboard build settings**
   - **Root directory:** `/` (current value is fine)
   - **Build command:** adapter build command (for example `npm run cf:build`)
   - **Deploy command:** `npx wrangler deploy`
   - **Production branch:** `main` (current value is fine)
