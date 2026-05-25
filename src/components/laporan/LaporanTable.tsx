"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { TransaksiWithRelations } from "@/types/transaksi";

interface LaporanTableProps {
  data: TransaksiWithRelations[];
}

export default function LaporanTable({ data }: LaporanTableProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Detail Transaksi</CardTitle>
        <span className="text-xs text-muted-foreground">{data.length} transaksi</span>
      </CardHeader>
      <CardContent className="p-0">
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Tanggal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">No. Transaksi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Metode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Nominal</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t) => (
                <tr key={t.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm tabular-nums">{formatDateShort(t.tanggal)}</td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{t.nomorTransaksi}</td>
                  <td className="px-4 py-3 text-sm max-w-[200px] truncate">{t.deskripsi}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span>{t.kategori.icon}</span>
                      <span className="text-muted-foreground">{t.kategori.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{t.metodeBayar}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-semibold tabular-nums ${
                      t.type === "PEMASUKAN" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {t.type === "PEMASUKAN" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="lg:hidden divide-y divide-border/50">
          {data.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:gap-4 sm:px-6">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                t.type === "PEMASUKAN"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-rose-500/10 text-rose-600"
              }`}>
                {t.type === "PEMASUKAN" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{t.deskripsi}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{t.kategori.icon} {t.kategori.name}</span>
                  <span>·</span>
                  <span>{formatDateShort(t.tanggal)}</span>
                </div>
              </div>
              <span className={`text-sm font-semibold tabular-nums ${
                t.type === "PEMASUKAN" ? "text-emerald-600" : "text-rose-600"
              }`}>
                {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-emerald-500/10 text-emerald-600",
    DRAFT: "bg-amber-500/10 text-amber-600",
    CANCELLED: "bg-rose-500/10 text-rose-600",
  };
  const labels: Record<string, string> = {
    CONFIRMED: "Confirmed",
    DRAFT: "Draft",
    CANCELLED: "Cancelled",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {labels[status] || status}
    </span>
  );
}
