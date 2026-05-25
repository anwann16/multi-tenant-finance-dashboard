"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Kategori, KategoriGrouped } from "@/types/kategori";
import { DEFAULT_PENGELUARAN_KATEGORI, DEFAULT_PEMASUKAN_KATEGORI } from "@/lib/constants";

const mockKategoris: Kategori[] = [
  ...DEFAULT_PENGELUARAN_KATEGORI.map((k, i) => ({
    id: `kp-${i + 1}`,
    kantorId: "k1",
    name: k.name,
    type: "PENGELUARAN" as const,
    icon: k.icon,
    color: k.color,
    isDefault: true,
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
  })),
  ...DEFAULT_PEMASUKAN_KATEGORI.map((k, i) => ({
    id: `km-${i + 1}`,
    kantorId: "k1",
    name: k.name,
    type: "PEMASUKAN" as const,
    icon: k.icon,
    color: k.color,
    isDefault: true,
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
  })),
  {
    id: "kc-1",
    kantorId: "k1",
    name: "Sumbangan",
    type: "PEMASUKAN",
    icon: "🎁",
    color: "#8B5CF6",
    isDefault: false,
    isActive: true,
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "kc-2",
    kantorId: "k1",
    name: "Perlengkapan Kantor",
    type: "PENGELUARAN",
    icon: "🖥️",
    color: "#0EA5E9",
    isDefault: false,
    isActive: true,
    createdAt: "2026-03-05T08:00:00Z",
  },
];

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

export function useKategoris(kantorId: string, type?: string) {
  return useQuery({
    queryKey: ["kategoris", kantorId, type],
    queryFn: () => {
      let filtered = mockKategoris.filter((k) => k.kantorId === kantorId && k.isActive);
      if (type) filtered = filtered.filter((k) => k.type === type);
      return delay(filtered);
    },
  });
}

export function useKategorisGrouped(kantorId: string) {
  return useQuery({
    queryKey: ["kategoris", kantorId],
    queryFn: () => {
      const all = mockKategoris.filter((k) => k.kantorId === kantorId && k.isActive);
      const grouped: KategoriGrouped = {
        PENGELUARAN: all.filter((k) => k.type === "PENGELUARAN"),
        PEMASUKAN: all.filter((k) => k.type === "PEMASUKAN"),
      };
      return delay(grouped);
    },
  });
}

export function useCreateKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { kantorId: string; name: string; type: "PEMASUKAN" | "PENGELUARAN"; icon?: string; color?: string }) =>
      delay({
        id: "kc" + Date.now(),
        ...data,
        isDefault: false,
        isActive: true,
        createdAt: new Date().toISOString(),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kategoris", variables.kantorId] });
    },
  });
}

export function useUpdateKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId, ...data }: { id: string; kantorId: string; name: string; icon?: string; color?: string }) =>
      delay({ ...data, id, kantorId }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kategoris", variables.kantorId] });
    },
  });
}

export function useDeleteKategori() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId }: { id: string; kantorId: string }) => delay({ success: true }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kategoris", variables.kantorId] });
    },
  });
}
