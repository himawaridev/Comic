import { listStories, StorySort } from "@/services/story.service";
import { fail, ok } from "@/lib/response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const data = await listStories({
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 24),
      q: searchParams.get("q"),
      genre: searchParams.get("genre"),
      status: searchParams.get("status"),
      sort: (searchParams.get("sort") || "updated") as StorySort,
    });
    return ok(data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load stories", 500);
  }
}
