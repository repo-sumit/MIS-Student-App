# HPU Admission — Student Mini App

A SwiftChat-styled, responsive student admission portal for colleges affiliated to Himachal Pradesh University. Register, complete profile, discover eligible courses, submit an application, track college scrutiny (and resolve any document issues raised), view merit, respond to a seat allotment, pay the admission fee, and download your admission letter.

The app runs entirely in the browser. No backend, no database, no auth server — every persistent piece of state lives in `localStorage`. Lifecycle progression is driven by real user actions plus a deterministic, time-based local progression engine — there is no operator/admin panel.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 3 with SwiftChat-aligned tokens
- Framer Motion for subtle transitions
- Lucide React for icons
- React Context + `localStorage` for persistence

## Getting started

```bash
cd "Student-App"
npm install
npm run dev
```

The app runs on `http://localhost:3001`.

```bash
npm run build       # production build
npm run start       # serve the production build on :3001
npm run typecheck   # tsc --noEmit
```

## Walkthrough

1. **Create account** at `/register`. The header shows the HPU logo and the locale switch.
2. **Complete profile** in five steps. After step 4 the profile is marked complete; the dashboard CTA flips to "Discover eligible courses". Step 5 (bank) is recommended before payment.
3. **Discover** at `/discover`. Filter by district, stream and eligibility. Eligibility chips are computed live against your Class 12 details.
4. **Select preferences** (BA up to 6, BSc up to 3) → **Rank** → **Review** → **Declaration** → **Submit**. The mock gateway lands on success ~85% of the time; failures and pending states are also reachable.
5. **Track scrutiny.** The application moves to *Under scrutiny* automatically a few seconds after submission. The dashboard's next-action card and timeline reflect each transition.
6. **Resolve document issue (if raised).** ~20% of scrutinies surface a document discrepancy. The applications page badges it as *Action needed*; tap **Fix document**, re-upload, and the application returns to the review queue.
7. **View merit** at `/merit-lookup` once the merit list is published for your application. Searching with your application number reveals a result card with rank, BoF percentage, category, course and first-preference college.
8. **Respond to allotment** at `/allotment/[courseId]`. Visiting the page after merit acknowledgement creates a real allocation entry in `localStorage`. Choose Freeze (→ payment), Float (toast + back to dashboard) or Decline (with confirm modal).
9. **Pay admission fee** at `/payment/[courseId]`. A simulated gateway issues a roll number on success.
10. **View admission confirmation.** The dashboard, applications list and timeline all reflect the issued roll number. Receipt and admission letter stubs are downloadable from the success view.

There is no operator panel anywhere in the UI. Every progression is caused by either a user action or the deterministic time-based engine.

## Architecture

### Provider tree

```
LocaleProvider
  ToastProvider
    MetaProvider
      ProfileProvider
        DocumentsProvider
          ApplicationsProvider
            AllocationProvider
              <App />
```

`MetaProvider` holds account-level timestamps (registered, profile completed). `ApplicationsProvider` runs a 4-second `setInterval` that advances each submitted application through its lifecycle based on saved timestamps.

### `localStorage` keys

| Key | Owner | Purpose |
|---|---|---|
| `hp-mis:profile-draft` | ProfileProvider | five-step profile draft |
| `hp-mis:applications` | ApplicationsProvider | course → application draft + lifecycle timestamps |
| `hp-mis:documents` | DocumentsProvider | document upload state by docType |
| `hp-mis:locale` | LocaleProvider | `"en"` or `"hi"` |
| `hp-mis:allocation` | AllocationProvider | allocation entries by courseId |
| `hp-mis:meta` | MetaProvider | `registeredAt`, `profileCompletedAt` |

### Lifecycle engine — `src/services/lifecycle.ts`

The engine is deterministic. After an application is submitted:

- **+6 s** → scrutiny visibly starts (`scrutinyStartedAt`)
- **+14 s after that** → an outcome is decided. The outcome is derived from a hash of the application number so it is stable across reloads:
  - 70% **verified**
  - 20% **discrepancy** — a specific document is flagged with a realistic reason; the dashboard's next-action becomes "Fix document"
  - 10% **conditional** — verified with a caveat
