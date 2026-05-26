"use client";

import { useState, useEffect } from "react";
import { Tag } from "lucide-react";
import { useKategorisGrouped } from "@/hooks/useKategori";
import { useKantors } from "@/hooks/useKantor";
import KategoriList from "@/components/kategori/KategoriList";
import KategoriForm from "@/components/kategori/KategoriForm";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function KategoriPage() {
  const { data: kantors, isLoading: kantorsLoading } = useKantors();
  const [selectedKantorId, setSelectedKantorId] = useState("");
  const { data, isLoading } = useKategorisGrouped(selectedKantorId);

  useEffect(() => {
    if (kantors && kantors.length > 0 && !selectedKantorId) {
      setSelectedKantorId(kantors[0].id);
    }
  }, [kantors, selectedKantorId]);

  if (kantorsLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
            <p className="text-sm text-muted-foreground">Kelola kategori transaksi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {kantors && kantors.length > 1 && (
            <Select value={selectedKantorId} onValueChange={(v) => v && setSelectedKantorId(v)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih kantor" />
              </SelectTrigger>
              <SelectContent>
                {kantors.map((k) => (
                  <SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedKantorId && <KategoriForm kantorId={selectedKantorId} />}
        </div>
      </div>

      {selectedKantorId && data && (
        <KategoriList kantorId={selectedKantorId} data={data} />
      )}
    </div>
  );
}
