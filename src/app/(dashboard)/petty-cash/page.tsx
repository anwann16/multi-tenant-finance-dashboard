"use client";

import { Wallet } from "lucide-react";
import PettyCashWidget from "@/components/petty-cash/PettyCashWidget";
import PettyCashLog from "@/components/petty-cash/PettyCashLog";
import { useKantorSelection } from "@/lib/store";

export default function PettyCashPage() {
  const { selectedKantorId } = useKantorSelection();
  const kantorId = selectedKantorId ?? "";

  if (!kantorId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Wallet className="mb-4 h-12 w-12 opacity-40" />
        <p className="text-lg font-medium">Pilih kantor terlebih dahulu</p>
        <p className="text-sm">Gunakan dropdown kantor di bagian atas untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Petty Cash</h1>
          <p className="text-sm text-muted-foreground">Kelola saldo petty cash kantor</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PettyCashWidget kantorId={kantorId} />
        <PettyCashLog kantorId={kantorId} />
      </div>
    </div>
  );
}
