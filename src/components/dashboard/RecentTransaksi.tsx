"use client";

import Link from "next/link";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { TransaksiWithRelations } from "@/types/transaksi";

const MOCK_DATA: TransaksiWithRelations[] = [
  { id: "1", nomorTransaksi: "TRX-001", tanggal: "2026-06-15", deskripsi: "Beli ATK", nominal: 450000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TUNAI", kategori: { id: "1", name: "ATK", icon: "📎", color: null }, user: { id: "u1", name: "Admin" }, kantorId: "k1", userId: "u1", kategoriId: "1", rekeningInfo: null, isPettyCash: false, buktiFiles: [], createdAt: "2026-06-15T10:00:00Z" },
  { id: "2", nomorTransaksi: "TRX-002", tanggal: "2026-06-14", deskripsi: "Client Meeting Lunch", nominal: 850000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "CARD", kategori: { id: "2", name: "Makan & Minum", icon: "🍔", color: null }, user: { id: "u1", name: "Admin" }, kantorId: "k1", userId: "u1", kategoriId: "2", rekeningInfo: null, isPettyCash: false, buktiFiles: [], createdAt: "2026-06-14T12:00:00Z" },
  { id: "3", nomorTransaksi: "TRX-003", tanggal: "2026-06-14", deskripsi: "Proyek Web App", nominal: 15000000, type: "PEMASUKAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "3", name: "Penjualan", icon: "💰", color: null }, user: { id: "u2", name: "Finance" }, kantorId: "k1", userId: "u2", kategoriId: "3", rekeningInfo: null, isPettyCash: false, buktiFiles: [], createdAt: "2026-06-14T14:00:00Z" },
  { id: "4", nomorTransaksi: "TRX-004", tanggal: "2026-06-13", deskripsi: "Grab ke Klien", nominal: 125000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TUNAI", kategori: { id: "4", name: "Transport", icon: "🚗", color: null }, user: { id: "u1", name: "Admin" }, kantorId: "k1", userId: "u1", kategoriId: "4", rekeningInfo: null, isPettyCash: false, buktiFiles: [], createdAt: "2026-06-13T09:00:00Z" },
  { id: "5", nomorTransaksi: "TRX-005", tanggal: "2026-06-12", deskripsi: "Top Up Listrik", nominal: 500000, type: "PENGELUARAN", status: "DRAFT", metodeBayar: "TRANSFER", kategori: { id: "5", name: "Operasional", icon: "🏢", color: null }, user: { id: "u1", name: "Admin" }, kantorId: "k1", userId: "u1", kategoriId: "5", rekeningInfo: null, isPettyCash: false, buktiFiles: [], createdAt: "2026-06-12T15:00:00Z" },
];

export default function RecentTransaksi() {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Transaksi Terakhir</CardTitle>
        <Link href="/transaksi" className="text-xs text-primary hover:underline">
          Lihat Semua
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {MOCK_DATA.map((t) => (
            <div key={t.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-6">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${t.type === "PEMASUKAN" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {t.type === "PEMASUKAN" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{t.deskripsi}</p>
                <p className="text-xs text-muted-foreground">{formatDateShort(t.tanggal)}</p>
              </div>
              <span className={`text-sm font-medium tabular-nums ${t.type === "PEMASUKAN" ? "text-green-600" : "text-red-600"}`}>
                {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
