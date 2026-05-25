export type NotificationType = "TRANSAKSI" | "PETTY_CASH" | "SALDO" | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedUrl?: string;
}
