"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TransaksiWithRelations } from "@/types/transaksi";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json;
}

// --- Queries ---

export function useTransaksiList(
  kantorId: string,
  filters?: {
    type?: string;
    status?: string;
    kategoriId?: string;
    tanggalFrom?: string;
    tanggalTo?: string;
    nominalMin?: string;
    nominalMax?: string;
    search?: string;
    page?: number;
  },
) {
  return useQuery({
    queryKey: ["transaksis", kantorId, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ kantorId });
      if (filters) {
        if (filters.type && filters.type !== "ALL") params.set("type", filters.type);
        if (filters.status && filters.status !== "ALL") params.set("status", filters.status);
        if (filters.kategoriId) params.set("kategoriId", filters.kategoriId);
        if (filters.tanggalFrom) params.set("tanggalFrom", filters.tanggalFrom);
        if (filters.tanggalTo) params.set("tanggalTo", filters.tanggalTo);
        if (filters.nominalMin) params.set("nominalMin", filters.nominalMin);
        if (filters.nominalMax) params.set("nominalMax", filters.nominalMax);
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
      }
      const res = await api<{ success: boolean; data: TransaksiWithRelations[]; meta: { page: number; limit: number; total: number } }>(
        `/api/transaksi?${params}`,
      );
      return res;
    },
    enabled: !!kantorId,
  });
}

export function useTransaksi(id: string) {
  return useQuery({
    queryKey: ["transaksi", id],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: TransaksiWithRelations }>(`/api/transaksi/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useSaldoKantor(kantorId: string) {
  return useQuery({
    queryKey: ["saldo", kantorId],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: { totalPemasukan: number; totalPengeluaran: number; saldo: number } }>(
        `/api/transaksi/saldo?kantorId=${kantorId}`,
      );
      return res.data;
    },
    enabled: !!kantorId,
  });
}

// --- Mutations ---

export function useCreateTransaksi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      kantorId: string;
      type: "PEMASUKAN" | "PENGELUARAN";
      kategoriId: string;
      tanggal: string;
      deskripsi: string;
      nominal: number;
      metodeBayar: "TUNAI" | "TRANSFER" | "CARD";
      rekeningInfo?: string;
      isPettyCash?: boolean;
    }) =>
      api("/api/transaksi", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["transaksis", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["saldo", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaksi berhasil dibuat");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateTransaksi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId, ...input }: {
      id: string;
      kantorId: string;
      kategoriId?: string;
      tanggal?: string;
      deskripsi?: string;
      nominal?: number;
      metodeBayar?: "TUNAI" | "TRANSFER" | "CARD";
      rekeningInfo?: string;
    }) =>
      api(`/api/transaksi/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["transaksi", variables.id] });
      qc.invalidateQueries({ queryKey: ["transaksis", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaksi berhasil diperbarui");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateTransaksiStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId, action }: { id: string; kantorId: string; action: "confirm" | "cancel" }) =>
      api(`/api/transaksi/${id}/confirm`, {
        method: "POST",
        body: JSON.stringify({ action }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["transaksi", variables.id] });
      qc.invalidateQueries({ queryKey: ["transaksis", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["saldo", variables.kantorId] });
      toast.success(variables.action === "confirm" ? "Transaksi dikonfirmasi" : "Transaksi dibatalkan");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteTransaksi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId }: { id: string; kantorId: string }) =>
      api(`/api/transaksi/${id}`, { method: "DELETE" }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["transaksis", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["saldo", variables.kantorId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaksi dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
