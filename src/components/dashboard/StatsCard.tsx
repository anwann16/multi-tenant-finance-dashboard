"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  gradient?: string;
  iconBg?: string;
}

const GRADIENTS = {
  blue: "from-blue-500/10 via-blue-500/5 to-transparent",
  green: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  red: "from-rose-500/10 via-rose-500/5 to-transparent",
  amber: "from-amber-500/10 via-amber-500/5 to-transparent",
  purple: "from-violet-500/10 via-violet-500/5 to-transparent",
};

const ICON_BG = {
  blue: "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25",
  green: "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25",
  red: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/25",
  amber: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25",
  purple: "bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/25",
};

export default function StatsCard({ title, value, icon: Icon, trend, gradient = "blue", iconBg }: StatsCardProps) {
  const isPositive = trend && trend > 0;
  const gradientClass = GRADIENTS[gradient as keyof typeof GRADIENTS] || GRADIENTS.blue;
  const iconBgClass = iconBg || ICON_BG[gradient as keyof typeof ICON_BG] || ICON_BG.blue;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5">
      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", gradientClass)} />

      {/* Content */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
          {trend !== undefined && (
            <div className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}{trend}%
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110",
          iconBgClass
        )}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}
