"use client";

import { cn } from "@/lib/utils";

interface PettyCashProgressProps {
  saldo: number;
  limit: number;
}

export default function PettyCashProgress({ saldo, limit }: PettyCashProgressProps) {
  const percentage = limit > 0 ? Math.min((saldo / limit) * 100, 100) : 0;

  let barColor = "bg-green-500";
  if (percentage < 30) barColor = "bg-red-500";
  else if (percentage < 50) barColor = "bg-yellow-500";

  return (
    <div className="space-y-2">
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{Math.round(percentage)}% tersisa</span>
        <span>{percentage < 30 ? "⚠️ Hampir habis" : ""}</span>
      </div>
    </div>
  );
}