- **+8 s after verifiedAt** → merit is published (`meritPublishedAt`)
- The student must **view the merit result** to acknowledge (`meritViewedAt`).
- Visiting **/allotment/[courseId]** then creates the persisted allocation entry (`allocationCreatedAt`) and routes the student through Freeze / Float / Decline.
- Freezing routes to **/payment/[courseId]**. On success, `feePaidAt` and `admissionConfirmedAt` are stored, and a roll number is issued.

Internally the engine also exposes `lifecycleOf()`, `getNextAction()`, `getApplicationTimeline()`, `createAllocationEntry()`, `resolveDiscrepancy()`, and `deriveMajorTrackerStep()` (which collapses the rich lifecycle to the 7-step tracker). These are pure functions used from both the dashboard and applications pages.

### Responsive layout

The app is fully responsive across mobile, tablet, laptop, desktop and widescreen.

| Utility | Used for |
|---|---|
| `.app-container` | top-level container · max 1180px · `px-4 sm:px-6 lg:px-10 xl:px-12` |
| `.form-container` | centred forms · max 640px |
| `.content-narrow` | reading-width pages · max 720px |
| `.content-wide` | listings and dashboards · max 1180px |
| `.dashboard-grid` | 12-column grid on `lg+`, single column on smaller |
| `.card-grid` | 1-up mobile · 2-up tablet · 3-up desktop |

`PageShell` accepts a `size` prop (`"narrow" | "medium" | "wide" | "dashboard"`). Layouts:

- **Mobile (≤ 767 px)** — single column, sticky header, bottom tab bar.
- **Tablet (768–1023 px)** — centred content, 2-column card grids; the bottom tab bar is still visible.
- **Laptop / Desktop (≥ 1024 px)** — bottom tab bar hidden, horizontal nav in the header (Home · Apply · Applications · Dates · Help). Dashboard expands to an 8/4 column grid (tracker + next-action + timeline + quick links on the left, application summary + recent updates on the right). Forms stay centred at `max-w-[640px]`. Discover and Apply listings expand to 3-up.
- **Widescreen (≥ 1366 px)** — the same 1180 px container plus larger outer padding; cards never stretch awkwardly.

### Header / Logo

`public/assets/HPU_Logo.png` (referenced from `/assets/HPU_Logo.png`) is used in:

- the site header (`SiteHeader` — 28 px on mobile, 32 px on desktop)
- the landing page hero (lifecycle preview card)
- the icons metadata (`<link rel="icon">` and apple-touch-icon, plus `public/favicon.ico`)

> Note: the file in the `Docs/` folder is named `HPU_Logo.svg` but is actually a PNG binary. We've copied it into `public/assets/HPU_Logo.png` so browsers receive the correct `image/png` Content-Type.

## Routes

| Section | Routes |
|---|---|
| Pre-login | `/`, `/register`, `/login`, `/forgot-password`, `/language`, `/how-it-works`, `/dates`, `/help`, `/merit-lookup` |
| Dashboard | `/dashboard` |
| Profile | `/profile/step/1` … `/profile/step/5` |
| Discover | `/discover`, `/discover/college/[collegeId]`, `/discover/course/[courseId]` |
| Apply | `/apply`, `/apply/[courseId]/preferences`, `/apply/[courseId]/rank`, `/apply/[courseId]/review`, `/apply/[courseId]/declaration`, `/apply/[courseId]/submit`, `/apply/[courseId]/submitted` |
| Applications | `/applications`, `/applications/[courseId]/issues` |
| Allotment / payment | `/allotment/[courseId]`, `/payment/[courseId]` |
| Documents | `/documents/upload/[docType]`, `/documents/preview/[docType]`, `/documents/rejection/[docType]` |

## Acceptance checklist

- [x] Operator Progression panel and any "demo only" copy are fully removed.
- [x] Lifecycle progresses through real user actions and a deterministic local engine.
- [x] Document discrepancy / re-upload flow is realistic and resolvable.
- [x] Dashboard always shows the correct next action.
- [x] 7-step tracker remains; richer internal statuses surface where useful (e.g. *Action needed*, *Resubmitted*).
- [x] App is responsive across mobile, tablet, laptop and widescreen.
- [x] Forms remain centred and readable on desktop.
- [x] Cards do not stretch awkwardly on widescreen.
- [x] HPU logo is used for header, landing hero and favicon.
- [x] Bottom tab bar appears only on mobile / tablet (`lg:hidden`).
- [x] Build passes with zero TypeScript errors and zero warnings.
