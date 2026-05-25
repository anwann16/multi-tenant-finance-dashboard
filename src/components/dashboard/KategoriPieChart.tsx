"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const MOCK_DATA = [
  { name: "Operasional", value: 4500000 },
  { name: "Makan & Minum", value: 2500000 },
  { name: "Transport", value: 1800000 },
  { name: "ATK", value: 1200000 },
  { name: "Lainnya", value: 800000 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#6b7280"];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/50 bg-background/95 p-3 shadow-xl backdrop-blur-sm">
      <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].name}</p>
      <p className="text-sm font-semibold tabular-nums">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

function CustomLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 pt-4">
      {MOCK_DATA.map((entry, i) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i] }} />
          <span className="text-xs text-muted-foreground font-medium">{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function KategoriPieChart() {
  return (
    <Card className="border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Distribusi Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_DATA}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {MOCK_DATA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend />
      </CardContent>
    </Card>
  );
}
