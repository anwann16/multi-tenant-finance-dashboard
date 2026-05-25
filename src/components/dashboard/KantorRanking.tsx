"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Building2 } from "lucide-react";

const MOCK_DATA = [
  { id: "k1", name: "Kantor Pusat Jakarta", totalTransaksi: 125000000 },
  { id: "k2", name: "Cabang Bandung", totalTransaksi: 85000000 },
  { id: "k3", name: "Cabang Surabaya", totalTransaksi: 65000000 },
  { id: "k4", name: "Cabang Medan", totalTransaksi: 42000000 },
  { id: "k5", name: "Cabang Bali", totalTransaksi: 38000000 },
];

export default function KantorRanking() {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Top Kantor by Volume</CardTitle>
        <Link href="/kantor" className="text-xs text-primary hover:underline">
          Lihat Semua
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {MOCK_DATA.map((k, i) => (
            <Link key={k.id} href={`/kantor/${k.id}`} className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{k.name}</p>
              </div>
              <span className="text-sm font-medium tabular-nums text-primary">
                {formatCurrency(k.totalTransaksi)}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
