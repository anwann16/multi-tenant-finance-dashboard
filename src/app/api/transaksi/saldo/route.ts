import { NextRequest } from "next/server";
import { getSaldoKantor, getRunningBalance } from "@/services/transaksi.service";
import { jsonResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const kantorId = searchParams.get("kantorId");
    const running = searchParams.get("running");

    if (!kantorId) {
      return jsonResponse({ success: false, error: "kantorId wajib diisi" }, 400);
    }

    if (running === "true") {
      const balance = await getRunningBalance(kantorId);
      return jsonResponse({ success: true, data: balance });
    }

    const saldo = await getSaldoKantor(kantorId);
    return jsonResponse({ success: true, data: saldo });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
