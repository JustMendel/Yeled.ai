# Yeled.ai Product & Engineering Roadmap

_Last updated: April 14, 2026_

This roadmap translates the PRD (`project.md`) and current MVP implementation into a delivery plan from pilot-ready product to scalable SaaS.

## 0) Current Baseline (already in repo)

From the current codebase and README, Yeled.ai has:
- Next.js + Prisma MVP with multi-tenant nursery model
- Roles (`manager`, `staff`)
- Planning generation + save
- Parent Insights generation + save
- Dashboard and history APIs
- Editable outputs + settings endpoints
- Demo auth flow and OpenAI fallback behavior

This means the next roadmap should prioritize **production hardening**, **pilot readiness**, and then **commercial scale features**.

---

## 1) Product Vision & Success Criteria

## North-star outcome
Become the most trusted AI copilot for Jewish early years settings by reducing planning/admin time while increasing quality and consistency of parent communication.

## Success metrics (track from Day 1)
1. Weekly Active Nurseries (WAN)
2. Weekly Active Staff (WAS)
3. Generations per staff member/week
4. Time saved per week (self-reported + inferred)
5. Edit rate (healthy editing indicates trust + control)
6. Regeneration rate (too high may indicate poor quality)
7. Parent insight send rate
8. 4-week nursery retention
9. Paid conversion from pilot
10. Incident-free uptime and P95 response latency

---

## 2) Roadmap Principles

1. **Safety before scale**: parent-facing text quality and guardrails first.
2. **Manager trust**: controls, auditability, and consistency are essential.
3. **Staff speed**: reduce clicks and friction in daily workflow.
4. **Pilot evidence loop**: instrument everything to prove ROI.
5. **Architecture for growth**: avoid rework when adding integrations, billing, and multi-site support.

---

## 3) Full Feature Map (PRD + required additions)

## A. Core PRD Features to complete/harden
- Production auth + sessions + password reset
- Invite flows with expiry and role controls
- Planning UX polish (templates, regenerate variants, export)
- Insights UX polish (structured observations, tone presets, export)
- Full history management (search/filter/duplicate/delete/versioning)
- Manager dashboard with actionable KPIs

## B. Excluded-from-MVP features to phase in
- Billing and subscriptions
- Parent portal / sharing workflows
- External integrations (Famly, WhatsApp, email)
- Advanced analytics
- Multi-site support under one organization
- Voice input
- Staff onboarding + AI training simulator

## C. “Anything else needed” (critical additions)
- Compliance and privacy foundations (DPA, retention controls, consent workflows)
- Security hardening (RBAC enforcement, rate limits, audit logs)
- Reliability (monitoring, error tracking, backups, DR)
- AI quality system (evals, prompt/version management, moderation)
- Support and operations (in-app support, status page, runbooks)
- Data model evolution for org/site hierarchy and future reporting
- Localization/internationalization strategy (English + Hebrew terminology handling)

---

## 4) Delivery Plan by Phase

## Phase 1 (Weeks 1–4): Pilot-Ready Foundation

## Goals
- Make MVP safe and stable for real pilot nurseries.

## Scope
1. **Authentication & access**
   - Replace demo header auth with secure auth provider (e.g., NextAuth/Auth.js or Clerk)
   - Password reset, email verification, invite acceptance
   - Strict middleware-based route protection

2. **Data and infra hardening**
   - Move SQLite to managed Postgres
   - Add migrations policy and environment isolation
   - Nightly backup + restore drill

3. **Observability**
   - Error tracking (Sentry)
   - Structured logs with request IDs
   - Basic metrics dashboard (latency, error rate, token usage)

4. **Security baseline**
   - Rate limiting for generation endpoints
   - Input validation and output sanitization review
   - Audit log table for manager-visible key events

5. **AI safety baseline**
   - Parent insight guardrails (no diagnosis, no medical advice)
   - Toxicity/sensitive-content checks
   - Prompt templates versioned in code

## Exit criteria
- 2 pilot nurseries onboarded
- <1% 5xx error rate over 7 days
- No critical auth/tenant isolation bugs

---

## Phase 2 (Weeks 5–8): Core Workflow Excellence

## Goals
- Make daily use delightful and reduce editing burden.

## Scope
1. **Planning module upgrade**
   - Preset templates by age/theme/activity
   - “Regenerate section only” controls
   - Weekly pack structured builder

2. **Parent Insights upgrade**
   - Observation scaffolds (chips + free text hybrid)
   - Tone and sensitivity presets
   - Internal note and parent-facing preview modes

3. **History and reuse**
   - Full-text search and smart filters
   - Duplicate, pin, archive, delete with confirmations
   - Saved favorites and reusable snippets

4. **Export/share**
   - Copy, print, PDF export
   - Share-to-email draft flow

## Exit criteria
- Median generation-to-finalized time < 4 minutes
- ≥60% of outputs marked “usable with minor edits” in pilot surveys

---

## Phase 3 (Weeks 9–12): Manager Controls & Analytics

## Goals
- Give managers visibility and governance.

## Scope
1. **Manager dashboard v2**
   - Staff usage trends
   - Module usage split
   - Time-saved estimator
   - Quality feedback capture

2. **Settings sophistication**
   - Nursery tone packs (formal, warm, concise)
   - Jewish orientation presets and custom vocabulary
   - Output-length/detail defaults by module

3. **Review workflows**
   - Optional manager approval flow for parent insights
   - Activity feed and audit timeline

4. **Insights instrumentation**
   - Event taxonomy finalized
   - Product analytics (Mixpanel/PostHog)

## Exit criteria
- Managers can self-serve key reporting without support
- Clear value narrative for paid conversion

