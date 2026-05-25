import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

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
  const DEFAULT_PASSWORD = "password123";
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  // 1. Create users
  const usersData = [
    { name: "Super Admin", email: "superadmin@kantor.com" },
    { name: "Admin Utama", email: "admin@kantor.com" },
    { name: "Andi Kurniawan", email: "andi@kantor.com" },
    { name: "Sari Dewi", email: "sari@kantor.com" },
  ];

  const users: { id: string; email: string; name: string }[] = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, role: "ADMIN" },
    });
    users.push(user);
    console.log("User:", user.name, user.email);

    // Create credential account
    await prisma.account.upsert({
      where: { accountId_providerId: { accountId: u.email, providerId: "credential" } },
      update: {},
      create: {
        userId: user.id,
        accountId: u.email,
        providerId: "credential",
        password: hashedPassword,
      },
    });
  }
  console.log("Accounts with password created for all users");

  const [superadmin, admin, finance1, finance2] = users;

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
