"use client";

import { useState, useMemo } from "react";
import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransaksiList } from "@/hooks/useTransaksi";
import { useKategoris } from "@/hooks/useKategori";
import TransaksiTable from "@/components/transaksi/TransaksiTable";
import TransaksiFilter from "@/components/transaksi/TransaksiFilter";
import TransaksiForm from "@/components/transaksi/TransaksiForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransaksiFilterState, TransaksiWithRelations } from "@/types/transaksi";

const MOCK_KANTOR_ID = "k1";

const DEFAULT_FILTERS: TransaksiFilterState = {
  search: "", type: "ALL", status: "ALL", metodeBayar: "ALL",
  kategoriId: "", tanggalFrom: "", tanggalTo: "", nominalMin: "", nominalMax: "",
};

export default function TransaksiListPage() {
  const { data, isLoading } = useTransaksiList(MOCK_KANTOR_ID);
  const { data: kategoris = [] } = useKategoris(MOCK_KANTOR_ID);
  const [filters, setFilters] = useState<TransaksiFilterState>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((t: TransaksiWithRelations) => {
      if (filters.type !== "ALL" && t.type !== filters.type) return false;
      if (filters.status !== "ALL" && t.status !== filters.status) return false;
      if (filters.metodeBayar !== "ALL" && t.metodeBayar !== filters.metodeBayar) return false;
      if (filters.kategoriId && t.kategoriId !== filters.kategoriId) return false;
      if (filters.search && !t.deskripsi.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.tanggalFrom && t.tanggal < filters.tanggalFrom) return false;
      if (filters.tanggalTo && t.tanggal > filters.tanggalTo) return false;
      if (filters.nominalMin && t.nominal < Number(filters.nominalMin)) return false;
      if (filters.nominalMax && t.nominal > Number(filters.nominalMax)) return false;
      return true;
    });
  }, [data, filters]);

  const totalPemasukan = filtered.filter((t) => t.type === "PEMASUKAN" && t.status !== "CANCELLED").reduce((s, t) => s + t.nominal, 0);
  const totalPengeluaran = filtered.filter((t) => t.type === "PENGELUARAN" && t.status !== "CANCELLED").reduce((s, t) => s + t.nominal, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
            <p className="text-sm text-muted-foreground">Kelola transaksi pemasukan & pengeluaran</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Transaksi Baru
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Pemasukan</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-green-600">
            +{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPemasukan)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Pengeluaran</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-destructive">
            -{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPengeluaran)}
          </p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-xs text-muted-foreground">Saldo</p>
          <p className="mt-1 text-lg font-bold tabular-nums">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalPemasukan - totalPengeluaran)}
          </p>
        </div>
      </div>

      {/* Filter */}
      <TransaksiFilter filters={filters} onChange={setFilters} kategoris={kategoris} />

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : (
        <TransaksiTable data={filtered} />
      )}

      {/* Dialog Form */}
      <TransaksiForm kantorId={MOCK_KANTOR_ID} open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
