# PRD — Aplikasi Pengeluaran & Pemasukan Kantor (Multi-Tenant)

## 1. Overview

Aplikasi web multi-tenant untuk mencatat pengeluaran dan pemasukan kantor (termasuk petty cash), dengan fitur saldo tracking per kantor. Setiap kantor beroperasi sebagai tenant terpisah dengan data isolated.

---

## 2. Tech Stack

### Frontend
| Komponen | Teknologi |
|---|---|
| Framework | Next.js 14+ (App Router) |
| UI Library | Tailwind CSS v4 + shadcn/ui |
| State Management | Zustand / React Query (TanStack Query) |
| Form Handling | React Hook Form + Zod |
| Chart | Recharts / Chart.js |

### Backend
| Komponen | Teknologi |
|---|---|
| Runtime | Node.js (Next.js API Routes / Route Handlers) |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | Better Auth (Credentials + Session) |
| API Pattern | RESTful (tRPC optional untuk phase 2) |

### Infrastructure
| Komponen | Teknologi |
|---|---|
| Hosting | Vercel (frontend) + Railway/Supabase (DB) |
| Storage | Cloudflare R2 / Supabase Storage (lampiran bukti) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (error tracking) |

---

## 3. User Roles & Permissions

### Admin
- Buat, edit, hapus kantor
- Assign user ke kantor (role: Admin atau Finance di kantor tersebut)
- Lihat semua data lintas kantor
- Manage user (invite, deactivate)
- Lihat dashboard global

### Finance
- Input pengeluaran & pemasukan di kantor sendiri
- Upload bukti transaksi (lampiran)
- Lihat saldo kantor sendiri
- Generate & export laporan (PDF/Excel)
- Hanya bisa akses data kantor yang di-assign

---

## 4. Feature List

### MVP (Phase 1)

#### 4.1 Authentication & User Management
- [ ] Login / Logout (email + password)
- [ ] Registrasi admin pertama (seed)
- [ ] Profile management (ubah nama, password)
- [ ] Session management

#### 4.2 Multi-Tenant — Kantor Management
- [ ] Admin buat kantor baru (nama, alamat, deskripsi)
- [ ] Admin edit / nonaktifkan kantor
- [ ] Admin assign user ke kantor (dengan role: Admin Kantor / Finance)
- [ ] Admin lihat daftar semua kantor + jumlah user
- [ ] User hanya lihat kantor tempat dia di-assign

#### 4.3 Kategori Transaksi
- [ ] Default kategori pengeluaran (Gaji, Operasional, ATK, Transport, Makan, dll)
- [ ] Default kategori pemasukan (Penjualan, Servis, Pinjaman Masuk, dll)
- [ ] Admin kantor bisa tambah/edit/hapus kategori custom
- [ ] Setiap kategori punya icon/warna

#### 4.4 Transaksi — Pengeluaran
- [ ] Form input: tanggal, kategori, deskripsi, nominal, metode bayar (Tunai/Transfer/Card), rekening tujuan
- [ ] Upload bukti foto/nota (max 5 file)
- [ ] Auto-generate nomor urut pengeluaran per bulan (Pengeluaran-2026-001)
- [ ] Draft → Confirmed status workflow
- [ ] Filter: tanggal, kategori, nominal range, status
- [ ] Search by keyword deskripsi

#### 4.5 Transaksi — Pemasukan
- [ ] Form input: tanggal, kategori, deskripsi, nominal, sumber pemasukan, metode terima
- [ ] Upload bukti (invoice, receipt)
- [ ] Auto-generate nomor urut per bulan (Pemasukan-2026-001)
- [ ] Draft → Confirmed status workflow
- [ ] Filter & search (sama seperti pengeluaran)

#### 4.6 Petty Cash Management
- [ ] Set petty cash limit per kantor (oleh Admin)
- [ ] Tracking saldo petty cash real-time
- [ ] Top-up petty cash (catat sebagai pemasukan khusus)
- [ ] Pengeluaran dari petty cash otomatis kurangi saldo
- [ ] Dashboard widget: sisa saldo vs limit

#### 4.7 Saldo & Balance Tracking
- [ ] Hitung saldo per kantor: Total Pemasukan - Total Pengeluaran
- [ ] Breakdown per rekening/metode bayar
- [ ] Running balance per transaksi (row-level balance)
- [ ] Saldo akhir bulan自动 (auto-calculate)

#### 4.8 Dashboard
- **Admin Global Dashboard:**
  - Total kantor aktif
  - Total transaksi hari ini
  - Top 5 kantor by volume transaksi
  - Grafik trend pemasukan vs pengeluaran (bulanan)
- **Admin Kantor Dashboard:**
  - Saldo kantor saat ini
  - Petty cash sisa
  - 5 transaksi terakhir
  - Pie chart distribusi pengeluaran per kategori

