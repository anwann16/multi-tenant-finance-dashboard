# TASK LIST — Aplikasi Pengeluaran & Pemasukan Kantor

## Phase 0: Project Setup (Day 1)

### T0.1 — Init Project

- [x] `npx create-next-app@latest kantor-app` (TypeScript, Tailwind, App Router)
- [x] Install dependencies:
  - `prisma`, `@prisma/client`
  - `better-auth`
  - `zod`, `react-hook-form`, `@hookform/resolvers`
  - `@tanstack/react-query`
  - `zustand`
  - `bcryptjs`, `@types/bcryptjs`
  - `recharts`
  - `date-fns`
  - `lucide-react` (icons)
  - `sonner` (toast notifications)
  - `exceljs` (export Excel)
  - `@react-pdf/renderer` (export PDF)
- [x] Init shadcn/ui: `npx shadcn@latest init`
- [x] Add shadcn components: button, card, dialog, dropdown-menu, input, select, table, badge, calendar, form, label, tabs, separator, avatar, sheet, tooltip, popover, command
- [x] Setup `.env.local`:
  ```
  DATABASE_URL=postgresql://...
  BETTER_AUTH_SECRET=...
  BETTER_AUTH_URL=http://localhost:3000
  UPLOAD_DIR=./public/uploads
  ```
- [x] Setup `docker-compose.yml` (PostgreSQL local dev)
- [x] Setup `.eslintrc.json`, `.prettierrc`, `.gitignore`
- [ ] Init Git repo + push to GitHub
- [x] Init Prisma: `npx prisma init`

### T0.2 — Database Setup

- [x] Write full Prisma schema (from PRD section 7)
- [x] `npx prisma db push` (create tables)
- [x] `npx prisma generate` (generate client)
- [x] Create `src/lib/prisma.ts` (singleton pattern)
- [x] Create `prisma/seed.ts` (default kategori + admin user)
- [x] `npx prisma db seed`

### T0.3 — Project Config

- [x] Setup `src/lib/constants.ts` (enums, defaults)
- [x] Setup `src/lib/utils.ts` (cn, formatCurrency, formatDate)
- [x] Setup `src/lib/validators.ts` (base Zod schemas)
- [x] Setup `src/types/` (shared types, API response types)
- [x] Setup `vitest.config.ts` (unit test)
- [x] Setup `playwright.config.ts` (E2E test)
- [ ] First commit: `chore: init project with prisma schema`

---

## Phase 1: Authentication (Day 2-3)

### T1.1 — Auth Backend

- [x] `src/lib/auth.ts` — Better Auth config (credentials provider + Prisma adapter)
- [x] `src/app/api/auth/[[...all]]/route.ts` — Better Auth catch-all route handler
- [ ] `src/app/api/auth/sign-up/route.ts` — Custom sign-up endpoint (if custom logic needed, otherwise Better Auth handles it)
- [x] `src/services/auth.service.ts` — signIn, signUp, getCurrentUser, signOut
- [x] Password hashing (bcrypt 12 rounds)
- [x] Database session strategy (Better Auth manages sessions via Session/Account tables)
- [x] Better Auth middleware integration (better-auth/middleware)
- [ ] Unit test: auth.service.test.ts

### T1.2 — Auth Frontend

- [x] `src/app/(auth)/layout.tsx` — Auth layout (centered card)
- [x] `src/app/(auth)/login/page.tsx` — Login form
- [x] `src/app/(auth)/register/page.tsx` — Register form (admin only first)
- [x] `src/components/shared/AuthForm.tsx` — Reusable form component
- [x] Form validation with Zod + react-hook-form
- [x] Error handling (wrong password, user not found)
- [x] Redirect after login → dashboard
- [x] Use Better Auth's built-in signUp.email() and signIn.email() client helpers

### T1.3 — Middleware & Session

- [x] `src/middleware.ts` — Protect /dashboard routes
- [x] Better Auth session provider setup (from better-auth/react)
- [x] `useSession()` from better-auth/react
- [x] Logout functionality
- [x] First commit: `feat(auth): login/register with Better Auth`

