"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useKantor } from "@/hooks/useKantor";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  kantor: "Kantor",
  new: "Baru",
  edit: "Edit",
  transaksi: "Transaksi",
  pengeluaran: "Pengeluaran",
  pemasukan: "Pemasukan",
  "petty-cash": "Petty Cash",
  topup: "Top Up",
  kategori: "Kategori",
  laporan: "Laporan",
  export: "Export",
  settings: "Settings",
  users: "Users",
};

function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function BreadcrumbLabel({ segment, parentSegment }: { segment: string; parentSegment?: string }) {
  const { data: kantor } = useKantor(parentSegment === "kantor" && isUuid(segment) ? segment : "");

  if (parentSegment === "kantor" && isUuid(segment) && kantor) {
    return <>{kantor.name}</>;
  }
  return <>{routeLabels[segment] || segment}</>;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "login") return null;

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const parentSegment = index > 0 ? segments[index - 1] : undefined;
    const isLast = index === segments.length - 1;
    return { href, segment, parentSegment, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="font-medium text-foreground">
              <BreadcrumbLabel segment={crumb.segment} parentSegment={crumb.parentSegment} />
            </span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              <BreadcrumbLabel segment={crumb.segment} parentSegment={crumb.parentSegment} />
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
