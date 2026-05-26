import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { TransaksiSchema } from "@/lib/validators";
import { PAGE_SIZE } from "@/lib/constants";
import { Prisma, TransaksiStatus, TransaksiType } from "@/generated/prisma/client";

// --- helpers ---

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

/** Map Prisma transaksi to API response shape (referenceId → rekeningInfo). */
function toTransaksiResponse(t: any) {
  const { referenceId, ...rest } = t;
  return { ...rest, rekeningInfo: referenceId ?? null };
}

function formatDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}${mm}${yyyy}`;
}

async function generateNomorTransaksi(
  type: TransaksiType,
  tanggal: Date,
): Promise<string> {
  const prefix = type === "PENGELUARAN" ? "TRXOUT" : "TRXIN";
  const dateStr = formatDate(tanggal);

  const last = await prisma.transaksi.findFirst({
    where: { nomorTransaksi: { startsWith: `${prefix}-${dateStr}-` } },
    orderBy: { nomorTransaksi: "desc" },
  });

  let seq = 1;
  if (last) {
    const parts = last.nomorTransaksi.split("-");
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }

  return `${prefix}-${dateStr}-${String(seq).padStart(3, "0")}`;
}

// --- queries ---

export async function getTransaksiList({
  kantorId,
  type,
  status,
  kategoriId,
  tanggalFrom,
  tanggalTo,
  nominalMin,
  nominalMax,
  search,
  page = 1,
  limit = PAGE_SIZE,
}: {
  kantorId: string;
  type?: TransaksiType;
  status?: TransaksiStatus;
  kategoriId?: string;
  tanggalFrom?: string;
  tanggalTo?: string;
  nominalMin?: number;
  nominalMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const and: Prisma.TransaksiWhereInput[] = [];

  if (type) and.push({ type });
  if (status) and.push({ status });
  if (kategoriId) and.push({ kategoriId });
  if (search) {
    and.push({
      OR: [
        { deskripsi: { contains: search, mode: "insensitive" } },
        { nomorTransaksi: { contains: search, mode: "insensitive" } },
      ],
    });
  }
  if (tanggalFrom || tanggalTo) {
    and.push({
      tanggal: {
        ...(tanggalFrom && { gte: new Date(tanggalFrom) }),
        ...(tanggalTo && { lte: new Date(tanggalTo) }),
      },
    });
  }
  if (nominalMin !== undefined || nominalMax !== undefined) {
    and.push({
      nominal: {
        ...(nominalMin !== undefined && { gte: nominalMin }),
        ...(nominalMax !== undefined && { lte: nominalMax }),
      },
    });
  }

  const where: Prisma.TransaksiWhereInput = { kantorId, ...(and.length > 0 && { AND: and }) };

  const [data, total] = await Promise.all([
    prisma.transaksi.findMany({
      where,
      include: {
        kategori: { select: { id: true, name: true, icon: true, color: true } },
        user: { select: { id: true, name: true } },
        bukti: { select: { id: true, fileName: true, fileUrl: true } },
      },
      orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaksi.count({ where }),
  ]);

  return { data: data.map(toTransaksiResponse), meta: { page, limit, total } };
}

export async function getTransaksiById(id: string) {
  const session = await requireAuth();

  const transaksi = await prisma.transaksi.findUnique({
    where: { id },
    include: {
      kategori: { select: { id: true, name: true, icon: true, color: true } },
      user: { select: { id: true, name: true } },
      bukti: { select: { id: true, fileName: true, fileUrl: true, fileSize: true, mimeType: true } },
    },
  });

  if (!transaksi) throw new Error("Transaksi not found");
  await assertKantorAccess(session.user.id, transaksi.kantorId);
  return toTransaksiResponse(transaksi);
}

// --- mutations ---

export async function createTransaksi(
  kantorId: string,
  input: {
    type: TransaksiType;
    kategoriId: string;
    tanggal: string | Date;
    deskripsi: string;
    nominal: number;
    metodeBayar: "TUNAI" | "TRANSFER" | "CARD";
    rekeningInfo?: string;
    isPettyCash?: boolean;
  },
) {
  const parsed = TransaksiSchema.parse(input);
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const tanggal = typeof parsed.tanggal === "string" ? new Date(parsed.tanggal) : parsed.tanggal;
  const nomorTransaksi = await generateNomorTransaksi(input.type, tanggal);

  // Check petty cash balance before deducting
  let pettyCashSaldo = 0;
  let pettyCashLimit = 0;
  if (parsed.isPettyCash && input.type === "PENGELUARAN") {
    const kantor = await prisma.kantor.findUnique({
      where: { id: kantorId },
      select: { pettyCashLimit: true },
    });
    pettyCashLimit = Number(kantor?.pettyCashLimit ?? 0);

    const result = await prisma.pettyCashLog.groupBy({
      by: ["type"],
      where: { kantorId },
      _sum: { nominal: true },
    });

    for (const r of result) {
      const amount = Number(r._sum.nominal ?? 0);
      if (r.type === "TOPUP") pettyCashSaldo += amount;
      else if (r.type === "PENGELUARAN") pettyCashSaldo -= amount;
    }

    if (pettyCashSaldo <= 0) {
      throw new Error("Saldo petty cash habis, silakan top up terlebih dahulu");
    }
    if (pettyCashSaldo < parsed.nominal) {
      throw new Error(`Saldo petty cash tidak cukup. Sisa: Rp ${pettyCashSaldo.toLocaleString("id-ID")}`);
    }
  }

  return prisma.$transaction(async (tx) => {
    const isPettyCash = parsed.isPettyCash && input.type === "PENGELUARAN";
    const transaksi = await tx.transaksi.create({
      data: {
        kantorId,
        userId: session.user.id,
        kategoriId: parsed.kategoriId,
        type: input.type,
        nomorTransaksi,
        tanggal,
        deskripsi: parsed.deskripsi,
        nominal: parsed.nominal,
        metodeBayar: parsed.metodeBayar,
        referenceId: parsed.rekeningInfo ?? null,
        isPettyCash,
      },
      include: {
        kategori: { select: { id: true, name: true, icon: true, color: true } },
        user: { select: { id: true, name: true } },
      },
    });

    let pettyCashAlert: string | null = null;
    if (parsed.isPettyCash && input.type === "PENGELUARAN") {
      await tx.pettyCashLog.create({
        data: {
          kantorId,
          type: "PENGELUARAN",
          nominal: parsed.nominal,
          deskripsi: parsed.deskripsi,
          referenceId: transaksi.id,
          createdById: session.user.id,
        },
      });

      // Calculate new balance after deduction using the pre-check saldo
      const newSaldo = pettyCashSaldo - parsed.nominal;
      if (pettyCashLimit > 0) {
        const pct = (newSaldo / pettyCashLimit) * 100;
        if (pct <= 0) pettyCashAlert = "Saldo petty cash habis! Segera top up.";
        else if (pct < 30) pettyCashAlert = `Petty cash hampir habis! Sisa ${Math.round(pct)}% dari limit.`;
      }
    }

    return { ...toTransaksiResponse(transaksi), pettyCashAlert };
  });
}

export async function updateTransaksi(
  id: string,
  input: {
    kategoriId?: string;
    tanggal?: string | Date;
    deskripsi?: string;
    nominal?: number;
    metodeBayar?: "TUNAI" | "TRANSFER" | "CARD";
    rekeningInfo?: string;
  },
) {
  const session = await requireAuth();

  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new Error("Transaksi not found");
  if (existing.status !== "DRAFT") throw new Error("Hanya transaksi DRAFT yang bisa diubah");
  await assertKantorAccess(session.user.id, existing.kantorId);

  const data: Prisma.TransaksiUpdateInput = {};
  if (input.kategoriId) data.kategori = { connect: { id: input.kategoriId } };
  if (input.tanggal) data.tanggal = typeof input.tanggal === "string" ? new Date(input.tanggal) : input.tanggal;
  if (input.deskripsi) data.deskripsi = input.deskripsi;
  if (input.nominal !== undefined) data.nominal = input.nominal;
  if (input.metodeBayar) data.metodeBayar = input.metodeBayar;
  if (input.rekeningInfo !== undefined) data.referenceId = input.rekeningInfo;

  const updated = await prisma.transaksi.update({
    where: { id },
    data,
    include: {
      kategori: { select: { id: true, name: true, icon: true, color: true } },
      user: { select: { id: true, name: true } },
    },
  });
  return toTransaksiResponse(updated);
}

export async function confirmTransaksi(id: string) {
  const session = await requireAuth();

  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new Error("Transaksi not found");
  if (existing.status !== "DRAFT") throw new Error("Hanya transaksi DRAFT yang bisa dikonfirmasi");
  await assertKantorAccess(session.user.id, existing.kantorId);

  const confirmed = await prisma.transaksi.update({
    where: { id },
    data: { status: "CONFIRMED" },
    include: {
      kategori: { select: { id: true, name: true, icon: true, color: true } },
      user: { select: { id: true, name: true } },
    },
  });
  return toTransaksiResponse(confirmed);
}

export async function cancelTransaksi(id: string) {
  const session = await requireAuth();

  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new Error("Transaksi not found");
  if (!["DRAFT", "CONFIRMED"].includes(existing.status)) {
    throw new Error("Transaksi tidak bisa dibatalkan");
  }
  await assertKantorAccess(session.user.id, existing.kantorId);

  const cancelled = await prisma.transaksi.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: {
      kategori: { select: { id: true, name: true, icon: true, color: true } },
      user: { select: { id: true, name: true } },
    },
  });
  return toTransaksiResponse(cancelled);
}

export async function deleteTransaksi(id: string) {
  const session = await requireAuth();

  const existing = await prisma.transaksi.findUnique({ where: { id } });
  if (!existing) throw new Error("Transaksi not found");
  if (existing.status !== "DRAFT") throw new Error("Hanya transaksi DRAFT yang bisa dihapus");
  await assertKantorAccess(session.user.id, existing.kantorId);

  await prisma.$transaction([
    prisma.buktiTransaksi.deleteMany({ where: { transaksiId: id } }),
    prisma.transaksi.delete({ where: { id } }),
  ]);

  return { message: "Transaksi dihapus" };
}

// --- saldo ---

export async function getSaldoKantor(kantorId: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const result = await prisma.transaksi.groupBy({
    by: ["type"],
    where: { kantorId, isPettyCash: false },
    _sum: { nominal: true },
  });

  let totalPemasukan = 0;
  let totalPengeluaran = 0;

  for (const r of result) {
    if (r.type === "PEMASUKAN") totalPemasukan = Number(r._sum.nominal ?? 0);
    if (r.type === "PENGELUARAN") totalPengeluaran = Number(r._sum.nominal ?? 0);
  }

  return {
    kantorId,
    totalPemasukan,
    totalPengeluaran,
    saldo: totalPemasukan - totalPengeluaran,
  };
}

export async function getRunningBalance(kantorId: string) {
  const session = await requireAuth();
  await assertKantorAccess(session.user.id, kantorId);

  const transaksiList = await prisma.transaksi.findMany({
    where: { kantorId, isPettyCash: false },
    orderBy: [{ tanggal: "asc" }, { createdAt: "asc" }],
    select: { id: true, type: true, nominal: true, tanggal: true },
  });

  let running = 0;
  return transaksiList.map((t) => {
    if (t.type === "PEMASUKAN") running += Number(t.nominal);
    else running -= Number(t.nominal);
    return { transaksiId: t.id, tanggal: t.tanggal, balance: running };
  });
}