#### 4.9 Laporan & Export
- [ ] Laporan per kantor: filter tanggal, kategori, status
- [ ] Laporan konsolidasi (Admin global): gabungan semua kantor
- [ ] Export ke Excel (.xlsx)
- [ ] Export ke PDF (dengan template branded)
- [ ] Laporan petty cash khusus

#### 4.10 Notification (Basic)
- [ ] In-app notification saat transaksi baru
- [ ] Alert jika saldo kantor di bawah threshold
- [ ] Alert jika petty cash hampir habis

---

### Phase 2 (Post-MVP)
- [ ] Approval workflow (Finance input → Admin kantor approve)
- [ ] Budget per kategori per kantor
- [ ] Multi-rekening bank per kantor
- [ ] Recurring transactions
- [ ] API untuk integrasi sistem akuntansi
- [ ] Mobile responsive (PWA)
- [ ] Audit log (siapa input, siapa edit, kapan)
- [ ] Role custom (configurable permissions)

---

## 5. Entity Relationship Diagram (ERD)

```
┌─────────────────────┐       ┌─────────────────────────┐
│       users         │       │     user_kantor_roles    │
├─────────────────────┤       ├─────────────────────────┤
│ id          UUID PK │──┐    │ id              UUID PK │
│ name        VARCHAR │  │    │ user_id    UUID FK → users│
│ email       VARCHAR │  │    │ kantor_id  UUID FK → kantor│
│ password    VARCHAR │  ├───>│ role    ENUM(ADMIN,FIN)  │
│ avatar      VARCHAR │  │    │ is_active      BOOLEAN  │
│ created_at  TIMESTAM│  │    │ created_at    TIMESTAM  │
│ updated_at  TIMESTAM│  │    └─────────────────────────┘
└─────────────────────┘  │
                         │    ┌─────────────────────────┐
                         │    │        kantor            │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ name          VARCHAR   │
                         │    │ address       TEXT      │
                         │    │ description   TEXT      │
                         │    │ petty_cash_limit DECIMAL│
                         │    │ is_active      BOOLEAN  │
                         │    │ created_by UUID FK→users│
                         │    │ created_at    TIMESTAM  │
                         │    │ updated_at    TIMESTAM  │
                         │    └──────────┬──────────────┘
                         │               │
                         │               │ 1:N
                         │    ┌──────────┴──────────────┐
                         │    │      transaksi           │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ kantor_id  UUID FK→kantor│
                         │    │ user_id   UUID FK→users  │
                         │    │ kategori_id UUID FK→kategori│
                         │    │ type  ENUM(PEMASUKAN,    │
                         │    │         PENGELUARAN)     │
                         │    │ nomor_transaksi VARCHAR  │
                         │    │ tanggal         DATE     │
                         │    │ deskripsi       TEXT     │
                         │    │ nominal       DECIMAL    │
                         │    │ metode_bayar ENUM(TUNAI, │
                         │    │    TRANSFER, CARD)       │
                         │    │ rekening_info  VARCHAR   │
                         │    │ status ENUM(DRAFT,       │
                         │    │    CONFIRMED, CANCELLED) │
                         │    │ is_petty_cash   BOOLEAN  │
                         │    │ created_at    TIMESTAM   │
                         │    │ updated_at    TIMESTAM   │
                         │    └──────────┬──────────────┘
                         │               │
                         │               │ 1:N
                         │    ┌──────────┴──────────────┐
                         │    │    bukti_transaksi       │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ transaksi_id UUID FK     │
                         │    │ file_url      VARCHAR   │
                         │    │ file_name     VARCHAR   │
                         │    │ file_type     VARCHAR   │
                         │    │ created_at    TIMESTAM  │
                         │    └─────────────────────────┘
                         │
                         │    ┌─────────────────────────┐
                         │    │       kategori           │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ kantor_id  UUID FK→kantor│
                         │    │ name        VARCHAR     │
                         │    │ type  ENUM(PEMASUKAN,    │
                         │    │         PENGELUARAN)     │
                         │    │ icon        VARCHAR     │
                         │    │ color       VARCHAR     │
                         │    │ is_default   BOOLEAN    │
                         │    │ is_active    BOOLEAN    │
                         │    │ created_at   TIMESTAM   │
                         │    └─────────────────────────┘
                         │
                         │    ┌─────────────────────────┐
                         │    │    petty_cash_log        │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ kantor_id  UUID FK→kantor│
                         │    │ type  ENUM(TOPUP,        │
                         │    │    PENGELUARAN)          │
                         │    │ nominal      DECIMAL    │
                         │    │ deskripsi     TEXT      │
                         │    │ reference_id UUID FK     │
                         │    │ (→ transaksi.id)        │
                         │    │ created_by UUID FK→users │
                         │    │ created_at   TIMESTAM   │
                        │    └─────────────────────────┘
                        │
                        │    ┌─────────────────────────┐
                        │    │       sessions           │
                        │    ├─────────────────────────┤
                        │    │ id              UUID PK │
                        │    │ user_id    UUID FK→users│
                        │    │ token        VARCHAR UQ │
                        │    │ expires_at  TIMESTAM    │
                        │    │ ip_address   VARCHAR    │
                        │    │ user_agent   VARCHAR    │
                        │    │ created_at    TIMESTAM  │
                        │    │ updated_at    TIMESTAM  │
                        │    └─────────────────────────┘
                        │
                        │    ┌─────────────────────────┐
                        │    │       accounts           │
                        │    ├─────────────────────────┤
                        │    │ id              UUID PK │
                        │    │ user_id    UUID FK→users│
                        │    │ account_id    VARCHAR   │
                        │    │ provider_id   VARCHAR   │
                        │    │ password      VARCHAR   │
                        │    │ created_at    TIMESTAM  │
                        │    │ updated_at    TIMESTAM  │
                        │    └─────────────────────────┘
                        │
                        │    ┌─────────────────────────┐
                        │    │      verifications       │
                        │    ├─────────────────────────┤
                        │    │ id              UUID PK │
                        │    │ identifier     VARCHAR  │
                        │    │ value          VARCHAR  │
                        │    │ expires_at    TIMESTAM  │
                        │    │ created_at    TIMESTAM  │
                        │    │ updated_at    TIMESTAM  │
                        │    └─────────────────────────┘
                        │
                        │    ┌─────────────────────────┐
                        │    │     notification         │
                         │    ├─────────────────────────┤
                         │    │ id              UUID PK │
                         │    │ user_id    UUID FK→users │
                         │    │ title       VARCHAR     │
                         │    │ message      TEXT       │
                         │    │ type  ENUM(TRANSACTION,  │
                         │    │    ALERT, SYSTEM)        │
                         │    │ is_read     BOOLEAN     │
                         │    │ reference_id UUID       │
                         │    │ created_at   TIMESTAM   │
                         │    └─────────────────────────┘
```

