"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KategoriIconPicker from "./KategoriIconPicker";
import { KategoriSchema, type KategoriInput } from "@/lib/validators";
import { useCreateKategori, useUpdateKategori } from "@/hooks/useKategori";
import { toast } from "sonner";
import type { Kategori } from "@/types/kategori";

interface KategoriFormProps {
  kantorId: string;
  kategori?: Kategori;
  trigger?: React.ReactElement;
}

export default function KategoriForm({ kantorId, kategori, trigger }: KategoriFormProps) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(kategori?.icon || "📦");
  const [color, setColor] = useState(kategori?.color || "#64748B");
  const isEdit = !!kategori;

  const createMutation = useCreateKategori();
  const updateMutation = useUpdateKategori();

  const form = useForm<KategoriInput>({
    resolver: zodResolver(KategoriSchema),
    defaultValues: {
      name: kategori?.name || "",
      type: kategori?.type || "PENGELUARAN",
      icon: kategori?.icon || undefined,
      color: kategori?.color || undefined,
    },
  });

  function onSubmit(data: KategoriInput) {
    const payload = { ...data, icon, color };

    if (isEdit) {
      updateMutation.mutate(
        { id: kategori.id, kantorId, ...payload },
        {
          onSuccess: () => {
            toast.success("Kategori berhasil diupdate");
            setOpen(false);
            form.reset();
          },
        }
      );
    } else {
      createMutation.mutate(
        { kantorId, ...payload },
        {
          onSuccess: () => {
            toast.success("Kategori berhasil ditambahkan");
            setOpen(false);
            form.reset();
            setIcon("📦");
            setColor("#64748B");
          },
        }
      );
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset(); }}>
      <DialogTrigger render={trigger || (
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kategori
        </Button>
      )} />
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Ubah data kategori transaksi." : "Tambahkan kategori transaksi baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kategori</Label>
            <Input
              id="name"
              placeholder="Contoh: ATK & Office Supply"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tipe</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(v) => form.setValue("type", v as "PEMASUKAN" | "PENGELUARAN")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
                <SelectItem value="PEMASUKAN">Pemasukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Icon & Warna</Label>
            <KategoriIconPicker
              value={icon}
              color={color}
              onChange={(i, c) => { setIcon(i); setColor(c); }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan..." : isEdit ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
