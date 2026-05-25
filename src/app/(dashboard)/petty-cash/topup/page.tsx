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
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_KANTOR_ID = "k1";

export default function PettyCashTopupPage() {
  const router = useRouter();
  const topupMutation = usePettyCashTopup(MOCK_KANTOR_ID);
  const { data: info } = usePettyCashInfo(MOCK_KANTOR_ID);

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

  return (
    <div className="mx-auto max-w-lg space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/petty-cash">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Top Up Petty Cash</h1>
          <p className="text-sm text-muted-foreground">Tambah saldo petty cash kantor</p>
        </div>
      </div>

      {/* Current Saldo */}
      {info && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Saldo Saat Ini</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(info.saldo)}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground">Limit</p>
                <p className="text-sm font-medium tabular-nums">{formatCurrency(info.limit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Detail Top Up</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal Top Up (Rp)</Label>
              <Input
                id="nominal"
                type="number"
                placeholder="0"
                {...form.register("nominal", { valueAsNumber: true })}
              />
              {form.formState.errors.nominal && (
                <p className="text-sm text-destructive">{form.formState.errors.nominal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <Textarea
                id="deskripsi"
                placeholder="Contoh: Top up petty cash bulanan"
                rows={2}
                {...form.register("deskripsi")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-2 pb-4 sm:justify-end">
          <Link href="/petty-cash">
            <Button type="button" variant="outline">Batal</Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Menyimpan..." : "Top Up Sekarang"}
          </Button>
        </div>
      </form>
    </div>
  );
}
