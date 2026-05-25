"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const MOCK_DATA = [
  { name: "Jan", pemasukan: 12000000, pengeluaran: 8000000 },
  { name: "Feb", pemasukan: 14000000, pengeluaran: 10000000 },
  { name: "Mar", pemasukan: 11000000, pengeluaran: 9000000 },
  { name: "Apr", pemasukan: 16000000, pengeluaran: 12000000 },
  { name: "Mei", pemasukan: 18000000, pengeluaran: 11000000 },
  { name: "Jun", pemasukan: 15000000, pengeluaran: 13000000 },
];

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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="20%">
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
        </div>
      </CardContent>
    </Card>
  );
}
