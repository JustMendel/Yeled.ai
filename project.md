# PRD - Yeled.ai (Jewish Early Years AI Platform MVP)

## 1. Product Overview

### Product Name
**Yeled.ai**

### Product Type
Web-based SaaS platform for Jewish nurseries and Jewish early years settings.

### Purpose
Yeled.ai helps nursery managers and staff:
- Generate high-quality Jewish early years activities and planning
- Create clear, thoughtful parent insight updates from observations
- Save time while improving consistency and educational quality

### What This Is Not
- Not a nursery management system (e.g. Famly)
- Not a billing or attendance platform
- Not a static curriculum library
- Not a generic AI wrapper

---

## 2. MVP Scope

### Included in V1
- Multi-tenant nursery accounts
- Manager and staff roles
- Planning module
- Parent Insights module
- Basic dashboard
- Saved nursery preferences
- Generation history
- Editable outputs
- Copy/export functionality
- Auth system
- Database-backed persistence

### Excluded from V1
- Billing/subscriptions
- Parent portal
- External integrations (Famly, WhatsApp)
- Mobile app
- Advanced analytics
- Multi-site support
- Voice input
- Staff training simulator

---

## 3. Goals

### Business Goals
- Validate demand in Jewish nursery market
- Secure pilot nurseries
- Achieve weekly usage
- Prove willingness to pay

### User Goals

**Managers**
- Save staff time
- Improve consistency
- Improve parent communication

**Staff**
- Generate activities quickly
- Avoid starting from scratch
- Produce better outputs

---

## 4. Target Users

### Roles

**Manager**
- Full access
- Controls settings
- Manages users

**Staff**
- Generates content
- Edits outputs
- Cannot change account settings

---

## 5. Core Modules

---

## Module A - Planning

### Purpose
Generate practical Jewish early years activities based on real classroom constraints.

### Inputs
- Age group
- Time available
- Indoor / outdoor
- Energy level
- Materials available
- Jewish theme type:
  - Parsha
  - Yom Tov
  - Mitzvah
  - Middah
  - Hebrew vocabulary
- Specific topic (e.g. Noach, Shabbos candles)
- Activity type:
  - Single activity
  - Circle time
  - Sensory play
  - Art
  - Movement
  - Role-play
  - Weekly plan

### Outputs

#### Single Activity
- Title
- Summary
- Materials
- Setup
- Steps
- Jewish message
- Extensions
- Cleanup

#### Weekly Pack
- 3–5 activities
- Circle time idea
- Sensory idea
- Vocabulary
- Take-home idea

---

## Module B - Parent Insights

### Purpose
Convert observations into clear parent communication.

### Inputs
- Child name
- Age
- Observations (free text)
- Development focus
- Concern level
- Tone
- Jewish framing toggle

### Outputs
- Parent summary
- What child is showing
- What it may mean
- Home support suggestions
- Optional Jewish framing
- Internal note

### Rules
- No diagnosis
- No medical advice
- Supportive tone
- Always editable before use

---

## 6. Nursery Settings

Each nursery can configure:

- Terminology (Shabbos vs Shabbat)
- Tone
- Jewish orientation (Chabad / general)
- Language style
- Mess tolerance
- Output detail level

---

## 7. User Stories

### Manager
- Set nursery preferences
- Invite staff
- Review outputs

### Staff
- Generate activities quickly
- Generate parent insights
- Edit and reuse outputs

---

## 8. Functional Requirements

### Auth
- Email/password login
- Role-based access
- Invite users

### Multi-Tenant
- Each nursery isolated
- Users belong to one nursery

### Planning UI
- Input form
- Generate
- Edit
- Save
- Copy/export
- Regenerate

### Insights UI
- Observation input
- Generate
- Edit
- Save
- Copy/export

### Dashboard
- Recent activity
- Quick actions

### History
- View past generations
- Search/filter
- Edit/duplicate/delete

### User Management
- Invite/remove users
- Assign roles

---

## 9. Non-Functional Requirements

- Fast UI
- Clean design
- Mobile responsive
- Secure data separation
- Editable AI outputs
- Modular architecture

---

## 10. Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind

### Backend
- Next.js API routes

### Database
- PostgreSQL (Supabase or Neon)
- Prisma ORM

### Auth
- Auth.js or Supabase Auth

### AI
- OpenAI API
- Structured prompt system

### Hosting
- Vercel

---

## 11. Data Model

### Nursery
- id
- name

### NurserySettings
- nurseryId
- tone
- terminology
- preferences

### User
- id
- nurseryId
- role (manager/staff)

### PlanningGeneration
- id
- nurseryId
- userId
- inputJson
- outputText

### InsightGeneration
- id
- nurseryId
- userId
- observation
- outputText

---

## 12. AI Architecture

### Planning JSON Output
```json
{
  "title": "",
  "materials": [],
  "steps": [],
  "jewish_message": ""
}