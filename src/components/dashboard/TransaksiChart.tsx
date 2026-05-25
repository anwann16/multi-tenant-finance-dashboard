"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MOCK_DATA = [
  { name: "Jan", pemasukan: 12000000, pengeluaran: 8000000 },
  { name: "Feb", pemasukan: 14000000, pengeluaran: 10000000 },
  { name: "Mar", pemasukan: 11000000, pengeluaran: 9000000 },
  { name: "Apr", pemasukan: 16000000, pengeluaran: 12000000 },
  { name: "Mei", pemasukan: 18000000, pengeluaran: 11000000 },
  { name: "Jun", pemasukan: 15000000, pengeluaran: 13000000 },
];

export default function TransaksiChart() {
  const [range, setRange] = useState<"bulanan" | "mingguan" | "harian">("bulanan");

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Trend Pemasukan vs Pengeluaran</CardTitle>
        <div className="flex rounded-lg bg-muted p-1">
          {(["bulanan", "mingguan", "harian"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium capitalize transition-colors ${
                range === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `Rp${(v/1000000).toFixed(0)}jt`}
                dx={-10}
              />
              <Tooltip formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, '']} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPemasukan)" />
              <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPengeluaran)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
