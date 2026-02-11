import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware that allows all requests (no auth for public site)
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
