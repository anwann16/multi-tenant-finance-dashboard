import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { KategoriSchema } from "@/lib/validators";
import { DEFAULT_PENGELUARAN_KATEGORI, DEFAULT_PEMASUKAN_KATEGORI } from "@/lib/constants";

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function assertKantorAccess(userId: string, kantorId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "ADMIN") return;
  const role = await prisma.kantorUserRole.findUnique({
    where: { userId_kantorId: { userId, kantorId } },
  });
  if (!role || !role.isActive) throw new Error("Forbidden: no access to this kantor");
}

export async function getKategoris(kantorId: string, type?: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const where: Record<string, unknown> = { kantorId, isActive: true };
  if (type) where.type = type;

  return prisma.kategori.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });
}

export async function createKategori(input: {
  kantorId: string;
  name: string;
  type: "PEMASUKAN" | "PENGELUARAN";
  icon?: string;
  color?: string;
}) {
  const parsed = KategoriSchema.parse(input);
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, input.kantorId);

  const kantor = await prisma.kantor.findUnique({ where: { id: input.kantorId } });
  if (!kantor || !kantor.isActive) throw new Error("Kantor not found");

  return prisma.kategori.create({
    data: {
      kantorId: input.kantorId,
      name: parsed.name,
      type: parsed.type,
      icon: parsed.icon,
      color: parsed.color,
      isDefault: false,
    },
  });
}

export async function updateKategori(
  id: string,
  input: { name?: string; icon?: string; color?: string }
) {
  const session = await requireAuth();

  const existing = await prisma.kategori.findUnique({ where: { id } });
  if (!existing || !existing.isActive) throw new Error("Kategori not found");

  await assertKantorAccess(session.user.id, existing.kantorId);

  return prisma.kategori.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.icon !== undefined && { icon: input.icon }),
      ...(input.color !== undefined && { color: input.color }),
    },
  });
}

export async function deleteKategori(id: string) {
  const session = await requireAuth();

  const existing = await prisma.kategori.findUnique({ where: { id } });
  if (!existing || !existing.isActive) throw new Error("Kategori not found");
  if (existing.isDefault) throw new Error("Kategori default tidak bisa dihapus");

  await assertKantorAccess(session.user.id, existing.kantorId);

  return prisma.kategori.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function seedDefaultKategoris(kantorId: string) {
  const kantor = await prisma.kantor.findUnique({ where: { id: kantorId } });
  if (!kantor) throw new Error("Kantor not found");

  const allKategoris = [
    ...DEFAULT_PENGELUARAN_KATEGORI.map((k) => ({
      kantorId,
      name: k.name,
      type: "PENGELUARAN" as const,
      icon: k.icon,
      color: k.color,
      isDefault: true,
    })),
    ...DEFAULT_PEMASUKAN_KATEGORI.map((k) => ({
      kantorId,
      name: k.name,
      type: "PEMASUKAN" as const,
      icon: k.icon,
      color: k.color,
      isDefault: true,
    })),
  ];

  return prisma.kategori.createMany({ data: allKategoris });
}
