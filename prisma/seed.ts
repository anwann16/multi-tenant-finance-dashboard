import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete all existing data
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.pettyCashLog.deleteMany(),
    prisma.transaksi.deleteMany(),
    prisma.kategori.deleteMany(),
    prisma.kantorUserRole.deleteMany(),
    prisma.kantor.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log("✅ All existing data deleted");

  // Create 1 admin user
  const hashedPassword = await hashPassword("admin1234");
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@kantor.com",
      role: "ADMIN",
      emailVerified: true,
    },
  });
  await prisma.account.create({
    data: {
      userId: admin.id,
      accountId: "admin@kantor.com",
      providerId: "credential",
      password: hashedPassword,
    },
  });
  console.log(`✅ Admin user created: admin@kantor.com / admin1234`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