### ERD Relationship Summary
- **users** 1:N **user_kantor_roles** (satu user bisa di banyak kantor)
- **kantor** 1:N **user_kantor_roles** (satu kantor punya banyak user)
- **kantor** 1:N **transaksi** (satu kantor punya banyak transaksi)
- **kantor** 1:N **kategori** (satu kantor punya banyak kategori)
- **users** 1:N **transaksi** (satu user input banyak transaksi)
- **kategori** 1:N **transaksi** (satu kategori dipakai di banyak transaksi)
- **transaksi** 1:N **bukti_transaksi** (satu transaksi bisa punya banyak lampiran)
- **kantor** 1:N **petty_cash_log** (log pergerakan petty cash)
- **users** 1:N **notification** (notif per user)
- **users** 1:N **sessions** (satu user punya banyak session)
- **users** 1:N **accounts** (satu user punya banyak account/provider)

---

## 6. Business Process

### 6.1 Onboarding Flow (Admin Baru)

```
Admin Register
    │
    ▼
Buat Akun (name, email, password)
    │
    ▼
Login → Dashboard Global
    │
    ▼
Buat Kantor Pertama
    │
    ▼
Invite User ke Kantor (assign role: Admin Kantor / Finance)
    │
    ▼
Setup Kategori Default (auto-generated, bisa customize)
    │
    ▼
Siap Digunakan
```

### 6.2 Transaksi Pengeluaran Flow

```
Finance Login
    │
    ▼
Pilih Kantor (jika assign ke >1 kantor)
    │
    ▼
Klik "Catat Pengeluaran"
    │
    ▼
Isi Form:
  - Tanggal transaksi
  - Kategori (dropdown)
  - Deskripsi
  - Nominal
  - Metode Bayar (Tunai / Transfer / Card)
  - Info Rekening (jika transfer)
  - Upload bukti (opsional)
  - Centang "Dari Petty Cash?" (jika ya)
    │
    ▼
Submit → Status: DRAFT
    │
    ▼
Review → Confirm
    │
    ▼
Status: CONFIRMED
    │
    ├── Jika Petty Cash → Saldo petty cash otomatis berkurang
    │
    ├── Saldo kantor otomatis berkurang
    │
    └── Notification ke Admin Kantor
```

### 6.3 Transaksi Pemasukan Flow

