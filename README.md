# HPU Admission - Student App

Student-facing admission mini-app for colleges affiliated to Himachal Pradesh University. The app guides an applicant from account creation through profile completion, course discovery, application submission, scrutiny, merit lookup, allotment response, admission fee payment, and final admission confirmation.

This is a frontend-only Next.js application. No backend service, database, real authentication service, real payment gateway, or API routes were found in the current app. Persistent state is stored in browser `localStorage`.

## Overview

The Student App is the applicant surface of HP Higher Education MIS. It is designed as a mobile-first, bilingual admission journey with HPU branding, a status tracker, actionable dashboard cards, and localized English/Hindi copy.

Primary user flow:

1. Register or sign in with mock client-side credentials.
2. Complete a five-step profile.
3. Discover courses and colleges filtered by eligibility.
4. Select and rank preferences for a course.
5. Review details, accept the declaration, and pay the mock application fee.
6. Track application scrutiny through a deterministic local lifecycle engine.
7. Resolve a document discrepancy if one is generated.
8. Search the merit list after publication.
9. Respond to seat allotment with Freeze, Float, or Decline.
10. Pay the admission fee and receive a generated roll number.

## Key Features

- Bilingual UI powered by `src/i18n/en.json` and `src/i18n/hi.json`.
- Public pages for landing, login, registration, password reset, language selection, important dates, help, how-it-works, and merit lookup.
- Mock registration with validation for email, Indian mobile number, password length, password confirmation, and consent.
- Mock login that accepts non-empty credentials and records registration metadata if needed.
- Five-step profile flow:
  - Step 1: personal details, parent names, DOB, gender, mobile, email, masked Aadhaar.
  - Step 2: address, district, pincode, state.
  - Step 3: board, passing year, roll number, stream, best-of-five marks, result status.
  - Step 4: category, domicile, SGC/PwD claims, document upload links.
  - Step 5: bank holder, account number, IFSC, bank name.
- Eligibility engine with conditional, eligible, and not eligible states.
- Course and college discovery with search, district filter, stream filter, and eligibility filter.
- Application preference flow:
  - preference candidates combine eligible course combinations with colleges offering the same course type.
  - preference caps are read from course offering data.
  - rank order can be moved up/down or removed.
- Application review and declaration gate before submission.
- Mock application fee gateway with success, pending, and failure states.
- Deterministic local scrutiny lifecycle:
  - scrutiny starts 6 seconds after submission.
  - scrutiny outcome is decided 14 seconds later.
  - verified outcomes publish merit 8 seconds after verification.
- Stable scrutiny outcome derived from application number:
  - 70% verified.
  - 20% discrepancy.
  - 10% conditional.
- Document upload through simulated DigiLocker or device upload.
- Document discrepancy fix flow that re-uploads and returns the application to verified state.
- Merit lookup that requires the exact application number after merit unlock.
- Allotment response flow with Freeze, Float, and Decline.
- Admission fee payment that generates a roll number and confirms admission.
- Dashboard with status tracker, next-action card, active application summary, timeline, and quick links.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Motion | Framer Motion |
| Icons | Lucide React |
| Fonts | Montserrat and Mukta via `next/font/google` |
| State | React Context providers |
| Persistence | Browser `localStorage` |
| Package manager | npm with `package-lock.json` |

Not found in the current app:

- backend framework
- API routes
- database/ORM
- external auth provider
- real payment integration
- test framework
- CI/CD or Docker configuration

## Architecture

### Provider Tree

Defined in `src/app/providers.tsx`:

```text
LocaleProvider
  -> ToastProvider
    -> MetaProvider
      -> ProfileProvider
        -> DocumentsProvider
          -> ApplicationsProvider
            -> AllocationProvider
              -> App routes
```

### Important Folders

```text
Student-App/
|-- src/
|   |-- app/                  # Next.js routes
|   |-- components/
|   |   |-- apply/            # multi-step application shell
|   |   |-- profile/          # multi-step profile shell
|   |   |-- shell/            # page shell, header, tracker, next action, timeline
|   |   `-- ui/               # shared app UI primitives
|   |-- domain/               # TypeScript domain types and fixtures
|   |-- i18n/                 # English and Hindi dictionaries
|   |-- providers/            # local state and persistence providers
|   `-- services/             # eligibility, fee, lifecycle, status helpers
|-- public/
|   `-- assets/HPU_Logo.png
|-- package.json
|-- tailwind.config.ts
|-- next.config.mjs
`-- tsconfig.json
```

### Important Modules

