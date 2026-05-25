"use client";

import { ArrowUpRight, ArrowDownRight, Wallet, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { LaporanRingkasan } from "./mock-data";

const CARDS = [
  {
    label: "Total Pemasukan",
    key: "totalPemasukan" as const,
    icon: ArrowUpRight,
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    badgeBg: "bg-emerald-500/10",
  },
  {
    label: "Total Pengeluaran",
    key: "totalPengeluaran" as const,
    icon: ArrowDownRight,
    color: "text-rose-600",
    bg: "bg-rose-500/10",
    gradient: "from-rose-500/10 via-rose-500/5 to-transparent",
    badgeBg: "bg-rose-500/10",
  },
  {
    label: "Saldo Bersih",
    key: "saldoBersih" as const,
    icon: Wallet,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/10 via-primary/5 to-transparent",
    badgeBg: "bg-primary/10",
  },
];

interface LaporanSummaryProps {
  ringkasan: LaporanRingkasan;
}

export default function LaporanSummary({ ringkasan }: LaporanSummaryProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const value = ringkasan[card.key];
        const isNegative = card.key === "saldoBersih" && value < 0;

        return (
          <Card key={card.key} className="relative overflow-hidden border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
            <CardContent className="relative p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">{card.label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} shadow-lg shadow-primary/5`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${isNegative ? "text-rose-600" : card.color}`}>
                {isNegative ? "-" : ""}{formatCurrency(Math.abs(value))}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">
                  {ringkasan.jumlahTransaksi} transaksi
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {ringkasan.transaksiPemasukan} masuk / {ringkasan.transaksiPengeluaran} keluar
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