```
Finance Login
    │
    ▼
Klik "Catat Pemasukan"
    │
    ▼
Isi Form:
  - Tanggal transaksi
  - Kategori (dropdown)
  - Deskripsi
  - Nominal
  - Sumber Pemasukan (klien, pinjaman, dll)
  - Metode Terima (Tunai / Transfer)
  - Upload bukti (opsional)
    │
    ▼
Submit → Status: DRAFT
    │
    ▼
Review → Confirm
    │
    ▼
Status: CONFIRMED
    │
    ├── Saldo kantor otomatis bertambah
    │
    └── Notification ke Admin Kantor
```

### 6.4 Petty Cash Flow

```
Admin Kantor Set Limit Petty Cash (misal: Rp 5.000.000)
    │
    ▼
Top Up Petty Cash (Input nominal → catat sebagai log TOPUP)
    │
    ▼
Saldo Petty Cash = Rp 5.000.000
    │
    ▼
Finance Input Pengeluaran + Centang "Dari Petty Cash"
    │
    ▼
Saldo Petty Cash -= Nominal Pengeluaran
    │
    ▼
┌────────────────────────────────────────┐
│ Jika Saldo < 30% Limit → ALERT        │
│ Jika Saldo = 0 → BLOCK (harus top up)  │
└────────────────────────────────────────┘
```

### 6.5 Approval Workflow (Phase 2)

```
Finance Input Transaksi → Status: PENDING_APPROVAL
    │
    ▼
Admin Kantor Review
    │
    ├── Approve → Status: CONFIRMED → Saldo Update
    │
    └── Reject → Status: REJECTED → Catat Alasan
```

### 6.6 Laporan & Export Flow

```
User Pilih Periode Laporan
    │
    ▼
Filter: Tanggal, Kategori, Status, Metode Bayar
    │
    ▼
Preview Laporan (Tabel + Chart)
    │
    ▼
Export:
  ├── Excel (.xlsx) → Download
  └── PDF → Download (template branded)
```

---

## 7. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN         // Global admin
}

enum KantorUserRole {
  ADMIN_KANTOR  // Admin di level kantor
  FINANCE       // Staff keuangan
}

enum TransaksiType {
  PEMASUKAN
  PENGELUARAN
}

enum MetodeBayar {
  TUNAI
  TRANSFER
  CARD
}

enum TransaksiStatus {
  DRAFT
  CONFIRMED
  CANCELLED
}

enum PettyCashType {
  TOPUP
  PENGELUARAN
}

enum NotifType {
  TRANSACTION
  ALERT
  SYSTEM
}

model User {
  id            String   @id @default(uuid()) @db.Uuid
  name          String
  email         String   @unique
  avatar        String?
  role          UserRole @default(ADMIN)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  kantorRoles   KantorUserRole[]
  transaksi     Transaksi[]
  pettyCashLog  PettyCashLog[]
  notifications Notification[]
  sessions      Session[]
  accounts      Account[]

  @@map("users")
}

model Kantor {
  id              String   @id @default(uuid()) @db.Uuid
  name            String
  address         String?
  description     String?
  pettyCashLimit  Decimal  @default(0) @map("petty_cash_limit") @db.Decimal(15, 2)
  isActive        Boolean  @default(true) @map("is_active")
  createdById     String   @map("created_by") @db.Uuid
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  createdBy       User     @relation(fields: [createdById], references: [id])
  userRoles       KantorUserRole[]
  transaksi       Transaksi[]
  kategori        Kategori[]
  pettyCashLog    PettyCashLog[]

  @@map("kantor")
}

model KantorUserRole {
  id        String          @id @default(uuid()) @db.Uuid
  userId    String          @map("user_id") @db.Uuid
  kantorId  String          @map("kantor_id") @db.Uuid
  role      KantorUserRole  @default(FINANCE)
  isActive  Boolean         @default(true) @map("is_active")
  createdAt DateTime        @default(now()) @map("created_at")

  user      User            @relation(fields: [userId], references: [id])
  kantor    Kantor          @relation(fields: [kantorId], references: [id])

  @@unique([userId, kantorId])
  @@map("user_kantor_roles")
}

model Kategori {
  id         String        @id @default(uuid()) @db.Uuid
  kantorId   String        @map("kantor_id") @db.Uuid
  name       String
  type       TransaksiType
  icon       String?
  color      String?
  isDefault  Boolean       @default(false) @map("is_default")
  isActive   Boolean       @default(true) @map("is_active")
  createdAt  DateTime      @default(now()) @map("created_at")

  kantor     Kantor        @relation(fields: [kantorId], references: [id])
  transaksi  Transaksi[]

  @@map("kategori")
}

