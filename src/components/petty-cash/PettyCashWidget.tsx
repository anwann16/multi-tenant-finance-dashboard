"use client";

import Link from "next/link";
import { Wallet, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PettyCashProgress from "./PettyCashProgress";
import { formatCurrency } from "@/lib/utils";
import { usePettyCashInfo } from "@/hooks/usePettyCash";
import { PETTY_CASH_ALERT_THRESHOLD } from "@/lib/constants";

interface PettyCashWidgetProps {
  kantorId: string;
}

export default function PettyCashWidget({ kantorId }: PettyCashWidgetProps) {
  const { data: info, isLoading } = usePettyCashInfo(kantorId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!info) return null;

  const percentage = info.limit > 0 ? (info.saldo / info.limit) * 100 : 0;
  const isLow = percentage < PETTY_CASH_ALERT_THRESHOLD * 100;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Petty Cash</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(info.saldo)}</p>
              <p className="text-sm text-muted-foreground">dari {formatCurrency(info.limit)}</p>
            </div>
          </div>
          <Link href="/petty-cash/topup">
            <Button variant="outline" size="sm">
              <ArrowUp className="mr-2 h-4 w-4" />Top Up
            </Button>
          </Link>
        </div>

        <div className="mt-4">
          <PettyCashProgress saldo={info.saldo} limit={info.limit} />
        </div>

        {isLow && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
            ⚠️ Saldo di bawah 50%! Top up segera.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
