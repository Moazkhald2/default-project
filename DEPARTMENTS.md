# Departments — Wiring Map + Automation

Single source: `apps/api/src/lib/store.ts` (students, payments, attendance, submissions).
Web client: `apps/web/src/lib/api.ts` (token-aware; every panel uses it).

| # | Department | API | UI | Automation |
|---|---|---|---|---|
| 1 | Auth & Users | `POST /api/auth/login` `GET /api/auth/me` | `AuthBar.tsx` | token in `api.ts` `authHeaders()` on every call |
| 2 | Students / Enrollment | `GET /api/students` `GET /:id` `POST /` `PUT /:id` `DELETE /:id` `POST /import` | `CsvImport.tsx` | `automate --check` validates bank; CSV import wired |
| 3 | Exams / Question Bank | `GET /api/exams/bank` `GET /bank/:id` `POST /` `POST /submit` `GET /submissions` | `MathExam.tsx` `QuestionCard.tsx` `TeacherDashboard.tsx` | `ingest.mjs` + `fetch_libraries.mjs` + `automate.mjs` nightly CI |
| 4 | Curriculum | `GET /api/exams/curriculum/:grade` | `TeacherDashboard.tsx` week picker | cached 5min server-side; validated by `automate` |
| 5 | HRMS Payments | `GET /payments/:studentId` `POST /payments` `PATCH /payments/:id` `POST /payments/sweep` `GET /overview` | `PaymentsPanel.tsx` (mark paid → PATCH, sweep button) | `POST /sweep` auto-marks `pending→overdue`; nightly `automate.yml`; `npm run hrms:sweep` |
| 6 | HRMS Attendance | `GET /attendance/:studentId` `POST /attendance` (upsert) | `AttendancePanel.tsx` (present/absent today, rate) | upsert avoids dupes; today-count in `/overview` |
| 7 | Gradebook | `GET /api/hrms/gradebook/:studentId` (live avg from `SUBMISSIONS`) | `GradebookPanel.tsx` | auto-updates on every `POST /exams/submit` — no cron needed |
| 8 | Billing (Stripe) | `POST /api/stripe/checkout` `POST /api/stripe/webhook` → `markPaymentPaid()` | `StripeButton.tsx` (checkout → webhook → paid) | webhook wires Stripe→HRMS; stub mode without `STRIPE_SECRET_KEY` |
| 9 | Observability | `GET /api/health` `POST /api/vitals` | `web-vitals.ts` `initWebVitals()` in `main.tsx` | CI `verify` + `deploy_check.mjs` gate |
| 10 | Content → Print | `math_builder.py` `generate_sheet.mjs` `batch_generate.mjs` → `dist/` | `dist/week*/sheet.pdf` | `sheet:week` + `deploy_check.mjs` typst step |
| 11 | DevOps | `verify.mjs` `backup-system.mjs` `autopilot.mjs` | CI `ci.yml` + `automate.yml` nightly | `npm run verify` / `automate` / `automate:check` / `backup:system` |

## New wiring (this pass)
- `store.ts` unifies HRMS+Students+Submissions (was 3 isolated in-memory copies).
- `gradebook` now computes from real submissions (was stub 78.5%).
- `PATCH /hrms/payments/:id` replaces POST-new hack in `PaymentsPanel`.
- `POST /hrms/payments/sweep` + `POST /stripe/webhook {studentId,month}` → `markPaymentPaid()`.
- `PUT/DELETE /students/:id` + `GET /:id` + search `?q=&grade=`.
- `AttendancePanel` added to Teacher view (was API-only, no UI).
- `scripts/automate.mjs` + `automate.yml` nightly: ingest both banks + sweep + verify.

Run: `npm run automate:check` (read-only) · `npm run hrms:sweep` · `npm run verify`.
