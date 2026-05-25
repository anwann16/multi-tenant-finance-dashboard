"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTransaksi } from "@/hooks/useTransaksi";
import TransaksiDetail from "@/components/transaksi/TransaksiDetail";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransaksiDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: transaksi, isLoading } = useTransaksi(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!transaksi) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Transaksi tidak ditemukan.</p>
        <Link href="/transaksi"><Button variant="link">Kembali ke daftar transaksi</Button></Link>
      </div>
    );
  }

  return <TransaksiDetail transaksi={transaksi} />;
}
