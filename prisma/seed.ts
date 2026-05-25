import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

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
  // 1. Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@kantor.com" },
    update: {},
    create: {
      name: "Admin Utama",
      email: "admin@kantor.com",
      role: "ADMIN",
    },
  });
  console.log("Admin user:", admin.id, admin.email);

  // 2. Create default kantor
  const kantor = await prisma.kantor.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Kantor Pusat",
      address: "Jl. Jenderal Sudirman No. 1, Jakarta",
      description: "Kantor pusat operasional",
      pettyCashLimit: 5000000,
      createdById: admin.id,
    },
  });
  console.log("Default kantor:", kantor.id, kantor.name);

  // 3. Assign admin to kantor
  await prisma.kantorUserRole.upsert({
    where: {
      userId_kantorId: { userId: admin.id, kantorId: kantor.id },
    },
    update: {},
    create: {
      userId: admin.id,
      kantorId: kantor.id,
      role: "ADMIN_KANTOR",
    },
  });
  console.log("Admin assigned to kantor");

  // 4. Create default kategoris
  let kategoriCount = 0;
  for (const k of defaultPengeluaran) {
    await prisma.kategori.upsert({
      where: {
        kantorId_name: { kantorId: kantor.id, name: k.name },
      },
      update: {},
      create: {
        kantorId: kantor.id,
        name: k.name,
        type: "PENGELUARAN",
        icon: k.icon,
        color: k.color,
        isDefault: true,
      },
    });
    kategoriCount++;
  }

  for (const k of defaultPemasukan) {
    await prisma.kategori.upsert({
      where: {
        kantorId_name: { kantorId: kantor.id, name: k.name },
      },
      update: {},
      create: {
        kantorId: kantor.id,
        name: k.name,
        type: "PEMASUKAN",
        icon: k.icon,
        color: k.color,
        isDefault: true,
      },
    });
    kategoriCount++;
  }
  console.log("Default kategoris:", kategoriCount);

  // 5. Verify tables
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.kantor.count(),
    prisma.kategori.count(),
    prisma.kantorUserRole.count(),
  ]);
  console.log("\n=== Verification ===");
  console.log("Users:", counts[0]);
  console.log("Kantors:", counts[1]);
  console.log("Kategoris:", counts[2]);
  console.log("KantorUserRoles:", counts[3]);
  console.log("All tables created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
