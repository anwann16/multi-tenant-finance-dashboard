import { NextRequest } from "next/server";
import { confirmTransaksi, cancelTransaksi } from "@/services/transaksi.service";
import { jsonResponse } from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { action } = await request.json();

    let result;
    if (action === "cancel") {
      result = await cancelTransaksi(id);
    } else {
      result = await confirmTransaksi(id);
    }

    return jsonResponse({ success: true, data: result });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message.includes("not found") ? 404 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
