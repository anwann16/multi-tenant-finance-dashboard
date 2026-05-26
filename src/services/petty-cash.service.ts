import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { PettyCashTopupSchema } from "@/lib/validators";
import { PETTY_CASH_ALERT_THRESHOLD } from "@/lib/constants";

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

// --- queries ---

export async function getPettyCashInfo(kantorId: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const kantor = await prisma.kantor.findUnique({
    where: { id: kantorId },
    select: { pettyCashLimit: true },
  });
  if (!kantor) throw new Error("Kantor not found");

  const limit = Number(kantor.pettyCashLimit);

  const result = await prisma.pettyCashLog.groupBy({
    by: ["type"],
    where: { kantorId },
    _sum: { nominal: true },
  });

  let saldo = 0;
  for (const r of result) {
    const amount = Number(r._sum.nominal ?? 0);
    if (r.type === "TOPUP") saldo += amount;
    else if (r.type === "PENGELUARAN") saldo -= amount;
  }

  const lastTopUp = await prisma.pettyCashLog.findFirst({
    where: { kantorId, type: "TOPUP" },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, nominal: true },
  });

  const percentage = limit > 0 ? (saldo / limit) * 100 : 0;
  const isLow = percentage < PETTY_CASH_ALERT_THRESHOLD * 100;

  return {
    kantorId,
    saldo,
    limit,
    lastTopUp: lastTopUp?.createdAt.toISOString() ?? null,
    lastTopUpNominal: lastTopUp ? Number(lastTopUp.nominal) : null,
    percentage,
    isLow,
  };
}

export async function getPettyCashLog(kantorId: string, limit = 20) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const logs = await prisma.pettyCashLog.findMany({
    where: { kantorId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      createdBy: { select: { id: true, name: true } },
    },
  });

  return logs.map((log) => ({
    id: log.id,
    kantorId: log.kantorId,
    type: log.type,
    nominal: Number(log.nominal),
    deskripsi: log.deskripsi,
    referenceId: log.referenceId,
    createdById: log.createdById,
    createdByName: log.createdBy.name,
    createdAt: log.createdAt.toISOString(),
  }));
}

export async function getPettyCashSaldo(kantorId: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const result = await prisma.pettyCashLog.groupBy({
    by: ["type"],
    where: { kantorId },
    _sum: { nominal: true },
  });

  let saldo = 0;
  for (const r of result) {
    const amount = Number(r._sum.nominal ?? 0);
    if (r.type === "TOPUP") saldo += amount;
    else if (r.type === "PENGELUARAN") saldo -= amount;
  }

  const kantor = await prisma.kantor.findUnique({
    where: { id: kantorId },
    select: { pettyCashLimit: true },
  });

  return {
    kantorId,
    saldo,
    limit: Number(kantor?.pettyCashLimit ?? 0),
  };
}

// --- mutations ---

export async function topUpPettyCash(
  kantorId: string,
  input: { nominal: number; deskripsi?: string },
) {
  const parsed = PettyCashTopupSchema.parse(input);
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const log = await prisma.pettyCashLog.create({
    data: {
      kantorId,
      type: "TOPUP",
      nominal: parsed.nominal,
      deskripsi: parsed.deskripsi || null,
      createdById: session.user.id,
    },
  });

  return {
    id: log.id,
    kantorId: log.kantorId,
    type: log.type,
    nominal: Number(log.nominal),
    deskripsi: log.deskripsi,
    createdAt: log.createdAt.toISOString(),
  };
}

// --- alert check ---

export async function checkPettyCashAlert(kantorId: string) {
  const kantor = await prisma.kantor.findUnique({
    where: { id: kantorId },
    select: { pettyCashLimit: true },
  });
  if (!kantor) return null;

  const limit = Number(kantor.pettyCashLimit);
  if (limit <= 0) return null;

  const result = await prisma.pettyCashLog.groupBy({
    by: ["type"],
    where: { kantorId },
    _sum: { nominal: true },
  });

  let saldo = 0;
  for (const r of result) {
    const amount = Number(r._sum.nominal ?? 0);
    if (r.type === "TOPUP") saldo += amount;
    else if (r.type === "PENGELUARAN") saldo -= amount;
  }

  const percentage = limit > 0 ? (saldo / limit) * 100 : 0;
  const isLow = percentage < PETTY_CASH_ALERT_THRESHOLD * 100;

  return {
    saldo,
    limit,
    percentage,
    isLow,
    message: isLow
      ? `Petty cash hampir habis! Sisa ${Math.round(percentage)}% dari limit.`
      : null,
  };
}
