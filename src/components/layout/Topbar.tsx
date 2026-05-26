"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/lib/store";
import { useSession } from "@/hooks/useSession";
import { useKantors } from "@/hooks/useKantor";
import { authClient } from "@/lib/auth-client";
import Breadcrumb from "./Breadcrumb";
import NotificationBell from "./NotificationBell";
import { useQueryClient } from "@tanstack/react-query";

export default function Topbar() {
  const { setMobileOpen } = useSidebarStore();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { data: user } = useSession();
  const { data: kantors } = useKantors();
  const queryClient = useQueryClient();

  const isFinance = user?.role === "FINANCE";
  const kantorNames = kantors?.map((k: { name: string }) => k.name) ?? [];

  const initials = user?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "??";

  async function handleLogout() {
    setLoggingOut(true);
    await authClient.signOut();
    queryClient.clear();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Breadcrumb />
      </div>
      <div className="flex items-center gap-2">
        {isFinance && kantorNames.length > 0 && (
          <div className="hidden items-center gap-1.5 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground sm:flex">
            <Building2 className="h-3 w-3" />
            <span className="max-w-[150px] truncate font-medium">
              {kantorNames.length === 1 ? kantorNames[0] : `${kantorNames.length} Kantor`}
            </span>
          </div>
        )}
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" />
            }
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium">{user?.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {loggingOut ? "Keluar..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
