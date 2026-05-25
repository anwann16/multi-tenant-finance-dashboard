"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Building2,
  Receipt,
  Wallet,
  Tag,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kantor", href: "/kantor", icon: Building2 },
  { label: "Transaksi", href: "/transaksi", icon: Receipt },
  { label: "Petty Cash", href: "/petty-cash", icon: Wallet },
  { label: "Kategori", href: "/kategori", icon: Tag },
  { label: "Laporan", href: "/laporan", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function MobileMenu() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const pathname = usePathname();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-bold tracking-tight text-primary">
            Kantor App
          </h2>
        </div>
        <nav className="space-y-1 p-3">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