---

## Phase 2: Multi-Tenant — Kantor Management (Day 3-5)

### T2.1 — Kantor Backend

- [x] `src/services/kantor.service.ts`:
  - `createKantor()`
  - `getKantors()` (admin: all, finance: assigned)
  - `getKantorById()`
  - `updateKantor()`
  - `deleteKantor()` (soft delete)
  - `assignUserToKantor()`
  - `unassignUserFromKantor()`
  - `getKantorUsers()`
- [x] `src/app/api/kantor/route.ts` — GET, POST
- [x] `src/app/api/kantor/[id]/route.ts` — GET, PUT, DELETE
- [x] `src/app/api/kantor/[id]/assign/route.ts` — POST, DELETE
- [x] Tenant isolation middleware (check kantorId access)
- [ ] Unit test: kantor.service.test.ts

### T2.2 — Kantor Frontend

- [x] `src/app/(dashboard)/kantor/page.tsx` — List kantor (card grid)
- [x] `src/app/(dashboard)/kantor/new/page.tsx` — Create kantor form
- [x] `src/app/(dashboard)/kantor/[id]/page.tsx` — Detail kantor + user list
- [x] `src/app/(dashboard)/kantor/[id]/edit/page.tsx` — Edit kantor
- [x] `src/components/kantor/KantorForm.tsx`
- [x] `src/components/kantor/KantorCard.tsx`
- [x] `src/components/kantor/KantorTable.tsx`
- [x] `src/components/kantor/UserAssignDialog.tsx` — Dialog assign user
- [x] `src/hooks/useKantor.ts` — React Query hooks
- [x] First commit: `feat(kantor): CRUD kantor + user assignment`

---

## Phase 3: Layout & Navigation (Day 5-6)

### T3.1 — Dashboard Layout

- [x] `src/app/(dashboard)/layout.tsx` — Authenticated layout
- [x] `src/components/layout/Sidebar.tsx` — Collapsible sidebar
- [x] `src/components/layout/Topbar.tsx` — User menu, notification bell
- [x] `src/components/layout/SidebarItem.tsx`
- [x] `src/components/layout/Breadcrumb.tsx`
- [x] `src/components/layout/NotificationBell.tsx`
- [x] Responsive: mobile hamburger menu (Sheet component)
- [x] Active state highlight on sidebar
- [x] First commit: `feat(layout): dashboard sidebar + topbar`

---

## Phase 4: Kategori Management (Day 6-7)

### T4.1 — Kategori Backend

- [x] `src/services/kategori.service.ts`:
  - `getKategoris()` (by kantorId + type)
  - `createKategori()`
  - `updateKategori()`
  - `deleteKategori()` (non-default only)
- [x] `src/app/api/kategori/route.ts` — GET, POST
- [x] `src/app/api/kategori/[id]/route.ts` — PUT, DELETE
- [x] Default kategori seed (per kantor saat create kantor baru)
- [ ] Unit test: kategori.service.test.ts

### T4.2 — Kategori Frontend

- [x] `src/app/(dashboard)/kategori/page.tsx` — Kategori manager
- [x] `src/components/kategori/KategoriForm.tsx` — Add/edit dialog
- [x] `src/components/kategori/KategoriList.tsx` — Grouped by type
- [x] `src/components/kategori/KategoriIconPicker.tsx` — Icon + color picker
- [x] First commit: `feat(kategori): manage transaction categories`

---

## Phase 5: Transaksi — Pengeluaran & Pemasukan (Day 7-12) ⭐ CORE

### T5.1 — Transaksi Backend

- [x] `src/services/transaksi.service.ts`:
  - `createTransaksi()` — Generate nomor, save
  - `getTransaksiList()` — Filter, paginate, search
  - `getTransaksiById()` — Detail + bukti
  - `updateTransaksi()` — Draft only
  - `confirmTransaksi()` — DRAFT → CONFIRMED, update saldo
  - `cancelTransaksi()` — DRAFT/CONFIRMED → CANCELLED
  - `deleteTransaksi()` — Draft only
  - `generateNomorTransaksi()` — Auto nomor per bulan
  - `getSaldoKantor()` — Calculate balance
  - `getRunningBalance()` — Balance after each transaction
