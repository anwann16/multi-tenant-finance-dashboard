"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransaksiWithRelations } from "@/types/transaksi";

const MOCK_TRANSAKSI: TransaksiWithRelations[] = [
  {
    id: "t1", kantorId: "k1", userId: "u1", kategoriId: "kp-1", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-001", tanggal: "2026-05-01", deskripsi: "Gaji karyawan bulanan Mei",
    nominal: 25000000, metodeBayar: "TRANSFER", rekeningInfo: "BCA 1234567890", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: [], createdAt: "2026-05-01T08:00:00Z",
    kategori: { id: "kp-1", name: "Gaji & THR", icon: "💰", color: "#22C55E" },
    user: { id: "u1", name: "Admin Utama" },
  },
  {
    id: "t2", kantorId: "k1", userId: "u2", kategoriId: "kp-2", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-002", tanggal: "2026-05-03", deskripsi: "Bayar listrik bulanan",
    nominal: 1500000, metodeBayar: "TRANSFER", rekeningInfo: "Mandiri 9876543210", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: ["nota-listrik.pdf"], createdAt: "2026-05-03T10:00:00Z",
    kategori: { id: "kp-2", name: "Sewa & Utilitas", icon: "🏠", color: "#3B82F6" },
    user: { id: "u2", name: "Budi Santoso" },
  },
  {
    id: "t3", kantorId: "k1", userId: "u3", kategoriId: "kp-3", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-003", tanggal: "2026-05-05", deskripsi: "Beli ATK dan tinta printer",
    nominal: 350000, metodeBayar: "TUNAI", rekeningInfo: null, status: "CONFIRMED",
    isPettyCash: true, buktiFiles: ["nota-atk.jpg"], createdAt: "2026-05-05T14:00:00Z",
    kategori: { id: "kp-3", name: "ATK & Office Supply", icon: "📎", color: "#A855F7" },
    user: { id: "u3", name: "Siti Rahayu" },
  },
  {
    id: "t4", kantorId: "k1", userId: "u2", kategoriId: "kp-4", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-004", tanggal: "2026-05-07", deskripsi: "Perjalanan dinas ke Bandung",
    nominal: 2800000, metodeBayar: "CARD", rekeningInfo: "Visa ****4567", status: "DRAFT",
    isPettyCash: false, buktiFiles: ["tiket-kereta.pdf", "hotel.pdf"], createdAt: "2026-05-07T09:00:00Z",
    kategori: { id: "kp-4", name: "Transport & Perjalanan", icon: "🚗", color: "#F97316" },
    user: { id: "u2", name: "Budi Santoso" },
  },
  {
    id: "t5", kantorId: "k1", userId: "u1", kategoriId: "kp-5", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-005", tanggal: "2026-05-08", deskripsi: "Makan siang rapat tim",
    nominal: 450000, metodeBayar: "TUNAI", rekeningInfo: null, status: "CONFIRMED",
    isPettyCash: true, buktiFiles: [], createdAt: "2026-05-08T12:00:00Z",
    kategori: { id: "kp-5", name: "Makan & Minum", icon: "🍔", color: "#EC4899" },
    user: { id: "u1", name: "Admin Utama" },
  },
  {
    id: "t6", kantorId: "k1", userId: "u3", kategoriId: "km-1", type: "PEMASUKAN",
    nomorTransaksi: "Pemasukan-202605-001", tanggal: "2026-05-10", deskripsi: "Penjualan produk A ke PT Maju",
    nominal: 15000000, metodeBayar: "TRANSFER", rekeningInfo: "BCA 1234567890", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: ["invoice-001.pdf"], createdAt: "2026-05-10T11:00:00Z",
    kategori: { id: "km-1", name: "Penjualan Produk", icon: "🛒", color: "#22C55E" },
    user: { id: "u3", name: "Siti Rahayu" },
  },
  {
    id: "t7", kantorId: "k1", userId: "u2", kategoriId: "km-2", type: "PEMASUKAN",
    nomorTransaksi: "Pemasukan-202605-002", tanggal: "2026-05-12", deskripsi: "Konsultasi bisnis CV Sejahtera",
    nominal: 5000000, metodeBayar: "TRANSFER", rekeningInfo: "Mandiri 9876543210", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: [], createdAt: "2026-05-12T15:00:00Z",
    kategori: { id: "km-2", name: "Servis & Konsultasi", icon: "💼", color: "#3B82F6" },
    user: { id: "u2", name: "Budi Santoso" },
  },
  {
    id: "t8", kantorId: "k1", userId: "u1", kategoriId: "kp-6", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-006", tanggal: "2026-05-14", deskripsi: "Iklan Instagram campaign Mei",
    nominal: 2000000, metodeBayar: "TRANSFER", rekeningInfo: "BCA 1234567890", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: ["bukti-transfer.pdf"], createdAt: "2026-05-14T10:00:00Z",
    kategori: { id: "kp-6", name: "Marketing & Promosi", icon: "📢", color: "#EAB308" },
    user: { id: "u1", name: "Admin Utama" },
  },
  {
    id: "t9", kantorId: "k1", userId: "u3", kategoriId: "kp-7", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-007", tanggal: "2026-05-16", deskripsi: "Servis AC kantor",
    nominal: 750000, metodeBayar: "TUNAI", rekeningInfo: null, status: "DRAFT",
    isPettyCash: true, buktiFiles: [], createdAt: "2026-05-16T09:00:00Z",
    kategori: { id: "kp-7", name: "Maintenance & Perbaikan", icon: "🔧", color: "#6B7280" },
    user: { id: "u3", name: "Siti Rahayu" },
  },
  {
    id: "t10", kantorId: "k1", userId: "u2", kategoriId: "km-3", type: "PEMASUKAN",
    nomorTransaksi: "Pemasukan-202605-003", tanggal: "2026-05-18", deskripsi: "Pinjaman masuk dari investor",
    nominal: 50000000, metodeBayar: "TRANSFER", rekeningInfo: "BCA 1234567890", status: "DRAFT",
    isPettyCash: false, buktiFiles: ["surat-pinjaman.pdf"], createdAt: "2026-05-18T13:00:00Z",
    kategori: { id: "km-3", name: "Pinjaman Masuk", icon: "🏦", color: "#A855F7" },
    user: { id: "u2", name: "Budi Santoso" },
  },
  {
    id: "t11", kantorId: "k1", userId: "u1", kategoriId: "km-4", type: "PEMASUKAN",
    nomorTransaksi: "Pemasukan-202605-004", tanggal: "2026-05-20", deskripsi: "Dividen investasi Q1",
    nominal: 8000000, metodeBayar: "TRANSFER", rekeningInfo: "Mandiri 9876543210", status: "CONFIRMED",
    isPettyCash: false, buktiFiles: [], createdAt: "2026-05-20T10:00:00Z",
    kategori: { id: "km-4", name: "Investasi & Dividen", icon: "📈", color: "#F97316" },
    user: { id: "u1", name: "Admin Utama" },
  },
  {
    id: "t12", kantorId: "k1", userId: "u3", kategoriId: "kp-8", type: "PENGELUARAN",
    nomorTransaksi: "Pengeluaran-202605-008", tanggal: "2026-05-22", deskripsi: "Langganan software bulanan",
    nominal: 1200000, metodeBayar: "CARD", rekeningInfo: "Visa ****4567", status: "CANCELLED",
    isPettyCash: false, buktiFiles: [], createdAt: "2026-05-22T11:00:00Z",
    kategori: { id: "kp-8", name: "Lainnya", icon: "📦", color: "#64748B" },
    user: { id: "u3", name: "Siti Rahayu" },
  },
];

