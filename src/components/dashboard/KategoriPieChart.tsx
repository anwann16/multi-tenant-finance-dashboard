"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KategoriDist {
  name: string;
  icon: string;
  color: string;
  value: number;
  count: number;
}

const FALLBACK_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6b7280", "#ec4899", "#14b8a6", "#f97316"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as KategoriDist;
  return (
    <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-medium text-muted-foreground mb-1">{d.icon} {d.name}</p>
      <p className="text-sm font-semibold tabular-nums">{formatCurrency(d.value)}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{d.count} transaksi</p>
    </div>
  );
}

function CustomLegend({ data }: { data: KategoriDist[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-4">
      {data.map((entry, i) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length] }} />
          <span className="text-xs text-muted-foreground font-medium">{entry.icon} {entry.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function KategoriPieChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "charts", "kategori"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/charts?range=bulanan");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as { trend: any[]; kategoriDist: KategoriDist[] };
    },
  });

  const chartData = data?.kategoriDist ?? [];

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Distribusi Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] sm:h-[330px] w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Belum ada data pengeluaran bulan ini
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {chartData.length > 0 && <CustomLegend data={chartData} />}
      </CardContent>
    </Card>
  );
}
