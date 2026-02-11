import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes
  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    (pathname.startsWith("/api/vacatures") && req.method === "GET") ||
    (pathname === "/api/applications" && req.method === "POST");

  if (isPublicRoute) return NextResponse.next();

  if (!req.auth) {
    // Use req.nextUrl (a URL object) as the base to avoid Invalid URL errors in some runtimes
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-icon.svg).*)"],
};