function delay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

export function useTransaksiList(kantorId: string) {
  return useQuery({
    queryKey: ["transaksi", kantorId],
    queryFn: () => delay(MOCK_TRANSAKSI.filter((t) => t.kantorId === kantorId)),
  });
}

export function useTransaksi(id: string) {
  return useQuery({
    queryKey: ["transaksi", id],
    queryFn: () => {
      const t = MOCK_TRANSAKSI.find((x) => x.id === id);
      if (!t) throw new Error("Transaksi tidak ditemukan");
      return delay(t);
    },
  });
}

export function useCreateTransaksi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TransaksiWithRelations, "id" | "createdAt" | "kategori" | "user">) =>
      delay({ ...data, id: "t" + Date.now(), createdAt: new Date().toISOString(), kategori: { id: data.kategoriId, name: "", icon: null, color: null }, user: { id: data.userId, name: "" } }),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["transaksi", v.kantorId] }),
  });
}

export function useUpdateTransaksiStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId, status }: { id: string; kantorId: string; status: "CONFIRMED" | "CANCELLED" }) =>
      delay({ id, status }),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["transaksi", v.kantorId] }),
  });
}

export function useDeleteTransaksi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, kantorId }: { id: string; kantorId: string }) => delay({ success: true }),
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["transaksi", v.kantorId] }),
  });
}
