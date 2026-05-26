import type { TransaksiWithRelations } from "@/types/transaksi";
import type { Kategori } from "@/types/kategori";

export interface LaporanRingkasan {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoBersih: number;
  jumlahTransaksi: number;
  transaksiPemasukan: number;
  transaksiPengeluaran: number;
}

export const MOCK_RINGKASAN: LaporanRingkasan = {
  totalPemasukan: 25750000,
  totalPengeluaran: 18420000,
  saldoBersih: 7330000,
  jumlahTransaksi: 47,
  transaksiPemasukan: 18,
  transaksiPengeluaran: 29,
};

export const MOCK_LAPORAN_DATA: TransaksiWithRelations[] = [
  { id: "1", nomorTransaksi: "PSM-202605-001", tanggal: "2026-05-24", deskripsi: "Invoice Proyek Web App #42", nominal: 15000000, type: "PEMASUKAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "1", name: "Penjualan Produk", icon: "🛒", color: "#22C55E" }, user: { id: "u1", name: "Andi Kurniawan" }, kantorId: "k1", userId: "u1", kategoriId: "1", rekeningInfo: "BCA 1234567890", isPettyCash: false, bukti: [], createdAt: "2026-05-24T10:00:00Z" },
  { id: "2", nomorTransaksi: "PGL-202605-012", tanggal: "2026-05-24", deskripsi: "Beli ATK untuk kantor", nominal: 450000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TUNAI", kategori: { id: "2", name: "ATK & Office Supply", icon: "📎", color: "#A855F7" }, user: { id: "u2", name: "Sari Dewi" }, kantorId: "k1", userId: "u2", kategoriId: "2", rekeningInfo: null, isPettyCash: true, bukti: [], createdAt: "2026-05-24T11:00:00Z" },
  { id: "3", nomorTransaksi: "PGL-202605-011", tanggal: "2026-05-23", deskripsi: "Grab ke klien Sunter", nominal: 125000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TUNAI", kategori: { id: "3", name: "Transport & Perjalanan", icon: "🚗", color: "#F97316" }, user: { id: "u1", name: "Andi Kurniawan" }, kantorId: "k1", userId: "u1", kategoriId: "3", rekeningInfo: null, isPettyCash: true, bukti: [], createdAt: "2026-05-23T09:30:00Z" },
  { id: "4", nomorTransaksi: "PGL-202605-010", tanggal: "2026-05-23", deskripsi: "Client meeting lunch", nominal: 850000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "CARD", kategori: { id: "4", name: "Makan & Minum", icon: "🍔", color: "#EC4899" }, user: { id: "u3", name: "Rina Sari" }, kantorId: "k1", userId: "u3", kategoriId: "4", rekeningInfo: "Mandiri 9876543210", isPettyCash: false, bukti: [], createdAt: "2026-05-23T12:00:00Z" },
  { id: "5", nomorTransaksi: "PSM-202605-002", tanggal: "2026-05-22", deskripsi: "Servis maintenance server bulanan", nominal: 3500000, type: "PEMASUKAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "5", name: "Servis & Konsultasi", icon: "💼", color: "#3B82F6" }, user: { id: "u2", name: "Sari Dewi" }, kantorId: "k1", userId: "u2", kategoriId: "5", rekeningInfo: "BCA 1234567890", isPettyCash: false, bukti: [], createdAt: "2026-05-22T14:00:00Z" },
  { id: "6", nomorTransaksi: "PGL-202605-009", tanggal: "2026-05-22", deskripsi: "Top up listrik kantor", nominal: 500000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "6", name: "Sewa & Utilitas", icon: "🏠", color: "#3B82F6" }, user: { id: "u1", name: "Andi Kurniawan" }, kantorId: "k1", userId: "u1", kategoriId: "6", rekeningInfo: "BCA 1234567890", isPettyCash: false, bukti: [], createdAt: "2026-05-22T15:00:00Z" },
  { id: "7", nomorTransaksi: "PGL-202605-008", tanggal: "2026-05-21", deskripsi: "Iklan Instagram campaign Mei", nominal: 2500000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "7", name: "Marketing & Promosi", icon: "📢", color: "#EAB308" }, user: { id: "u3", name: "Rina Sari" }, kantorId: "k1", userId: "u3", kategoriId: "7", rekeningInfo: "Mandiri 9876543210", isPettyCash: false, bukti: [], createdAt: "2026-05-21T10:00:00Z" },
  { id: "8", nomorTransaksi: "PSM-202605-003", tanggal: "2026-05-20", deskripsi: "Pembayaran konsultasi tax", nominal: 4250000, type: "PEMASUKAN", status: "CONFIRMED", metodeBayar: "TRANSFER", kategori: { id: "5", name: "Servis & Konsultasi", icon: "💼", color: "#3B82F6" }, user: { id: "u2", name: "Sari Dewi" }, kantorId: "k1", userId: "u2", kategoriId: "5", rekeningInfo: "BCA 1234567890", isPettyCash: false, bukti: [], createdAt: "2026-05-20T09:00:00Z" },
  { id: "9", nomorTransaksi: "PGL-202605-007", tanggal: "2026-05-20", deskripsi: "Service AC kantor", nominal: 750000, type: "PENGELUARAN", status: "CONFIRMED", metodeBayar: "TUNAI", kategori: { id: "8", name: "Maintenance & Perbaikan", icon: "🔧", color: "#6B7280" }, user: { id: "u1", name: "Andi Kurniawan" }, kantorId: "k1", userId: "u1", kategoriId: "8", rekeningInfo: null, isPettyCash: true, bukti: [], createdAt: "2026-05-20T13:00:00Z" },
  { id: "10", nomorTransaksi: "PGL-202605-006", tanggal: "2026-05-19", deskripsi: "Makan siang rapat bulanan", nominal: 680000, type: "PENGELUARAN", status: "DRAFT", metodeBayar: "TUNAI", kategori: { id: "4", name: "Makan & Minum", icon: "🍔", color: "#EC4899" }, user: { id: "u3", name: "Rina Sari" }, kantorId: "k1", userId: "u3", kategoriId: "4", rekeningInfo: null, isPettyCash: true, bukti: [], createdAt: "2026-05-19T12:30:00Z" },
];

export const MOCK_KATEGORI_OPTIONS: Kategori[] = [
  { id: "1", kantorId: "k1", name: "Penjualan Produk", type: "PEMASUKAN", icon: "🛒", color: "#22C55E", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "2", kantorId: "k1", name: "ATK & Office Supply", type: "PENGELUARAN", icon: "📎", color: "#A855F7", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "3", kantorId: "k1", name: "Transport & Perjalanan", type: "PENGELUARAN", icon: "🚗", color: "#F97316", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "4", kantorId: "k1", name: "Makan & Minum", type: "PENGELUARAN", icon: "🍔", color: "#EC4899", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "5", kantorId: "k1", name: "Servis & Konsultasi", type: "PEMASUKAN", icon: "💼", color: "#3B82F6", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "6", kantorId: "k1", name: "Sewa & Utilitas", type: "PENGELUARAN", icon: "🏠", color: "#3B82F6", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "7", kantorId: "k1", name: "Marketing & Promosi", type: "PENGELUARAN", icon: "📢", color: "#EAB308", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
  { id: "8", kantorId: "k1", name: "Maintenance & Perbaikan", type: "PENGELUARAN", icon: "🔧", color: "#6B7280", isDefault: true, isActive: true, createdAt: "2026-05-01T00:00:00Z" },
];
