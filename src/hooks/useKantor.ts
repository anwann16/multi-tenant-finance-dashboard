"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { KantorWithUserCount, KantorDetail, UserKantorRole } from "@/types/kantor";

// Mock data
const mockKantors: KantorWithUserCount[] = [
  {
    id: "k1",
    name: "Kantor Pusat Jakarta",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    description: "Kantor pusat operasional utama",
    pettyCashLimit: 5000000,
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
    _count: { userRoles: 8, transaksi: 156 },
  },
  {
    id: "k2",
    name: "Kantor Cabang Bandung",
    address: "Jl. Asia Afrika No. 45, Bandung",
    description: "Cabang regional Jawa Barat",
    pettyCashLimit: 2000000,
    isActive: true,
    createdAt: "2026-02-20T08:00:00Z",
    _count: { userRoles: 5, transaksi: 89 },
  },
  {
    id: "k3",
    name: "Kantor Cabang Surabaya",
    address: "Jl. Pemuda No. 78, Surabaya",
    description: "Cabang regional Jawa Timur",
    pettyCashLimit: 3000000,
    isActive: true,
    createdAt: "2026-03-10T08:00:00Z",
    _count: { userRoles: 4, transaksi: 67 },
  },
  {
    id: "k4",
    name: "Kantor Cabang Medan",
    address: "Jl. Pemuda No. 12, Medan",
    description: "Cabang regional Sumatera Utara",
    pettyCashLimit: 2500000,
    isActive: false,
    createdAt: "2026-04-05T08:00:00Z",
    _count: { userRoles: 2, transaksi: 12 },
  },
];

const mockKantorDetail: KantorDetail = {
  ...mockKantors[0],
  createdBy: { id: "u1", name: "Admin Utama", email: "admin@kantor.com" },
  userRoles: [
    { id: "ur1", userId: "u1", kantorId: "k1", role: "ADMIN_KANTOR", isActive: true, user: { id: "u1", name: "Admin Utama", email: "admin@kantor.com" } },
    { id: "ur2", userId: "u2", kantorId: "k1", role: "FINANCE", isActive: true, user: { id: "u2", name: "Budi Santoso", email: "budi@kantor.com" } },
    { id: "ur3", userId: "u3", kantorId: "k1", role: "FINANCE", isActive: true, user: { id: "u3", name: "Siti Rahayu", email: "siti@kantor.com" } },
    { id: "ur4", userId: "u4", kantorId: "k1", role: "ADMIN_KANTOR", isActive: false, user: { id: "u4", name: "Dewi Lestari", email: "dewi@kantor.com" } },
  ],
};

// Simulate async fetch
function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

export function useKantors() {
  return useQuery({
    queryKey: ["kantors"],
    queryFn: () => delay(mockKantors),
  });
}

export function useKantor(id: string) {
  return useQuery({
    queryKey: ["kantor", id],
    queryFn: () => {
      const kantor = mockKantors.find((k) => k.id === id);
      if (!kantor) throw new Error("Kantor tidak ditemukan");
      return delay({ ...mockKantorDetail, ...kantor });
    },
  });
}

export function useCreateKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; address?: string; description?: string; pettyCashLimit?: number }) =>
      delay({ id: "k" + Date.now(), ...data, isActive: true, createdAt: new Date().toISOString(), _count: { userRoles: 0, transaksi: 0 } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kantors"] }),
  });
}

export function useUpdateKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name: string; address?: string; description?: string; pettyCashLimit?: number; isActive?: boolean }) =>
      delay({ ...data, id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kantors"] }),
  });
}

export function useDeleteKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => delay({ success: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kantors"] }),
  });
}

export function useAssignUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { kantorId: string; email: string; role: "ADMIN_KANTOR" | "FINANCE" }) =>
      delay({ id: "ur" + Date.now(), ...data, userId: "u" + Date.now(), isActive: true, user: { id: "u" + Date.now(), name: data.email.split("@")[0], email: data.email } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kantors"] }),
  });
}

export function useUnassignUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userRoleId: string) => delay({ success: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kantors"] }),
  });
}
