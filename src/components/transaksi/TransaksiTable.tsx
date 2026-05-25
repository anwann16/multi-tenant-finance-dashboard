"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { TransaksiWithRelations, TransaksiSort } from "@/types/transaksi";

interface TransaksiTableProps {
  data: TransaksiWithRelations[];
}

const STATUS_MAP = {
  DRAFT: { label: "Draft", variant: "secondary" as const },
  CONFIRMED: { label: "Confirmed", variant: "default" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

export default function TransaksiTable({ data }: TransaksiTableProps) {
  const [sort, setSort] = useState<TransaksiSort>({ field: "tanggal", direction: "desc" });

  function toggleSort(field: TransaksiSort["field"]) {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  }

  const sorted = [...data].sort((a, b) => {
    const dir = sort.direction === "asc" ? 1 : -1;
    if (sort.field === "nominal") return (a.nominal - b.nominal) * dir;
    return (new Date(a[sort.field]).getTime() - new Date(b[sort.field]).getTime()) * dir;
  });

  function SortIcon({ field }: { field: TransaksiSort["field"] }) {
    if (sort.field !== field) return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    return sort.direction === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">No. Transaksi</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("tanggal")} className="inline-flex items-center font-medium">
                  Tanggal <SortIcon field="tanggal" />
                </button>
              </TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("nominal")} className="inline-flex items-center font-medium">
                  Nominal <SortIcon field="nominal" />
                </button>
              </TableHead>
              <TableHead>Metode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.nomorTransaksi}</TableCell>
                  <TableCell className="tabular-nums">{formatDateShort(t.tanggal)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5">
                      <span style={{ color: t.kategori.color || undefined }}>{t.kategori.icon}</span>
                      {t.kategori.name}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{t.deskripsi}</TableCell>
                  <TableCell className={`text-right font-medium tabular-nums ${t.type === "PEMASUKAN" ? "text-green-600" : "text-destructive"}`}>
                    {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                  </TableCell>
                  <TableCell>{t.metodeBayar}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_MAP[t.status].variant}>{STATUS_MAP[t.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/transaksi/${t.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="space-y-2 md:hidden">
        {sorted.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-sm text-muted-foreground">
            Tidak ada transaksi
          </div>
        ) : (
          sorted.map((t) => (
            <Link
              key={t.id}
              href={`/transaksi/${t.id}`}
              className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{t.nomorTransaksi}</span>
                  <Badge variant={STATUS_MAP[t.status].variant} className="text-[10px]">{STATUS_MAP[t.status].label}</Badge>
                </div>
                <p className="mt-1 truncate text-sm font-medium">{t.deskripsi}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{t.kategori.icon} {t.kategori.name}</span>
                  <span>·</span>
                  <span>{formatDateShort(t.tanggal)}</span>
                  <span>·</span>
                  <span>{t.metodeBayar}</span>
                </div>
              </div>
              <div className="ml-3 shrink-0 text-right">
                <p className={`text-sm font-medium tabular-nums ${t.type === "PEMASUKAN" ? "text-green-600" : "text-destructive"}`}>
                  {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
