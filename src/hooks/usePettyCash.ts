"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PettyCashInfo, PettyCashLogEntry } from "@/types/petty-cash";

const MOCK_PETTY_CASH_INFO: PettyCashInfo = {
  kantorId: "k1",
  saldo: 3200000,
  limit: 5000000,
  lastTopUp: "2026-05-20",
};

const MOCK_PETTY_CASH_LOG: PettyCashLogEntry[] = [
  {
    id: "pc-1",
    kantorId: "k1",
    type: "PENGELUARAN",
    nominal: -150000,
    deskripsi: "Beli ATK kantor",
    createdAt: "2026-05-22T10:30:00",
    relatedTransaksiId: "t1",
  },
  {
    id: "pc-2",
    kantorId: "k1",
    type: "PENGELUARAN",
    nominal: -25000,
    deskripsi: "Ojol ke client",
    createdAt: "2026-05-21T14:15:00",
    relatedTransaksiId: "t3",
  },
  {
    id: "pc-3",
    kantorId: "k1",
    type: "TOPUP",
    nominal: 2000000,
    deskripsi: "Top up petty cash bulanan",
    createdAt: "2026-05-20T09:00:00",
  },
  {
    id: "pc-4",
    kantorId: "k1",
    type: "PENGELUARAN",
    nominal: -75000,
    deskripsi: "Makan siang rapat",
    createdAt: "2026-05-19T12:00:00",
    relatedTransaksiId: "t5",
  },
  {
    id: "pc-5",
    kantorId: "k1",
    type: "PENGELUARAN",
    nominal: -50000,
    deskripsi: "Parkir kendaraan",
    createdAt: "2026-05-18T16:45:00",
    relatedTransaksiId: "t7",
  },
  {
    id: "pc-6",
    kantorId: "k1",
    type: "TOPUP",
    nominal: 1500000,
    deskripsi: "Top up tambahan",
    createdAt: "2026-05-15T08:30:00",
  },
  {
    id: "pc-7",
    kantorId: "k1",
    type: "PENGELUARAN",
    nominal: -100000,
    deskripsi: "Beli pulsa kantor",
    createdAt: "2026-05-14T11:00:00",
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePettyCashInfo(kantorId: string) {
  return useQuery({
    queryKey: ["petty-cash", kantorId],
    queryFn: async (): Promise<PettyCashInfo> => {
      await delay(300);
      return { ...MOCK_PETTY_CASH_INFO, kantorId };
    },
  });
}

export function usePettyCashLog(kantorId: string) {
  return useQuery({
    queryKey: ["petty-cash-log", kantorId],
    queryFn: async (): Promise<PettyCashLogEntry[]> => {
      await delay(300);
      return MOCK_PETTY_CASH_LOG.filter((l) => l.kantorId === kantorId);
    },
  });
}

export function usePettyCashTopup(kantorId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { nominal: number; deskripsi?: string }) => {
      await delay(500);
      const newEntry: PettyCashLogEntry = {
        id: `pc-${Date.now()}`,
        kantorId,
        type: "TOPUP",
        nominal: data.nominal,
        deskripsi: data.deskripsi || "Top up petty cash",
        createdAt: new Date().toISOString(),
      };
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["petty-cash", kantorId] });
      queryClient.invalidateQueries({ queryKey: ["petty-cash-log", kantorId] });
    },
  });
}
