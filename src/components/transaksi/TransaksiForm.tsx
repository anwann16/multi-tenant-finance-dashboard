"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Save, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransaksiForm({ kantorId, open, onOpenChange }: TransaksiFormProps) {
  const [step, setStep] = useState<"pick-type" | "form">("pick-type");
  const [type, setType] = useState<TransaksiType | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [files, setFiles] = useState<File[]>([]);
  const [isPettyCash, setIsPettyCash] = useState(false);

  const createMutation = useCreateTransaksi();
  const { data: kategoris } = useKategoris(kantorId, type ?? "PENGELUARAN");

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

  function resetAll() {
    setStep("pick-type");
    setType(null);
    form.reset();
    setSelectedDate(new Date());
    setFiles([]);
    setIsPettyCash(false);
  }

  function handleOpenChange(value: boolean) {
    if (!value) resetAll();
    onOpenChange(value);
  }

  function pickType(t: TransaksiType) {
    setType(t);
    setStep("form");
  }

  function onSubmit(data: TransaksiInput) {
    if (!type) return;
    createMutation.mutate({
      kantorId,
      type,
      tanggal: selectedDate.toISOString().split("T")[0],
      deskripsi: data.deskripsi,
      nominal: data.nominal,
      metodeBayar: data.metodeBayar,
      rekeningInfo: data.rekeningInfo || undefined,
      isPettyCash,
      kategoriId: data.kategoriId,
    }, {
      onSuccess: () => {
        toast.success(`Transaksi ${isPengeluaran ? "pengeluaran" : "pemasukan"} berhasil ditambahkan`);
        handleOpenChange(false);
      },
    });
  }

  const isPending = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {step === "pick-type" ? (
          <>
            <DialogHeader>
              <DialogTitle>Transaksi Baru</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-2">
              <button
                onClick={() => pickType("PENGELUARAN")}
                className="flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-destructive/50 hover:bg-destructive/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Pengeluaran</p>
                  <p className="text-xs text-muted-foreground">Catat pengeluaran</p>
                </div>
              </button>
              <button
                onClick={() => pickType("PEMASUKAN")}
                className="flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-colors hover:border-green-500/50 hover:bg-green-500/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Pemasukan</p>
                  <p className="text-xs text-muted-foreground">Catat pemasukan</p>
                </div>
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Catat {isPengeluaran ? "Pengeluaran" : "Pemasukan"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Tanggal */}
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

              {/* Kategori + Nominal */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Detail Transaksi</p>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <Select value={form.watch("kategoriId")} onValueChange={(v) => { if (v) form.setValue("kategoriId", v); }}>
                    <SelectTrigger className="w-full min-w-0">
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
                    rows={2}
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
              </div>

              {/* Sumber Dana */}
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Sumber Dana</p>
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
              </div>

              {/* Bukti Upload */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Bukti Transaksi</p>
                <BuktiUpload files={files} onChange={setFiles} />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {isPending ? "Menyimpan..." : "Simpan Transaksi"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
