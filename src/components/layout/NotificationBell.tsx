"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" className="relative h-9 w-9" />}
      >
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium">Notifikasi</p>
        </div>
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