- [x] `src/app/api/transaksi/route.ts` — GET, POST
- [x] `src/app/api/transaksi/[id]/route.ts` — GET, PUT, DELETE
- [x] `src/app/api/transaksi/[id]/confirm/route.ts` — POST
- [x] Transaction atomicity (Prisma $transaction)
- [ ] Unit test: transaksi.service.test.ts (CRUD, nomor gen, saldo calc)

### T5.2 — Transaksi Frontend — Form

- [x] `src/app/(dashboard)/transaksi/pengeluaran/new/page.tsx`
- [x] `src/app/(dashboard)/transaksi/pemasukan/new/page.tsx`
- [x] `src/components/transaksi/TransaksiForm.tsx` — Shared form
  - Tanggal (calendar picker)
  - Kategori (dynamic dropdown based on type)
  - Deskripsi (textarea)
  - Nominal (currency input)
  - Metode Bayar (Tunai/Transfer/Card)
  - Rekening Info (conditional: show if Transfer/Card)
  - Petty Cash toggle (conditional: show if pengeluaran)
  - Upload Bukti (drag & drop, max 5 files)
- [x] `src/components/transaksi/BuktiUpload.tsx` — File upload component
- [ ] `src/components/shared/CurrencyInput.tsx` — Rp formatting
- [ ] `src/components/shared/DatePicker.tsx`
- [x] Form validation (Zod schema)
- [x] Success redirect + toast notification

### T5.3 — Transaksi Frontend — List & Detail

- [x] `src/app/(dashboard)/transaksi/page.tsx` — List all transaksi
- [x] `src/app/(dashboard)/transaksi/[id]/page.tsx` — Detail transaksi
- [x] `src/components/transaksi/TransaksiTable.tsx` — Sortable table
- [x] `src/components/transaksi/TransaksiFilter.tsx` — Filter panel
  - Date range
  - Kategori
  - Status (Draft/Confirmed/Cancelled)
  - Metode Bayar
  - Nominal range
  - Search keyword
- [x] `src/components/transaksi/TransaksiDetail.tsx` — Detail view
- [x] `src/components/transaksi/TransaksiActions.tsx` — Confirm/Cancel/Delete buttons
- [x] `src/hooks/useTransaksi.ts` — React Query hooks
- [ ] Pagination component
- [x] First commit: `feat(transaksi): core transaction CRUD + saldo tracking`

---

## Phase 6: Petty Cash (Day 12-13)

### T6.1 — Petty Cash Backend

- [x] `src/services/petty-cash.service.ts`:
  - `getPettyCashInfo()` — Current saldo + limit
  - `topUpPettyCash()` — Add funds (log TOPUP)
  - `getPettyCashLog()` — History of movements
  - `getPettyCashSaldo()` — Real-time balance
- [x] Update `transaksi.service.ts` — Auto deduct on confirm if isPettyCash
- [x] `src/app/api/petty-cash/route.ts` — GET
- [x] `src/app/api/petty-cash/topup/route.ts` — POST
- [x] Alert threshold logic (sal < 30% limit)
- [ ] Unit test: petty-cash.service.test.ts

### T6.2 — Petty Cash Frontend

- [x] `src/app/(dashboard)/petty-cash/page.tsx` — Petty cash dashboard
- [x] `src/app/(dashboard)/petty-cash/topup/page.tsx` — Top-up form
- [x] `src/components/petty-cash/PettyCashWidget.tsx` — Saldo card
- [x] `src/components/petty-cash/PettyCashLog.tsx` — Movement history
- [x] `src/components/petty-cash/PettyCashProgress.tsx` — Bar progress (saldo vs limit)
- [x] `src/hooks/usePettyCash.ts` — Wired to real API
- [x] First commit: `feat(petty-cash): tracking + top-up + alerts`

