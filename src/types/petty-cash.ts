export type PettyCashLogType = "TOPUP" | "PENGELUARAN" | "ADJUSTMENT";

export interface PettyCashInfo {
  kantorId: string;
  saldo: number;
  limit: number;
  lastTopUp: string | null;
}

export interface PettyCashLogEntry {
  id: string;
  kantorId: string;
  type: PettyCashLogType;
  nominal: number;
  deskripsi: string;
  createdAt: string;
  relatedTransaksiId?: string;
}
