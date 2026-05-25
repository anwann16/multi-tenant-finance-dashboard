"use client";

import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { usePettyCashLog } from "@/hooks/usePettyCash";
import type { PettyCashLogType } from "@/types/petty-cash";

interface PettyCashLogProps {
  kantorId: string;
}

const TYPE_CONFIG: Record<PettyCashLogType, { label: string; icon: typeof ArrowUp; color: string; prefix: string }> = {
  TOPUP: { label: "Top Up", icon: ArrowUp, color: "text-green-600", prefix: "+" },
  PENGELUARAN: { label: "Pengeluaran", icon: ArrowDown, color: "text-destructive", prefix: "-" },
  ADJUSTMENT: { label: "Penyesuaian", icon: RefreshCw, color: "text-muted-foreground", prefix: "" },
};

export default function PettyCashLog({ kantorId }: PettyCashLogProps) {
  const { data: logs = [], isLoading } = usePettyCashLog(kantorId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Riwayat Pergerakan</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-32 rounded bg-muted" />
                  <div className="h-2 w-20 rounded bg-muted" />
                </div>
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Belum ada riwayat</p>
        ) : (
          <div className="divide-y">
            {logs.map((entry) => {
              const config = TYPE_CONFIG[entry.type];
              const Icon = config.icon;
              return (
                <div key={entry.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.deskripsi}</p>
                    <p className="text-xs text-muted-foreground">{formatDateShort(entry.createdAt)}</p>
                  </div>
                  <span className={`shrink-0 text-sm font-medium tabular-nums ${config.color}`}>
                    {config.prefix}{formatCurrency(Math.abs(entry.nominal))}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
