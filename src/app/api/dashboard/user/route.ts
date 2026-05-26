import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return jsonResponse({ success: false, error: "Unauthorized" }, 401);
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return jsonResponse({ success: false, error: "User not found" }, 404);
    }

    // Get kantors the user has access to
    const kantorRoles = await prisma.kantorUserRole.findMany({
      where: { userId: session.user.id, isActive: true },
      select: { kantorId: true, role: true },
    });
    const kantorIds = kantorRoles.map((r) => r.kantorId);

    if (kantorIds.length === 0) {
      return jsonResponse({
        success: true,
        data: {
          kantors: [],
          totalPettyCash: 0,
          todayTransaksi: 0,
          monthlyPemasukan: 0,
          monthlyPengeluaran: 0,
          recentTransaksi: [],
        },
      });
    }

    // Get kantor details
    const kantors = await prisma.kantor.findMany({
      where: { id: { in: kantorIds }, isActive: true },
      select: { id: true, name: true },
    });

    // Calculate actual petty cash balance from PettyCashLog
    // saldo = sum(TOPUP) - sum(PENGELUARAN) across all assigned kantors
    const pettyCashLogs = await prisma.pettyCashLog.groupBy({
      by: ["type"],
      where: { kantorId: { in: kantorIds } },
      _sum: { nominal: true },
    });

    let totalPettyCash = 0;
    for (const entry of pettyCashLogs) {
      const amount = Number(entry._sum.nominal ?? 0);
      if (entry.type === "TOPUP") totalPettyCash += amount;
      else if (entry.type === "PENGELUARAN") totalPettyCash -= amount;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [todayTransaksi, monthlyPemasukan, monthlyPengeluaran, recentTransaksi, saldoGroup] =
      await Promise.all([
        prisma.transaksi.count({
          where: {
            kantorId: { in: kantorIds },
            tanggal: { gte: today },
          },
        }),
        prisma.transaksi.aggregate({
          where: {
            kantorId: { in: kantorIds },
            type: "PEMASUKAN",
            tanggal: { gte: startOfMonth },
            status: "CONFIRMED",
          },
          _sum: { nominal: true },
        }),
        prisma.transaksi.aggregate({
          where: {
            kantorId: { in: kantorIds },
            type: "PENGELUARAN",
            tanggal: { gte: startOfMonth },
            status: "CONFIRMED",
          },
          _sum: { nominal: true },
        }),
        prisma.transaksi.findMany({
          where: { kantorId: { in: kantorIds } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            nomorTransaksi: true,
            tanggal: true,
            deskripsi: true,
            nominal: true,
            type: true,
            status: true,
            metodeBayar: true,
            kategori: { select: { id: true, name: true, icon: true, color: true } },
            user: { select: { id: true, name: true } },
          },
        }),
        prisma.transaksi.groupBy({
          by: ["type"],
          where: { kantorId: { in: kantorIds } },
          _sum: { nominal: true },
        }),
      ]);

    let totalSaldo = 0;
    for (const r of saldoGroup) {
      const amount = Number(r._sum.nominal ?? 0);
      if (r.type === "PEMASUKAN") totalSaldo += amount;
      else if (r.type === "PENGELUARAN") totalSaldo -= amount;
    }

    return jsonResponse({
      success: true,
      data: {
        kantors,
        totalSaldo,
        totalPettyCash,
        todayTransaksi,
        monthlyPemasukan: monthlyPemasukan._sum.nominal ?? 0,
        monthlyPengeluaran: monthlyPengeluaran._sum.nominal ?? 0,
        recentTransaksi,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}
