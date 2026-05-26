"use client";

import { useQuery } from "@tanstack/react-query";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: string;
  createdAt: string;
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await fetch("/api/auth/get-session");
      if (!res.ok) return null;
      const data = await res.json();
      return (data?.user as SessionUser) ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}
