import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: Implement auth + tenant isolation middleware
  // - Check session token
  // - Verify user has access to requested kantorId
  // - Redirect to login if not authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
