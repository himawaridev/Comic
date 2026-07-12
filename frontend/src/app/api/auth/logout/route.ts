import { clearSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  clearSessionCookie();
  return ok({ loggedOut: true });
}