model Transaksi {
  id               String          @id @default(uuid()) @db.Uuid
  kantorId         String          @map("kantor_id") @db.Uuid
  userId           String          @map("user_id") @db.Uuid
  kategoriId       String          @map("kategori_id") @db.Uuid
  type             TransaksiType
  nomorTransaksi   String          @map("nomor_transaksi") @unique
  tanggal          DateTime        @db.Date
  deskripsi        String
  nominal          Decimal         @db.Decimal(15, 2)
  metodeBayar      MetodeBayar     @map("metode_bayar")
  rekeningInfo     String?         @map("rekening_info")
  status           TransaksiStatus @default(DRAFT)
  isPettyCash      Boolean         @default(false) @map("is_petty_cash")
  createdAt        DateTime        @default(now()) @map("created_at")
  updatedAt        DateTime        @updatedAt @map("updated_at")

  kantor           Kantor          @relation(fields: [kantorId], references: [id])
  user             User            @relation(fields: [userId], references: [id])
  kategori         Kategori        @relation(fields: [kategoriId], references: [id])
  bukti            BuktiTransaksi[]
  pettyCashRef     PettyCashLog[]

  @@index([kantorId, tanggal])
  @@index([kantorId, type])
  @@index([status])
  @@map("transaksi")
}

model BuktiTransaksi {
  id           String     @id @default(uuid()) @db.Uuid
  transaksiId  String     @map("transaksi_id") @db.Uuid
  fileUrl      String     @map("file_url")
  fileName     String     @map("file_name")
  fileType     String     @map("file_type")
  createdAt    DateTime   @default(now()) @map("created_at")

  transaksi    Transaksi  @relation(fields: [transaksiId], references: [id])

  @@map("bukti_transaksi")
}

model PettyCashLog {
  id           String        @id @default(uuid()) @db.Uuid
  kantorId     String        @map("kantor_id") @db.Uuid
  type         PettyCashType
  nominal      Decimal       @db.Decimal(15, 2)
  deskripsi    String?
  referenceId  String?       @map("reference_id") @db.Uuid
  createdById  String        @map("created_by") @db.Uuid
  createdAt    DateTime      @default(now()) @map("created_at")

  kantor       Kantor        @relation(fields: [kantorId], references: [id])
  transaksi    Transaksi?    @relation(fields: [referenceId], references: [id])
  createdBy    User          @relation(fields: [createdById], references: [id])

  @@index([kantorId, createdAt])
  @@map("petty_cash_log")
}

model Notification {
  id           String    @id @default(uuid()) @db.Uuid
  userId       String    @map("user_id") @db.Uuid
  title        String
  message      String
  type         NotifType
  isRead       Boolean   @default(false) @map("is_read")
  referenceId  String?   @map("reference_id") @db.Uuid
  createdAt    DateTime  @default(now()) @map("created_at")

  user         User      @relation(fields: [userId], references: [id])

  @@index([userId, isRead])
  @@map("notification")
}

model Session {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @map("user_id") @db.Uuid
  token         String   @unique
  expiresAt     DateTime @map("expires_at")
  ipAddress     String?  @map("ip_address")
  userAgent     String?  @map("user_agent")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}

model Account {
  id            String   @id @default(uuid()) @db.Uuid
  userId        String   @map("user_id") @db.Uuid
  accountId     String   @map("account_id")
  providerId    String   @map("provider_id")
  password      String?
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([accountId, providerId])
  @@index([userId])
  @@map("accounts")
}

