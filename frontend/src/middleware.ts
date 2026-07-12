import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/profile", "/favorites", "/history", "/admin"];
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "change_me");

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("truyen_session")?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/profile/:path*", "/favorites/:path*", "/history/:path*", "/admin/:path*"],
};
