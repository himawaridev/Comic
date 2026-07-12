import { readSession } from "@/lib/auth";
import { ok } from "@/lib/response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return ok({ user: await readSession() });
}
