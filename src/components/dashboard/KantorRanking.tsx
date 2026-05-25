"use client";

import Link from "next/link";
import { ArrowRight, Trophy, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MOCK_DATA = [
  { id: "k1", name: "Kantor Pusat Jakarta", totalTransaksi: 125000000 },
  { id: "k2", name: "Cabang Bandung", totalTransaksi: 85000000 },
  { id: "k3", name: "Cabang Surabaya", totalTransaksi: 65000000 },
  { id: "k4", name: "Cabang Medan", totalTransaksi: 42000000 },
  { id: "k5", name: "Cabang Bali", totalTransaksi: 38000000 },
];

const RANK_STYLES = [
  { icon: Trophy, bg: "bg-gradient-to-br from-amber-400 to-amber-600", text: "text-amber-600", shadow: "shadow-amber-500/25" },
  { icon: Medal, bg: "bg-gradient-to-br from-slate-400 to-slate-500", text: "text-slate-500", shadow: "shadow-slate-500/25" },
  { icon: Award, bg: "bg-gradient-to-br from-amber-600 to-amber-800", text: "text-amber-800", shadow: "shadow-amber-700/25" },
];

export default function KantorRanking() {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Top Kantor by Volume</CardTitle>
        <Link href="/kantor" className="group flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
          Lihat Semua
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {MOCK_DATA.map((k, i) => {
            const rank = RANK_STYLES[i];
            const RankIcon = rank?.icon;
            return (
              <Link key={k.id} href={`/kantor/${k.id}`} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:gap-4 sm:px-6">
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-200 hover:scale-110",
                  rank?.bg || "bg-gradient-to-br from-primary/50 to-primary",
                  rank?.shadow || "shadow-primary/25"
                )}>
                  {RankIcon ? <RankIcon className="h-4 w-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{k.name}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-primary">
                  {formatCurrency(k.totalTransaksi)}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