| File | Purpose |
| --- | --- |
| `src/domain/types.ts` | Core domain types such as profile, application, document, allocation, and timeline entries |
| `src/domain/fixtures.ts` | Seeded districts, colleges, combinations, offerings, and recent updates |
| `src/services/eligibility.ts` | Course eligibility checks |
| `src/services/lifecycle.ts` | Student application lifecycle, timeline, allocation creation, and next action logic |
| `src/services/status.ts` | Profile completeness and generated IDs |
| `src/services/fee.ts` | Application fee, fee breakup, INR formatting |
| `src/providers/storage.ts` | Safe JSON read/write helpers and storage keys |
| `src/providers/applications-provider.tsx` | Application drafts, submission, lifecycle auto-advance, discrepancy resolution |
| `src/providers/allocation-provider.tsx` | Allotment and roll number state |
| `src/providers/profile-provider.tsx` | Five-step profile draft state |
| `src/providers/documents-provider.tsx` | Document upload and rejection state |

## Business Logic

### Profile Completeness

`hasEnoughProfile()` in `src/services/status.ts` requires:

- full name
- DOB
- mobile
- email
- address
- district
- pincode
- board
- passing year
- stream
- best-of-five marks
- category
- domicile
- completed step 4

Step 5 bank details are validated and saved separately. `isProfileFullyComplete()` requires step 5 in addition to the profile threshold above.

### Eligibility Rules

`evaluateOne()` in `src/services/eligibility.ts` returns:

- `conditional` when academic details are incomplete.
- `not_eligible` when a required science background is missing.
- `not_eligible` when marks are below the offering minimum.
- `conditional` for compartment or awaited Class 12 results.
- `eligible` when rules pass, with informational reasons for near-cutoff or non-HP domicile cases.

### Application Submission

- Drafts are lazily created by `ensureDraft(courseId)`.
- Preferences are persisted with `rankOrder`.
- The declaration checkbox must be accepted before the submit page.
- `applicationFee()` is fixed at `250`.
- Successful submit writes:
  - `status: "submitted"`
  - `submittedAt`
  - generated `applicationNumber`
  - `applicationFeePaid: true`

### Lifecycle Engine

Defined in `src/services/lifecycle.ts`.

```text
draft
-> submitted
-> underScrutiny
-> discrepancyRaised OR verified OR conditionallyVerified
-> meritPublished
-> allotted
-> feePaid
-> admissionConfirmed
```

Timing constants:

| Transition | Delay |
| --- | --- |
| submitted to scrutiny start | 6 seconds |
| scrutiny start to outcome | 14 seconds |
| verified to merit published | 8 seconds |

`ApplicationsProvider` runs the auto-advance loop every 4 seconds on the client.

### Discrepancy Handling

- The lifecycle engine may create a discrepancy for `class12`, `domicile`, `photo`, or `category`.
- The discrepancy includes document type, reason, raised time, and a 7-day deadline.
- Re-upload from `documents/rejection/[docType]` calls `resolveAppDiscrepancy()`.
- Resolution clears the discrepancy and immediately marks the application verified.

### Merit, Allotment, and Payment

- Merit lookup is locked until the effective student step is at least `meritPublished`.
- Searching the exact application number marks merit as viewed.
- Visiting `/allotment/[courseId]` after merit creates an allocation entry if one does not exist.
- Allocation response choices:
  - `freeze`: persists response and routes to payment.
  - `float`: persists response and returns to dashboard.
  - `decline`: requires modal confirmation and returns to dashboard.
- Payment always succeeds after the simulated delay.
- Confirmation writes `feePaidAt`, `admissionConfirmedAt`, allocation `status: "admission_confirmed"`, and a generated roll number.

## Routes

| Area | Routes |
| --- | --- |
| Public | `/`, `/register`, `/login`, `/forgot-password`, `/language`, `/how-it-works`, `/dates`, `/help`, `/merit-lookup` |
| Dashboard | `/dashboard` |
| Profile | `/profile/step/1` to `/profile/step/5` |
| Discovery | `/discover`, `/discover/course/[courseId]`, `/discover/college/[collegeId]` |
| Apply | `/apply`, `/apply/[courseId]/preferences`, `/apply/[courseId]/rank`, `/apply/[courseId]/review`, `/apply/[courseId]/declaration`, `/apply/[courseId]/submit`, `/apply/[courseId]/submitted` |
| Applications | `/applications`, `/applications/[courseId]/issues` |
| Documents | `/documents/upload/[docType]`, `/documents/preview/[docType]`, `/documents/rejection/[docType]` |
| Allotment/payment | `/allotment/[courseId]`, `/payment/[courseId]` |
| Error | custom 404 in `src/app/not-found.tsx` |

## API Documentation

Not found in the current app.

- No `src/app/api` directory was found.
- No HTTP client calls were found in the app code.
- All behavior is local UI state, fixtures, pure services, and `localStorage`.

## Data Model and Local Persistence

### Main Types

Defined in `src/domain/types.ts`.

