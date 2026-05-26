"use client";

import { User } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import { useSession } from "@/hooks/useSession";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">Kelola informasi profile Anda</p>
        </div>
      </div>

      <ProfileForm profile={user} />
    </div>
  );
}
