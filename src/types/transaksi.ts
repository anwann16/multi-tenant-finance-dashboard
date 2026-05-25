import type { TransaksiType, MetodeBayar, TransaksiStatus } from "@/generated/prisma/enums";

export interface TransaksiWithType {
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
  updatedAt: string;
}

export interface TransaksiWithRelations extends TransaksiWithType {
  kategori: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
  bukti: Array<{
    id: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
  }>;
}

export interface TransaksiFilter {
  kantorId?: string;
  type?: TransaksiType;
  status?: TransaksiStatus;
  tanggalAwal?: string;
  tanggalAkhir?: string;
  kategoriId?: string;
  nominalMin?: number;
  nominalMax?: number;
  search?: string;
}
