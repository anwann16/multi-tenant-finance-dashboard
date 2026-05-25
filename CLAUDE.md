# Kantor App — Multi-Tenant Expense & Income Tracker

## ⚠️ CRITICAL RULE: ALWAYS READ DOCS FIRST
Before doing ANYTHING, you MUST read these files in order:
1. `cat PRD.md` — full requirements, schema, API endpoints
2. `cat TASKS.md` — task list, execute phases sequentially
3. `cat DESIGN.md` — design system tokens and components

Do NOT start coding without reading them. Do NOT guess requirements. The docs are the source of truth.

## Overview
Aplikasi web multi-tenant untuk mencatat pengeluaran dan pemasukan kantor.

## Tech Stack
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS v4, shadcn/ui, React Query, Zustand
- **Backend:** Next.js API Routes, Prisma ORM, PostgreSQL
- **Auth:** Better Auth (credentials + database sessions)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Export:** ExcelJS (Excel), @react-pdf/renderer (PDF)

## Coding Rules
1. TypeScript strict — no `any`, use `unknown` if unsure
2. Every API route validates input with Zod
3. Every query filters by `kantorId` (multi-tenant isolation)
4. No direct prisma calls from components — always through `services/`
5. Components default to Server Components — add `"use client"` only when needed
6. Every feature must have unit tests for service layer

## Naming Conventions
- Components: PascalCase (`TransaksiForm.tsx`)
- Services: camelCase (`transaksi.service.ts`)
- Routes: kebab-case (`/api/petty-cash/topup`)
- DB columns: snake_case (`kantor_id`)
- Types: PascalCase + suffix (`TransaksiCreateInput`)
- Zod schemas: PascalCase + `Schema` suffix (`TransaksiCreateSchema`)

## Current Phase
Check TASKS.md for current phase. Execute sequentially. Do not skip phases.

## ⚠️ DEPENDENCY RULE
Before installing ANY package, always check the latest version:
- Run `npm info <package> version` to get the latest stable version
- Do NOT hardcode old versions — always use the latest
- When in doubt, use `npx create-next-app@latest` (not older)
- Pin versions in package.json only after verifying compatibility
- Reference: `DEPENDENCIES.md` for full package list and categories

## ⚠️ TASK TRACKING RULE — MANDATORY
After completing EACH task (T0.1, T0.2, T1.1, etc.):
1. Open TASKS.md
2. Change `- [ ]` to `- [x]` for the completed task items
3. Save the file

This keeps TASKS.md as a live progress tracker. Never skip this step. The user relies on TASKS.md to know what's done.

Example:
Before: `- [ ] src/lib/auth.ts — Better Auth config`
After:  `- [x] src/lib/auth.ts — Better Auth config`
