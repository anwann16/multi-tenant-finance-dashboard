"use client";

import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { TransaksiWithRelations } from "@/types/transaksi";

interface TransaksiTableProps {
  data: TransaksiWithRelations[];
}

export default function TransaksiTable({ data }: TransaksiTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "tanggal", desc: true }]);

  const columns: ColumnDef<TransaksiWithRelations>[] = [
    {
      accessorKey: "nomorTransaksi",
      header: "No. Transaksi",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.nomorTransaksi}</span>
      ),
      size: 160,
    },
    {
      accessorKey: "tanggal",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center font-medium">
          Tanggal {column.getIsSorted() === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : column.getIsSorted() === "desc" ? <ArrowDown className="ml-1 h-3 w-3" /> : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </button>
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">{formatDateShort(row.original.tanggal)}</span>
      ),
    },
    {
      accessorKey: "kategori",
      header: "Kategori",
      cell: ({ row }) => {
        const k = row.original.kategori;
        return (
          <span className="inline-flex items-center gap-1.5">
            <span style={{ color: k.color || undefined }}>{k.icon}</span>
            {k.name}
          </span>
        );
      },
    },
    {
      accessorKey: "deskripsi",
      header: "Deskripsi",
      cell: ({ row }) => (
        <span className="block max-w-[200px] truncate text-muted-foreground">{row.original.deskripsi}</span>
      ),
    },
    {
      accessorKey: "nominal",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="inline-flex items-center font-medium">
          Nominal {column.getIsSorted() === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : column.getIsSorted() === "desc" ? <ArrowDown className="ml-1 h-3 w-3" /> : <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />}
        </button>
      ),
      cell: ({ row }) => {
        const t = row.original;
        return (
          <span className={`text-right font-medium tabular-nums ${t.type === "PEMASUKAN" ? "text-green-600" : "text-destructive"}`}>
            {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
          </span>
        );
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "metodeBayar",
      header: "Metode",
      cell: ({ row }) => <span>{row.original.metodeBayar}</span>,
    },
    {
      accessorKey: "user",
      header: "Dicatat oleh",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.user.name}</span>
      ),
    },
    {
      id: "aksi",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="text-left">
          <Link href={`/transaksi/${row.original.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
      size: 72,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      {/* Desktop */}
      <div className="hidden rounded-lg border lg:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Tidak ada transaksi
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile + Tablet */}
      <div className="lg:hidden divide-y divide-border/50">
        {table.getRowModel().rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Tidak ada transaksi
          </div>
        ) : (
          table.getRowModel().rows.map((row) => {
            const t = row.original;
            return (
              <Link
                key={row.id}
                href={`/transaksi/${t.id}`}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:px-6"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  t.type === "PEMASUKAN"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-rose-500/10 text-rose-600"
                }`}>
                  {t.type === "PEMASUKAN" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{t.deskripsi}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{t.kategori.icon} {t.kategori.name}</span>
                    <span>·</span>
                    <span>{formatDateShort(t.tanggal)}</span>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${
                  t.type === "PEMASUKAN" ? "text-emerald-600" : "text-rose-600"
                }`}>
                  {t.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(t.nominal)}
                </span>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
