import { NextRequest } from "next/server";
import { topUpPettyCash } from "@/services/petty-cash.service";
import { jsonResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kantorId, nominal, deskripsi } = body;

    if (!kantorId) {
      return jsonResponse({ success: false, error: "kantorId is required" }, 400);
    }

    const data = await topUpPettyCash(kantorId, { nominal, deskripsi });
    return jsonResponse({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return jsonResponse({ success: false, error: message }, 500);
  }
}
