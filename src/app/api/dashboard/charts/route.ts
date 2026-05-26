import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { jsonResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return jsonResponse({ success: false, error: "Unauthorized" }, 401);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return jsonResponse({ success: false, error: "User not found" }, 404);

    const kantorRoles = await prisma.kantorUserRole.findMany({
      where: { userId: session.user.id, isActive: true },
      select: { kantorId: true },
    });
    const kantorIds = kantorRoles.map((r) => r.kantorId);

    if (kantorIds.length === 0) {
      return jsonResponse({ success: true, data: { trend: [], kategoriDist: [] } });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") ?? "bulanan";

    const now = new Date();

    // --- Trend data (pemasukan vs pengeluaran over time) ---
    let trend: { name: string; pemasukan: number; pengeluaran: number }[] = [];

    if (range === "bulanan") {
      // Last 6 months
      const months: { name: string; start: Date; end: Date }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const label = d.toLocaleString("id-ID", { month: "short" });
        months.push({ name: label, start: d, end });
      }

      const results = await Promise.all(
        months.map((m) =>
          prisma.transaksi.groupBy({
            by: ["type"],
            where: {
              kantorId: { in: kantorIds },
              tanggal: { gte: m.start, lte: m.end },
              isPettyCash: false,
            },
            _sum: { nominal: true },
          })
        )
      );

      trend = months.map((m, i) => {
        let pemasukan = 0;
        let pengeluaran = 0;
        for (const r of results[i]) {
          const amount = Number(r._sum.nominal ?? 0);
          if (r.type === "PEMASUKAN") pemasukan = amount;
          else if (r.type === "PENGELUARAN") pengeluaran = amount;
        }
        return { name: m.name, pemasukan, pengeluaran };
      });
    } else if (range === "mingguan") {
      // Last 4 weeks
      const weeks: { name: string; start: Date; end: Date }[] = [];
      for (let i = 3; i >= 0; i--) {
        const end = new Date(now);
        end.setDate(end.getDate() - i * 7);
        end.setHours(23, 59, 59, 999);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        const label = `${start.getDate()}/${start.getMonth() + 1}`;
        weeks.push({ name: label, start, end });
      }

      const results = await Promise.all(
        weeks.map((w) =>
          prisma.transaksi.groupBy({
            by: ["type"],
            where: {
              kantorId: { in: kantorIds },
              tanggal: { gte: w.start, lte: w.end },
              isPettyCash: false,
            },
            _sum: { nominal: true },
          })
        )
      );

      trend = weeks.map((w, i) => {
        let pemasukan = 0;
        let pengeluaran = 0;
        for (const r of results[i]) {
          const amount = Number(r._sum.nominal ?? 0);
          if (r.type === "PEMASUKAN") pemasukan = amount;
          else if (r.type === "PENGELUARAN") pengeluaran = amount;
        }
        return { name: w.name, pemasukan, pengeluaran };
      });
    } else {
      // Harian - last 7 days
      const days: { name: string; start: Date; end: Date }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const end = new Date(d);
        end.setHours(23, 59, 59, 999);
        const label = d.toLocaleString("id-ID", { weekday: "short" });
        days.push({ name: label, start: d, end });
      }

      const results = await Promise.all(
        days.map((day) =>
          prisma.transaksi.groupBy({
            by: ["type"],
            where: {
              kantorId: { in: kantorIds },
              tanggal: { gte: day.start, lte: day.end },
              isPettyCash: false,
            },
            _sum: { nominal: true },
          })
        )
      );

      trend = days.map((day, i) => {
        let pemasukan = 0;
        let pengeluaran = 0;
        for (const r of results[i]) {
          const amount = Number(r._sum.nominal ?? 0);
          if (r.type === "PEMASUKAN") pemasukan = amount;
          else if (r.type === "PENGELUARAN") pengeluaran = amount;
        }
        return { name: day.name, pemasukan, pengeluaran };
      });
    }

    // --- Kategori distribution (pengeluaran this month) ---
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const kategoriGroup = await prisma.transaksi.groupBy({
      by: ["kategoriId"],
      where: {
        kantorId: { in: kantorIds },
        type: "PENGELUARAN",
        tanggal: { gte: startOfMonth },
        isPettyCash: false,
      },
      _sum: { nominal: true },
      _count: true,
    });

    const kategoriIds = kategoriGroup.map((k) => k.kategoriId);
    const kategoris = await prisma.kategori.findMany({
      where: { id: { in: kategoriIds } },
      select: { id: true, name: true, icon: true, color: true },
    });
    const kategoriMap = new Map(kategoris.map((k) => [k.id, k]));

    const kategoriDist = kategoriGroup
      .map((g) => {
        const k = kategoriMap.get(g.kategoriId);
        return {
          name: k?.name ?? "Lainnya",
          icon: k?.icon ?? "📋",
          color: k?.color ?? "#6b7280",
          value: Number(g._sum.nominal ?? 0),
          count: g._count,
        };
      })
      .filter((k) => k.value > 0)
      .sort((a, b) => b.value - a.value);

    return jsonResponse({
      success: true,
      data: { trend, kategoriDist },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}
