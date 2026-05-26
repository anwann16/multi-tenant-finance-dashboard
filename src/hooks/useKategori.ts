"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Kategori, KategoriGrouped } from "@/types/kategori";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json;
}

export function useKategoris(kantorId: string, type?: string) {
  return useQuery({
    queryKey: ["kategoris", kantorId, type],
    queryFn: async () => {
      const params = new URLSearchParams({ kantorId });
      if (type) params.set("type", type);
      const res = await api<{ success: boolean; data: Kategori[] }>(`/api/kategori?${params}`);
      return res.data;
    },
    enabled: !!kantorId,
  });
}

export function useKategorisGrouped(kantorId: string) {
  return useQuery({
    queryKey: ["kategoris", kantorId],
    queryFn: async () => {
      const params = new URLSearchParams({ kantorId });
      const res = await api<{ success: boolean; data: Kategori[] }>(`/api/kategori?${params}`);
      const grouped: KategoriGrouped = { PENGELUARAN: [], PEMASUKAN: [] };
      for (const k of res.data) {
        if (k.type === "PENGELUARAN") grouped.PENGELUARAN.push(k);
        else if (k.type === "PEMASUKAN") grouped.PEMASUKAN.push(k);
      }
      return grouped;
    },
    enabled: !!kantorId,
  });
}

export function useCreateKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { kantorId: string; name: string; type: "PEMASUKAN" | "PENGELUARAN"; icon?: string; color?: string }) =>
      api("/api/kategori", { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kategoris"] });
      toast.success("Kategori berhasil dibuat");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; icon?: string; color?: string }) =>
      api(`/api/kategori/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kategoris"] });
      toast.success("Kategori berhasil diupdate");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; kantorId: string }) =>
      api(`/api/kategori/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kategoris"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
