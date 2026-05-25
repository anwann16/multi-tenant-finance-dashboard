export type TransaksiType = "PEMASUKAN" | "PENGELUARAN";
export type MetodeBayar = "TUNAI" | "TRANSFER" | "CARD";
export type TransaksiStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface Transaksi {
  id: string;
  kantorId: string;
  userId: string;
  kategoriId: string;
  type: TransaksiType;
  nomorTransaksi: string;
  tanggal: string;
  deskripsi: string;
  nominal: number;
  metodeBayar: MetodeBayar;
  rekeningInfo: string | null;
  status: TransaksiStatus;
  isPettyCash: boolean;
  buktiFiles: string[];
  createdAt: string;
}

export interface TransaksiWithRelations extends Transaksi {
  kategori: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  user: {
    id: string;
    name: string;
  };
}

export interface TransaksiFilterState {
  search: string;
  type: TransaksiType | "ALL";
  status: TransaksiStatus | "ALL";
  metodeBayar: MetodeBayar | "ALL";
  kategoriId: string;
  tanggalFrom: string;
  tanggalTo: string;
  nominalMin: string;
  nominalMax: string;
}

export interface TransaksiSort {
  field: "tanggal" | "nominal" | "createdAt";
  direction: "asc" | "desc";
}
