import { listStories } from "@/services/story.service";
import { fail, ok } from "@/lib/response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    return ok(await listStories({ page: Number(searchParams.get("page") || 1), limit: Number(searchParams.get("limit") || 24), sort: "hot" }));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load hot stories", 500);
  }
}
