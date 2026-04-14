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
