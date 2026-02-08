import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie name must match src/lib/session.ts (don't verify JWT in Edge - AUTH_SECRET may be unavailable)
const AUTH_COOKIE_NAME = "auth-session";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const path = request.nextUrl.pathname;
  console.log("[auth/middleware]", { path, hasCookie: !!token, tokenLength: token?.length ?? 0 });
  if (!token || token.length === 0) {
    console.log("[auth/middleware] Redirecting to /login (no cookie)");
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/rooms/:path*",
    "/bookings/:path*",
    "/availability/:path*",
    "/reports/:path*",
    "/content/:path*",
  ],
};
