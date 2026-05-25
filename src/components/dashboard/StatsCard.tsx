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
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          {trend !== undefined && (
            <div className={cn("flex items-center text-xs font-medium", isPositive ? "text-green-600" : "text-destructive")}>
              {isPositive ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
              {isPositive ? "+" : ""}{trend}%
            </div>
          )}
        </div>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10", iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
