import { fail, ok } from "@/lib/response";
import { listStories } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    return ok(await listStories({ q: searchParams.get("q"), page: Number(searchParams.get("page") || 1), limit: Number(searchParams.get("limit") || 24) }));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot search stories", 500);
  }
}
