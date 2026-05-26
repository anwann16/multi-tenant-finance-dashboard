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
    if (!user || user.role !== "ADMIN") {
      return jsonResponse({ success: false, error: "Forbidden" }, 403);
    }

    const [totalKantors, totalUsers, recentKantors, recentUsers] = await Promise.all([
      prisma.kantor.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.kantor.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return jsonResponse({
      success: true,
      data: { totalKantors, totalUsers, recentKantors, recentUsers },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}
