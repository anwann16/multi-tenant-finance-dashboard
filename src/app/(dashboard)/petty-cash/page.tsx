"use client";

import { Wallet } from "lucide-react";
import PettyCashWidget from "@/components/petty-cash/PettyCashWidget";
import PettyCashLog from "@/components/petty-cash/PettyCashLog";

const MOCK_KANTOR_ID = "k1";

export default function PettyCashPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Petty Cash</h1>
          <p className="text-sm text-muted-foreground">Kelola saldo petty cash kantor</p>
        </div>
      </div>

      {/* Widget + Log */}
      <div className="grid gap-4 lg:grid-cols-2">
        <PettyCashWidget kantorId={MOCK_KANTOR_ID} />
        <PettyCashLog kantorId={MOCK_KANTOR_ID} />
      </div>
    </div>
  );
}
