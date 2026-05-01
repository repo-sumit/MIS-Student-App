# HPU Admission — Student Mini App

A SwiftChat-style, mobile-first prototype of the student-facing surface of the HP Higher Education MIS. Built end-to-end as a polished demo: register, complete profile, discover courses, apply, track scrutiny, view merit, respond to seat allotment, pay the admission fee, and confirm admission.

The app runs entirely in the browser. No backend, no database, no auth server — every persistent piece of state lives in `localStorage`.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
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

The app runs on `http://localhost:3001`. The first paint serves the landing page; tap **Create account** to enter the authenticated journey.

Other scripts:

```bash
npm run build       # production build
npm run start       # serve the production build on :3001
npm run typecheck   # tsc --noEmit
```

## Demo walkthrough (≈ 5 minutes)

1. Open `/`. Hit **Create account**, fill the four fields, accept the terms.
2. You land on `/dashboard`. The status tracker shows step 1/7 (Registered).
3. Tap **Continue profile** and walk through the five-step builder. After step 4, the status flips to *Profile complete*.
4. Tap **Discover courses**. Eligibility chips appear next to each course. Pick one → **Apply**.
5. Pick preferences (BA up to 6, BSc up to 3) → **Rank** → **Review** → **Declaration** → **Submit**. The mock gateway lands on success ~85 % of the time; failures and pending states are also reachable.
6. Back on the dashboard, scroll to **Operator progression**. Tap **Advance to Under scrutiny**. The hero card flips to the scrutiny view.
7. Tap **Advance to Merit published** → confirm in the modal. The dashboard now shows your rank and best-of-five score.
8. Tap **Advance to Allotted** → confirm. The seat offer card appears. Tap **Open seat offer**.
9. On `/allotment/[courseId]`, choose **Freeze and pay**. You're routed to `/payment/[courseId]`. Tap **Pay**.
10. Admission confirmation lands with a roll number generated as `{COLLEGE}/2026/0047`.
11. Use the **Reset** link in the operator panel at any point to return to the real flow without touching real application data.

## Architecture

### Provider tree (in mount order)

```
LocaleProvider
  ToastProvider
    ProfileProvider
      DocumentsProvider
        ApplicationsProvider
          ScrutinyBridgeProvider
            AllotmentBridgeProvider
              DemoProgressProvider
                <App />
```

### `localStorage` keys

| Key | Owner | Purpose |
|---|---|---|
| `hp-mis:profile-draft` | ProfileProvider | five-step profile draft |
| `hp-mis:applications` | ApplicationsProvider | course → application draft map |
| `hp-mis:documents` | DocumentsProvider | document upload state by docType |
| `hp-mis:locale` | LocaleProvider | `"en"` or `"hi"` |
| `hp-mis:scrutiny` | ScrutinyBridgeProvider | review status + discrepancies |
| `hp-mis:merit` | AllotmentBridgeProvider | merit-published map |
| `hp-mis:allocation` | AllotmentBridgeProvider | allocation entries |
| `hp-mis:student-demo-stage` | DemoProgressProvider | active demo override stage |

### Effective-step rule

Every page that switches on lifecycle state reads `useEffectiveStudentStep()`. The hook computes `step = demoStage ?? realStep` so a single Reset returns the entire UI to the real flow.

When demo forces `allotted` or `admissionConfirmed` and there is no real allocation, the hook synthesizes a read-only `AllocationEntry` (rank #47, BoF 87.4 %, fee from the offering catalogue, college from the first preference) so the allotment, payment and dashboard pages all have coherent data to render.

## Design system

The app respects the SwiftChat Design System for the student app — Montserrat for Latin, Mukta for Devanagari, brand `#386AF6`, pill controls, friendly cards. UX4G styling is **not** used here; it is reserved for the portal app.

Tokens live in `src/app/globals.css` and are mapped to Tailwind utilities through `tailwind.config.ts`.

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

## What's mocked vs real

- **Real:** every UI state, every transition, every persistence layer, eligibility evaluation, fee breakup, application number generation, roll number generation, bilingual rendering.
- **Mocked:** the payment gateway (1.1 s simulated processing), the DigiLocker fetch (1.4 s simulated pull), the file upload (read locally only — file content is not persisted, only metadata), the scrutiny outcomes (driven by the operator panel or the bridge providers).

## File map

```
src/
├── app/                           # Next.js App Router
│   ├── (each route)/page.tsx
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── apply/                     # apply flow shell
│   ├── profile/                   # profile step shell
│   ├── shell/                     # PageShell, MobileHeader, BottomTabBar, StatusTracker, stage views, demo control
│   └── ui/                        # Button, Card, Badge, Field/Input, Modal, Stepper, etc.
├── domain/
│   ├── types.ts
│   └── fixtures.ts                # colleges, courses, combinations, districts
├── i18n/
│   ├── en.json
│   └── hi.json
├── providers/
│   ├── locale-provider.tsx
│   ├── toast-provider.tsx
│   ├── profile-provider.tsx
│   ├── documents-provider.tsx
│   ├── applications-provider.tsx
│   ├── bridge-providers.tsx       # scrutiny + allotment
│   ├── demo-progress-provider.tsx
│   ├── use-effective-step.ts
│   └── storage.ts
└── services/
    ├── status.ts                  # effective step, generators, demo helpers
    ├── eligibility.ts             # offering evaluation
    ├── fee.ts                     # fee breakup, INR formatting
    └── allocation.ts              # synthetic allocation builder
```

## Acceptance checklist

- [x] App runs without backend
- [x] Student can complete profile (5 steps)
- [x] Student can discover courses with live eligibility
- [x] Student can apply, rank preferences and submit
- [x] Dashboard reflects the entire 7-step lifecycle
- [x] Demo override walks `submitted → underScrutiny → meritPublished → allotted → admissionConfirmed`
- [x] Demo override never mutates real provider state
- [x] Reset returns the dashboard to the real flow instantly
- [x] Bilingual EN/HI on every Tier-1 screen
- [x] No UX4G styling
- [x] No dead CTAs, no placeholder-looking screens