---

## Phase 7: Dashboard (Day 13-15)

### T7.1 — Dashboard Backend

- [ ] `src/app/api/dashboard/admin/route.ts` — Global stats
  - Total kantor aktif
  - Total transaksi hari ini
  - Top 5 kantor by volume
  - Monthly trend (pemasukan vs pengeluaran)
- [ ] `src/app/api/dashboard/kantor/[id]/route.ts` — Kantor stats
  - Saldo kantor
  - Petty cash sisa
  - 5 transaksi terakhir
  - Distribusi pengeluaran per kategori
- [ ] `src/services/dashboard.service.ts`

### T7.2 — Dashboard Frontend

- [ ] `src/app/(dashboard)/page.tsx` — Dashboard page (role-based)
- [ ] `src/components/dashboard/StatsCard.tsx` — KPI cards
- [ ] `src/components/dashboard/TransaksiChart.tsx` — Line/bar chart (Recharts)
- [ ] `src/components/dashboard/KategoriPieChart.tsx` — Pie chart
- [ ] `src/components/dashboard/RecentTransaksi.tsx` — Latest 5 transactions
- [ ] `src/components/dashboard/KantorRanking.tsx` — Top kantor (admin only)
- [ ] Lazy load chart components
- [ ] First commit: `feat(dashboard): admin + kantor dashboard with charts`

---

## Phase 8: Laporan & Export (Day 15-17)

### T8.1 — Laporan Backend

- [ ] `src/services/laporan.service.ts`:
  - `getRingkasanBulanan()` — Summary per kantor
  - `getDetailLaporan()` — Filtered transaction list
  - `generateExcel()` — Export to .xlsx
  - `generatePDF()` — Export to .pdf
- [ ] `src/app/api/laporan/ringkasan/route.ts` — GET
- [ ] `src/app/api/laporan/export/route.ts` — GET (download file)
- [ ] Unit test: laporan.service.test.ts

### T8.2 — Laporan Frontend

- [x] `src/app/(dashboard)/laporan/page.tsx` — Laporan viewer
- [x] `src/components/laporan/LaporanFilter.tsx` — Date + kategori filter
- [x] `src/components/laporan/LaporanTable.tsx` — Results table
- [x] `src/components/laporan/LaporanSummary.tsx` — Summary cards
- [x] `src/components/laporan/ExportButtons.tsx` — Excel + PDF buttons
- [x] PDF template (branded header/footer)
- [x] First commit: `feat(laporan): report viewer + Excel/PDF export`

---

## Phase 9: Notifications (Day 17-18)

### T9.1 — Notification Backend

- [ ] `src/services/notification.service.ts`:
  - `createNotification()` — Create notif
  - `getNotifications()` — By userId, paginated
  - `markAsRead()` — Single
  - `markAllAsRead()` — Bulk
  - `getUnreadCount()` — For badge
- [ ] `src/app/api/notification/route.ts` — GET
- [ ] `src/app/api/notification/[id]/read/route.ts` — POST
- [ ] Auto-create notif on: transaksi confirm, petty cash alert
- [ ] First commit: `feat(notification): in-app notifications`

### T9.2 — Notification Frontend

- [x] `src/components/layout/NotificationBell.tsx` — Badge + dropdown
- [x] `src/components/notification/NotificationList.tsx`
- [x] `src/components/notification/NotificationItem.tsx`
- [x] Real-time badge count (polling or WebSocket)
- [x] First commit: `feat(notification): bell dropdown + mark as read`

---

## Phase 10: Settings & User Management (Day 18-19)

### T10.1 — Settings Backend

- [ ] `src/app/api/users/route.ts` — List users (admin only)
- [ ] `src/app/api/users/[id]/route.ts` — Update user profile
- [ ] `src/app/api/users/[id]/password/route.ts` — Change password
- [ ] `src/services/user.service.ts`

### T10.2 — Settings Frontend

