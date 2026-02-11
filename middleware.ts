import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  // Public routes
  const isLogin = pathname === "/login";
  const isSiteRoute = pathname.startsWith("/site");
  const isPublicRoute =
    isLogin ||
    isSiteRoute ||
    pathname.startsWith("/api/auth") ||
    (pathname.startsWith("/api/vacatures") && req.method === "GET") ||
    (pathname === "/api/applications" && req.method === "POST");

  // If an authenticated user tries to visit /login, send them to the app root
  if (isLogin && req.auth) {
    const dest = req.nextUrl.clone();
    dest.pathname = "/";
    return NextResponse.redirect(dest);
  }

  if (isPublicRoute) {
    // For the login page, set a lightweight header so server components can
    // detect the request and avoid rendering global navigation.
    // For site routes, pass pathname for conditional layout rendering.
    const res = NextResponse.next();
    if (isLogin) res.headers.set("x-hide-layout", "1");
    res.headers.set("x-pathname", pathname);
    return res;
  }

  if (!req.auth) {
    // Use req.nextUrl (a URL object) as the base to avoid Invalid URL errors in some runtimes
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For authenticated routes, also pass pathname
  const res = NextResponse.next();
  res.headers.set("x-pathname", pathname);
  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo-icon.svg).*)"],
};
