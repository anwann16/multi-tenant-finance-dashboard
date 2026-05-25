"use client";

import { useState } from "react";
import { Search, Filter, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateShort } from "@/lib/utils";
import { TRANSAKSI_STATUS_OPTIONS, METODE_BAYAR_OPTIONS } from "@/lib/constants";
import type { TransaksiFilterState } from "@/types/transaksi";
import type { Kategori } from "@/types/kategori";

interface TransaksiFilterProps {
  filters: TransaksiFilterState;
  onChange: (filters: TransaksiFilterState) => void;
  kategoris: Kategori[];
}

export default function TransaksiFilter({ filters, onChange, kategoris }: TransaksiFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  function update(key: keyof TransaksiFilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  function clearFilters() {
    onChange({
      search: "", type: "ALL", status: "ALL", metodeBayar: "ALL",
      kategoriId: "", tanggalFrom: "", tanggalTo: "", nominalMin: "", nominalMax: "",
    });
  }

  const hasActiveFilters = filters.type !== "ALL" || filters.status !== "ALL" || filters.metodeBayar !== "ALL" ||
    filters.kategoriId || filters.tanggalFrom || filters.tanggalTo || filters.nominalMin || filters.nominalMax;

  return (
    <div className="space-y-3">
      {/* Search + Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari deskripsi..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </div>
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Type */}
          <div className="space-y-1">
            <Label className="text-xs">Tipe</Label>
            <Select value={filters.type} onValueChange={(v) => { if (v) update("type", v); }}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
                <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={filters.status} onValueChange={(v) => { if (v) update("status", v); }}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                {TRANSAKSI_STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Metode Bayar */}
          <div className="space-y-1">
            <Label className="text-xs">Metode Bayar</Label>
            <Select value={filters.metodeBayar} onValueChange={(v) => { if (v) update("metodeBayar", v); }}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                {METODE_BAYAR_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kategori */}
          <div className="space-y-1">
            <Label className="text-xs">Kategori</Label>
            <Select value={filters.kategoriId || "ALL"} onValueChange={(v) => { if (v) update("kategoriId", v === "ALL" ? "" : v); }}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Semua" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                {kategoris.map((k) => (
                  <SelectItem key={k.id} value={k.id}>{k.icon} {k.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-1">
            <Label className="text-xs">Dari Tanggal</Label>
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger render={
                <Button variant="outline" className="h-9 w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filters.tanggalFrom ? formatDateShort(filters.tanggalFrom) : "Pilih tanggal"}
                </Button>
              } />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.tanggalFrom ? new Date(filters.tanggalFrom) : undefined}
                  onSelect={(d) => { update("tanggalFrom", d ? d.toISOString().split("T")[0] : ""); setFromOpen(false); }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-1">
            <Label className="text-xs">Sampai Tanggal</Label>
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger render={
                <Button variant="outline" className="h-9 w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {filters.tanggalTo ? formatDateShort(filters.tanggalTo) : "Pilih tanggal"}
                </Button>
              } />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.tanggalTo ? new Date(filters.tanggalTo) : undefined}
                  onSelect={(d) => { update("tanggalTo", d ? d.toISOString().split("T")[0] : ""); setToOpen(false); }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Nominal Range */}
          <div className="space-y-1">
            <Label className="text-xs">Minimal Nominal</Label>
            <Input
              type="number"
              placeholder="0"
              className="h-9"
              value={filters.nominalMin}
              onChange={(e) => update("nominalMin", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Maksimal Nominal</Label>
            <Input
              type="number"
              placeholder="Tanpa batas"
              className="h-9"
              value={filters.nominalMax}
              onChange={(e) => update("nominalMax", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
