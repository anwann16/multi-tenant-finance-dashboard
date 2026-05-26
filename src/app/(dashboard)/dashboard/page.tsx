"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { LayoutDashboard, Building2, Users, Wallet, ArrowUp, ArrowDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentTransaksi from "@/components/dashboard/RecentTransaksi";
import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency, formatDateShort } from "@/lib/utils";

const TransaksiChart = dynamic(() => import("@/components/dashboard/TransaksiChart"), { loading: () => <Skeleton className="h-[350px] w-full rounded-2xl" /> });
const KategoriPieChart = dynamic(() => import("@/components/dashboard/KategoriPieChart"), { loading: () => <Skeleton className="h-[350px] w-full rounded-2xl" /> });

function AdminDashboard() {
  const { admin, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const data = admin.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <StatsCard title="Total Kantor" value={String(data?.totalKantors ?? 0)} icon={Building2} gradient="blue" />
        <StatsCard title="Total User" value={String(data?.totalUsers ?? 0)} icon={Users} gradient="purple" />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Kantor Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {data?.recentKantors?.map((k) => (
                <Link key={k.id} href={`/kantor/${k.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 sm:px-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{k.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDateShort(k.createdAt)}</p>
                  </div>
                </Link>
              ))}
              {(!data?.recentKantors || data.recentKantors.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">Belum ada kantor</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">User Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {data?.recentUsers?.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className="text-xs">{u.role}</Badge>
                </div>
              ))}
              {(!data?.recentUsers || data.recentUsers.length === 0) && (
                <div className="px-6 py-8 text-center text-sm text-muted-foreground">Belum ada user</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserDashboard() {
  const { user: userDashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Skeleton className="h-[350px] rounded-2xl" />
          <Skeleton className="h-[350px] rounded-2xl" />
        </div>
      </div>
    );
  }

  const data = userDashboard.data;

  if (data && data.kantors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 mb-4">
          <Building2 className="h-7 w-7 text-amber-600" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Kamu belum di-assign ke kantor</h2>
        <p className="mt-1 text-sm text-muted-foreground">Silahkan hubungi admin untuk di-assign ke kantor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Saldo" value={formatCurrency(data?.totalSaldo ?? 0)} icon={Wallet} gradient="blue" />
        <StatsCard title="Pemasukan Bulan Ini" value={formatCurrency(data?.monthlyPemasukan ?? 0)} icon={ArrowUp} gradient="purple" />
        <StatsCard title="Pengeluaran Bulan Ini" value={formatCurrency(data?.monthlyPengeluaran ?? 0)} icon={ArrowDown} gradient="red" />
        <StatsCard title="Total Petty Cash" value={formatCurrency(data?.totalPettyCash ?? 0)} icon={Wallet} gradient="amber" />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransaksiChart />
        </div>
        <div>
          <KategoriPieChart />
        </div>
      </div>

      <RecentTransaksi />
    </div>
  );
}

export default function DashboardPage() {
  const { isAdmin, isLoading: sessionLoading } = useDashboard();

  if (sessionLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "Overview seluruh kantor" : "Overview kantor Anda"}
          </p>
        </div>
      </div>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}
