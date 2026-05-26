"use client";

import { useState } from "react";
import { Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransaksiList } from "@/hooks/useTransaksi";
import { useKategoris } from "@/hooks/useKategori";
import { useKantorSelection } from "@/lib/store";
import TransaksiTable from "@/components/transaksi/TransaksiTable";
import TransaksiFilter from "@/components/transaksi/TransaksiFilter";
import TransaksiForm from "@/components/transaksi/TransaksiForm";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransaksiFilterState } from "@/types/transaksi";

const DEFAULT_FILTERS: TransaksiFilterState = {
  search: "", type: "ALL", metodeBayar: "ALL",
  kategoriId: "", tanggalFrom: "", tanggalTo: "", nominalMin: "", nominalMax: "",
};

export default function TransaksiListPage() {
  const { selectedKantorId } = useKantorSelection();
  const kantorId = selectedKantorId ?? "";
  const [filters, setFilters] = useState<TransaksiFilterState>(DEFAULT_FILTERS);
  const [formOpen, setFormOpen] = useState(false);

  const { data: apiResult, isLoading } = useTransaksiList(kantorId, {
    type: filters.type !== "ALL" ? filters.type : undefined,
    kategoriId: filters.kategoriId || undefined,
    tanggalFrom: filters.tanggalFrom || undefined,
    tanggalTo: filters.tanggalTo || undefined,
    nominalMin: filters.nominalMin || undefined,
    nominalMax: filters.nominalMax || undefined,
    search: filters.search || undefined,
  });
  const data = apiResult?.data ?? [];

  const { data: kategoris = [] } = useKategoris(kantorId);

  const totalPemasukan = data
    .filter((t: any) => t.type === "PEMASUKAN")
    .reduce((sum: number, t: any) => sum + t.nominal, 0);
  const totalPengeluaran = data
    .filter((t: any) => t.type === "PENGELUARAN")
    .reduce((sum: number, t: any) => sum + t.nominal, 0);

  if (!kantorId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Receipt className="mb-4 h-12 w-12 opacity-40" />
        <p className="text-lg font-medium">Pilih kantor terlebih dahulu</p>
        <p className="text-sm">Gunakan dropdown kantor di bagian atas untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-sm text-muted-foreground">Kelola data pemasukan dan pengeluaran kantor.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Pemasukan</p>
          <p className="text-xl font-bold text-emerald-600">
            Rp {totalPemasukan.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
          <p className="text-xl font-bold text-red-600">
            Rp {totalPengeluaran.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Saldo</p>
          <p className="text-xl font-bold">
            Rp {(totalPemasukan - totalPengeluaran).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <TransaksiFilter
            filters={filters}
            onChange={setFilters}
            kategoris={kategoris}
          />
          <TransaksiTable data={data} />
        </>
      )}

      <TransaksiForm kantorId={kantorId} open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
