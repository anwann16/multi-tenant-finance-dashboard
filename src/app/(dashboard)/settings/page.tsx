"use client";

import { Settings, ShieldAlert } from "lucide-react";
import UserTable from "@/components/settings/UserTable";
import { useSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data: user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 mb-4">
          <ShieldAlert className="h-7 w-7 text-rose-600" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Akses Ditolak</h2>
        <p className="mt-1 text-sm text-muted-foreground">Halaman ini hanya untuk admin.</p>
        <Link href="/settings/profile">
          <Button variant="outline" className="mt-4">Ke Profile</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-sm text-muted-foreground">Daftar user yang terdaftar di sistem</p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
