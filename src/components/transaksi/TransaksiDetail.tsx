"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteTransaksi } from "@/hooks/useTransaksi";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { TransaksiWithRelations } from "@/types/transaksi";

interface TransaksiDetailProps {
  transaksi: TransaksiWithRelations;
}

const STATUS_MAP = {
  DRAFT: { label: "Draft", variant: "secondary" as const },
  CONFIRMED: { label: "Confirmed", variant: "default" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

export default function TransaksiDetail({ transaksi }: TransaksiDetailProps) {
  const router = useRouter();
  const deleteTransaksi = useDeleteTransaksi();
  const [actionTarget, setActionTarget] = useState<"delete" | null>(null);

  function handleAction() {
    if (!actionTarget) return;

    if (actionTarget === "delete") {
      deleteTransaksi.mutate(
        { id: transaksi.id, kantorId: transaksi.kantorId },
        { onSuccess: () => { toast.success("Transaksi dihapus"); router.push("/transaksi"); } }
      );
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/transaksi">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{transaksi.nomorTransaksi}</h1>
              <Badge variant={STATUS_MAP[transaksi.status].variant}>{STATUS_MAP[transaksi.status].label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Dibuat pada {formatDate(transaksi.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Amount + Type */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nominal</p>
              <p className={`text-2xl font-bold tabular-nums ${transaksi.type === "PEMASUKAN" ? "text-green-600" : "text-destructive"}`}>
                {transaksi.type === "PEMASUKAN" ? "+" : "-"}{formatCurrency(transaksi.nominal)}
              </p>
            </div>
            <Badge variant={transaksi.type === "PEMASUKAN" ? "default" : "secondary"} className="text-sm">
              {transaksi.type === "PEMASUKAN" ? "Pemasukan" : "Pengeluaran"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Info Grid */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tanggal</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{formatDate(transaksi.tanggal)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Kategori</CardTitle></CardHeader>
          <CardContent>
            <p className="flex items-center gap-1.5 text-sm">
              <span>{transaksi.kategori.icon}</span>
              {transaksi.kategori.name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Metode Bayar</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{transaksi.metodeBayar}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Input Oleh</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{transaksi.user.name}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Petty Cash</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{transaksi.isPettyCash ? "Ya" : "Tidak"}</p></CardContent>
        </Card>
        {transaksi.rekeningInfo && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Info Rekening</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{transaksi.rekeningInfo}</p></CardContent>
          </Card>
        )}
      </div>

      {/* Deskripsi */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Deskripsi</CardTitle></CardHeader>
        <CardContent><p className="text-sm">{transaksi.deskripsi}</p></CardContent>
      </Card>

      {/* Bukti */}
      {transaksi.bukti.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Bukti Transaksi</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {transaksi.bukti.map((b) => (
                <div key={b.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {b.fileName}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setActionTarget("delete")}>
          <Trash2 className="mr-2 h-4 w-4" />Hapus
        </Button>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!actionTarget} onOpenChange={(v) => { if (!v) setActionTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus transaksi ini? Tindakan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleAction}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
