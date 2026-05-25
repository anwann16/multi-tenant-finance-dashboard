"use client";

import { Settings } from "lucide-react";
import ProfileForm from "@/components/settings/ProfileForm";
import { MOCK_PROFILE } from "@/components/settings/mock-data";

export default function SettingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-sm text-muted-foreground">Kelola profile dan akun Anda</p>
        </div>
      </div>

      <ProfileForm profile={MOCK_PROFILE} />
    </div>
  );
}
