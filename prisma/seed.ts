import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const defaultPengeluaran = [
  { name: "Gaji & THR", icon: "💰", color: "#22C55E" },
  { name: "Sewa & Utilitas", icon: "🏠", color: "#3B82F6" },
  { name: "ATK & Office Supply", icon: "📎", color: "#A855F7" },
  { name: "Transport & Perjalanan", icon: "🚗", color: "#F97316" },
  { name: "Makan & Minum", icon: "🍔", color: "#EC4899" },
  { name: "Marketing & Promosi", icon: "📢", color: "#EAB308" },
  { name: "Maintenance & Perbaikan", icon: "🔧", color: "#6B7280" },
  { name: "Lainnya", icon: "📦", color: "#64748B" },
];

const defaultPemasukan = [
  { name: "Penjualan Produk", icon: "🛒", color: "#22C55E" },
  { name: "Servis & Konsultasi", icon: "💼", color: "#3B82F6" },
  { name: "Pinjaman Masuk", icon: "🏦", color: "#A855F7" },
  { name: "Investasi & Dividen", icon: "📈", color: "#F97316" },
  { name: "Donasi / Hibah", icon: "🎁", color: "#EC4899" },
  { name: "Lainnya", icon: "📦", color: "#64748B" },
];

async function main() {
  console.log("Seeding default categories...");
  console.log("Pengeluaran:", defaultPengeluaran.length, "categories");
  console.log("Pemasukan:", defaultPemasukan.length, "categories");
  console.log("Seed complete. Categories will be created per-kantor via service layer.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
