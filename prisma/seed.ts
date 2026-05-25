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
  // 1. Create users
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@kantor.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@kantor.com",
      role: "ADMIN",
    },
  });
  console.log("Superadmin:", superadmin.id, superadmin.email);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kantor.com" },
    update: {},
    create: {
      name: "Admin Utama",
      email: "admin@kantor.com",
      role: "ADMIN",
    },
  });
  console.log("Admin:", admin.id, admin.email);

  const finance1 = await prisma.user.upsert({
    where: { email: "andi@kantor.com" },
    update: {},
    create: {
      name: "Andi Kurniawan",
      email: "andi@kantor.com",
      role: "ADMIN",
    },
  });
  console.log("Finance 1:", finance1.id, finance1.email);

  const finance2 = await prisma.user.upsert({
    where: { email: "sari@kantor.com" },
    update: {},
    create: {
      name: "Sari Dewi",
      email: "sari@kantor.com",
      role: "ADMIN",
    },
  });
  console.log("Finance 2:", finance2.id, finance2.email);

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

  // 3. Assign users to kantor
  const usersToAssign = [
    { user: superadmin, role: "ADMIN_KANTOR" as const },
    { user: admin, role: "ADMIN_KANTOR" as const },
    { user: finance1, role: "FINANCE" as const },
    { user: finance2, role: "FINANCE" as const },
  ];

  for (const { user, role } of usersToAssign) {
    await prisma.kantorUserRole.upsert({
      where: {
        userId_kantorId: { userId: user.id, kantorId: kantor.id },
      },
      update: {},
      create: {
        userId: user.id,
        kantorId: kantor.id,
        role,
      },
    });
  }
  console.log("Users assigned to kantor:", usersToAssign.length);

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
