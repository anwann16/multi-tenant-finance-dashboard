"use client";

import { Tag } from "lucide-react";
import { useKategorisGrouped } from "@/hooks/useKategori";
import KategoriList from "@/components/kategori/KategoriList";
import KategoriForm from "@/components/kategori/KategoriForm";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_KANTOR_ID = "k1";

export default function KategoriPage() {
  const { data, isLoading } = useKategorisGrouped(MOCK_KANTOR_ID);

  if (isLoading) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kategori</h1>
            <p className="text-sm text-muted-foreground">Kelola kategori transaksi</p>
          </div>
        </div>
        <KategoriForm kantorId={MOCK_KANTOR_ID} />
      </div>

      {data && <KategoriList kantorId={MOCK_KANTOR_ID} data={data} />}
    </div>
  );
}
