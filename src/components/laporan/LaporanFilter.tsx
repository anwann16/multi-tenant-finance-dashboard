"use client";

import { useState } from "react";
import { CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import { TRANSAKSI_STATUS_OPTIONS } from "@/lib/constants";
import type { Kategori } from "@/types/kategori";

export interface LaporanFilterState {
  tanggalFrom: string;
  tanggalTo: string;
  kategoriId: string;
  status: string;
  search: string;
}

interface LaporanFilterProps {
  filters: LaporanFilterState;
  onChange: (filters: LaporanFilterState) => void;
  kategoris: Kategori[];
}

export default function LaporanFilter({ filters, onChange, kategoris }: LaporanFilterProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  function update(key: keyof LaporanFilterState, value: string) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Row 1: Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari deskripsi atau nomor transaksi..."
              className="pl-9 h-10"
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
            />
          </div>

          {/* Row 2: Date range + Apply */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label className="text-xs">Dari Tanggal</Label>
              <Popover open={fromOpen} onOpenChange={setFromOpen}>
                <PopoverTrigger render={
                  <Button variant="outline" className="h-10 w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
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

            <div className="space-y-1">
              <Label className="text-xs">Sampai Tanggal</Label>
              <Popover open={toOpen} onOpenChange={setToOpen}>
                <PopoverTrigger render={
                  <Button variant="outline" className="h-10 w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
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

            <div className="space-y-1">
              <Label className="text-xs">Kategori</Label>
              <Select value={filters.kategoriId || "ALL"} onValueChange={(v) => { if (v) update("kategoriId", v === "ALL" ? "" : v); }}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Semua Kategori">
                    {(val: string | null) => {
                      if (!val || val === "ALL") return "Semua Kategori";
                      const k = kategoris.find((k) => k.id === val);
                      return k ? `${k.icon} ${k.name}` : "Semua Kategori";
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" label="Semua Kategori">Semua Kategori</SelectItem>
                  {kategoris.map((k) => (
                    <SelectItem key={k.id} value={k.id} label={`${k.icon} ${k.name}`}>{k.icon} {k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select value={filters.status || "ALL"} onValueChange={(v) => { if (v) update("status", v); }}>
                <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" label="Semua Status">Semua Status</SelectItem>
                  {TRANSAKSI_STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
