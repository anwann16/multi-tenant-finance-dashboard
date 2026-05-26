export type TransaksiType = "PEMASUKAN" | "PENGELUARAN";
export type MetodeBayar = "TUNAI" | "TRANSFER" | "CARD";
export type TransaksiStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface BuktiTransaksi {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export interface TransaksiWithRelations {
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
  createdAt: string;
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
  bukti: BuktiTransaksi[];
}

export interface TransaksiFilterState {
  search: string;
  type: TransaksiType | "ALL";
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
