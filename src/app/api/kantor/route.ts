import { getKantors, createKantor } from "@/services/kantor.service";
import { jsonResponse } from "@/lib/api-response";
import { ZodError } from "zod";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "20");
    const search = searchParams.get("search") ?? undefined;

    const result = await getKantors({ page, limit, search });
    return jsonResponse({ success: true, ...result });
  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const kantor = await createKantor(body);
    return jsonResponse({ success: true, data: kantor }, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return jsonResponse(
        { success: false, error: error.issues[0].message },
        400
      );
    }
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 : 500;
    return jsonResponse({ success: false, error: error.message }, status);
  }
}
