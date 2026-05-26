"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import Breadcrumb from "./Breadcrumb";
import NotificationBell from "./NotificationBell";
import KantorSelector from "@/components/shared/KantorSelector";
import { useQueryClient } from "@tanstack/react-query";

export default function Topbar() {
  const { setMobileOpen } = useSidebarStore();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const { data: user } = useSession();
  const queryClient = useQueryClient();

  const isFinance = user?.role === "FINANCE";

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
        <KantorSelector />
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