- [x] `src/app/(dashboard)/settings/page.tsx` — Profile settings
- [x] `src/app/(dashboard)/settings/users/page.tsx` — User list (admin global)
- [x] `src/components/settings/ProfileForm.tsx`
- [x] `src/components/settings/UserTable.tsx`
- [x] First commit: `feat(settings): profile + user management`

---

## Phase 11: Testing & QA (Day 19-21)

### T11.1 — Unit Tests

- [ ] All service files covered (target: 80% coverage)
- [ ] Validator tests (all Zod schemas)
- [ ] `vitest run` — all passing

### T11.2 — Integration Tests

- [ ] API route tests (supertest or similar)
- [ ] Auth flow tests
- [ ] Multi-tenant isolation tests
- [ ] Transaction flow tests (create → confirm → saldo check)

### T11.3 — E2E Tests (Playwright)

- [ ] Login → Dashboard flow
- [ ] Create kantor → assign user → create transaksi
- [ ] Petty cash: top-up → pengeluaran → saldo check
- [ ] Laporan export flow

### T11.4 — Manual QA

- [ ] Responsive check (mobile, tablet, desktop)
- [ ] Cross-browser check (Chrome, Firefox, Safari)
- [ ] Edge cases:
  - Concurrent transactions
  - Zero nominal
  - Very long descriptions
  - Special characters in input
  - File upload: wrong type, too large
- [ ] First commit: `test: unit + integration + e2e tests`

---

## Phase 12: Deploy & Launch (Day 21-22)

### T12.1 — Production Setup

- [ ] Setup PostgreSQL (Supabase / Railway)
- [ ] Setup file storage (Cloudflare R2 or Supabase Storage)
- [ ] Configure Vercel environment variables
  - BETTER_AUTH_SECRET (production secret)
  - BETTER_AUTH_URL (production URL)
- [ ] `prisma migrate deploy` (production DB)
- [ ] Seed production kategori defaults

### T12.2 — Deploy

- [ ] Push to GitHub → auto-deploy Vercel
- [ ] Verify all routes work
- [ ] Test auth flow on production
- [ ] Test file upload on production
- [ ] Verify SSL / HTTPS

### T12.3 — Post-Launch

- [ ] Setup Sentry (error monitoring)
- [ ] Setup uptime monitoring (UptimeRobot / BetterStack)
- [ ] Create admin user on production
- [ ] Create first kantor
- [ ] Demo walkthrough (screen recording)
- [ ] First commit: `chore: production deploy + monitoring`

---

## Phase 13: Phase 2 Features (Post-MVP)

- [ ] Budget per kategori per kantor
- [ ] Multi-rekening bank per kantor
- [ ] Recurring transactions
- [ ] API for external integration
- [ ] PWA (mobile installable)
- [ ] Audit log
- [ ] Custom role permissions
- [ ] WhatsApp/Telegram notification
- [ ] Dark mode

---

## Timeline Summary

| Phase             | Days         | Deliverable             |
| ----------------- | ------------ | ----------------------- |
| 0 — Project Setup | 1            | Init repo, DB, config   |
| 1 — Auth          | 2            | Login/Register          |
| 2 — Kantor        | 2            | Multi-tenant CRUD       |
| 3 — Layout        | 1            | Sidebar, topbar         |
| 4 — Kategori      | 1            | Category management     |
| 5 — Transaksi ⭐  | 5            | Core transaction system |
| 6 — Petty Cash    | 1            | Petty cash tracking     |
| 7 — Dashboard     | 2            | Stats + charts          |
| 8 — Laporan       | 2            | Report + export         |
| 9 — Notifications | 1            | In-app notifs           |
| 10 — Settings     | 1            | Profile + user mgmt     |
| 11 — Testing      | 2            | QA + test suite         |
| 12 — Deploy       | 1            | Production launch       |
| **Total MVP**     | **~22 days** | **Full MVP**            |

---

_Document version: 2.0_
_Last updated: 2026-05-25_
_Author: Mimaaa SuperAgent_
