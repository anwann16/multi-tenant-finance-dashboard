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

function CustomLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-4">
      {MOCK_DATA.map((entry, i) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: COLORS[i] }} />
          <span className="text-xs text-muted-foreground">{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function KategoriPieChart() {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-base font-medium">Distribusi Pengeluaran per Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_DATA}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
              >
                {MOCK_DATA.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend />
      </CardContent>
    </Card>
  );
}
