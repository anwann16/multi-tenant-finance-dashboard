"use client";

import { BellOff } from "lucide-react";
import NotificationItem from "./NotificationItem";
import type { Notification } from "@/types/notification";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

export default function NotificationList({ notifications, onMarkAsRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="px-4 py-10 text-center">
        <BellOff className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Belum ada notifikasi</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50 max-h-[360px] overflow-y-auto">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />
      ))}
    </div>
  );
}
