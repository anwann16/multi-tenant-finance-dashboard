"use client";

import { CheckCircle2, AlertTriangle, Wallet, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types/notification";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof CheckCircle2; bg: string; color: string }> = {
  TRANSAKSI: { icon: CheckCircle2, bg: "bg-emerald-500/10", color: "text-emerald-600" },
  PETTY_CASH: { icon: Wallet, bg: "bg-amber-500/10", color: "text-amber-600" },
  SALDO: { icon: AlertTriangle, bg: "bg-rose-500/10", color: "text-rose-600" },
  SYSTEM: { icon: Info, bg: "bg-primary/10", color: "text-primary" },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const config = TYPE_CONFIG[notification.type];
  const Icon = config.icon;

  return (
    <button
      onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
        !notification.isRead && "bg-primary/5 border-l-2 border-l-primary",
        notification.isRead && "border-l-2 border-l-transparent"
      )}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5", config.bg)}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm leading-tight", !notification.isRead ? "font-semibold" : "font-medium")}>
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[11px] text-muted-foreground/70 mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}
