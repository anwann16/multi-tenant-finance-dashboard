"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";

export default function RecentTransaksi() {
  const { user: userDashboard, isLoading } = useDashboard();
  const data = userDashboard.data?.recentTransaksi ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Transaksi Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-20 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Transaksi Terakhir</CardTitle>
        <Link href="/transaksi" className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          Lihat Semua
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            Belum ada transaksi
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {data.map((t) => (
              <Link key={t.id} href={`/transaksi/${t.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 sm:px-6">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
                  t.type === "PEMASUKAN"
                    ? "bg-emerald-500/10"
                    : "bg-rose-500/10"
                }`}>
                  {t.kategori.icon ?? "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{t.deskripsi}</p>
                    <Badge variant={t.type === "PEMASUKAN" ? "default" : "destructive"} className="shrink-0 text-[10px] px-1.5 py-0">
                      {t.type === "PEMASUKAN" ? "Masuk" : "Keluar"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.user.name} · {formatDateShort(t.tanggal)}
                  </p>
                </div>
                <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                  t.type === "PEMASUKAN" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
