import { fail, ok } from "@/lib/response";
import { listGenresWithCounts } from "@/services/genre.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return ok({ items: await listGenresWithCounts() });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load genres", 500);
  }
}
