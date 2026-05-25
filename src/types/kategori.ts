export type KategoriType = "PEMASUKAN" | "PENGELUARAN";

export interface Kategori {
  id: string;
  kantorId: string;
  name: string;
  type: KategoriType;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface KategoriGrouped {
  PENGELUARAN: Kategori[];
  PEMASUKAN: Kategori[];
}
