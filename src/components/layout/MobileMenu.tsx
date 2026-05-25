"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kantor", href: "/kantor", icon: Building2 },
  {
    label: "Transaksi",
    href: "/transaksi",
    icon: Receipt,
    children: [
      { label: "Pengeluaran", href: "/transaksi/pengeluaran/new", icon: TrendingDown },
      { label: "Pemasukan", href: "/transaksi/pemasukan/new", icon: TrendingUp },
    ],
  },
  { label: "Petty Cash", href: "/petty-cash", icon: Wallet },
  { label: "Kategori", href: "/kategori", icon: Tag },
  { label: "Laporan", href: "/laporan", icon: BarChart3 },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { label: "Users", href: "/settings/users", icon: Users },
    ],
  },
];

function MobileMenuItem({ item }: { item: (typeof menuItems)[number] }) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const isChildActive = item.children?.some((child) => pathname === child.href);
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setIsOpen(true);
  }, [isChildActive]);

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              !isOpen && "-rotate-90"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 space-y-1">
            {item.children.map((child) => {
              const isChildItemActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    isChildItemActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <child.icon className="h-4 w-4 shrink-0" />
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function MobileMenu() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <h2 className="text-lg font-bold tracking-tight text-primary">
            Kantor App
          </h2>
        </div>
        <nav className="space-y-1 p-3">
          {menuItems.map((item) => (
            <MobileMenuItem key={item.href} item={item} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
