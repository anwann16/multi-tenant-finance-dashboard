"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PettyCashTopupSchema, type PettyCashTopupInput } from "@/lib/validators";
import { usePettyCashTopup, usePettyCashInfo } from "@/hooks/usePettyCash";
import { useKantorSelection } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function PettyCashTopupPage() {
  const router = useRouter();
  const { selectedKantorId } = useKantorSelection();
  const kantorId = selectedKantorId ?? "";
  const topupMutation = usePettyCashTopup(kantorId);
  const { data: info } = usePettyCashInfo(kantorId);

  const form = useForm<PettyCashTopupInput>({
    resolver: zodResolver(PettyCashTopupSchema),
    defaultValues: {
      nominal: 0,
      deskripsi: "",
    },
  });

  function onSubmit(data: PettyCashTopupInput) {
    topupMutation.mutate(data, {
      onSuccess: () => {
        toast.success(`Top up ${formatCurrency(data.nominal)} berhasil`);
        router.push("/petty-cash");
      },
    });
  }

  const isPending = topupMutation.isPending;

  if (!kantorId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Wallet className="mb-4 h-12 w-12 opacity-40" />
        <p className="text-lg font-medium">Pilih kantor terlebih dahulu</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/petty-cash">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Top Up Petty Cash</h1>
          <p className="text-sm text-muted-foreground">Tambah saldo petty cash kantor</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Saldo Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(info?.saldo ?? 0)}</p>
          <p className="text-sm text-muted-foreground">dari limit {formatCurrency(info?.limit ?? 0)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Form Top Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal</Label>
              <Input
                id="nominal"
                type="number"
                placeholder="Masukkan nominal"
                {...form.register("nominal", { valueAsNumber: true })}
              />
              {form.formState.errors.nominal && (
                <p className="text-xs text-destructive">{form.formState.errors.nominal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Keterangan (opsional)</Label>
              <Textarea
                id="deskripsi"
                placeholder="Top up untuk..."
                rows={2}
                {...form.register("deskripsi")}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Link href="/petty-cash" className="flex-1">
                <Button type="button" variant="outline" className="w-full">Batal</Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Menyimpan..." : <><Save className="mr-2 h-4 w-4" />Top Up</>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
