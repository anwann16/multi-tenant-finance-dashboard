"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useKantor, useDeleteKantor } from "@/hooks/useKantor";
import UserAssignDialog from "@/components/kantor/UserAssignDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function KantorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: kantor, isLoading } = useKantor(id);
  const deleteKantor = useDeleteKantor();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!kantor) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kantor tidak ditemukan.</p>
        <Link href="/kantor"><Button variant="link">Kembali ke daftar kantor</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — mobile: stacked, desktop: original */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/kantor">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{kantor.name}</h1>
              <Badge variant={kantor.isActive ? "default" : "secondary"}>
                {kantor.isActive ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Dibuat pada {formatDate(kantor.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <UserAssignDialog kantorId={kantor.id} users={kantor.userRoles} />
          <Link href={`/kantor/${id}/edit`}>
            <Button variant="outline" size="sm"><Pencil className="mr-2 h-4 w-4" />Edit</Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />Hapus
          </Button>
        </div>
      </div>

      {/* Info cards — mobile: 1 col, tablet: 2 col, desktop: 3 col */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Alamat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-sm">{kantor.address ? <><MapPin className="h-4 w-4 shrink-0" />{kantor.address}</> : "Tidak ada alamat"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Limit Petty Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="flex items-center gap-2 text-sm font-medium tabular-nums"><Wallet className="h-4 w-4 shrink-0" />{formatCurrency(kantor.pettyCashLimit)}</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 sm:text-left lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Statistik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm sm:flex sm:gap-6 sm:space-y-0">
            <p>User: <span className="font-medium tabular-nums">{kantor.userRoles.length}</span></p>
            <p>Transaksi: <span className="font-medium tabular-nums">{kantor._count.transaksi}</span></p>
          </CardContent>
        </Card>
      </div>

      {kantor.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Deskripsi</CardTitle>
          </CardHeader>
          <CardContent><p className="text-sm">{kantor.description}</p></CardContent>
        </Card>
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kantor</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus <strong>{kantor.name}</strong>? Semua data terkait akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                deleteKantor.mutate(id, {
                  onSuccess: () => { toast.success("Kantor dihapus"); router.push("/kantor"); },
                });
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