model Verification {
  id            String   @id @default(uuid()) @db.Uuid
  identifier    String
  value         String
  expiresAt     DateTime @map("expires_at")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  @@index([identifier, value])
  @@map("verifications")
}
```

---

## 8. API Endpoints (REST)

### Auth
- `POST /api/auth/sign-up/email` — Register admin
- `POST /api/auth/sign-in/email` — Login
- `POST /api/auth/sign-out` — Logout
- `GET /api/auth/get-session` — Get current user

> Better Auth handles these via its built-in API handler.

### Kantor
- `GET /api/kantor` — List kantor (admin: all, finance: assigned only)
- `POST /api/kantor` — Create kantor (admin only)
- `PUT /api/kantor/[id]` — Update kantor
- `DELETE /api/kantor/[id]` — Soft delete kantor
- `POST /api/kantor/[id]/assign` — Assign user ke kantor
- `DELETE /api/kantor/[id]/unassign/[userId]` — Remove user dari kantor

### Transaksi
- `GET /api/transaksi?kantor_id&type=tanggal&status` — List transaksi (filtered)
- `POST /api/transaksi` — Create transaksi
- `GET /api/transaksi/[id]` — Detail transaksi
- `PUT /api/transaksi/[id]` — Update transaksi (draft only)
- `POST /api/transaksi/[id]/confirm` — Confirm transaksi
- `POST /api/transaksi/[id]/cancel` — Cancel transaksi
- `DELETE /api/transaksi/[id]` — Delete transaksi (draft only)

### Kategori
- `GET /api/kategori?kantor_id&type` — List kategori
- `POST /api/kategori` — Create kategori
- `PUT /api/kategori/[id]` — Update kategori
- `DELETE /api/kategori/[id]` — Delete kategori (non-default only)

### Petty Cash
- `GET /api/petty-cash?kantor_id` — Info saldo petty cash
- `POST /api/petty-cash/topup` — Top up petty cash
- `GET /api/petty-cash/log?kantor_id&bulan` — Log pergerakan

### Laporan
- `GET /api/laporan/ringkasan?kantor_id&bulan&tahun` — Ringkasan bulanan
- `GET /api/laporan/detail?kantor_id&tanggal_awal&tanggal_akhir` — Detail laporan
- `GET /api/laporan/export?format=excel|pdf` — Export laporan

### Dashboard
- `GET /api/dashboard/admin` — Global admin dashboard
- `GET /api/dashboard/kantor/[id]` — Kantor-specific dashboard

---

## 9. Default Kategori Seed

### Pengeluaran Default
| Kategori | Icon | Warna |
|---|---|---|
| Gaji & THR | 💰 | #22C55E |
| Sewa & Utilitas | 🏠 | #3B82F6 |
| ATK & Office Supply | 📎 | #A855F7 |
| Transport & Perjalanan | 🚗 | #F97316 |
| Makan & Minum | 🍔 | #EC4899 |
| Marketing & Promosi | 📢 | #EAB308 |
| Maintenance & Perbaikan | 🔧 | #6B7280 |
| Lainnya | 📦 | #64748B |

### Pemasukan Default
| Kategori | Icon | Warna |
|---|---|---|
| Penjualan Produk | 🛒 | #22C55E |
| Servis & Konsultasi | 💼 | #3B82F6 |
| Pinjaman Masuk | 🏦 | #A855F7 |
| Investasi & Dividen | 📈 | #F97316 |
| Donsumsi / Hibah | 🎁 | #EC4899 |
| Lainnya | 📦 | #64748B |

---

## 10. Security & Data Isolation

- **Row-level security**: Semua query transaksi/kategori wajib filter `kantorId`
- **Middleware check**: Setiap API endpoint cek user punya akses ke kantor_id yang diminta
- **Password hashing**: bcrypt (managed by Better Auth)
- **Session**: Session-based (database sessions via Better Auth)
- **Session cookie**: Database session token via Better Auth, httpOnly cookie
- **File upload**: Max 5MB per file, allowed types: jpg, png, pdf
- **Rate limiting**: 100 requests per minute per user
- **Soft delete**: Data tidak benar-benar dihapus, hanya `isActive = false`

---

## 11. Deployment Architecture

```
┌──────────────────────────────────────────────┐
│                   Vercel                      │
│          Next.js App (SSR + API)              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│              Railway / Supabase               │
│            PostgreSQL Database                │
└──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│          Cloudflare R2 / Supabase             │
│         File Storage (Bukti Upload)           │
└──────────────────────────────────────────────┘
```

---

## 12. Project Structure

```
kantor-app/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, type-check, test
│       └── deploy.yml             # Vercel auto-deploy
│
├── prisma/
│   ├── schema.prisma              # DB schema
│   ├── seed.ts                    # Default kategori & admin seed
│   └── migrations/
│
├── public/
│   ├── icons/                     # Static icons (kategori icons fallback)
│   └── images/
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Route group: auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/           # Route group: authenticated pages
│   │   │   ├── layout.tsx         # Sidebar + topbar layout
│   │   │   ├── page.tsx           # Dashboard (role-based)
│   │   │   ├── kantor/
│   │   │   │   ├── page.tsx       # List kantor
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── page.tsx   # Detail kantor
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── transaksi/
│   │   │   │   ├── page.tsx       # List transaksi
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx   # Detail transaksi
│   │   │   │   ├── pengeluaran/
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── pemasukan/
│   │   │   │       └── new/
│   │   │   │           └── page.tsx
│   │   │   ├── petty-cash/
│   │   │   │   ├── page.tsx       # Petty cash dashboard
│   │   │   │   └── topup/
│   │   │   │       └── page.tsx
│   │   │   ├── kategori/
│   │   │   │   └── page.tsx       # Manage kategori
│   │   │   ├── laporan/
│   │   │   │   ├── page.tsx       # Laporan viewer
│   │   │   │   └── export/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx       # Profile settings
│   │   │       └── users/
│   │   │           └── page.tsx   # User management (admin)
│   │   │
│   │   ├── api/                   # Route Handlers (API)
│   │   │   ├── auth/
│   │   │   │   └── [[...all]]/
│   │   │   │       └── route.ts        # Better Auth catch-all route
│   │   │   ├── kantor/
│   │   │   │   ├── route.ts       # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts   # GET, PUT, DELETE
│   │   │   │       └── assign/
│   │   │   │           └── route.ts
│   │   │   ├── transaksi/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── confirm/
│   │   │   │           └── route.ts
│   │   │   ├── kategori/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── petty-cash/
│   │   │   │   ├── route.ts
│   │   │   │   └── topup/
│   │   │   │       └── route.ts
│   │   │   ├── laporan/
│   │   │   │   ├── ringkasan/
│   │   │   │   │   └── route.ts
│   │   │   │   └── export/
│   │   │   │       └── route.ts
│   │   │   ├── upload/
│   │   │   │   └── route.ts       # File upload handler
│   │   │   └── dashboard/
│   │   │       ├── admin/
│   │   │       │   └── route.ts
│   │   │       └── kantor/
│   │   │           └── [id]/
│   │   │               └── route.ts
│   │   │
│   │   ├── layout.tsx             # Root layout (providers)
│   │   ├── page.tsx               # Landing / redirect
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── NotificationBell.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── TransaksiChart.tsx
│   │   │   ├── KategoriPieChart.tsx
│   │   │   ├── RecentTransaksi.tsx
│   │   │   └── PettyCashWidget.tsx
│   │   │
│   │   ├── transaksi/
│   │   │   ├── TransaksiForm.tsx
│   │   │   ├── TransaksiTable.tsx
│   │   │   ├── TransaksiFilter.tsx
│   │   │   ├── TransaksiDetail.tsx
│   │   │   └── BuktiUpload.tsx
│   │   │
│   │   ├── kantor/
│   │   │   ├── KantorForm.tsx
│   │   │   ├── KantorCard.tsx
│   │   │   ├── KantorTable.tsx
│   │   │   └── UserAssignDialog.tsx
│   │   │
│   │   ├── kategori/
│   │   │   ├── KategoriForm.tsx
│   │   │   ├── KategoriList.tsx
│   │   │   └── KategoriIconPicker.tsx
│   │   │
│   │   ├── laporan/
│   │   │   ├── LaporanFilter.tsx
│   │   │   ├── LaporanTable.tsx
│   │   │   ├── LaporanSummary.tsx
│   │   │   └── ExportButtons.tsx
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── DatePicker.tsx
│   │       ├── CurrencyInput.tsx
│   │       └── PageHeader.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # Better Auth config
│   │   ├── utils.ts               # cn(), formatCurrency(), etc
│   │   ├── validators.ts          # Zod schemas (shared)
│   │   └── constants.ts           # Enums, default values
│   │
│   ├── hooks/
│   │   ├── useKantor.ts           # Fetch & cache kantor list
│   │   ├── useTransaksi.ts        # Transaksi CRUD hooks
│   │   ├── usePettyCash.ts        # Petty cash hooks
│   │   └── useDashboard.ts        # Dashboard data hooks
│   │
│   ├── services/
│   │   ├── kantor.service.ts      # Kantor business logic
│   │   ├── transaksi.service.ts   # Transaksi logic + nomor gen
│   │   ├── kategori.service.ts    # Kategori logic
│   │   ├── petty-cash.service.ts  # Petty cash logic
│   │   ├── laporan.service.ts     # Report generation
│   │   ├── upload.service.ts      # File upload handling
│   │   └── notification.service.ts # Notif logic
│   │
│   ├── types/
│   │   ├── index.ts               # Shared types
│   │   ├── transaksi.ts           # Transaksi types
│   │   ├── kantor.ts              # Kantor types
│   │   └── api.ts                 # API response types
│   │
│   └── middleware.ts              # Auth + tenant isolation middleware
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── transaksi.service.test.ts
│   │   │   ├── petty-cash.service.test.ts
│   │   │   └── laporan.service.test.ts
│   │   └── lib/
│   │       └── validators.test.ts
│   ├── integration/
│   │   ├── api/
│   │   │   ├── kantor.test.ts
│   │   │   ├── transaksi.test.ts
│   │   │   └── auth.test.ts
│   │   └── db/
│   │       └── prisma.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── transaksi.spec.ts
│       └── kantor.spec.ts
│
├── .env.example                   # Template environment variables
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── docker-compose.yml             # Local dev: PostgreSQL
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts               # Unit test config
└── playwright.config.ts           # E2E test config
```

### Key Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| File colocation | Route-based (`app/`) + component grouping | Next.js App Router convention |
| Business logic | Separate `services/` layer | Kept out of route handlers for testability |
| Validation | Zod at API boundary + form level | Single source of truth |
| State | Server Components default, client only when interactive | Performance + simpler data fetching |
| API pattern | Route Handlers (not tRPC) | Simpler MVP, tRPC optional phase 2 |
| File upload | Direct to R2 via presigned URL | No server memory pressure |
| Multi-tenant check | Middleware + service layer | Defense in depth |
| Auth | Better Auth | Lightweight, Prisma-native, no provider lock-in |

---

## 13. Coding Rules & Conventions

### 13.1 General Rules

```
1. TypeScript strict mode — no `any`, use `unknown` if type unsure
2. Every API route must validate input with Zod
3. Every query must filter by kantorId (multi-tenant isolation)
4. No direct prisma calls from components — always go through services/
5. Components default to Server Components — add "use client" only when needed
6. Every feature must have at least unit tests for service layer
```

### 13.2 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `TransaksiForm.tsx` |
| Files (non-component) | camelCase | `transaksi.service.ts` |
| Files (routes) | kebab-case folders | `petty-cash/page.tsx` |
| Variables/functions | camelCase | `getSaldoKantor()` |
| Types/Interfaces | PascalCase | `TransaksiCreateInput` |
| DB models (Prisma) | PascalCase | `Transaksi`, `KantorUserRole` |
| DB columns | snake_case | `kantor_id`, `created_at` |
| API routes | kebab-case | `/api/petty-cash/topup` |
| CSS classes | Tailwind utility | `bg-primary text-white` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL`, `BETTER_AUTH_SECRET` |
| Zod schemas | PascalCase + `Schema` suffix | `TransaksiCreateSchema` |
| Service functions | verbNoun | `createTransaksi()`, `getSaldoKantor()` |
| React hooks | `use` prefix | `useTransaksi()`, `useKantor()` |

