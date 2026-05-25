"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number; // Percentage change
  iconColor?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, iconColor = "text-blue-600" }: StatsCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5 sm:p-6 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-lg font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-bold tabular-nums tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className={cn("flex items-center text-sm font-medium", isPositive ? "text-green-600" : "text-destructive")}>
              {isPositive ? <TrendingUp className="mr-1 h-4 w-4 shrink-0" /> : <TrendingDown className="mr-1 h-4 w-4 shrink-0" />}
              <span>{isPositive ? "+" : ""}{trend}% dari bulan lalu</span>
            </div>
          )}
        </div>
        <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 sm:h-20 sm:w-20", iconColor)}>
          <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
      </CardContent>
    </Card>
  );
}
