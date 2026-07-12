import { fail, ok } from "@/lib/response";
import { getStoryBySlug, listChapters } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const story = await getStoryBySlug(params.slug);
    if (!story) return fail("Story not found", 404);
    const chapters = await listChapters(params.slug);
    return ok({ story, chapters: chapters?.items || [], chapterTotal: chapters?.total || 0 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load story", 500);
  }
}
