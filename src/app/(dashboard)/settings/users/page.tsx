"use client";

import { Users } from "lucide-react";
import UserTable from "@/components/settings/UserTable";
import { MOCK_USERS } from "@/components/settings/mock-data";

export default function UsersPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-sm text-muted-foreground">Daftar user yang terdaftar di sistem</p>
        </div>
      </div>

      <UserTable users={MOCK_USERS} />
    </div>
  );
}
