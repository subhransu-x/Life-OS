# Project Architecture Guidelines & Guardrails

## Core React & Next.js Patterns
All views and pages start as React Server Components by default. Do not add the `"use client"` directive unless client-side interactive capabilities are strictly required (e.g. event listeners, React state/effects, hooks, browser APIs). If only a sub-element of a page is interactive, extract it into a small Client Component instead of making the entire page Client.

---

## The 24 Architecture Guardrails

### Rule 01 — Server Components by Default
Every Next.js page and component starts as a Server Component. Do not add `"use client"` unless the component requires: `onClick`, `onChange`, `useState`, `useEffect`, `useRef`, or browser APIs. If a page needs interactivity, extract the interactive part into a sub-component that is Client. Never make an entire page Client because one element needs interactivity.

### Rule 02 — Never Fetch Data in useEffect
`useEffect` for data fetching is the pre-2023 React pattern. It causes loading spinners on every page load and defeats Server Components. All initial data fetching happens in Server Component bodies (direct `async/await`). Client-side re-fetching uses TanStack Query. Never: `useEffect(() => { fetchData() }, [])`.

### Rule 03 — No React Context for Data
React Context is not a data store. It causes unnecessary re-renders, makes code hard to trace, and is superseded by Server Components (for server data) and TanStack Query (for cached client data). The only acceptable use of Context: shadcn/ui components use it internally. Do not create custom Context providers.

### Rule 04 — No Custom Hooks in Phase 1
Custom hooks are an abstraction. Abstractions have a cost: indirection, maintenance, learnability. Phase 1 has too few components to justify abstraction. Write TanStack Query calls directly in components. Abstract in Phase 2 when there are 3+ identical patterns.

### Rule 05 — All TanStack Query Keys From `lib/queries/keys.ts`
Never hardcode query key strings in components. Always import from the keys file. A typo in a query key string (`['expenses']` vs `['expense']`) breaks cache invalidation silently. The keys file is the single source of truth.

### Rule 06 — No New npm Dependencies Without Explicit Approval
The stack is defined. Every dependency was chosen deliberately. If a problem arises, solve it with existing tools first. If you believe a dependency is needed, document: what it does, why existing tools don't solve it, what it costs. Common AI agent failure: installing 5 icon libraries "just in case".

### Rule 07 — `prisma migrate dev` is Local Only
Never run `prisma migrate dev` in production. It creates migration files that may conflict with the production state. Production uses `prisma migrate deploy`. The build command on Vercel runs `prisma migrate deploy`. This is non-negotiable.

### Rule 08 — No Raw SQL Queries
Prisma is the only way to communicate with the database. No `db.$queryRaw()` unless there is a documented performance reason. Raw SQL bypasses TypeScript type safety and opens SQL injection risk.

### Rule 09 — Validate Everything at the API Boundary
The API route handler is the trust boundary. Client-side validation (Zod in the form) is UX. Server-side validation (Zod in the route handler) is security. Both must exist. The server must never trust that client-side validation ran correctly.

### Rule 10 — Optimistic Updates Require Rollback
If you implement an optimistic update, you must also implement: (a) snapshot of current cache state in `onMutate`, (b) rollback to snapshot in `onError`, (c) error toast in `onError`, (d) cache invalidation in `onSettled`. An optimistic update without rollback is a bug waiting to happen.

### Rule 11 — Never Expose Secrets to the Browser
Environment variables prefixed with `NEXT_PUBLIC_` are bundled into the browser JavaScript. `DATABASE_URL`, `ANTHROPIC_API_KEY`, and `CRON_SECRET` must never have this prefix. If a browser component needs configuration, pass it as a prop from a Server Component that reads the environment variable.

### Rule 12 — Mobile First, Always
All CSS is written mobile-first. Start with the base style (390px width). Add responsive variants for larger screens. Never write desktop-first styles and override for mobile. `md:` prefix adds desktop styles. Base styles are mobile.

### Rule 13 — Minimum Tap Target: 44×44px
All interactive elements — buttons, checkboxes, row items — must be at least 44×44px on mobile. This is Apple's Human Interface Guideline. HabitCheckItem rows are 80px tall. Never make tap targets smaller to save space.

### Rule 14 — iPhone Safe Area Insets
All elements fixed to the bottom of the screen (BottomNavBar, FAB buttons) must account for the iPhone home indicator (34px). Use Tailwind's `pb-safe` or explicitly add `padding-bottom: env(safe-area-inset-bottom)`. Test on a real iPhone, not just Chrome DevTools mobile emulator.

### Rule 15 — No Premature Abstraction
The DRY principle ("Don't Repeat Yourself") is a code quality guideline, not an absolute law. In Phase 1, with 4 pages and 12 components, code repetition is acceptable if abstraction would add indirection. Abstract when the same pattern exists in 3+ places AND the pattern is stable (unlikely to change). The Rule of Three: tolerate 2 copies. Refactor 3+.

### Rule 16 — Component Files Have One Component
One component per file. No utility functions in component files. No types in component files. Types belong in `lib/types/`. Utilities belong in `lib/utils/`. This keeps components readable and searchable.

### Rule 17 — API Response Envelope is Non-Negotiable
Every API route returns `{ data: T | null, error: { message: string, code: string } | null }`. Never return a bare object. Never return an array at the root. The envelope allows the client to handle success and error consistently.

### Rule 18 — No `any` in TypeScript
Using `any` defeats TypeScript. It is always a symptom of a design problem: missing type, incorrect schema, lack of understanding of a third-party library. Solve the underlying problem. Use `unknown` if the type is genuinely unknown, then narrow it with type guards.

### Rule 19 — Dates Are Timezone-Aware
"What day is today?" depends on the user's timezone. A user logging a midnight expense in India (IST = UTC+5:30) gets the wrong date if the server assumes UTC. All date operations use the timezone stored in the user's preferences (`Asia/Kolkata` by default). The `lib/utils/date.ts` utility handles all date formatting and parsing.

### Rule 20 — Forms Are Never Full-Page
All data entry in Phase 1 happens in BottomSheet modals. Pages are for reading and review. This keeps the mobile UX consistent and prevents users from losing context.

### Rule 21 — No Console.log in Committed Code
`console.log` is acceptable during development. It must be removed before committing. Add an ESLint rule: `"no-console": "warn"`. Exception: `console.error` in error handlers is allowed.

### Rule 22 — Prisma Schema Changes Require a Migration
If `schema.prisma` changes, run `prisma migrate dev`. Commit both the schema change AND the migration file. Never change the schema without migrating. The migration history is the source of truth for database state.

### Rule 23 — Feature Folders Must Match the Architecture Document
When adding a new module (expenses, journal, habits), the folder structure must match: `app/[feature]/page.tsx`, `components/[feature]/`, `app/api/[feature]/route.ts`, `lib/validations/[feature].ts`, `lib/types/[feature].ts`. Deviating from this pattern makes the codebase inconsistent.

### Rule 24 — Document Decisions in `lib/ARCHITECTURE.md`
When a significant architectural decision is made (why a specific pattern was chosen, why a library was added, why a component was split), document it in `lib/ARCHITECTURE.md`. This is living documentation that future AI agents read before making changes.