| Type | Purpose |
| --- | --- |
| `ProfileDraft` | Student profile across the five-step flow |
| `ApplicationDraft` | Course application, preferences, declaration, payment, lifecycle timestamps |
| `DiscrepancyEntry` | Open document issue created during scrutiny |
| `AllocationEntry` | Seat offer, response, fee breakup, roll number |
| `DocumentEntry` | Uploaded document metadata and status |
| `TimelineEntry` | Dashboard timeline event |
| `College`, `Combination`, `CourseOffering` | Seeded catalog data |

### localStorage Keys

Defined in `src/providers/storage.ts`.

| Key | Owner | Purpose |
| --- | --- | --- |
| `hp-mis:profile-draft` | `ProfileProvider` | profile draft |
| `hp-mis:applications` | `ApplicationsProvider` | application drafts and lifecycle timestamps |
| `hp-mis:documents` | `DocumentsProvider` | document upload metadata |
| `hp-mis:locale` | `LocaleProvider` | selected locale, `en` or `hi` |
| `hp-mis:allocation` | `AllocationProvider` | allotment/payment records |
| `hp-mis:meta` | `MetaProvider` | account timestamps |
| `hp-mis:scrutiny` | defined only | no active consumer found |
| `hp-mis:merit` | defined only | no active consumer found |

## Environment Variables

No environment variables were found in this app.

| Variable | Purpose | Required | Default | Used in |
| --- | --- | --- | --- | --- |
| Not found | N/A | N/A | N/A | N/A |

## Installation

```bash
cd Student-App
npm install
```

## Running the Project

```bash
npm run dev
```

The development server runs on:

```text
http://localhost:3001
```

Other scripts:

| Command | Purpose | Notes |
| --- | --- | --- |
| `npm run build` | Production build | Verified during README update |
| `npm run start` | Serve production build on port 3001 | Requires a prior build |
| `npm run typecheck` | `tsc --noEmit` | Verified during README update |
| `npm run lint` | Next lint command | Currently opens ESLint setup prompt because no ESLint config exists |

Windows PowerShell note:
If `npm run ...` is blocked by script execution policy, use `npm.cmd run ...`.

## Testing

Not found in the current app.

- No test files were found.
- No Jest, Vitest, Playwright, Cypress, or Testing Library setup was found.
- Recommended high-value tests:
  - eligibility service tests
  - lifecycle timing/outcome tests
  - profile validation tests
  - application flow tests
  - allotment/payment state tests

## Deployment

No deployment configuration was found for this app.

The deployable shape is a standard standalone Next.js frontend:

```bash
npm run build
npm run start
```

Constraints:

- State is stored in the browser and is not shared across users or devices.
- Data is not durable beyond browser storage.
- The app does not currently talk to the portal through a backend.
- Same-origin deployment would be required for any `localStorage`-based cross-app sharing.

## Security and Permissions

- Authentication is mocked; there is no server-side identity verification.
- Route access is not security-enforced by a backend.
- Personal, academic, document metadata, and bank details are stored in browser `localStorage`.
- Aadhaar is represented as a masked field only.
- No rate limiting, CSRF protection, server-side validation, or audit service was found.

## Error Handling and Logging

What exists:

- Inline validation errors on forms.
- Toast notifications for user actions.
- Fallbacks for invalid/missing route params on some detail pages.
- Safe JSON read fallback in `readJSON()`.
- Custom 404 page.

Not found:

- remote logging
- monitoring
- error reporting service
- retry queue
- backend logs

## Known Constraints

- Frontend-only prototype.
- No real user account system.
- No real file upload or document preview renderer.
- No real DigiLocker integration.
- No real payment gateway.
- Merit and scrutiny are simulated locally, not consumed from portal state.
- `hp-mis:scrutiny` and `hp-mis:merit` keys are defined but not actively wired into the student UI.
- `npm run lint` is not configured to run non-interactively yet.
- Existing documents in `Docs/` may describe a broader or older architecture than the current source tree.

## Future Improvements

- Add backend APIs for profile, applications, documents, scrutiny, merit, allocation, and payment.
- Add real authentication and OTP/password reset flows.
- Replace `localStorage` persistence with server-backed data.
- Wire real portal-to-student synchronization.
- Add real document upload, preview, validation, and storage.
- Add a real payment provider.
- Configure ESLint and add automated tests.
- Add CI/CD and deployment instructions.

## Contribution Guidelines

No app-specific contribution policy was found.

Recommended baseline:

1. Keep changes aligned with the existing provider/service/page structure.
2. Run `npm run typecheck` and `npm run build` before handing off.
3. Update this README when routes, storage keys, lifecycle behavior, or commands change.
4. Avoid introducing backend assumptions unless backend code is added in the same change.
