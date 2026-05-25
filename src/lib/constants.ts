export const METODE_BAYAR_OPTIONS = [
  { value: "TUNAI", label: "Tunai" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "CARD", label: "Card" },
] as const;

export const TRANSAKSI_STATUS_OPTIONS = [
  { value: "DRAFT", label: "Draft" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export const TRANSAKSI_TYPE_OPTIONS = [
  { value: "PEMASUKAN", label: "Pemasukan" },
  { value: "PENGELUARAN", label: "Pengeluaran" },
] as const;

export const KANTOR_ROLE_OPTIONS = [
  { value: "ADMIN_KANTOR", label: "Admin Kantor" },
  { value: "FINANCE", label: "Finance" },
] as const;

export const DEFAULT_PENGELUARAN_KATEGORI = [
  { name: "Gaji & THR", icon: "💰", color: "#22C55E" },
  { name: "Sewa & Utilitas", icon: "🏠", color: "#3B82F6" },
  { name: "ATK & Office Supply", icon: "📎", color: "#A855F7" },
  { name: "Transport & Perjalanan", icon: "🚗", color: "#F97316" },
  { name: "Makan & Minum", icon: "🍔", color: "#EC4899" },
  { name: "Marketing & Promosi", icon: "📢", color: "#EAB308" },
  { name: "Maintenance & Perbaikan", icon: "🔧", color: "#6B7280" },
  { name: "Lainnya", icon: "📦", color: "#64748B" },
] as const;

export const DEFAULT_PEMASUKAN_KATEGORI = [
  { name: "Penjualan Produk", icon: "🛒", color: "#22C55E" },
  { name: "Servis & Konsultasi", icon: "💼", color: "#3B82F6" },
  { name: "Pinjaman Masuk", icon: "🏦", color: "#A855F7" },
  { name: "Investasi & Dividen", icon: "📈", color: "#F97316" },
  { name: "Donasi / Hibah", icon: "🎁", color: "#EC4899" },
  { name: "Lainnya", icon: "📦", color: "#64748B" },
] as const;

export const PETTY_CASH_ALERT_THRESHOLD = 0.3;

export const PAGE_SIZE = 20;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
