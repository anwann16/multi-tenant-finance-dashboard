import { NextRequest } from "next/server";
import { getTransaksiById, updateTransaksi, deleteTransaksi } from "@/services/transaksi.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const transaksi = await getTransaksiById(id);
    return jsonResponse({ success: true, data: transaksi });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message.includes("not found") ? 404 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const transaksi = await updateTransaksi(id, body);
    return jsonResponse({ success: true, data: transaksi });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(
        { success: false, error: error.issues[0].message },
        400,
      );
    }
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message.includes("not found") ? 404 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await deleteTransaksi(id);
    return jsonResponse({ success: true, ...result });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message.includes("not found") ? 404 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
