"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendPoint {
  name: string;
  pemasukan: number;
  pengeluaran: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((item: any) => (
        <div key={item.name} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill || item.color }} />
          <span className="text-muted-foreground">{item.name}:</span>
          <span className="font-semibold tabular-nums">Rp {Number(item.value).toLocaleString("id-ID")}</span>
        </div>
      ))}
    </div>
  );
}

export default function TransaksiChart() {
  const [range, setRange] = useState<"bulanan" | "mingguan" | "harian">("bulanan");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "charts", range],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/charts?range=${range}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data as { trend: TrendPoint[]; kategoriDist: any[] };
    },
  });

  const chartData = data?.trend ?? [];

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold">Trend Pemasukan vs Pengeluaran</CardTitle>
        <div className="flex shrink-0 rounded-xl bg-muted/50 p-1">
          {(["bulanan", "mingguan", "harian"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs font-medium capitalize transition-all duration-200 rounded-lg ${
                range === r
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Pemasukan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-xs text-muted-foreground">Pengeluaran</span>
          </div>
        </div>

        <div className="h-[250px] sm:h-[320px] w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
