import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { KantorSchema, UserAssignSchema } from "@/lib/validators";
import { PAGE_SIZE, DEFAULT_PENGELUARAN_KATEGORI, DEFAULT_PEMASUKAN_KATEGORI } from "@/lib/constants";
import { Prisma } from "@/generated/prisma/client";

// --- helpers ---

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

/** Return IDs of kantors the user has an active role in (null = global admin). */
async function getUserKantorIds(userId: string): Promise<string[] | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "ADMIN") return null; // global admin → no restriction
  const roles = await prisma.kantorUserRole.findMany({
    where: { userId, isActive: true },
    select: { kantorId: true },
  });
  return roles.map((r) => r.kantorId);
}

/** Throw if user has no access to kantorId. */
async function assertKantorAccess(userId: string, kantorId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "ADMIN") return; // global admin
  const role = await prisma.kantorUserRole.findUnique({
    where: { userId_kantorId: { userId, kantorId } },
  });
  if (!role || !role.isActive) throw new Error("Forbidden: no access to this kantor");
}

/** Throw if user is not global ADMIN. */
async function assertGlobalAdmin(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: only global admin can perform this action");
  }
}

/** Throw if user is not ADMIN_KANTOR or global ADMIN for this kantor. */
async function assertKantorAdmin(userId: string, kantorId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === "ADMIN") return; // global admin
  const role = await prisma.kantorUserRole.findUnique({
    where: { userId_kantorId: { userId, kantorId } },
  });
  if (!role || role.role !== "ADMIN_KANTOR" || !role.isActive) {
    throw new Error("Forbidden: need ADMIN_KANTOR role");
  }
}

// --- service ---

export async function createKantor(input: {
  name: string;
  address?: string;
  description?: string;
  pettyCashLimit?: number;
}) {
  const parsed = KantorSchema.parse(input);
  const session = await requireAuth();
  await assertGlobalAdmin(session.user.id);

  return prisma.$transaction(async (tx) => {
    const kantor = await tx.kantor.create({
      data: {
        name: parsed.name,
        address: parsed.address,
        description: parsed.description,
        pettyCashLimit: parsed.pettyCashLimit ?? 0,
        createdById: session.user.id,
      },
    });

    // Auto-assign creator as ADMIN_KANTOR
    await tx.kantorUserRole.create({
      data: {
        userId: session.user.id,
        kantorId: kantor.id,
        role: "ADMIN_KANTOR",
      },
    });

    // Seed default kategori
    const defaultKategoris = [
      ...DEFAULT_PENGELUARAN_KATEGORI.map((k) => ({
        kantorId: kantor.id,
        name: k.name,
        type: "PENGELUARAN" as const,
        icon: k.icon,
        color: k.color,
        isDefault: true,
      })),
      ...DEFAULT_PEMASUKAN_KATEGORI.map((k) => ({
        kantorId: kantor.id,
        name: k.name,
        type: "PEMASUKAN" as const,
        icon: k.icon,
        color: k.color,
        isDefault: true,
      })),
    ];
    await tx.kategori.createMany({ data: defaultKategoris });

    return kantor;
  });
}

export async function getKantors({
  page = 1,
  limit = PAGE_SIZE,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  const session = await requireAuth();
  const userKantorIds = await getUserKantorIds(session.user.id);

  const where: Prisma.KantorWhereInput = { isActive: true };

  // Tenant isolation: non-global-admin only sees assigned kantors
  if (userKantorIds !== null) {
    if (userKantorIds.length > 0) {
      where.id = { in: userKantorIds };
    } else {
      where.id = { in: [] };
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.kantor.findMany({
      where,
      include: {
        _count: { select: { userRoles: true, transaksi: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.kantor.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
}

export async function getKantorById(id: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, id);

  const kantor = await prisma.kantor.findUnique({
    where: { id, isActive: true },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      userRoles: {
        where: { isActive: true },
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      _count: { select: { userRoles: true, transaksi: true, kategori: true } },
    },
  });

  if (!kantor) throw new Error("Kantor not found");
  return kantor;
}

export async function updateKantor(
  id: string,
  input: { name?: string; address?: string; description?: string; pettyCashLimit?: number }
) {
  const parsed = KantorSchema.partial().parse(input);
  const session = await requireAuth();
  await assertKantorAdmin(session.user.id, id);

  const existing = await prisma.kantor.findUnique({ where: { id } });
  if (!existing || !existing.isActive) throw new Error("Kantor not found");

  const updated = await prisma.kantor.update({
    where: { id },
    data: {
      ...(parsed.name !== undefined && { name: parsed.name }),
      ...(parsed.address !== undefined && { address: parsed.address }),
      ...(parsed.description !== undefined && { description: parsed.description }),
      ...(parsed.pettyCashLimit !== undefined && { pettyCashLimit: parsed.pettyCashLimit }),
    },
  });
  return updated;
}

export async function deleteKantor(id: string) {
  const session = await requireAuth();
  await assertKantorAdmin(session.user.id, id);

  const existing = await prisma.kantor.findUnique({ where: { id } });
  if (!existing || !existing.isActive) throw new Error("Kantor not found");

  // Soft delete: deactivate kantor and all its user roles
  const result = await prisma.$transaction(async (tx) => {
    await tx.kantorUserRole.updateMany({
      where: { kantorId: id },
      data: { isActive: false },
    });
    return tx.kantor.update({
      where: { id },
      data: { isActive: false },
    });
  });
  return result;
}

export async function assignUserToKantor(
  kantorId: string,
  input: { email: string; role: "ADMIN_KANTOR" | "FINANCE" }
) {
  const parsed = UserAssignSchema.parse(input);
  const session = await requireAuth();
  await assertKantorAdmin(session.user.id, kantorId);

  const kantor = await prisma.kantor.findUnique({ where: { id: kantorId } });
  if (!kantor || !kantor.isActive) throw new Error("Kantor not found");

  const user = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (!user) throw new Error("User not found");

  const existing = await prisma.kantorUserRole.findUnique({
    where: { userId_kantorId: { userId: user.id, kantorId } },
  });

  if (existing) {
    // Reactivate if soft-deleted, update role
    return prisma.kantorUserRole.update({
      where: { userId_kantorId: { userId: user.id, kantorId } },
      data: { isActive: true, role: parsed.role },
    });
  }

  return prisma.kantorUserRole.create({
    data: {
      userId: user.id,
      kantorId,
      role: parsed.role,
    },
  });
}

export async function unassignUserFromKantor(kantorId: string, userId: string) {
  const session = await requireAuth();
  await assertKantorAdmin(session.user.id, kantorId);

  const role = await prisma.kantorUserRole.findUnique({
    where: { userId_kantorId: { userId, kantorId } },
  });
  if (!role) throw new Error("User not assigned to this kantor");

  // Soft delete
  return prisma.kantorUserRole.update({
    where: { userId_kantorId: { userId, kantorId } },
    data: { isActive: false },
  });
}

export async function getKantorUsers(kantorId: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const roles = await prisma.kantorUserRole.findMany({
    where: { kantorId, isActive: true },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return roles;
}
