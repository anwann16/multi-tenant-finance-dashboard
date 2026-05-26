import { assignUserToKantor, unassignUserFromKantor } from "@/services/kantor.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await assignUserToKantor(id, body);
    return jsonResponse({ success: true, data: result }, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(
        { success: false, error: error.issues[0].message },
        400
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
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return jsonResponse(
        { success: false, error: "userId query param required" },
        400
      );
    }
    await unassignUserFromKantor(id, userId);
    return jsonResponse({ success: true, message: "User unassigned" });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message.includes("not found") ? 404 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
