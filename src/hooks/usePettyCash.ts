"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PettyCashInfo, PettyCashLogEntry } from "@/types/petty-cash";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Request failed");
  return json;
}

export function usePettyCashInfo(kantorId: string) {
  return useQuery({
    queryKey: ["pettyCash", "info", kantorId],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: PettyCashInfo }>(
        `/api/petty-cash?kantorId=${kantorId}`,
      );
      return res.data;
    },
    enabled: !!kantorId,
  });
}

export function usePettyCashLog(kantorId: string) {
  return useQuery({
    queryKey: ["pettyCash", "log", kantorId],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: PettyCashLogEntry[] }>(
        `/api/petty-cash?kantorId=${kantorId}&action=log`,
      );
      return res.data;
    },
    enabled: !!kantorId,
  });
}

export function usePettyCashSaldo(kantorId: string) {
  return useQuery({
    queryKey: ["pettyCash", "saldo", kantorId],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: { saldo: number; limit: number } }>(
        `/api/petty-cash?kantorId=${kantorId}&action=saldo`,
      );
      return res.data;
    },
    enabled: !!kantorId,
  });
}

export function usePettyCashTopup(kantorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { nominal: number; deskripsi?: string }) =>
      api("/api/petty-cash/topup", {
        method: "POST",
        body: JSON.stringify({ kantorId, ...input }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pettyCash", "info", kantorId] });
      qc.invalidateQueries({ queryKey: ["pettyCash", "log", kantorId] });
      qc.invalidateQueries({ queryKey: ["pettyCash", "saldo", kantorId] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Top up berhasil");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
