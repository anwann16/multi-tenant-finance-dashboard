import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, data: [], meta: { page: 1, limit: 20, total: 0 } });
}

export async function POST() {
  return NextResponse.json({ success: true, data: null });
}
