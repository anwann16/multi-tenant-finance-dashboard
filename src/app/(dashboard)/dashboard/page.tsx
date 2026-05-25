"use client";

import dynamic from "next/dynamic";
import { LayoutDashboard, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentTransaksi from "@/components/dashboard/RecentTransaksi";
import KantorRanking from "@/components/dashboard/KantorRanking";

const TransaksiChart = dynamic(() => import("@/components/dashboard/TransaksiChart"), { loading: () => <Skeleton className="h-[350px] w-full rounded-2xl" /> });
const KategoriPieChart = dynamic(() => import("@/components/dashboard/KategoriPieChart"), { loading: () => <Skeleton className="h-[350px] w-full rounded-2xl" /> });

export default function DashboardPage() {
  const isAdmin = true; // Placeholder for role check

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview dan statistik kantor Anda</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Saldo" value="Rp 45.250.000" icon={Wallet} trend={12.5} gradient="blue" />
        <StatsCard title="Transaksi Hari Ini" value="12" icon={Wallet} trend={5.2} gradient="green" />
        <StatsCard title="Pemasukan Bulan Ini" value="Rp 18.000.000" icon={Wallet} gradient="purple" />
        <StatsCard title="Pengeluaran Bulan Ini" value="Rp 11.000.000" icon={Wallet} gradient="red" />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TransaksiChart />
        </div>
        <div>
          <KategoriPieChart />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <RecentTransaksi />
        {isAdmin && <KantorRanking />}
      </div>
    </div>
  );
}
