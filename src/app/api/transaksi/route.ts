import { NextRequest } from "next/server";
import { getTransaksiList, createTransaksi } from "@/services/transaksi.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const kantorId = searchParams.get("kantorId");
    if (!kantorId) {
      return jsonResponse({ success: false, error: "kantorId wajib diisi" }, 400);
    }

    const result = await getTransaksiList({
      kantorId,
      type: (searchParams.get("type") as any) ?? undefined,
      status: (searchParams.get("status") as any) ?? undefined,
      kategoriId: searchParams.get("kategoriId") ?? undefined,
      tanggalFrom: searchParams.get("tanggalFrom") ?? undefined,
      tanggalTo: searchParams.get("tanggalTo") ?? undefined,
      nominalMin: searchParams.get("nominalMin") ? Number(searchParams.get("nominalMin")) : undefined,
      nominalMax: searchParams.get("nominalMax") ? Number(searchParams.get("nominalMax")) : undefined,
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page") ?? "1"),
      limit: Number(searchParams.get("limit") ?? "20"),
    });

    return jsonResponse({ success: true, ...result });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kantorId, type, ...data } = body;
    if (!kantorId || !type) {
      return jsonResponse({ success: false, error: "kantorId dan type wajib diisi" }, 400);
    }

    const transaksi = await createTransaksi(kantorId, { ...data, type });
    return jsonResponse({ success: true, data: transaksi }, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(
        { success: false, error: error.issues[0].message },
        400,
      );
    }
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
