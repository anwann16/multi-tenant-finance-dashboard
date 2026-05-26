import { NextRequest } from "next/server";
import { getPettyCashInfo, getPettyCashLog, getPettyCashSaldo } from "@/services/petty-cash.service";
import { jsonResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kantorId = searchParams.get("kantorId");
    const action = searchParams.get("action");
    const limit = searchParams.get("limit");

    if (!kantorId) {
      return jsonResponse({ success: false, error: "kantorId is required" }, 400);
    }

    if (action === "log") {
      const data = await getPettyCashLog(kantorId, limit ? parseInt(limit) : undefined);
      return jsonResponse({ success: true, data });
    }

    if (action === "saldo") {
      const data = await getPettyCashSaldo(kantorId);
      return jsonResponse({ success: true, data });
    }

    const data = await getPettyCashInfo(kantorId);
    return jsonResponse({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}
