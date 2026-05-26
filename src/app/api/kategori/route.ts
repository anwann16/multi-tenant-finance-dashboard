import { getKategoris, createKategori } from "@/services/kategori.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kantorId = searchParams.get("kantorId");
    if (!kantorId) {
      return jsonResponse({ success: false, error: "kantorId query param required" }, 400);
    }
    const type = searchParams.get("type") ?? undefined;
    const result = await getKategoris(kantorId, type);
    return jsonResponse({ success: true, data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : message.includes("Forbidden") ? 403 : 500;
    return jsonResponse({ success: false, error: message }, status);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createKategori(body);
    return jsonResponse({ success: true, data: result }, 201);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return jsonResponse({ success: false, error: error.issues[0].message }, 400);
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "Unauthorized" ? 401 : message.includes("Forbidden") ? 403 : 500;
    return jsonResponse({ success: false, error: message }, status);
  }
}
