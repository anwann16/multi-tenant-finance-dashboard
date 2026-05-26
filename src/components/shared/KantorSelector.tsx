"use client";

import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { useKantors } from "@/hooks/useKantor";
import { useSession } from "@/hooks/useSession";
import { useKantorSelection } from "@/lib/store";

export default function KantorSelector() {
  const { data: user } = useSession();
  const { data: kantors = [] } = useKantors();
  const { selectedKantorId, setSelectedKantorId } = useKantorSelection();

  const isFinance = user?.role === "FINANCE";

  useEffect(() => {
    if (kantors.length > 0 && !selectedKantorId) {
      setSelectedKantorId(kantors[0].id);
    }
  }, [kantors, selectedKantorId, setSelectedKantorId]);

  if (!isFinance || kantors.length === 0) return null;

  const selectedKantor = kantors.find((k: { id: string; name: string }) => k.id === selectedKantorId);

  if (kantors.length === 1) {
    return (
      <div className="hidden items-center gap-1.5 sm:flex">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium">{selectedKantor?.name ?? "Kantor"}</span>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-1.5 sm:flex">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <select
        value={selectedKantorId ?? ""}
        onChange={(e) => setSelectedKantorId(e.target.value)}
        className="h-8 rounded-lg border border-border/50 bg-muted/30 px-2 text-xs outline-none"
      >
        {kantors.map((k: { id: string; name: string }) => (
          <option key={k.id} value={k.id}>
            {k.name}
          </option>
        ))}
      </select>
    </div>
  );
}
