"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "./useSession";

interface AdminDashboardData {
  totalKantors: number;
  totalUsers: number;
  recentKantors: { id: string; name: string; createdAt: string }[];
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
}

interface UserDashboardData {
  kantors: { id: string; name: string }[];
  totalPettyCash: number;
  todayTransaksi: number;
  monthlyPemasukan: number;
  monthlyPengeluaran: number;
  recentTransaksi: {
    id: string;
    nomorTransaksi: string;
    tanggal: string;
    deskripsi: string;
    nominal: number;
    type: string;
    status: string;
    metodeBayar: string;
    kategori: { id: string; name: string; icon: string | null; color: string | null };
    user: { id: string; name: string };
  }[];
}

export function useAdminDashboard(enabled = true) {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/admin");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as AdminDashboardData;
    },
    enabled,
  });
}

export function useUserDashboard(enabled = true) {
  return useQuery({
    queryKey: ["dashboard", "user"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/user");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as UserDashboardData;
    },
    enabled,
  });
}

export function useDashboard() {
  const { data: user, isLoading: sessionLoading } = useSession();
  const isAdmin = user?.role === "ADMIN";
  const adminDashboard = useAdminDashboard(isAdmin === true);
  const userDashboard = useUserDashboard(isAdmin === false);

  return {
    isAdmin,
    admin: adminDashboard,
    user: userDashboard,
    isLoading: isAdmin ? adminDashboard.isLoading : userDashboard.isLoading,
  };
}
