import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Export endpoint — to be implemented", { status: 200 });
}
