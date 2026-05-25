"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BuktiUpload from "./BuktiUpload";
import { TransaksiSchema, type TransaksiInput } from "@/lib/validators";
import { useCreateTransaksi } from "@/hooks/useTransaksi";
import { useKategoris } from "@/hooks/useKategori";
import { formatDateShort } from "@/lib/utils";
import { METODE_BAYAR_OPTIONS } from "@/lib/constants";
import { toast } from "sonner";
import type { TransaksiType } from "@/types/transaksi";

interface TransaksiFormProps {
  kantorId: string;
  type: TransaksiType;
}

export default function TransaksiForm({ kantorId, type }: TransaksiFormProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [files, setFiles] = useState<File[]>([]);
  const [isPettyCash, setIsPettyCash] = useState(false);

  const createMutation = useCreateTransaksi();
  const { data: kategoris } = useKategoris(kantorId, type);

  const form = useForm<TransaksiInput>({
    resolver: zodResolver(TransaksiSchema),
    defaultValues: {
      kategoriId: "",
      tanggal: new Date().toISOString(),
      deskripsi: "",
      nominal: 0,
      metodeBayar: "TUNAI",
      rekeningInfo: "",
      isPettyCash: false,
    },
  });

  const isPengeluaran = type === "PENGELUARAN";
  const watchMetodeBayar = form.watch("metodeBayar");
  const showRekeningInfo = watchMetodeBayar !== "TUNAI";

  function onSubmit(data: TransaksiInput) {
    createMutation.mutate({
      kantorId,
      userId: "u1",
      type,
      nomorTransaksi: `${isPengeluaran ? "Pengeluaran" : "Pemasukan"}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-001`,
      tanggal: selectedDate.toISOString().split("T")[0],
      deskripsi: data.deskripsi,
      nominal: data.nominal,
      metodeBayar: data.metodeBayar,
      rekeningInfo: data.rekeningInfo || null,
      status: "DRAFT",
      isPettyCash,
      buktiFiles: files.map((f) => f.name),
      kategoriId: data.kategoriId,
    }, {
      onSuccess: () => {
        toast.success(`Transaksi ${isPengeluaran ? "pengeluaran" : "pemasukan"} berhasil ditambahkan`);
        form.reset();
        setSelectedDate(new Date());
        setFiles([]);
        setIsPettyCash(false);
      },
    });
  }

  const isPending = createMutation.isPending;

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/transaksi">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Catat {isPengeluaran ? "Pengeluaran" : "Pemasukan"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Isi data transaksi {isPengeluaran ? "pengeluaran" : "pemasukan"} baru
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Tanggal */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger render={
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateShort(selectedDate)}
                  </Button>
                } />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { if (d) { setSelectedDate(d); setDateOpen(false); } }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Kategori + Nominal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Detail Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={form.watch("kategoriId")} onValueChange={(v) => { if (v) form.setValue("kategoriId", v); }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori">
                    {(val: string | null) => {
                      const k = kategoris?.find((k) => k.id === val);
                      return k ? `${k.icon} ${k.name}` : val;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {kategoris?.map((k) => (
                    <SelectItem key={k.id} value={k.id} label={`${k.icon} ${k.name}`}>{k.icon} {k.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.kategoriId && (
                <p className="text-sm text-destructive">{form.formState.errors.kategoriId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder={`Deskripsi ${isPengeluaran ? "pengeluaran" : "pemasukan"}...`}
                rows={3}
                {...form.register("deskripsi")}
              />
              {form.formState.errors.deskripsi && (
                <p className="text-sm text-destructive">{form.formState.errors.deskripsi.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nominal">Nominal (Rp)</Label>
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
          </CardContent>
        </Card>

        {/* Sumber Dana */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Sumber Dana</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <Label>Metode Bayar</Label>
              <Select value={form.watch("metodeBayar")} onValueChange={(v) => { if (v) form.setValue("metodeBayar", v as "TUNAI" | "TRANSFER" | "CARD"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {METODE_BAYAR_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {showRekeningInfo && (
              <div className="space-y-2">
                <Label htmlFor="rekeningInfo">Info Rekening / Kartu</Label>
                <Input
                  id="rekeningInfo"
                  placeholder="Contoh: BCA 1234567890 atau Visa ****4567"
                  {...form.register("rekeningInfo")}
                />
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Petty Cash</p>
                <p className="text-xs text-muted-foreground">Gunakan dana petty cash</p>
              </div>
              <Switch checked={isPettyCash} onCheckedChange={setIsPettyCash} />
            </div>
          </CardContent>
        </Card>

        {/* Bukti Upload */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bukti Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <BuktiUpload files={files} onChange={setFiles} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-2 pb-4 sm:justify-end">
          <Link href="/transaksi">
            <Button type="button" variant="outline">Batal</Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Menyimpan..." : "Simpan Transaksi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
