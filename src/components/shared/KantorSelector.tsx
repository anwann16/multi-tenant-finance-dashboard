"use client";

import { useEffect } from "react";
import { Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  return (
    <div className="hidden items-center gap-1.5 sm:flex">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedKantorId ?? ""} onValueChange={setSelectedKantorId}>
        <SelectTrigger className="h-8 w-[180px] text-xs border-border/50 bg-muted/30">
          <SelectValue placeholder="Pilih kantor" />
        </SelectTrigger>
        <SelectContent>
          {kantors.map((k: { id: string; name: string }) => (
            <SelectItem key={k.id} value={k.id} className="text-xs">
              {k.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
