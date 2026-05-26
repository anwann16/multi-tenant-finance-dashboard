import { updateKategori, deleteKategori } from "@/services/kategori.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateKategori(id, body);
    return jsonResponse({ success: true, data: result });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return jsonResponse({ success: false, error: error.issues[0].message }, 400);
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "Unauthorized" ? 401 :
      message.includes("Forbidden") ? 403 :
      message === "Kategori not found" ? 404 : 500;
    return jsonResponse({ success: false, error: message }, status);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteKategori(id);
    return jsonResponse({ success: true, message: "Kategori deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status =
      message === "Unauthorized" ? 401 :
      message.includes("Forbidden") ? 403 :
      message === "Kategori not found" ? 404 : 500;
    return jsonResponse({ success: false, error: message }, status);
  }
}
