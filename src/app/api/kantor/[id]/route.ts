import { NextResponse } from "next/server";
import { getKantorById, updateKantor, deleteKantor } from "@/services/kantor.service";
import { ZodError } from "zod";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kantor = await getKantorById(id);
    return NextResponse.json({ success: true, data: kantor });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message === "Kantor not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const kantor = await updateKantor(id, body);
    return NextResponse.json({ success: true, data: kantor });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message === "Kantor not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteKantor(id);
    return NextResponse.json({ success: true, message: "Kantor deleted" });
  } catch (error: any) {
    const status =
      error.message === "Unauthorized" ? 401 :
      error.message.includes("Forbidden") ? 403 :
      error.message === "Kantor not found" ? 404 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