### 13.3 File Structure Rules

```
Component files MUST follow this order:
1. "use client" directive (if client component)
2. Imports (React → libs → components → types)
3. Types/interfaces
4. Constants
5. Component function (export default)
6. Helper functions (if small, file-local)

Service files MUST follow this order:
1. Imports (prisma, types, lib)
2. Types
3. Exported functions (one per operation)
4. Internal helpers (prefixed with _)
```

### 13.4 API Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'nominal' is required",
    "details": [
      { "field": "nominal", "message": "Required" }
    ]
  }
}
```

### 13.5 Error Handling Rules

```
1. Service layer throws AppError (custom error class)
2. Route handler catches and maps to HTTP status + JSON response
3. Frontend uses react-query error callbacks
4. All errors logged to console.error (add Sentry in prod)
5. Never expose raw DB errors to client
6. Never expose stack traces in production
```

### 13.6 Database Rules

```
1. Always use @map for snake_case DB columns
2. Always use @map for table names
3. UUIDs for all primary keys (default uuid())
4. Decimal(15,2) for all monetary values — never Float
5. Soft delete with isActive flag — never hard delete
6. created_at auto-set, updated_at auto-update
7. All foreign keys indexed
8. Composite index for common query patterns
```

### 13.7 Security Rules

```
1. NEVER trust client input — validate everything with Zod
2. NEVER skip kantorId check in queries (tenant isolation)
3. NEVER return full user objects — strip password
4. Hash passwords with bcrypt (12 rounds)
5. Use httpOnly cookies for sessions
6. Rate limit: 100 req/min per user
7. File uploads: validate type + size server-side
8. Sanitize all string inputs (XSS prevention)
9. CSRF protection via SameSite cookies
```

### 13.8 Git Commit Convention

```
Format: <type>(<scope>): <description>

