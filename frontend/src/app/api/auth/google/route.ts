import { NextResponse } from "next/server";
import { safeRedirectPath } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo = safeRedirectPath(requestUrl.searchParams.get("next"), "/profile");
  return NextResponse.redirect(new URL(`/login?error=google_flow_updated&next=${encodeURIComponent(returnTo)}`, requestUrl.origin));
}