---

## Phase 4 (Weeks 13–18): Monetization + Integrations

## Goals
- Become commercially deployable beyond pilots.

## Scope
1. **Billing/subscriptions**
   - Stripe integration
   - Plan tiers (pilot, standard, pro)
   - Seat-based pricing and usage caps

2. **External integrations (first wave)**
   - Email integration (send parent insight drafts)
   - WhatsApp export workflow (where compliant)
   - Famly integration discovery + MVP sync endpoint

3. **Org scaling**
   - Multi-site org model (HQ + multiple nurseries)
   - Site-level settings overrides

4. **Admin operations**
   - Internal admin panel for support tooling
   - Feature flags and rollout controls

## Exit criteria
- First paying customer live
- Billing + entitlement checks fully enforced

---

## Phase 5 (Weeks 19–26): Advanced Product Expansion

## Goals
- Extend defensibility and deepen daily dependence.

## Scope
1. **Parent portal / secure sharing**
   - Parent-facing view links or authenticated portal
   - Read receipts and communication history

2. **Advanced analytics**
   - Child development trend tagging (non-diagnostic)
   - Cohort insights for managers

3. **Voice input**
   - Dictation for observations
   - Speech-to-text cleanup pipeline

4. **Staff training simulator**
   - AI role-play scenarios
   - Quality scoring and coaching prompts

5. **AI quality platform**
   - Golden dataset and regression evaluations
   - A/B prompt testing
   - Model fallback orchestration

## Exit criteria
- Measurable expansion revenue from existing customers
- Demonstrated differentiation vs generic AI tools

---

## 5) Technical Workstreams (cross-phase)

## 1. Architecture & backend
- Modular service layer for Planning, Insights, Settings, Billing, Integrations
- Queue/background jobs for async tasks (BullMQ/Temporal)
- Idempotent API design for retries

## 2. Data model evolution
- Add Organization and Site hierarchy
- Event and audit schema
- Output/version tables with lineage

## 3. Frontend system
- Design system tokens and reusable form components
- Accessibility pass (WCAG 2.1 AA target)
- Performance budgets and bundle monitoring

## 4. AI operations
- Prompt registry (versioned)
- Evaluation harness run in CI
- Safety policy tests for prohibited outputs

## 5. Security & compliance
- SOC 2 readiness controls checklist
- Encryption at rest/in transit and key management policy
- Data retention + deletion tooling

## 6. DevEx and quality
- CI pipeline: lint, typecheck, test, migration checks
- Staging environment with production-like data masks
- Playwright smoke tests for top flows

---

## 6) Suggested Milestone Backlog (by epic)

## Epic: Auth & Tenant Security
- [ ] Real auth provider integration
- [ ] Session management + secure cookies
- [ ] Tenant guard utility with test coverage
- [ ] Role-based route policies

## Epic: Planning Quality
- [ ] Schema-validated structured output format
- [ ] Prompt improvements by age/activity
- [ ] Regenerate subsection endpoint
- [ ] Weekly pack output QA checks

## Epic: Insights Safety
- [ ] Safety classifier pass
- [ ] Auto-redaction for sensitive terms (configurable)
- [ ] Mandatory disclaimer insertion rules
- [ ] Manager approval option

## Epic: History & Knowledge Reuse
- [ ] Search index strategy
- [ ] Duplicate/edit lineage UI
- [ ] Favorites/snippets library

## Epic: Billing & Entitlements
- [ ] Stripe customer + subscription model
- [ ] Webhook processing with retries
- [ ] Plan limits middleware

## Epic: Integrations
- [ ] Outbound email connectors
- [ ] Parent communication export adapters
- [ ] Famly API investigation + connector spec

## Epic: Analytics & Evidence
- [ ] Event schema v1
- [ ] Dashboard KPI cards + trend charts
- [ ] Pilot ROI report export

---

## 7) Team Plan (minimum viable)

- Product lead (0.5–1 FTE)
- Full-stack engineer (2 FTE)
- AI engineer (1 FTE)
- Designer (0.5 FTE)
- QA/support ops (0.5 FTE)

If team is smaller, keep schedule but reduce concurrent epics and prioritize:
1) security/auth, 2) workflow quality, 3) analytics evidence, 4) billing.

---

## 8) Risks & Mitigations

1. **AI output inconsistency**  
   Mitigation: eval suite, prompt versioning, human-edit-first UX

2. **Sensitive communication risk**  
   Mitigation: safety rules, manager approvals, immutable audit logs

3. **Integration complexity**  
   Mitigation: adapter abstraction + phased connector rollout

4. **Pilot churn from low perceived value**  
   Mitigation: KPI instrumentation + ROI report surfaced to managers

5. **Scope creep**  
   Mitigation: phase gates with strict exit criteria

---

## 9) Immediate Next 10 Tasks (start this sprint)

1. Implement production auth and remove demo header dependency
2. Add tenant/role middleware tests
3. Migrate to managed Postgres for non-local environments
4. Add Sentry + structured logging
5. Introduce rate limiting for generation endpoints
6. Define event tracking schema and instrument key actions
7. Add search/filter for history
8. Add regenerate-section support for Planning outputs
9. Add manager dashboard KPI cards
10. Draft pricing + entitlement model for Stripe integration

---

## 10) Definition of Done (for every feature)

A feature is done only when:
- UX implemented and accessible
- API + validation complete
- RBAC + tenant isolation validated
- Analytics events instrumented
- Audit log behavior defined (if manager-impacting)
- Tests added (unit/integration/e2e as relevant)
- Documentation updated (user + technical)
- Rollout plan + feature flag (if high risk)