Types:
  feat     → New feature
  fix      → Bug fix
  refactor → Code restructure (no behavior change)
  test     → Add/update tests
  docs     → Documentation
  chore    → Config, deps, tooling
  style    → Formatting, whitespace
  perf     → Performance improvement

Scopes (optional):
  auth, kantor, transaksi, kategori, petty-cash, 
  laporan, dashboard, ui, api, db

Examples:
  feat(transaksi): add petty cash deduction on confirm
  fix(kantor): prevent self-unassign for last admin
  refactor(services): extract nomor generator to shared util
  test(transaksi): add unit tests for saldo calculation
```

### 13.9 Branch Strategy

```
main          → Production (auto-deploy)
  └── dev     → Development (auto-deploy preview)
       └── feat/xxx  → Feature branches
       └── fix/xxx   → Bug fix branches
       └── refactor/xxx
```

### 13.10 Performance Rules

```
1. Use Server Components by default — minimize "use client"
2. Use React Query for client-side data (cache + dedupe)
3. Paginate all list endpoints (default: 20 items)
4. Use Prisma select to fetch only needed columns
5. Index all filter/sort columns
6. Lazy load charts and heavy components
7. Optimize images with next/image
8. Use Suspense boundaries for streaming
```

---

*Document version: 2.0*
*Last updated: 2026-05-25*
*Author: Mimaaa SuperAgent*
