"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store";
import {
  LayoutDashboard,
  Building2,
  Receipt,
  Wallet,
  Tag,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Kantor",
    href: "/kantor",
    icon: Building2,
  },
  {
    label: "Transaksi",
    href: "/transaksi",
    icon: Receipt,
    children: [
      { label: "Pengeluaran", href: "/transaksi/pengeluaran/new", icon: TrendingDown },
      { label: "Pemasukan", href: "/transaksi/pemasukan/new", icon: TrendingUp },
    ],
  },
  {
    label: "Petty Cash",
    href: "/petty-cash",
    icon: Wallet,
  },
  {
    label: "Kategori",
    href: "/kategori",
    icon: Tag,
  },
  {
    label: "Laporan",
    href: "/laporan",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { label: "Users", href: "/settings/users", icon: Users },
    ],
  },
];

interface SidebarItemProps {
  item: (typeof menuItems)[number];
  isCollapsed: boolean;
}

function SidebarItem({ item, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    pathname.startsWith(item.href + "/");

  // Auto-open if any child route is active
  const isChildActive = item.children?.some(
    (child) => pathname === child.href
  );
  const [isOpen, setIsOpen] = useState(isChildActive);

  // Sync with route changes
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
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  !isOpen && "-rotate-90"
                )}
              />
            </>
          )}
        </button>
        {!isCollapsed && isOpen && (
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
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <h2 className="text-lg font-bold tracking-tight text-primary">
            Kantor App
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 shrink-0"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  );
}
