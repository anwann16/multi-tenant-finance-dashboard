"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { KantorWithUserCount, KantorDetail } from "@/types/kantor";

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

export function useKantors(search?: string) {
  return useQuery({
    queryKey: ["kantors", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await api<{ success: boolean; data: KantorWithUserCount[] }>(`/api/kantor?${params}`);
      return res.data;
    },
  });
}

export function useKantor(id: string) {
  return useQuery({
    queryKey: ["kantor", id],
    queryFn: async () => {
      const res = await api<{ success: boolean; data: KantorDetail }>(`/api/kantor/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

// --- Mutations ---

export function useCreateKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; address?: string; description?: string; pettyCashLimit?: number }) =>
      api(`/api/kantor`, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kantors"] });
      toast.success("Kantor berhasil dibuat");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; address?: string; description?: string; pettyCashLimit?: number }) =>
      api(`/api/kantor/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kantors"] });
      qc.invalidateQueries({ queryKey: ["kantor", variables.id] });
      toast.success("Kantor berhasil diperbarui");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteKantor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/kantor/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kantors"] });
      toast.success("Kantor berhasil dihapus");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAssignUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kantorId, email, role }: { kantorId: string; email: string; role: string }) =>
      api(`/api/kantor/${kantorId}/assign`, {
        method: "POST",
        body: JSON.stringify({ email, role }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kantor", variables.kantorId] });
      toast.success("User berhasil di-assign");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUnassignUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ kantorId, userId }: { kantorId: string; userId: string }) =>
      api(`/api/kantor/${kantorId}/assign?userId=${userId}`, { method: "DELETE" }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["kantor", variables.kantorId] });
      toast.success("User berhasil di-unassign");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
