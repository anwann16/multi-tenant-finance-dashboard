"use client";

import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import LaporanFilter, { type LaporanFilterState } from "@/components/laporan/LaporanFilter";
import LaporanSummary from "@/components/laporan/LaporanSummary";
import LaporanTable from "@/components/laporan/LaporanTable";
import ExportButtons from "@/components/laporan/ExportButtons";
import { MOCK_LAPORAN_DATA, MOCK_RINGKASAN, MOCK_KATEGORI_OPTIONS } from "@/components/laporan/mock-data";

const DEFAULT_FILTERS: LaporanFilterState = {
  tanggalFrom: "",
  tanggalTo: "",
  kategoriId: "",
  search: "",
};

export default function LaporanPage() {
  const [filters, setFilters] = useState<LaporanFilterState>(DEFAULT_FILTERS);

  const filteredData = useMemo(() => {
    return MOCK_LAPORAN_DATA.filter((t) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!t.deskripsi.toLowerCase().includes(q) && !t.nomorTransaksi.toLowerCase().includes(q)) return false;
      }
      if (filters.tanggalFrom && t.tanggal < filters.tanggalFrom) return false;
      if (filters.tanggalTo && t.tanggal > filters.tanggalTo) return false;
      if (filters.kategoriId && t.kategoriId !== filters.kategoriId) return false;
      return true;
    });
  }, [filters]);

  const ringkasan = useMemo(() => {
    const pemasukan = filteredData.filter((t) => t.type === "PEMASUKAN");
    const pengeluaran = filteredData.filter((t) => t.type === "PENGELUARAN");
    return {
      totalPemasukan: pemasukan.reduce((s, t) => s + t.nominal, 0),
      totalPengeluaran: pengeluaran.reduce((s, t) => s + t.nominal, 0),
      saldoBersih: pemasukan.reduce((s, t) => s + t.nominal, 0) - pengeluaran.reduce((s, t) => s + t.nominal, 0),
      jumlahTransaksi: filteredData.length,
      transaksiPemasukan: pemasukan.length,
      transaksiPengeluaran: pengeluaran.length,
    };
  }, [filteredData]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan</h1>
          <p className="text-sm text-muted-foreground">Lihat dan export laporan keuangan</p>
        </div>
      </div>

      {/* Filters */}
      <LaporanFilter filters={filters} onChange={setFilters} kategoris={MOCK_KATEGORI_OPTIONS} />

      {/* Summary Cards */}
      <LaporanSummary ringkasan={ringkasan} />

      {/* Detail Table */}
      <LaporanTable data={filteredData} />

      {/* Export */}
      <ExportButtons data={filteredData} ringkasan={ringkasan} />
    </div>
  );
}
