import { fail, ok } from "@/lib/response";
import { listChapters } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  try {
    const chapters = await listChapters(params.slug, {
      q: searchParams.get("q"),
      chapterNumber: Number(searchParams.get("chapterNumber") || 0),
      page: Number(searchParams.get("page") || 1),
      limit: Number(searchParams.get("limit") || 60),
    });
    if (!chapters) return fail("Story not found", 404);
    return ok(chapters);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load chapters", 500);
  }
}
