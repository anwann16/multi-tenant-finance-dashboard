"use client";

import { useState } from "react";
import { Pencil, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import KategoriForm from "./KategoriForm";
import { useDeleteKategori } from "@/hooks/useKategori";
import { toast } from "sonner";
import type { Kategori, KategoriGrouped } from "@/types/kategori";

interface KategoriListProps {
  kantorId: string;
  data: KategoriGrouped;
}

export default function KategoriList({ kantorId, data }: KategoriListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Kategori | null>(null);
  const deleteMutation = useDeleteKategori();

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      { id: deleteTarget.id, kantorId },
      {
        onSuccess: () => {
          toast.success("Kategori berhasil dihapus");
          setDeleteTarget(null);
        },
      }
    );
  }

  function renderGroup(title: string, items: Kategori[], accent: string) {
    if (items.length === 0) {
      return (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Belum ada kategori {title.toLowerCase()}
        </div>
      );
    }

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((k) => (
          <div
            key={k.id}
            className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
              style={{ backgroundColor: (k.color || "#64748B") + "20", color: k.color || "#64748B" }}
            >
              {k.icon || "📦"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{k.name}</p>
              {k.isDefault && (
                <Badge variant="secondary" className="mt-0.5 text-[10px]">
                  <Lock className="mr-1 h-2.5 w-2.5" />
                  Default
                </Badge>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <KategoriForm
                kantorId={kantorId}
                kategori={k}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              {!k.isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(k)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pengeluaran</h2>
            <Badge variant="outline" className="text-xs">{data.PENGELUARAN.length}</Badge>
          </div>
          {renderGroup("Pengeluaran", data.PENGELUARAN, "red")}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pemasukan</h2>
            <Badge variant="outline" className="text-xs">{data.PEMASUKAN.length}</Badge>
          </div>
          {renderGroup("Pemasukan", data.PEMASUKAN, "green")}
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus <strong>{deleteTarget?.name}</strong>? Kategori yang sudah digunakan di transaksi tidak akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
